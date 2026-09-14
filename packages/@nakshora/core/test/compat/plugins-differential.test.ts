// Differential test: the official Tailwind plugins, run unmodified through
// Nakshora's plugin adapter, must emit the same rules Tailwind 3.4.19 emits.
//
// Covered: @tailwindcss/typography, @tailwindcss/forms, @tailwindcss/aspect-ratio,
// @tailwindcss/container-queries — i.e. addComponents, addBase, addUtilities,
// matchUtilities, addVariant, matchVariant, theme() and plugin.withOptions.

import { describe, expect, it } from 'vitest';
import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';
import aspectRatio from '@tailwindcss/aspect-ratio';
import containerQueries from '@tailwindcss/container-queries';
import postcss from 'postcss';
import tailwind from 'tailwindcss';
import { CSSGenerator, parseCss } from '../../src/index';
import { tailwindOracle, type OracleRule } from './oracle';

type Rules = Record<string, OracleRule[]>;

/** Rules per candidate from Nakshora's JIT utilities layer. */
function nakshoraRules(gen: CSSGenerator, candidates: string[]): Rules {
  const out: Rules = {};
  for (const c of candidates) {
    out[c] = gen.engine.compile(c).map((r) => ({
      selector: r.selector,
      atrules: r.atrules.map(
        (a) => `@${a.kind === 'starting' ? 'starting-style' : a.kind} ${a.params}`,
      ),
      decls: Object.entries(r.decls),
    }));
  }
  return out;
}

function normAt(at: string): string {
  return at.replace(/^@(\w[\w-]*)\s*/, '@$1 ').trim();
}
/** Whitespace-insensitive comparison of selectors (PostCSS keeps the plugin's raw spacing). */
function normSel(sel: string): string {
  return sel
    .replace(/\s*,\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
}
function normalise(rules: OracleRule[]): OracleRule[] {
  return rules.map((r) => ({
    selector: normSel(r.selector),
    atrules: r.atrules.map(normAt),
    decls: r.decls.map(([k, v]) => [k, v.replace(/\s+/g, ' ').trim()] as [string, string]),
  }));
}

function diff(name: string, want: Rules, got: Rules): string[] {
  const problems: string[] = [];
  for (const cls of Object.keys(want)) {
    const w = JSON.stringify(normalise(want[cls]));
    const g = JSON.stringify(normalise(got[cls] ?? []));
    if (w !== g)
      problems.push(`${name} ${cls}\n   want ${w.slice(0, 400)}\n   got  ${g.slice(0, 400)}`);
  }
  return problems;
}

describe('official Tailwind plugins through the adapter', () => {
  it('@tailwindcss/typography: prose, modifiers, size & colour variants', async () => {
    const candidates = [
      'prose',
      'prose-sm',
      'prose-lg',
      'prose-xl',
      'prose-2xl',
      'prose-invert',
      'prose-slate',
      'prose-zinc',
      'lg:prose-xl',
      'dark:prose-invert',
      'prose-headings:underline',
      'prose-a:text-blue-600',
      'hover:prose-a:text-blue-500',
      'prose-img:rounded-xl',
      'prose-p:my-2',
      'prose-li:marker:text-red-500',
    ];
    const want = await tailwindOracle(candidates, {}, { plugins: [typography], cacheKey: 'typo' });
    const gen = new CSSGenerator({ plugins: [typography] });
    const got = nakshoraRules(gen, candidates);
    expect(diff('typography', want, got)).toEqual([]);
    // sanity: the whole prose block is compared, not just the first rule
    expect(want.prose.length).toBeGreaterThan(80); // 88 rules in tailwindcss@3.4.19
    expect(got.prose.length).toBe(want.prose.length);
  }, 60_000);

  it('@tailwindcss/forms: base styles (strategy: base) and class strategy', async () => {
    // base layer: compare the rule list emitted by Tailwind's @tailwind base
    const result = await postcss([
      tailwind({
        content: [
          { raw: '<input class="form-input form-select form-checkbox">', extension: 'html' },
        ],
        corePlugins: { preflight: false },
        plugins: [forms],
      } as never),
    ]).process('@tailwind base;', { from: undefined });
    const twBase = result.root.nodes
      .filter((n): n is postcss.Rule => n.type === 'rule')
      .map((r) => normSel(r.selector));
    const gen = new CSSGenerator({ plugins: [forms], preflight: false });
    const nkBase = parseCss(gen.getBase())
      .nodes.filter((n) => n.type === 'rule')
      .map((r) => normSel((r as { selector: string }).selector))
      // Nakshora's base layer also carries the `--tw-*` defaults rule
      .filter((s) => s !== '*, ::before, ::after' && s !== '::backdrop');
    const twOnly = twBase.filter((s) => s !== '*, ::before, ::after' && s !== '::backdrop');
    for (const sel of twOnly) expect(nkBase, `missing forms base rule ${sel}`).toContain(sel);
    expect(nkBase.length).toBe(twOnly.length);

    // class strategy
    const candidates = [
      'form-input',
      'form-select',
      'form-checkbox',
      'form-radio',
      'form-textarea',
    ];
    const want = await tailwindOracle(
      candidates,
      {},
      { plugins: [forms({ strategy: 'class' })], cacheKey: 'forms-class' },
    );
    const gen2 = new CSSGenerator({ plugins: [forms({ strategy: 'class' })] });
    const got = nakshoraRules(gen2, candidates);
    expect(diff('forms', want, got)).toEqual([]);
  }, 60_000);

  it('@tailwindcss/aspect-ratio: matchUtilities + addUtilities + base defaults', async () => {
    const candidates = [
      'aspect-w-16',
      'aspect-h-9',
      'aspect-none',
      'md:aspect-w-4',
      'aspect-w-[3]',
    ];
    const want = await tailwindOracle(candidates, {}, { plugins: [aspectRatio], cacheKey: 'ar' });
    const gen = new CSSGenerator({ plugins: [aspectRatio] });
    const got = nakshoraRules(gen, candidates);
    expect(diff('aspect-ratio', want, got)).toEqual([]);
  }, 60_000);

  it('@tailwindcss/container-queries: the built-in variants match the official plugin', async () => {
    const candidates = [
      '@container',
      '@container/main',
      '@container-normal',
      '@sm:flex',
      '@lg:grid',
      '@[400px]:hidden',
      '@md/main:hidden',
      '@7xl:block',
      'hover:@md:flex',
      '@md:hover:flex',
    ];
    const want = await tailwindOracle(
      candidates,
      {},
      { plugins: [containerQueries], cacheKey: 'cq' },
    );
    // Nakshora ships container queries natively, so the plugin is not needed…
    const gen = new CSSGenerator({});
    expect(diff('container-queries (built-in)', want, nakshoraRules(gen, candidates))).toEqual([]);
    // …but loading it must not break anything either
    const gen2 = new CSSGenerator({ plugins: [containerQueries] });
    expect(diff('container-queries (plugin)', want, nakshoraRules(gen2, candidates))).toEqual([]);
  }, 60_000);
});
