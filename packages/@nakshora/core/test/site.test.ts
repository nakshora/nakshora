// Landing page detectors (Phase B — design-system port).
//
// `index.html` is a JIT build of itself against `site/nakshora.config.mjs`.
// These tests are the permanent form of the checks used to port the v1.0.0
// hand-written bundle (`min.main.css`) to a real Nakshora config:
//
//  1. every class used in index.html compiles (no silent no-ops),
//  2. every class that the legacy bundle styled renders the same declarations
//     (after resolving the legacy `var(--token)` indirection),
//  3. the committed `site/index.min.css` matches a fresh build (drift),
//  4. the CDN bundles in `dist/css/` match the committed core dist (drift).

import { brotliDecompressSync, gunzipSync } from 'node:zlib';
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import * as csstree from 'css-tree';
import { CSSGenerator, parseCss, parseColor } from '../src/index';
import type { NakshoraConfig } from '../src/index';

const root = join(__dirname, '../../../..');
const html = readFileSync(join(root, 'index.html'), 'utf-8');
// The v1.0.0 stylesheet the page used to load from the CDN, frozen in two forms:
// the readable source and its cssnano pass.
const legacyPretty = readFileSync(join(__dirname, 'fixtures/nakshora-v1.0.0.css'), 'utf-8');
const legacyCss = readFileSync(join(root, 'minified-version/v1.0.0.css'), 'utf-8');

async function loadConfig(): Promise<NakshoraConfig> {
  const mod = (await import(pathToFileURL(join(root, 'site/nakshora.config.mjs')).href)) as {
    default: NakshoraConfig;
  };
  return mod.default;
}

const classesIn = (source: string): string[] => [
  ...new Set(
    [...source.matchAll(/class="([^"]*)"/g)].flatMap((m) => m[1].split(/\s+/)).filter(Boolean),
  ),
];

// ───────── legacy rule model: selector + declarations, tokens resolved ─────────

interface Rule {
  at: string;
  sel: string;
  decls: Record<string, string>;
}

function rootVars(css: string): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const n of parseCss(css).nodes) {
    if (n.type === 'rule' && /^(:root|\*,\s*::before)/.test(n.selector.trim()))
      for (const d of n.nodes) if (d.type === 'decl') vars[d.prop] = d.value;
  }
  return vars;
}

function resolveVars(
  value: string,
  vars: Record<string, string>,
  local: Record<string, string>,
): string {
  let out = value;
  for (let i = 0, prev = ''; i < 10 && prev !== out; i++) {
    prev = out;
    out = out.replace(
      /var\((--[\w-]+)(?:,\s*([^()]*(?:\([^()]*\))?[^()]*))?\)/g,
      (m, name: string, fb?: string) => local[name] ?? vars[name] ?? (fb !== undefined ? fb : m),
    );
  }
  return out.replace(/\s+/g, ' ').trim();
}

/** Canonical colour + number spelling so `hsl(0, 0%, 5%)` ≡ `hsl(0 0% 5% / 1)`. */
function canon(value: string): string {
  return value
    .replace(/(hsl|rgb)a?\([^)]*\)/g, (m) => {
      const c = parseColor(m);
      return c ? `${c.mode}(${c.color.join(' ')} / ${c.alpha ?? '1'})` : m;
    })
    .replace(/\b0\.(\d)/g, '.$1')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')');
}

function rulesFor(css: string, cls: string, vars: Record<string, string>): Rule[] {
  const escaped = `.${cls.replace(/[:./[\]%]/g, '\\$&')}`;
  const re = new RegExp(`${escaped.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&')}(?![\\w-])`);
  const out: Rule[] = [];
  const walk = (nodes: ReturnType<typeof parseCss>['nodes'], at: string): void => {
    for (const n of nodes) {
      if (n.type === 'rule') {
        // only the parts of a selector list that mention the class matter
        const parts = n.selector.split(',').filter((s) => re.test(s));
        if (parts.length === 0) continue;
        const local: Record<string, string> = {};
        const decls: Record<string, string> = {};
        for (const d of n.nodes)
          if (d.type === 'decl' && d.prop.startsWith('--')) local[d.prop] = d.value;
        for (const d of n.nodes)
          if (d.type === 'decl' && !d.prop.startsWith('--'))
            decls[d.prop] = canon(resolveVars(d.value, vars, local));
        out.push({
          at: at.trim().replace(/\s*:\s*/g, ':'),
          sel: parts.map((s) => s.replace(/\s+/g, ' ').trim()).join(', '),
          decls,
        });
      } else if (n.type === 'atrule' && n.nodes) walk(n.nodes, `${at}@${n.name} ${n.params} `);
    }
  };
  walk(parseCss(css).nodes, '');
  return out;
}

