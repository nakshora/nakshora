// Differential tests for the author-CSS features Tailwind users rely on:
// `@apply` (plain, variants, `!important`, errors), `theme()` / `screen()`,
// `@screen`, and every `darkMode` strategy. tailwindcss@3.4.19 is the oracle.

import { describe, expect, it } from 'vitest';
import postcss from 'postcss';
import tailwind from 'tailwindcss';
import { ApplyError, CSSGenerator, parseCss, serializeCss, type CssNode } from '../../src/index';

async function tailwindCss(input: string, config: Record<string, unknown> = {}): Promise<string> {
  const result = await postcss([
    tailwind({
      content: [{ raw: '', extension: 'html' }],
      corePlugins: { preflight: false },
      darkMode: 'class',
      ...config,
    } as never),
  ]).process(input, { from: undefined });
  return result.css;
}

/** Canonical form: re-serialise both outputs through Nakshora's AST printer. */
function canon(css: string): string {
  return serializeCss(parseCss(css)).trim();
}

/**
 * Tailwind nests stacked media queries (`@media a { @media b { … } }`);
 * Nakshora combines them into `@media a and b` (documented policy, tested for
 * equivalence in tailwind-differential.test.ts). Normalise the oracle output.
 */
function combineNestedMedia(css: string): string {
  const root = parseCss(css);
  const walk = (nodes: CssNode[]): void => {
    for (const n of nodes) {
      if (n.type !== 'atrule' || !n.nodes) continue;
      let children: CssNode[] = n.nodes;
      for (;;) {
        const inner = children.length === 1 ? children[0] : undefined;
        if (n.name !== 'media' || !inner || inner.type !== 'atrule' || inner.name !== 'media')
          break;
        n.params = `${n.params} and ${inner.params}`;
        children = inner.nodes ?? [];
      }
      n.nodes = children;
      walk(children);
    }
  };
  walk(root.nodes);
  return serializeCss(root).trim();
}

const AUTHOR_CSS = `
.btn { @apply px-4 py-2 font-bold rounded hover:bg-blue-700 md:text-lg dark:bg-black !important; }
.card { @apply bg-white shadow; color: theme(colors.red.500); margin: theme('spacing.4'); padding: theme(spacing[2.5]); }
.card2 { @apply space-x-4 group-hover:opacity-50 focus-within:ring-2 before:content-['x']; width: theme(colors.blue.500 / 50%); }
.a, .b { @apply flex; }
@screen md { .x { @apply block; } }
@media (min-width: theme(screens.lg)) { .y { color: red } }
.z { @apply !p-2 hover:!m-2 }
.nested { .inner { @apply mt-1; } }
.multi { @apply lg:hover:underline print:hidden; }
`;

