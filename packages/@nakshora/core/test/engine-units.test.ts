// Unit tests for engine helpers that the differential suites only exercise
// indirectly: postcss-js number semantics, adjacent-rule collapsing, output
// de-duplication, cascade comparison, JIT minify and a few regressions.

import { describe, expect, it } from 'vitest';
import { CSSGenerator, Engine, resolveTheme, plugin } from '../src/index';
import { compareRules } from '../src/engine';
import {
  numberToCss,
  kebabProp,
  collapseAdjacentRules,
  cssInJsToNodes,
  parseCss,
  serializeCss,
} from '../src/css-ast';

const gen = new CSSGenerator();
const jit = (html: string): string =>
  gen.generateFromContent(html).split('Utilities (JIT) ─── */')[1].trim();

describe('numberToCss (postcss-js semantics)', () => {
  it('adds px to lengths, keeps unitless properties and zero bare', () => {
    expect(numberToCss('border-top-width', 1)).toBe('1px');
    expect(numberToCss('margin', 0)).toBe('0');
    expect(numberToCss('opacity', 0.5)).toBe('0.5');
    expect(numberToCss('line-height', 1.5)).toBe('1.5');
    expect(numberToCss('z-index', 10)).toBe('10');
    expect(numberToCss('flex', 1)).toBe('1');
    expect(numberToCss('font-weight', 700)).toBe('700');
    expect(numberToCss('--my-var', 3)).toBe('3');
    expect(numberToCss('stroke-width', 2)).toBe('2');
  });
  it('kebabProp handles vendor prefixes and custom properties', () => {
    expect(kebabProp('WebkitLineClamp')).toBe('-webkit-line-clamp');
    expect(kebabProp('MozAppearance')).toBe('-moz-appearance');
    expect(kebabProp('borderTopLeftRadius')).toBe('border-top-left-radius');
    expect(kebabProp('--tw-x')).toBe('--tw-x');
  });
  it('cssInJsToNodes applies numbers, nesting and at-rules', () => {
    const css = serializeCss(
      cssInJsToNodes({
        '.card': {
          borderWidth: 1,
          opacity: 0.9,
          '&:hover': { opacity: 1 },
          '> p': { margin: 0 },
          '@media (min-width: 640px)': { padding: 8 },
        },
      }),
    );
    expect(css).toBe(
      [
        '.card { border-width: 1px; opacity: 0.9; }',
        '.card:hover { opacity: 1; }',
        '.card > p { margin: 0; }',
        '@media (min-width: 640px) {',
        '  .card { padding: 8px; }',
        '}',
        '',
      ].join('\n'),
    );
  });
});

describe('collapseAdjacentRules', () => {
  it('merges adjacent same-selector rules and same at-rules, leaves non-adjacent alone', () => {
    const root = parseCss(
      '.a { color: red } .a { top: 0 } .b { x: 1 } .a { z: 2 }\n' +
        '@media (min-width: 1px) { .c { a: 1 } } @media (min-width: 1px) { .c { b: 2 } }\n' +
        '@font-face { src: url(a) } @font-face { src: url(b) }',
    );
    const out = serializeCss(collapseAdjacentRules(root.nodes));
    expect(out).toBe(
      [
        '.a { color: red; top: 0; }',
        '.b { x: 1; }',
        '.a { z: 2; }',
        '@media (min-width: 1px) {',
        '  .c { a: 1; b: 2; }',
        '}',
        '@font-face { src: url(a); }',
        '@font-face { src: url(b); }',
        '',
      ].join('\n'),
    );
  });
});

