// Phase C — the 10-step breakpoint system. Every documented behaviour in
// docs/RESPONSIVE.md is pinned here.

import { describe, expect, it } from 'vitest';
import { CSSGenerator, DEFAULT_SCREENS, screenToPx } from '../src/index';
import { neonTheme, pastelTheme, brutalistTheme, minimalistTheme, natureTheme } from '../src/index';

const gen = new CSSGenerator();
const utilities = (g: CSSGenerator, html: string): string =>
  g.generateFromContent(html).split('Utilities (JIT) ─── */')[1].trim();

const SCREENS: Array<[string, number]> = [
  ['xxs', 200],
  ['xs', 400],
  ['sm', 640],
  ['md', 768],
  ['lg', 1024],
  ['xl', 1280],
  ['2xl', 1536],
  ['3xl', 1920],
  ['4xl', 2560],
  ['5xl', 5000],
];

describe('the 10 breakpoints', () => {
  it('are exactly xxs 200 … 5xl 5000 (min-width px), in that order', () => {
    expect(Object.entries(DEFAULT_SCREENS)).toEqual(SCREENS.map(([n, px]) => [n, `${px}px`]));
    expect(Object.keys(gen.theme.screens)).toEqual(SCREENS.map(([n]) => n));
  });

  it('each `<screen>:` variant emits `@media (min-width: Npx)`', () => {
    const css = utilities(gen, `<a class="${SCREENS.map(([n]) => `${n}:flex`).join(' ')}">`);
    for (const [name, px] of SCREENS) {
      const esc = /^\d/.test(name) ? `\\3${name[0]}${name.slice(1)}` : name;
      expect(css).toContain(
        `@media (min-width: ${px}px) {\n  .${esc}\\:flex { display: flex; }\n}`,
      );
    }
    // ascending order in the output
    const positions = SCREENS.map(([, px]) => css.indexOf(`(min-width: ${px}px)`));
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  it('`max-<screen>:` emits `@media (max-width: N-0.02px)`, largest first', () => {
    const css = utilities(gen, `<a class="${SCREENS.map(([n]) => `max-${n}:flex`).join(' ')}">`);
    for (const [name, px] of SCREENS)
      expect(css).toContain(
        `@media (max-width: ${px - 0.02}px) {\n  .max-${name}\\:flex { display: flex; }\n}`,
      );
    const positions = SCREENS.map(([, px]) => css.indexOf(`(max-width: ${px - 0.02}px)`));
    expect([...positions].sort((a, b) => b - a)).toEqual(positions);
  });

  it('sm–2xl output is byte-identical to the pre-Phase-C build', () => {
    // captured from main@b1d0c3f dist/css/nakshora.css
    const css = utilities(gen, '<a class="sm:flex md:p-4 lg:grid xl:hidden 2xl:max-w-4xl">');
    expect(css).toBe(
      [
        '@media (min-width: 640px) {',
        '  .sm\\:flex { display: flex; }',
        '}',
        '@media (min-width: 768px) {',
        '  .md\\:p-4 { padding: 1rem; }',
        '}',
        '@media (min-width: 1024px) {',
        '  .lg\\:grid { display: grid; }',
        '}',
        '@media (min-width: 1280px) {',
        '  .xl\\:hidden { display: none; }',
        '}',
        '@media (min-width: 1536px) {',
        '  .\\32xl\\:max-w-4xl { max-width: 56rem; }',
        '}',
      ].join('\n'),
    );
  });

  it('`.container` never emits a 200px or 5000px max-width by default', () => {
    const css = utilities(gen, '<a class="container">');
    expect(css).not.toContain('200px');
    expect(css).not.toContain('5000px');
    expect(css).not.toContain('1920px');
    expect(css.match(/max-width/g)?.length).toBe(5); // sm md lg xl 2xl
    expect(css).toContain('@media (min-width: 1536px) {\n  .container { max-width: 1536px; }');
    // opt in to the wider range
    const wide = new CSSGenerator({ theme: { container: { minScreen: 'xxs', maxScreen: '4xl' } } });
    const wcss = utilities(wide, '<a class="container">');
    expect(wcss).toContain('max-width: 200px');
    expect(wcss).toContain('max-width: 2560px');
    expect(wcss).not.toContain('5000px');
    const all = new CSSGenerator({ theme: { container: { minScreen: false, maxScreen: false } } });
    expect(utilities(all, '<a class="container">')).toContain('max-width: 5000px');
  });
});

describe('combining and stacking', () => {
  it('a screen plus any other media variant collapses into ONE @media', () => {
    expect(utilities(gen, '<a class="print:md:flex">')).toBe(
      '@media print and (min-width: 768px) {\n  .print\\:md\\:flex { display: flex; }\n}',
    );
    expect(utilities(gen, '<a class="md:print:flex">')).toBe(
      '@media print and (min-width: 768px) {\n  .md\\:print\\:flex { display: flex; }\n}',
    );
    expect(utilities(gen, '<a class="motion-reduce:xl:hidden">')).toBe(
      '@media (min-width: 1280px) and (prefers-reduced-motion: reduce) {\n  .motion-reduce\\:xl\\:hidden { display: none; }\n}',
    );
    expect(utilities(gen, '<a class="portrait:max-md:dark:flex">')).toBe(
      '@media (max-width: 767.98px) and (orientation: portrait) {\n  .portrait\\:max-md\\:dark\\:flex:is(.dark *) { display: flex; }\n}',
    );
  });

  it('`lg:xl:` (same family) keeps the tighter bound: largest min / smallest max', () => {
    expect(utilities(gen, '<a class="lg:xl:flex">')).toBe(
      '@media (min-width: 1280px) {\n  .lg\\:xl\\:flex { display: flex; }\n}',
    );
    expect(utilities(gen, '<a class="xl:lg:flex">')).toBe(
      '@media (min-width: 1280px) {\n  .xl\\:lg\\:flex { display: flex; }\n}',
    );
    expect(utilities(gen, '<a class="max-md:max-sm:flex">')).toBe(
      '@media (max-width: 639.98px) {\n  .max-md\\:max-sm\\:flex { display: flex; }\n}',
    );
    // a range: min and max together
    expect(utilities(gen, '<a class="md:max-xl:flex">')).toBe(
      '@media (min-width: 768px) and (max-width: 1279.98px) {\n  .md\\:max-xl\\:flex { display: flex; }\n}',
    );
  });

  it('arbitrary `[@media(...)]:` queries are never merged', () => {
    expect(utilities(gen, '<a class="[@media(min-width:200px)]:md:flex">')).toBe(
      '@media (min-width:200px) {\n  @media (min-width: 768px) {\n    .\\[\\@media\\(min-width\\:200px\\)\\]\\:md\\:flex { display: flex; }\n  }\n}',
    );
  });

  it('`combineMedia: false` restores nested queries', () => {
    const nested = new CSSGenerator({ combineMedia: false });
    expect(utilities(nested, '<a class="print:md:flex">')).toBe(
      '@media print {\n  @media (min-width: 768px) {\n    .print\\:md\\:flex { display: flex; }\n  }\n}',
    );
  });

  it('`min-[…]:` / `max-[…]:` / `*-svh` / `clamp()` keep working', () => {
    const css = utilities(
      gen,
      '<a class="min-[300px]:flex max-[900px]:flex h-svh h-lvh h-dvh min-h-dvh w-[clamp(1rem,5vw,3rem)]">',
    );
    expect(css).toContain('@media (min-width: 300px) {\n  .min-\\[300px\\]\\:flex');
    expect(css).toContain('@media (max-width: 900px) {\n  .max-\\[900px\\]\\:flex');
    expect(css).toContain('.h-svh { height: 100svh; }');
    expect(css).toContain('.h-lvh { height: 100lvh; }');
    expect(css).toContain('.h-dvh { height: 100dvh; }');
    expect(css).toContain('.min-h-dvh { min-height: 100dvh; }');
    expect(css).toContain('width: clamp(1rem, 5vw, 3rem)');
  });
});

describe('configuration', () => {
  it('`theme.breakpoints` extends (numbers → px), `null` removes, `theme.screens` replaces', () => {
    const ext = new CSSGenerator({ theme: { breakpoints: { tablet: 900, xxs: null } } });
    // inserted in pixel order, not appended
    expect(Object.keys(ext.theme.screens)).toEqual([
      'xs',
      'sm',
      'md',
      'tablet',
      'lg',
      'xl',
      '2xl',
      '3xl',
      '4xl',
      '5xl',
    ]);
    const css = utilities(ext, '<a class="tablet:flex max-tablet:flex xxs:flex md:flex">');
    expect(css).toContain('@media (min-width: 900px) {\n  .tablet\\:flex');
    expect(css).toContain('@media (max-width: 899.98px) {\n  .max-tablet\\:flex');
    expect(css).not.toContain('xxs');
    const rep = new CSSGenerator({ theme: { screens: { a: '100px', b: '200px' } } });
    expect(Object.keys(rep.theme.screens)).toEqual(['a', 'b']);
    expect(utilities(rep, '<a class="a:flex md:flex">')).toBe(
      '@media (min-width: 100px) {\n  .a\\:flex { display: flex; }\n}',
    );
  });

  it('presets keep the full scale; a preset may trim it via theme.screens', () => {
    for (const preset of [neonTheme, pastelTheme, brutalistTheme, minimalistTheme, natureTheme]) {
      const g = new CSSGenerator({ presets: [preset] });
      expect(Object.keys(g.theme.screens)).toEqual(SCREENS.map(([n]) => n));
    }
    const trimmed = new CSSGenerator({
      presets: [{ theme: { screens: { sm: '640px', lg: '1024px' } } }],
    });
    expect(Object.keys(trimmed.theme.screens)).toEqual(['sm', 'lg']);
  });

  it('`variants.responsive: false` disables min-*, max-*, min-[…] and max-[…]', () => {
    const g = new CSSGenerator({ variants: { responsive: false } });
    expect(
      utilities(g, '<a class="flex md:flex max-md:flex min-[300px]:flex max-[300px]:flex">'),
    ).toBe('.flex { display: flex; }');
    // the full build has no responsive layer and `.container` has no breakpoints either
    expect(g.generate({ mode: 'full' })).not.toContain('(min-width:');
    expect(utilities(g, '<a class="container">')).toBe('.container { width: 100%; }');
  });

  it('`variants.maxResponsive: false` disables only the max-* half', () => {
    const g = new CSSGenerator({ variants: { maxResponsive: false } });
    expect(utilities(g, '<a class="flex md:flex max-md:flex max-[300px]:flex">')).toBe(
      '.flex { display: flex; }\n@media (min-width: 768px) {\n  .md\\:flex { display: flex; }\n}',
    );
  });

  it('full build emits sm–2xl only unless `screens: "all"` / a list', () => {
    // a screen is "in the build" when its prefixed utilities exist
    const screensIn = (css: string): string[] =>
      SCREENS.filter(([n]) => css.includes(`.${n.replace(/^(\d)/, '\\3$1')}\\:flex {`)).map(
        ([n]) => n,
      );
    expect(screensIn(gen.generate({ mode: 'full' }))).toEqual(['sm', 'md', 'lg', 'xl', '2xl']);
    expect(screensIn(gen.getUtilitiesFull(false, { screens: ['xxs', '5xl'] }))).toEqual([
      'xxs',
      '5xl',
    ]);
    expect(screensIn(gen.getUtilitiesFull(false, { screens: 'all' }))).toEqual(
      SCREENS.map(([n]) => n),
    );
  });

  it('screenToPx understands px, rem and em', () => {
    expect(screenToPx('640px')).toBe(640);
    expect(screenToPx('40rem')).toBe(640);
    expect(screenToPx('40em')).toBe(640);
  });
});

describe('container queries', () => {
  it('@container, @<size>, @min-<size>, @max-<size>, arbitrary and named', () => {
    const css = utilities(
      gen,
      '<a class="@container @container/card @sm:flex @min-md:flex @max-md:flex @max-sm:flex @max-[400px]:flex @lg/card:flex @max-lg/card:flex @[30rem]:flex">',
    );
    expect(css).toContain('.\\@container { container-type: inline-size; }');
    expect(css).toContain(
      '.\\@container\\/card { container-type: inline-size; container-name: card; }',
    );
    expect(css).toContain('@container (min-width: 24rem) {\n  .\\@sm\\:flex');
    expect(css).toContain('@container (min-width: 28rem) {\n  .\\@min-md\\:flex');
    expect(css).toContain('@container (width < 28rem) {\n  .\\@max-md\\:flex');
    expect(css).toContain('@container (width < 400px) {\n  .\\@max-\\[400px\\]\\:flex');
    expect(css).toContain('@container card (min-width: 32rem) {\n  .\\@lg\\/card\\:flex');
    expect(css).toContain('@container card (width < 32rem) {\n  .\\@max-lg\\/card\\:flex');
    expect(css).toContain('@container (min-width: 30rem) {\n  .\\@\\[30rem\\]\\:flex');
    // Tailwind v4 order: `@max-*` first, widest first (400px, 32rem, 28rem, 24rem),
    // then `@min-*` ascending — verified against tailwindcss@4.3.3 `compile()`.
    const order = [
      '(width < 400px)',
      'card (width < 32rem)',
      '(width < 28rem)',
      '(width < 24rem)',
      '(min-width: 24rem)',
      '(min-width: 28rem)',
      'card (min-width: 32rem)',
    ].map((q) => css.indexOf(q));
    expect(order.every((p) => p >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it('`variants.containerQueries: false` disables all of them', () => {
    const g = new CSSGenerator({ variants: { containerQueries: false } });
    expect(utilities(g, '<a class="flex @md:flex @max-md:flex">')).toBe('.flex { display: flex; }');
  });
});
