// Incremental content scanning.
//
// Extracting candidates is the dominant cost of a JIT build once the engine
// is warm (~0.6 ms per 4 KB file; ~300 ms for 500 files). The set of
// candidates a file contributes only changes when the file does, so the
// CLI / PostCSS / Vite plugins keep one `ContentCache` per process and ask it
// for each source: unchanged files (same mtime + size) are not even read
// again, changed files are re-extracted. The cache is platform neutral — the
// caller supplies the stamp and a reader.

import { extractCandidates } from './extractor';

export interface ContentCacheStats {
  hits: number;
  misses: number;
  entries: number;
}

interface Entry {
  stamp: string;
  candidates: Set<string>;
}

/** FNV-1a 32-bit — cheap content stamp for raw strings. */
export function contentHash(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `${text.length}:${(h >>> 0).toString(36)}`;
}

export class ContentCache {
  private readonly entries = new Map<string, Entry>();
  private hits = 0;
  private misses = 0;

  constructor(private readonly pattern?: string) {}

  /**
   * Candidates for one source. `key` identifies the source (file path or
   * `raw:<n>`), `stamp` its version (`${mtimeMs}:${size}` for files, a hash
   * for strings). `read` is only called on a miss.
   */
  candidatesFor(key: string, stamp: string, read: () => string): Set<string> {
    const hit = this.entries.get(key);
    if (hit && hit.stamp === stamp) {
      this.hits++;
      return hit.candidates;
    }
    this.misses++;
    const candidates = extractCandidates([read()], { pattern: this.pattern });
    this.entries.set(key, { stamp, candidates });
    return candidates;
  }

  /** Raw content chunk (no path): stamped by hash. */
  candidatesForText(text: string, key?: string): Set<string> {
    const stamp = contentHash(text);
    return this.candidatesFor(key ?? `raw:${stamp}`, stamp, () => text);
  }

  /** Drop sources that no longer exist (call after a glob pass with the live key set). */
  retain(keys: Iterable<string>): void {
    const keep = new Set(keys);
    for (const k of this.entries.keys())
      if (!keep.has(k) && !k.startsWith('raw:')) this.entries.delete(k);
  }

  /** Union of several candidate sets, in a deterministic (sorted) order. */
  static union(sets: Iterable<Set<string>>): Set<string> {
    const all = new Set<string>();
    for (const s of sets) for (const c of s) all.add(c);
    return new Set([...all].sort());
  }

  stats(): ContentCacheStats {
    return { hits: this.hits, misses: this.misses, entries: this.entries.size };
  }

  clear(): void {
    this.entries.clear();
    this.hits = 0;
    this.misses = 0;
  }
}

/** Minimal file-system surface `scanSources` needs (injected so core stays platform neutral). */
export interface ScanFs {
  stat: (path: string) => { mtimeMs: number; size: number } | null;
  read: (path: string) => string;
}

/**
 * Resolve content sources to a candidate set using the cache: file paths are
 * stamped by mtime+size, raw strings by hash. `files` are absolute paths
 * (already globbed by the caller); `raw` are inline template strings.
 * Returns a sorted candidate set so output never depends on scan order.
 */
export function scanSources(
  cache: ContentCache,
  fs: ScanFs,
  files: readonly string[],
  raw: readonly string[] = [],
): Set<string> {
  const sets: Set<string>[] = [];
  const live: string[] = [];
  for (const file of files) {
    const st = fs.stat(file);
    if (!st) continue;
    live.push(file);
    sets.push(cache.candidatesFor(file, `${st.mtimeMs}:${st.size}`, () => fs.read(file)));
  }
  for (const text of raw) sets.push(cache.candidatesForText(text));
  cache.retain(live);
  return ContentCache.union(sets);
}