describe('@apply / theme() / @screen — differential against tailwindcss@3.4.19', () => {
  it('expands author CSS identically (declarations, variant siblings, cascade order, !important)', async () => {
    const want = canon(await tailwindCss(AUTHOR_CSS));
    const got = canon(new CSSGenerator({}).processCss(AUTHOR_CSS));
    expect(got).toBe(want);
  });

  it('theme() supports every path form Tailwind does', async () => {
    const css = `.t {
      a: theme(colors.red.500);
      b: theme('colors.red.500');
      c: theme("colors.red.500");
      d: theme(spacing.4);
      e: theme(spacing[2.5]);
      g: theme(fontFamily.sans);
      h: theme(fontSize.lg);
      i: theme(boxShadow.md);
      j: theme(colors.red.500 / 50%);
      k: theme(colors.red.500 / 0.5);
      l: theme(screens.md);
      m: theme(borderRadius.DEFAULT);
      n: theme(transitionTimingFunction.DEFAULT);
    }`;
    const want = canon(await tailwindCss(css));
    const got = canon(new CSSGenerator({}).processCss(css));
    expect(got).toBe(want);
  });

  it('theme() sees theme overrides and extensions', () => {
    const gen = new CSSGenerator({
      theme: { extend: { colors: { brand: { 500: '#123456' } }, spacing: { 128: '32rem' } } },
    });
    expect(gen.processCss('.x { color: theme(colors.brand.500); width: theme(spacing.128) }')).toBe(
      '.x { color: #123456; width: 32rem; }\n',
    );
  });

  it('reports unknown classes and theme paths with Tailwind-style messages', () => {
    const gen = new CSSGenerator({});
    expect(() => gen.processCss('.x { @apply not-a-class; }')).toThrow(ApplyError);
    expect(() => gen.processCss('.x { @apply not-a-class; }')).toThrow(
      /The `not-a-class` class does not exist/,
    );
    expect(() => gen.processCss('.x { color: theme(colors.nope.500); }')).toThrow(
      /'colors.nope.500' does not exist in your theme config/,
    );
    expect(() => gen.processCss('@screen huge { .x { color: red } }')).toThrow(
      /The 'huge' screen does not exist/,
    );
    expect(() => gen.processCss('@apply flex;')).toThrow(/`@apply` must be used inside a rule/);
    expect(() => gen.processCss('.x { @apply group; }')).toThrow(
      /@apply should not be used with the 'group' utility/,
    );
    expect(() => gen.processCss('.flex { @apply flex; }')).toThrow(/circular dependency/);
    expect(() => gen.processCss('.x { @media (min-width: 1px) { @apply flex; } }')).toThrow(
      /@apply is not supported within nested at-rules like @media/,
    );
    // lenient mode keeps going
    expect(gen.processCss('.x { @apply not-a-class p-1; }', { strict: false })).toBe(
      '.x { padding: 0.25rem; }\n',
    );
  });

  it('@apply works with plugin components and user classes registered via plugins', () => {
    const gen = new CSSGenerator({
      plugins: [
        {
          handler: (api) => {
            api.addComponents({ '.chip': { padding: '2px', borderRadius: '9999px' } });
          },
        },
      ],
    });
    expect(gen.processCss('.tag { @apply chip font-bold; }')).toBe(
      '.tag { padding: 2px; border-radius: 9999px; font-weight: 700; }\n',
    );
  });
});

describe('darkMode strategies — differential against tailwindcss@3.4.19', () => {
  const html = '<i class="dark:bg-black dark:hover:text-white md:dark:flex">';
  const cases: [string, unknown][] = [
    ['class', 'class'],
    ['media', 'media'],
    ['selector', 'selector'],
    ["['class', '.theme-dark']", ['class', '.theme-dark']],
    ["['selector', '[data-mode=dark]']", ['selector', '[data-mode="dark"]']],
    ["['variant', '&:not(.light *)']", ['variant', '&:not(.light *)']],
    [
      "['variant', [ '@media (prefers-color-scheme: dark) { &:not(.light *) }', '&:is(.dark *)' ]]",
      ['variant', ['@media (prefers-color-scheme: dark) { &:not(.light *) }', '&:is(.dark *)']],
    ],
  ];
  for (const [label, darkMode] of cases) {
    it(`darkMode: ${label}`, async () => {
      const result = await postcss([
        tailwind({
          content: [{ raw: html, extension: 'html' }],
          corePlugins: { preflight: false },
          darkMode,
        } as never),
      ]).process('@tailwind utilities;', { from: undefined });
      const want = combineNestedMedia(result.css);
      const gen = new CSSGenerator({ darkMode: darkMode as never });
      const got = canon(
        gen.generateJIT(html, {}, { utilitiesOnly: true }).replace(/\/\*.*?\*\//g, ''),
      );
      expect(got).toBe(want);
    });
  }

  it('`variants.dark = false` disables the variant entirely', () => {
    const gen = new CSSGenerator({ variants: { dark: false } });
    expect(gen.generateJIT(html, {}, { utilitiesOnly: true })).not.toContain('bg-black');
  });
});
