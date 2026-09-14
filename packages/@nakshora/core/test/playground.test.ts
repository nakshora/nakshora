// Playground detectors (Phase D — P2 "playground/gallery").
//
// `playground/` is a static page that imports the *built* core ESM bundle in
// the browser and compiles the user's HTML/CSS live. These tests keep it
// honest without a headless browser:
//
//  1. the core ESM bundle is platform-neutral (no Node built-ins), so the
//     browser can load it exactly as shipped,
//  2. every example preset compiles: each class resolves, author CSS
//     (`@theme` / `@utility` / `@custom-variant` / `@apply` / `theme()`) is
//     accepted by the same pipeline `playground.js` runs,
//  3. every class the playground chrome itself uses resolves, and the
//     committed `playground/playground.min.css` matches a fresh build (drift),
//  4. `byteLength` (the one former `Buffer` call in core) matches Node's.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import * as csstree from 'css-tree';
import {
  CSSGenerator,
  byteLength,
  classesInCss,
  extractClasses,
  extractCssConfig,
  hasCssConfig,
  mergeCssConfig,
  minifyCss,
  parseCss,
} from '../src/index';
import type { NakshoraConfig } from '../src/index';

const root = join(__dirname, '../../../..');
const pageHtml = readFileSync(join(root, 'playground/index.html'), 'utf-8');
const pageJs = readFileSync(join(root, 'playground/playground.js'), 'utf-8');
const distEsm = readFileSync(join(__dirname, '../dist/index.js'), 'utf-8');

interface Preset {
  html: string;
  css: string;
}

async function loadPresets(): Promise<Record<string, Preset>> {
  const mod = (await import(pathToFileURL(join(root, 'playground/presets.js')).href)) as {
    PRESETS: Record<string, Preset>;
  };
  return mod.PRESETS;
}

/** The exact pipeline `playground/playground.js#compile` runs in the browser. */
function compileLikeBrowser(html: string, author: string, minify = false) {
  let config: Partial<NakshoraConfig> = { content: [] };
  let rootVars = '';
  if (author && hasCssConfig(author)) {
    const extracted = extractCssConfig(author);
    author = extracted.css;
    rootVars = extracted.rootVars;
    config = mergeCssConfig(config, extracted.config);
  }
  const gen = new CSSGenerator(config as NakshoraConfig);
  const candidates = extractClasses([html, author]);
  let css = gen.generateJITFromCandidates(candidates, { minify });
  if (author.trim()) {
    const processed = gen.processCss(author);
    css += minify ? minifyCss(processed) : `\n/* ─── Author CSS ─── */\n${processed}\n`;
  }
  if (rootVars) css = (minify ? minifyCss(rootVars) : rootVars) + css;
  return { css, gen };
}

const MARKERS = new Set(['group', 'peer', 'dark']);