describe('dedupeRules / multi-rule utilities', () => {
  it('a class listed twice (and via safelist) is emitted once', () => {
    const css = new CSSGenerator({ safelist: ['flex'] }).generateFromContent(
      '<a class="flex flex">',
    );
    expect(css.match(/\.flex \{/g)?.length).toBe(1);
  });
  it('plugin components with adjacent identical selectors collapse; user components survive corePlugins.components:false', () => {
    const g = new CSSGenerator({
      corePlugins: { components: false },
      plugins: [
        plugin(({ addComponents }) => {
          addComponents({ '.btn': { padding: '1px' } });
          addComponents({ '.btn': { color: 'red' } });
        }),
      ],
    });
    const css = g.generateFromContent('<a class="btn">').split('Utilities (JIT) ─── */')[1];
    expect(css).toContain('.btn { padding: 1px; color: red; }');
    expect(css.match(/\.btn \{/g)?.length).toBe(1);
  });
  it('matchUtilities with a `&`-wrapped object yields several rules in order', () => {
    const g = new CSSGenerator({
      plugins: [
        plugin(({ matchUtilities }) => {
          matchUtilities(
            { tab: (v) => ({ tabSize: String(v), '&::before': { content: `"${String(v)}"` } }) },
            { values: { 2: '2', 4: '4' } },
          );
        }),
      ],
    });
    const css = g
      .generateFromContent('<a class="tab-4 tab-[8]">')
      .split('Utilities (JIT) ─── */')[1];
    expect(css).toContain('.tab-4 { tab-size: 4; }\n.tab-4::before { content: "4"; }');
    expect(css).toContain('.tab-\\[8\\] { tab-size: 8; }\n.tab-\\[8\\]::before { content: "8"; }');
  });
});

describe('compareRules', () => {
  const engine = new Engine({
    theme: resolveTheme({}),
    darkMode: 'class',
    pluginEnabled: () => true,
    variantEnabled: () => true,
    important: false,
  });
  const one = (c: string) => engine.compile(c)[0];
  it('orders plain < variant, by layer, by screen, then by utility position', () => {
    expect(compareRules(one('flex'), one('hover:flex'))).toBeLessThan(0);
    expect(compareRules(one('sm:flex'), one('md:flex'))).toBeLessThan(0);
    expect(compareRules(one('md:flex'), one('sm:flex'))).toBeGreaterThan(0);
    expect(compareRules(one('p-4'), one('px-4'))).toBeLessThan(0); // p before px (Tailwind)
    expect(compareRules(one('hover:flex'), one('focus:flex'))).toBeLessThan(0);
    expect(compareRules(one('flex'), one('flex'))).toBe(0);
    expect(compareRules(one('[color:red]'), one('flex'))).toBeGreaterThan(0); // arbitrary props last
  });
  it('is antisymmetric and transitive on a sample', () => {
    const rules = [
      'flex',
      'hover:flex',
      'sm:flex',
      'md:hover:flex',
      'p-4',
      'dark:p-4',
      'print:p-4',
    ].map(one);
    for (const a of rules)
      for (const b of rules)
        expect(Math.sign(compareRules(a, b)) + Math.sign(compareRules(b, a))).toBe(0);
    const sorted = [...rules].sort(compareRules);
    for (let i = 0; i < sorted.length - 1; i++)
      expect(compareRules(sorted[i], sorted[i + 1])).toBeLessThanOrEqual(0);
  });
});

describe('generateJIT / generate options', () => {
  it('generateJIT honours minify and utilitiesOnly', () => {
    const pretty = gen.generateJIT(['<a class="flex p-4">']);
    const min = gen.generateJIT(['<a class="flex p-4">'], { minify: true });
    expect(min.length).toBeLessThan(pretty.length);
    expect(min).not.toMatch(/\n\s+\./);
    expect(min).toContain('.flex{display:flex;}');
    expect(min).not.toContain('\n');
    const only = gen.generateJIT(['<a class="flex">'], { minify: false }, { utilitiesOnly: true });
    expect(only).not.toContain(':root');
    expect(only).not.toContain('box-sizing');
    expect(only.trim().endsWith('.flex { display: flex; }')).toBe(true);
  });
  it('two runs are byte-identical', () => {
    const html = '<a class="md:hover:bg-red-500/50 flex neon-btn @md:p-2 [--x:1]">';
    expect(new CSSGenerator().generateFromContent(html)).toBe(
      new CSSGenerator().generateFromContent(html),
    );
  });
});

describe('regressions', () => {
  it('size-* and legacy *-opacity-* utilities', () => {
    const css = jit(
      '<a class="size-4 size-px size-[3rem] size-full bg-opacity-50 text-opacity-25 border-opacity-0">',
    );
    expect(css).toContain('.size-4 { width: 1rem; height: 1rem; }');
    expect(css).toContain('.size-px { width: 1px; height: 1px; }');
    expect(css).toContain('.size-\\[3rem\\] { width: 3rem; height: 3rem; }');
    expect(css).toContain('.size-full { width: 100%; height: 100%; }');
    expect(css).toContain('.bg-opacity-50 { --tw-bg-opacity: 0.5; }');
    expect(css).toContain('.text-opacity-25 { --tw-text-opacity: 0.25; }');
    expect(css).toContain('.border-opacity-0 { --tw-border-opacity: 0; }');
  });
  it('sibling-order: selector-list utilities keep their extra selectors', () => {
    const css = jit('<a class="space-x-4 divide-y">');
    expect(css).toContain('.space-x-4 > :not([hidden]) ~ :not([hidden]) {');
    expect(css).toContain('.divide-y > :not([hidden]) ~ :not([hidden]) {');
  });
  it('variant bits: stacked selector variants apply in written order', () => {
    expect(jit('<a class="group-hover:focus:flex">')).toBe(
      '.group:hover .group-hover\\:focus\\:flex:focus { display: flex; }',
    );
    expect(jit('<a class="focus:group-hover:flex">')).toBe(
      '.group:hover .focus\\:group-hover\\:flex:focus { display: flex; }',
    );
    expect(jit('<a class="dark:hover:flex">')).toBe(
      '.dark\\:hover\\:flex:hover:is(.dark *) { display: flex; }',
    );
  });
});
