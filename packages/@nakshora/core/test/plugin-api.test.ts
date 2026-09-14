// The documented plugin API (docs/CONFIGURATION.md "Plugins", docs/API.md
// "Plugins") — every method, in one plugin, exact output.
import { describe, expect, it } from 'vitest';
import { CSSGenerator, type UtilityGenerator } from '../src/index';

function demo(api: UtilityGenerator): void {
  api.addUtilities({ '.content-auto': { 'content-visibility': 'auto' } });
  api.matchUtilities(
    { tab: (v) => ({ tabSize: String(v) }) },
    { values: api.theme('spacing') as Record<string, string> },
  );
  api.addComponents({
    '.card': { padding: api.theme('spacing.4') as string, '&:hover': { opacity: '0.9' } },
  });
  api.matchComponents({ 'card-w': (v) => ({ width: String(v) }) }, { values: { sm: '20rem' } });
  api.addBase({ h1: { fontSize: (api.theme('fontSize.2xl') as [string, unknown])[0] } });
  api.addVariant('hocus', ['&:hover', '&:focus']);
  api.matchVariant('nth', (v) => `&:nth-child(${v})`, { values: { 1: '1' } });
}

describe('plugin API', () => {
  const html =
    '<a class="content-auto tab-4 tab-[3] card card-w-sm hocus:flex nth-1:flex nth-[3]:flex md:hocus:p-2">';

  it('function plugin: every method produces the documented CSS', () => {
    const gen = new CSSGenerator({ plugins: [demo] });
    const css = gen.generateJIT(html, {}, { utilitiesOnly: true });
    expect(css).toBe(
      [
        '',
        '/* ─── Utilities (JIT) ─── */',
        '.content-auto { content-visibility: auto; }',
        '.card { padding: 1rem; }',
        '.card:hover { opacity: 0.9; }',
        '.tab-4 { tab-size: 1rem; }',
        '.tab-\\[3\\] { tab-size: 3; }',
        '.card-w-sm { width: 20rem; }',
        '.hocus\\:flex:hover { display: flex; }',
        '.hocus\\:flex:focus { display: flex; }',
        '.nth-1\\:flex:nth-child(1) { display: flex; }',
        '.nth-\\[3\\]\\:flex:nth-child(3) { display: flex; }',
        '@media (min-width: 768px) {',
        '  .md\\:hocus\\:p-2:hover { padding: 0.5rem; }',
        '  .md\\:hocus\\:p-2:focus { padding: 0.5rem; }',
        '}',
        '',
      ].join('\n'),
    );
    expect(gen.getBase()).toContain('h1 { font-size: 1.5rem; }');
  });

  it('object plugin with handler + config hook, and helpers e()/prefix()/corePlugins()/config()', () => {
    let seen: Record<string, unknown> = {};
    const gen = new CSSGenerator({
      prefix: 'nk-',
      plugins: [
        {
          name: 'demo',
          config(cfg) {
            cfg.theme = { ...cfg.theme, extend: { colors: { brand: '#123456' } } };
          },
          handler(api) {
            seen = {
              e: api.e('1/2'),
              prefix: api.prefix('.x'),
              flex: api.corePlugins('flex'),
              dark: api.config('darkMode'),
              brand: api.theme('colors.brand'),
            };
            demo(api);
          },
        },
      ],
    });
    expect(seen).toEqual({
      e: '\\31\\/2',
      prefix: '.nk-x',
      flex: true,
      dark: 'class',
      brand: '#123456',
    });
    const css = gen.generateJIT(
      '<a class="nk-content-auto nk-bg-brand hocus:nk-flex">',
      {},
      { utilitiesOnly: true },
    );
    expect(css).toContain('.nk-content-auto { content-visibility: auto; }');
    expect(css).toContain('.nk-bg-brand {');
    expect(css).toContain('.hocus\\:nk-flex:hover { display: flex; }');
  });

  it('plugin utilities take variants and appear in the catalog; components do not conflict', () => {
    const gen = new CSSGenerator({ plugins: [demo] });
    const names = new Set(gen.getUtilities().map((u) => u.class));
    expect(names.has('content-auto')).toBe(true);
    expect(names.has('tab-4')).toBe(true);
    expect(names.has('card')).toBe(true);
    expect(gen.compileClass('hover:md:content-auto')).toBe(
      '@media (min-width: 768px) {\n  .hover\\:md\\:content-auto:hover { content-visibility: auto; }\n}\n',
    );
    expect(gen.getVariantNames()).toEqual(expect.arrayContaining(['hocus', 'nth']));
  });
});
