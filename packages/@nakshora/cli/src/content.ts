// Nakshora CLI — JIT content resolution (globs → file contents)

import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { globby } from 'globby';

// Resolve JIT content sources.
// Each entry is either:
//  - a glob pattern (recursive wildcards) → matching files are read
//  - an existing plain file path → read
//  - anything else → treated as raw content (templates/strings)
export async function resolveContent(
  content: string | string[] | undefined,
  cwd: string = process.cwd(),
): Promise<string[]> {
  if (!content) return [];
  const entries = Array.isArray(content) ? content : [content];
  const chunks: string[] = [];

  const globs: string[] = [];
  const raw: string[] = [];
  for (const entry of entries) {
    if (!entry) continue;
    if (entry.includes('*') || entry.includes('{') || entry.includes('[')) {
      globs.push(entry);
    } else if (existsSync(resolve(cwd, entry)) && statSync(resolve(cwd, entry)).isFile()) {
      raw.push(readFileSync(resolve(cwd, entry), 'utf-8'));
    } else {
      raw.push(entry);
    }
  }

  if (globs.length > 0) {
    const files = await globby(globs, { cwd, absolute: true });
    for (const file of files) {
      try {
        raw.push(readFileSync(file, 'utf-8'));
      } catch {
        // unreadable file — skip
      }
    }
  }
  chunks.push(...raw);
  return chunks;
}

/**
 * Like `resolveContent` but keeps files and raw strings apart so a
 * `ContentCache` can stamp files by mtime (incremental rebuilds).
 */
export async function resolveSources(
  content: string | string[] | undefined,
  cwd: string = process.cwd(),
): Promise<{ files: string[]; raw: string[] }> {
  if (!content) return { files: [], raw: [] };
  const entries = Array.isArray(content) ? content : [content];
  const globs: string[] = [];
  const files: string[] = [];
  const raw: string[] = [];
  for (const entry of entries) {
    if (!entry) continue;
    if (entry.includes('*') || entry.includes('{') || entry.includes('[')) globs.push(entry);
    else if (existsSync(resolve(cwd, entry)) && statSync(resolve(cwd, entry)).isFile())
      files.push(resolve(cwd, entry));
    else raw.push(entry);
  }
  if (globs.length > 0) files.push(...(await globby(globs, { cwd, absolute: true })).sort());
  return { files, raw };
}
