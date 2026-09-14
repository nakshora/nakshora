// Numeric claims in the docs must match the code. Counts and byte sizes are
// recomputed here; timings must equal the committed benchmark baseline
// (perf/baseline.json, refreshed with `pnpm benchmark:update`).

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CSSGenerator, DEFAULT_SCREENS, minifyCss } from '../src/index';

const root = join(__dirname, '../../../..');
const read = (p: string): string => readFileSync(join(root, p), 'utf-8');
const fmt = (n: number): string => n.toLocaleString('en-US');

const gen = new CSSGenerator();
const catalog = gen.getUtilities().length;
const categories = new Set(gen.getUtilities().map((u) => u.category)).size;
const palettes = Object.values(gen.theme.colors).filter(
  (v) => typeof v === 'object' && v !== null && '500' in (v as object),
).length;

describe('documentation claims match the code', () => {
  it('utility / category / palette / screen counts', () => {
    const corpus = JSON.parse(read('ai/corpus.json')) as {
      utilityCount: number;
      categories: unknown[];
    };
    expect(corpus.utilityCount).toBe(catalog);
    expect(corpus.categories.length).toBe(categories);
    for (const file of [
      'README.md',
      'docs/UTILITIES.md',
      'docs/AI_TRAINING.md',
      'packages/@nakshora/core/README.md',
      'packages/@nakshora/vite-plugin/README.md',
    ]) {
      const text = read(file);
      expect(text, `${file} utility count`).toContain(`${fmt(catalog)} utilities`);
      expect(text, `${file} stale count`).not.toMatch(/\b3,091\b|\b6,313\b/);
    }
    expect(read('README.md')).toContain(`${categories} categories`);
    expect(read('README.md')).toContain(`${palettes} color palettes`);
    expect(read('docs/utilities/README.md')).toContain(`Total generated utilities: **${catalog}**`);
    expect(Object.keys(DEFAULT_SCREENS).length).toBe(10);
    expect(read('docs/RESPONSIVE.md')).toContain('## The 10 breakpoints');
  });

  it('JIT.md colour-matrix explanation matches the catalog', () => {
    const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
    const paletteNames = Object.entries(gen.theme.colors)
      .filter(([, v]) => typeof v === 'object' && v !== null && '500' in (v as object))
      .map(([k]) => k);
    const re = new RegExp(`-(?:${paletteNames.join('|')})-(?:${shades.join('|')})$`);
    const colour = gen.getUtilities().filter((u) => re.test(u.class));
    const families = new Set(colour.map((u) => u.class.replace(re, '-*')));
    const jit = read('docs/JIT.md');
    expect(jit).toContain(`${palettes} palettes × ${shades.length} shades ×`);
    expect(jit).toContain(`${families.size} colour utilities`);
    expect(jit).toContain(`= ${fmt(colour.length)} of the ${fmt(catalog)} catalog classes`);
    // bytes: rules with a hex colour / rgb() / opacity var share of the pretty full build
    const pretty = gen.generate({ mode: 'full' });
    let colourBytes = 0;
    for (const m of pretty.matchAll(/^\s*[^{}\n]+ \{ ([^}]*)\}$/gm))
      if (/#[0-9a-f]{6}|rgb\(|--tw-[a-z-]*opacity/.test(m[1])) colourBytes += m[0].length;
    const pct = ((100 * colourBytes) / pretty.length).toFixed(1);
    expect(jit).toContain(`measured ${pct} % of the pretty full build`);
  });

  it('full-build sizes quoted in docs are the real bytes', () => {
    const pretty = gen.generate({ mode: 'full' });
    const min = minifyCss(pretty);
    const p = Buffer.byteLength(pretty);
    const m = Buffer.byteLength(min);
    const perf = read('docs/PERFORMANCE.md');
    expect(perf).toContain(`${fmt(p)} B`);
    expect(perf).toContain(`${fmt(m)} B`);
    expect(read('docs/JIT.md')).toContain(`${fmt(p)} B`);
    expect(read('README.md')).toContain(`${fmt(Math.round(p / 1024))} KB`);
    expect(read('README.md')).toContain(`${fmt(Math.round(m / 1024))} KB min`);
    // committed artifacts are that build
    if (existsSync(join(root, 'dist/css/nakshora.min.css')))
      expect(read('dist/css/nakshora.min.css').length).toBe(min.length);
    if (existsSync(join(root, 'min.main.css')))
      expect(read('min.main.css').length).toBe(min.length);
  }, 60_000);

  it('timings quoted in docs equal perf/baseline.json', () => {
    const base = JSON.parse(read('perf/baseline.json')).metrics as Record<string, number>;
    const perf = read('docs/PERFORMANCE.md');
    const readme = read('README.md');
    const jit = read('docs/JIT.md');
    const ms1 = (k: string): string => base[k].toFixed(1);
    const ms0 = (k: string): string => Math.round(base[k]).toString();
    expect(perf).toContain(`| ${ms1('JIT 200 lines warm (ms)')} ms`);
    expect(perf).toContain(`| ${ms0('full build pretty (ms)')} ms`);
    expect(perf).toContain(`| ${ms0('full build minify (ms)')} ms`);
    expect(perf).toContain(`**${ms1('500 files warm, 1 changed: scan + JIT (ms)')} ms**`);
    expect(perf).toContain(`| ${ms1('catalog cold (ms)')} ms`);
    expect(readme).toContain(`${ms1('JIT 200 lines warm (ms)')}\n`);
    expect(readme).toContain(`${ms0('full build pretty (ms)')}\n`);
    expect(readme).toContain(`${ms0('full build minify (ms)')}\n`);
    expect(jit).toContain(`${ms0('full build pretty (ms)')} ms`);
    expect(jit).toContain(`${ms0('JIT 200 lines warm (ms)')} ms warm`);
    expect(base['catalog size (utilities)']).toBe(catalog);
    expect(base['full build pretty (bytes)']).toBe(
      Buffer.byteLength(gen.generate({ mode: 'full' })),
    );
  }, 60_000);
});