/** Merge rules with the same wrapper+selector (legacy bundle splits shared declarations across rules). */
function merged(rules: Rule[]): Record<string, Record<string, string>> {
  const out: Record<string, Record<string, string>> = {};
  for (const r of rules) {
    const key = `${r.at}|${r.sel}`;
    out[key] = { ...(out[key] ?? {}), ...r.decls };
  }
  return out;
}

// Declarations where the v3 engine intentionally differs from the v1.0.0 file
// (Tailwind-parity output). Each entry is `class → property` and is documented
// in docs/COMPATIBILITY.md §2.6.
const KNOWN_DIFFERENCES: Record<string, string[]> = {
  // Tailwind composes transforms/shadows through --tw-* variables
  transform: ['transform'],
  'hover:scale-105': ['transform'],
  'shadow-lg': ['box-shadow'],
  'shadow-xl': ['box-shadow'],
  'shadow-2xl': ['box-shadow'],
  'hover:shadow-xl': ['box-shadow'],
  // Tailwind: `text-decoration-line`, `0px`, long-hand transition
  'no-underline': ['text-decoration', 'text-decoration-line'],
  'top-0': ['top'],
  'transition-all': [
    'transition',
    'transition-property',
    'transition-timing-function',
    'transition-duration',
  ],
  // border-style now comes from the reset (`*, *::before, *::after { border-style: solid }`)
  border: ['border-style'],
  'border-t': ['border-top-style'],
  // `-webkit-backdrop-filter` is added for Safari ≤ 17
  'navbar-glass': ['-webkit-backdrop-filter'],
  'btn-glass': ['-webkit-backdrop-filter'],
  'card-glass': ['-webkit-backdrop-filter'],
  'input-glass': ['-webkit-backdrop-filter'],
  // minified bundle collapses `linear-gradient( 135deg, …` whitespace differently
  'hero-overlay': ['background'],
};

describe('landing page (index.html) is a JIT build of itself', () => {
  it('index.html links the JIT stylesheet and carries no inline <style>', () => {
    expect(html).toContain('href="site/index.min.css"');
    expect(html).not.toMatch(/<style[\s>]/);
    expect(html).not.toContain('<link rel="stylesheet" href="https://cdn.jsdelivr.net');
  });

  it('every class in index.html compiles against site/nakshora.config.mjs', async () => {
    const gen = new CSSGenerator(await loadConfig());
    const classes = classesIn(html);
    expect(classes.length).toBeGreaterThan(150);
    const unknown = classes.filter((c) => gen.engine.compile(c).length === 0);
    // `active` is a state class toggled by JS (`.toggle.active`, `.tab.active`), not a utility
    expect(unknown).toEqual(['active']);
  });

  it('emits every design-system component and utility the page uses, exactly once', async () => {
    const gen = new CSSGenerator(await loadConfig());
    const css = gen.generateJIT(html, {});
    for (const cls of [
      'btn-neon',
      'card-glass',
      'input-glass',
      'spinner-neon',
      'navbar-glass',
      'tabs',
      'alert-success',
      'badge-pill',
      'progress-neon',
      'skip-link',
      'hero-kpis',
      'z-sticky',
      'animate-slideInLeft',
      'bg-neon-purple-500',
      'text-mono-100',
      'lg:text-7xl',
    ]) {
      const escaped = `.${cls.replace(/:/g, '\\:')}`;
      const re = new RegExp(`^\\s*${escaped.replace(/[\\.]/g, '\\$&')}[\\s:.]`, 'm');
      expect(re.test(css), cls).toBe(true);
    }
    // a selector-list component used by two candidates is emitted once
    expect(css.split('.footer-link:hover, .nav-link:hover').length - 1).toBe(1);
    // keyframes for the animations the page uses, once each
    expect(css.split('@keyframes slideInLeft').length - 1).toBe(1);
    expect(css.split('@keyframes spin').length - 1).toBe(1);
    // built-in showcase components are disabled → the page's own `.glass` is the only one
    expect(css.split(/\n\.glass \{/).length - 1).toBe(1);
    expect(css).not.toContain('.neon-btn');
  });

  it('renders every legacy-styled class with the same declarations as v1.0.0', async () => {
    const gen = new CSSGenerator(await loadConfig());
    const jit = gen.generateJIT(html, {});
    // compare against the readable v1.0.0 file: it is what the page's CDN <link> loaded
    const legacyVars = rootVars(legacyPretty);
    const jitVars = rootVars(jit);
    // …plus the page-local `<style>` block index.html carried before the port
    const inline = readFileSync(join(__dirname, 'fixtures/index-inline-v1.css'), 'utf-8');
    const legacyDoc = `${legacyPretty}\n${inline}`;
    const problems: string[] = [];
    let compared = 0;
    for (const cls of classesIn(html)) {
      if (cls === 'active') continue;
      const a = merged(rulesFor(legacyDoc, cls, legacyVars));
      if (Object.keys(a).length === 0) continue; // page-only classes (bg-brutal-*, border-mono-7/800, lg:col-span-2, …)
      const b = merged(rulesFor(jit, cls, jitVars));
      compared++;
      const allowed = new Set(KNOWN_DIFFERENCES[cls] ?? []);
      for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
        const da = a[key] ?? {};
        const db = b[key] ?? {};
        for (const prop of new Set([...Object.keys(da), ...Object.keys(db)])) {
          if (allowed.has(prop)) continue;
          if (da[prop] !== db[prop])
            problems.push(`${cls} ${key} ${prop}: legacy=${da[prop]} jit=${db[prop]}`);
        }
      }
    }
    expect(compared).toBeGreaterThan(120);
    expect(problems).toEqual([]);
  });

  it('the JIT stylesheet is small and valid CSS', async () => {
    const gen = new CSSGenerator(await loadConfig());
    const css = gen.generateJIT(html, {});
    const min = gen.minify(css);
    expect(Buffer.byteLength(min)).toBeLessThan(20_000);
    let errors = 0;
    csstree.parse(min, { onParseError: () => errors++ });
    expect(errors).toBe(0);
  });

  it('site/index.min.css matches a fresh build (run `node scripts/build-site.mjs`)', async () => {
    const gen = new CSSGenerator(await loadConfig());
    const min = gen.minify(gen.generateJIT(html, {}));
    const committed = readFileSync(join(root, 'site/index.min.css'), 'utf-8');
    expect(committed.length).toBe(min.length);
    expect(committed === min).toBe(true);
  });
});