const classesIn = (source: string): string[] => [
  ...new Set(
    [...source.matchAll(/class="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/)).filter(Boolean),
  ),
];

describe('playground: core ESM bundle is browser-loadable', () => {
  it('dist/index.js imports nothing (no node: built-ins, no bare specifiers)', () => {
    const imports = [...distEsm.matchAll(/^import\b[^'"]*['"]([^'"]+)['"]/gm)].map((m) => m[1]);
    expect(imports).toEqual([]);
    expect(distEsm).not.toMatch(/\brequire\(\s*['"]node:/);
    expect(distEsm).not.toMatch(/\bBuffer\.byteLength\b/);
    expect(distEsm).not.toMatch(/\bprocess\.(?:env|cwd|argv)\b/);
  });

  it('byteLength equals Buffer.byteLength for ASCII, 2/3/4-byte and empty input', () => {
    for (const s of ['', 'abc', 'é', 'ঢাকা', '日本語', '😀🚀', 'a\u0000b', '\uFFFF']) {
      expect(byteLength(s), JSON.stringify(s)).toBe(Buffer.byteLength(s, 'utf-8'));
    }
  });
});

describe('playground: example presets compile', () => {
  it('ships the six presets the <select> offers', async () => {
    const presets = await loadPresets();
    const optionValues = [...pageHtml.matchAll(/<option value="([^"]+)"/g)].map((m) => m[1]);
    expect(optionValues.length).toBe(6);
    expect(Object.keys(presets).sort()).toEqual([...optionValues].sort());
  });

  it('every class in every preset resolves and the output parses', async () => {
    const presets = await loadPresets();
    for (const [name, preset] of Object.entries(presets)) {
      const { css, gen } = compileLikeBrowser(preset.html, preset.css);
      // `group` / `peer` / `dark` are marker classes: Tailwind emits nothing for them either
      // classes defined by the preset's own author CSS (`.btn-primary { @apply … }`) count as resolved
      const authored = new Set([...preset.css.matchAll(/^\.([\w-]+)\s*\{/gm)].map((m) => m[1]));
      // design components (`.glass`, `.neon-card`, …) are emitted by the JIT, not `engine.compile`
      const emitted = classesInCss(parseCss(css));
      const unknown = classesIn(preset.html)
        .filter((c) => !MARKERS.has(c) && !authored.has(c))
        .filter((c) => gen.engine.compile(c).length === 0 && !emitted.has(c));
      expect(unknown, `${name}: unresolved classes`).toEqual([]);
      let errors = 0;
      csstree.parse(css, { onParseError: () => errors++ });
      expect(errors, `${name}: CSS parse errors`).toBe(0);
      // minified path is lossless too (same pipeline with `minify: true`)
      const { css: min } = compileLikeBrowser(preset.html, preset.css, true);
      expect(min.length).toBeGreaterThan(0);
      expect(min.length).toBeLessThan(css.length);
    }
  });

  it('the CSS-first preset applies @theme, @utility, @custom-variant, @apply and theme()', async () => {
    const { cssconfig } = await loadPresets();
    const { css } = compileLikeBrowser(cssconfig.html, cssconfig.css);
    expect(css).toContain('--color-brand-700: #4338ca');
    expect(css).toMatch(/\.bg-brand-50 \{/);
    expect(css).toMatch(/\.font-display \{\s*font-family: "Georgia", serif/);
    expect(css).toMatch(/\.tab-4 \{\s*tab-size: 4/);
    expect(css).toMatch(/\.theme-midnight\\:text-white:where\(\[data-theme="midnight"\] \*\)/);
    // `.btn-primary { @apply … }` expanded in place, hover sibling rule emitted
    expect(css).toMatch(
      /\.btn-primary \{[^}]*background-color: rgb\(67 56 202 \/ var\(--tw-bg-opacity, 1\)\)/,
    );
    expect(css).toMatch(/\.btn-primary:hover \{\s*opacity: 0\.9/);
    // theme(colors.brand.700 / 30%) resolved to an rgb() with alpha (Tailwind 3.4 semantics)
    expect(css).toContain('box-shadow: 0 1px 2px rgb(67 56 202 / 30%)');
    expect(css).not.toContain('@apply');
    expect(css).not.toContain('theme(');
  });

  it('the variants preset exercises the v3.4 grammar the docs promise', async () => {
    const { variants } = await loadPresets();
    const { css } = compileLikeBrowser(variants.html, variants.css);
    expect(css).toContain('.group:hover .group-hover\\:bg-indigo-500');
    expect(css).toContain('.\\*\\:rounded > *');
    expect(css).toContain('.\\!bg-emerald-200');
    expect(css).toContain('.aria-pressed\\:bg-slate-900[aria-pressed="true"]');
    expect(css).toContain('.data-\\[state\\=open\\]\\:border-emerald-500[data-state="open"]');
    expect(css).toContain('.has-\\[a\\:hover\\]\\:bg-yellow-100:has(a:hover)');
    expect(css).toContain('.\\[\\&\\>em\\]\\:text-rose-600>em');
    expect(css).toContain('@supports (backdrop-filter: var(--tw))');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('width: clamp(12rem, 50%, 32rem)');
  });

  it('the grid preset covers the 10-breakpoint scale, max-*, container queries and print', async () => {
    const { grid } = await loadPresets();
    const { css } = compileLikeBrowser(grid.html, grid.css);
    expect(css).toContain('@media (min-width: 400px)'); // xs
    expect(css).toContain('@media (min-width: 1920px)'); // 3xl
    expect(css).toContain('@media (max-width: 767.98px)'); // max-md
    expect(css).toContain('@container (min-width: 12rem)');
    expect(css).toContain('@container (min-width: 28rem)'); // @md
    expect(css).toContain('@media print');
    expect(css).toContain('@media (orientation: portrait)');
  });
});

describe('playground: page chrome is a JIT build of itself', () => {
  it('index.html links playground.min.css and loads the engine as an ES module', () => {
    expect(pageHtml).toContain('href="playground.min.css"');
    expect(pageHtml).toContain('<script type="module" src="playground.js">');
    expect(pageHtml).not.toContain('<style');
    expect(pageJs).toContain("'../packages/@nakshora/core/dist/index.js'");
    expect(pageJs).toContain('https://cdn.jsdelivr.net/npm/@nakshora/core@3/dist/index.js');
  });

  it('every class the page and its script use resolves against the default theme', () => {
    const gen = new CSSGenerator({ content: [] } as unknown as NakshoraConfig);
    const classes = classesIn(pageHtml);
    expect(classes.length).toBeGreaterThan(80);
    const unknown = classes
      .filter((c) => !MARKERS.has(c))
      .filter((c) => gen.engine.compile(c).length === 0);
    // `tab` is a JS hook (querySelectorAll('.tab')), not a utility
    expect(unknown).toEqual(['tab']);
    // classes toggled at runtime by playground.js are compiled too
    for (const cls of ['bg-slate-800', 'text-slate-100', 'text-slate-400', 'hidden', 'flex'])
      expect(pageJs.includes(`'${cls}'`), cls).toBe(true);
  });

  it('playground/playground.min.css matches a fresh build (run `node scripts/build-site.mjs`)', () => {
    const gen = new CSSGenerator({ content: [] } as unknown as NakshoraConfig);
    const min = gen.minify(gen.generateJIT([pageHtml, pageJs], {}));
    const committed = readFileSync(join(root, 'playground/playground.min.css'), 'utf-8');
    expect(committed.length).toBe(min.length);
    expect(committed === min).toBe(true);
    let errors = 0;
    csstree.parse(min, { onParseError: () => errors++ });
    expect(errors).toBe(0);
    expect(Buffer.byteLength(min)).toBeLessThan(40_000);
  });
});
