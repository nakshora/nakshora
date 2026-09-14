// Incremental content scanning (`ContentCache` / `scanSources`) and the
// determinism guarantee of JIT builds.

import { describe, expect, it } from 'vitest';
import { CSSGenerator, ContentCache, contentHash, scanSources, type ScanFs } from '../src/index';

function memFs(
  files: Record<string, { text: string; mtime: number }>,
): ScanFs & { reads: string[] } {
  const reads: string[] = [];
  return {
    reads,
    stat: (p) => (files[p] ? { mtimeMs: files[p].mtime, size: files[p].text.length } : null),
    read: (p) => {
      reads.push(p);
      return files[p].text;
    },
  };
}

describe('ContentCache', () => {
  it('re-reads only files whose mtime/size changed; drops deleted ones', () => {
    const files = {
      '/a.html': { text: '<a class="flex p-4">', mtime: 1 },
      '/b.html': { text: '<a class="grid m-2">', mtime: 1 },
    };
    const fs = memFs(files);
    const cache = new ContentCache();
    const first = scanSources(cache, fs, ['/a.html', '/b.html'], ['<i class="hidden">']);
    // (`class` / `a` etc. are plausible candidates too — Tailwind's extractor keeps them)
    const only = (set: Set<string>) => [...set].filter((c) => !['class', 'a', 'i'].includes(c));
    expect(only(first)).toEqual(['flex', 'grid', 'hidden', 'm-2', 'p-4']);
    expect(fs.reads).toEqual(['/a.html', '/b.html']);
    expect(cache.stats()).toEqual({ hits: 0, misses: 3, entries: 3 });

    // nothing changed → zero reads
    scanSources(cache, fs, ['/a.html', '/b.html'], ['<i class="hidden">']);
    expect(fs.reads.length).toBe(2);
    expect(cache.stats().hits).toBe(3);

    // b changes (same size, new mtime) → only b is re-read
    files['/b.html'] = { text: '<a class="grid m-3">', mtime: 2 };
    const third = scanSources(cache, fs, ['/a.html', '/b.html']);
    expect(fs.reads).toEqual(['/a.html', '/b.html', '/b.html']);
    expect(third.has('m-3')).toBe(true);
    expect(third.has('m-2')).toBe(false);

    // b deleted → its candidates disappear and the entry is evicted
    const fourth = scanSources(cache, fs, ['/a.html']);
    expect(only(fourth)).toEqual(['flex', 'p-4']);
    expect(cache.stats().entries).toBe(2); // a + the raw chunk
  });

  it('raw chunks are stamped by content hash', () => {
    expect(contentHash('abc')).toBe(contentHash('abc'));
    expect(contentHash('abc')).not.toBe(contentHash('abd'));
    const cache = new ContentCache();
    cache.candidatesForText('<a class="flex">');
    cache.candidatesForText('<a class="flex">');
    expect(cache.stats()).toEqual({ hits: 1, misses: 1, entries: 1 });
  });

  it('honours a custom extractor pattern and returns sorted unions', () => {
    const first = scanSources(
      new ContentCache(),
      memFs({ '/z': { text: '<b class="z-10 a-1 m-2">', mtime: 1 } }),
      ['/z'],
    );
    const cache = new ContentCache('nk-[a-z0-9-]+');
    expect([...cache.candidatesForText('x nk-flex y nk-p-4 flex')]).toEqual(['nk-flex', 'nk-p-4']);
    expect([...first].sort()).toEqual([...first]); // sorted union
  });
});

describe('deterministic output', () => {
  const docs = Array.from(
    { length: 40 },
    (_, i) =>
      `<div class="flex p-${(i % 12) + 1} md:grid-cols-${(i % 6) + 1} hover:bg-blue-${(i % 9) * 100 + 100} ${i % 5 === 0 ? 'neon-btn' : ''} [--x:${i}]">`,
  );
  it('same files in any order, via extractor or via cache, give identical bytes', () => {
    const a = new CSSGenerator().generateJIT(docs);
    const b = new CSSGenerator().generateJIT([...docs].reverse());
    const cache = new ContentCache();
    const fs = memFs(
      Object.fromEntries(docs.map((t, i) => [`/f${i}.html`, { text: t, mtime: 1 }])),
    );
    const shuffled = docs.map((_, i) => `/f${i}.html`).sort(() => (Math.random() < 0.5 ? -1 : 1));
    const c = new CSSGenerator().generateJITFromCandidates(scanSources(cache, fs, shuffled));
    expect(a.length).toBeGreaterThan(1000);
    expect(b === a).toBe(true);
    expect(c === a).toBe(true);
  });
});

describe('incremental build benchmark (measured, reported)', () => {
  it('warm rebuild after touching one file avoids re-extracting the other 499', () => {
    const files: Record<string, { text: string; mtime: number }> = {};
    for (let i = 0; i < 500; i++)
      files[`/f${i}.html`] = {
        mtime: 1,
        text: Array.from(
          { length: 40 },
          (_, j) =>
            `<div class="flex p-${(j % 12) + 1} md:grid-cols-${(i % 12) + 1} hover:bg-blue-${((i + j) % 9) * 100 + 100} rounded-${['md', 'lg', 'xl'][i % 3]}">`,
        ).join('\n'),
      };
    const fs = memFs(files);
    const cache = new ContentCache();
    const paths = Object.keys(files);
    const gen = new CSSGenerator();
    const t0 = performance.now();
    const cold = gen.generateJITFromCandidates(scanSources(cache, fs, paths));
    expect(cold).toContain('.flex');
    const coldMs = performance.now() - t0;
    files['/f7.html'] = {
      ...files['/f7.html'],
      mtime: 2,
      text: files['/f7.html'].text + '<b class="underline">',
    };
    const t1 = performance.now();
    const warm = gen.generateJITFromCandidates(scanSources(cache, fs, paths));
    const warmMs = performance.now() - t1;
    console.log(
      `500 files: cold ${coldMs.toFixed(0)} ms, warm (1 file changed) ${warmMs.toFixed(0)} ms, reads ${fs.reads.length}`,
    );
    expect(fs.reads.length).toBe(501);
    expect(warm).toContain('.underline');
    expect(warmMs).toBeLessThan(coldMs);
  });
});