describe('static CDN bundles', () => {
  it('dist/css/nakshora{,.min}.css equal the committed core dist (scripts/generate-css.mjs)', () => {
    const coreDist = join(__dirname, '../dist');
    for (const file of ['nakshora.css', 'nakshora.min.css']) {
      expect(readFileSync(join(root, 'dist/css', file), 'utf-8')).toBe(
        readFileSync(join(coreDist, file), 'utf-8'),
      );
    }
  });

  it('precompressed sidecars decompress to exactly dist/css/nakshora.min.css', () => {
    const min = readFileSync(join(root, 'dist/css/nakshora.min.css'));
    const br = brotliDecompressSync(readFileSync(join(root, 'dist/css/nakshora.min.css.br')));
    const gz = gunzipSync(readFileSync(join(root, 'dist/css/nakshora.min.css.gz')));
    expect(br.equals(min)).toBe(true);
    expect(gz.equals(min)).toBe(true);
    // the numbers quoted in docs/PERFORMANCE.md / INSTALLATION.md
    expect(statSync(join(root, 'dist/css/nakshora.min.css.br')).size).toBeLessThan(140_000);
    expect(statSync(join(root, 'dist/css/nakshora.min.css.gz')).size).toBeLessThan(600_000);
  });

  it('dist/css/nakshora.min.css is the minified full build of the current engine', () => {
    const gen = new CSSGenerator();
    const min = gen.minify(gen.generate({ mode: 'full' }));
    const committed = readFileSync(join(root, 'dist/css/nakshora.min.css'), 'utf-8');
    expect(committed.length).toBe(min.length);
    expect(committed === min).toBe(true);
  }, 60_000);

  it('min.main.css (historical CDN entry point) === dist/css/nakshora.min.css', () => {
    const a = readFileSync(join(root, 'min.main.css'), 'utf-8');
    const b = readFileSync(join(root, 'dist/css/nakshora.min.css'), 'utf-8');
    expect(a.length).toBe(b.length);
    expect(a === b).toBe(true);
  });

  it('minified-version/v1.0.0.css is the frozen legacy bundle (same rules as the v1 source, modulo formatting)', () => {
    const rules = (css: string): number => {
      let n = 0;
      csstree.walk(csstree.parse(css), { visit: 'Rule', enter: () => n++ });
      return n;
    };
    // both are v1.0.0: min.main.css is the readable source, v1.0.0.css a cssnano pass that
    // merges rules with identical declarations — so rule counts differ but selectors agree.
    const selectors = (css: string): Set<string> => {
      const out = new Set<string>();
      csstree.walk(csstree.parse(css), {
        visit: 'Rule',
        enter(node) {
          for (const s of csstree.generate(node.prelude).split(',')) out.add(s.trim());
        },
      });
      return out;
    };
    // cssnano rewrites `*::before` → `::before`
    const norm = (set: Set<string>): Set<string> =>
      new Set([...set].map((s) => s.replace(/^\*::/, '::')));
    const a = norm(selectors(legacyPretty));
    const b = norm(selectors(legacyCss));
    expect([...a].filter((s) => !b.has(s))).toEqual([]);
    expect([...b].filter((s) => !a.has(s))).toEqual([]);
    expect(rules(legacyPretty)).toBeGreaterThan(900);
  });
});
