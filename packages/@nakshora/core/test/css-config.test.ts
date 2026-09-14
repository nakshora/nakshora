// CSS-first configuration (Tailwind v4 style): `@theme`, `@utility`,
// `@custom-variant` → config fragment + `:root` variables.
import { describe, expect, it } from 'vitest';
import {
  CSSGenerator,
  extractCssConfig,
  mergeCssConfig,
  hasCssConfig,
  type UtilityGenerator,
} from '../src/index';

const SHEET = `@theme {
  --color-brand-500: #123456;
  --color-brand-600: #0f2d4a;
  --color-mint: oklch(0.72 0.11 178);
  --breakpoint-3xl: 120rem;
  --font-display: "Inter", sans-serif;
  --text-huge: 4rem;
  --text-huge--line-height: 1;
  --spacing-18: 4.5rem;
  --radius-pill: 9999px;
  --shadow-glow: 0 0 20px var(--color-brand-500);
  --ease-snap: cubic-bezier(0.2, 0, 0, 1);
  --animate-wiggle: wiggle 1s ease-in-out infinite;
  --my-token: 12px;
  @keyframes wiggle { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
}
@theme reference { --color-ghost: #eee; }
@utility content-auto { content-visibility: auto; }
@utility tab-* { tab-size: --value(--tab-size-*, integer, [integer]); }
@utility scrollbar-hidden { &::-webkit-scrollbar { display: none; } scrollbar-width: none; }
@custom-variant hocus (&:hover, &:focus);
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
@custom-variant any-hover { @media (any-hover: hover) { @slot; } }
@nakshora source;
.x { color: red; }
`;

describe('extractCssConfig', () => {
  const r = extractCssConfig(SHEET);

  it('maps @theme namespaces to theme.extend and keeps the rest of the sheet', () => {
    expect(r.found).toBe(true);
    expect(hasCssConfig('.a{}')).toBe(false);
    expect(extractCssConfig('.a { x: 1 }')).toMatchObject({ found: false, css: '.a { x: 1 }' });
    expect(r.css).toBe('@nakshora source;\n.x { color: red; }\n');
    expect(r.config.theme?.extend).toEqual({
      colors: {
        brand: { 500: '#123456', 600: '#0f2d4a' },
        mint: 'oklch(0.72 0.11 178)',
        ghost: '#eee',
      },
      screens: { '3xl': '120rem' },
      fontFamily: { display: '"Inter", sans-serif' },
      fontSize: { huge: ['4rem', { lineHeight: '1' }] },
      spacing: { 18: '4.5rem' },
      borderRadius: { pill: '9999px' },
      boxShadow: { glow: '0 0 20px #123456' }, // var() to another @theme value resolved
      transitionTimingFunction: { snap: 'cubic-bezier(0.2, 0, 0, 1)' },
      animation: { wiggle: 'wiggle 1s ease-in-out infinite' },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    });
    expect(r.config.plugins).toHaveLength(1);
    expect(r.notes).toEqual([
      '@theme: `--my-token` has no utility namespace — kept as a CSS variable only',
    ]);
  });

  it('emits every @theme variable as a :root custom property (not for `reference`)', () => {
    expect(r.rootVars.startsWith(':root {\n  --color-brand-500: #123456;\n')).toBe(true);
    expect(r.rootVars).toContain('  --my-token: 12px;\n');
    expect(r.rootVars).toContain('  --shadow-glow: 0 0 20px var(--color-brand-500);\n'); // raw, as authored
    expect(r.rootVars).not.toContain('ghost');
  });

  it('the merged config compiles the new utilities, variants and theme values', () => {
    const gen = new CSSGenerator(mergeCssConfig({ content: ['x'], safelist: ['flex'] }, r.config));
    const css = gen.generateJIT(
      '<a class="bg-brand-500 bg-mint 3xl:flex font-display text-huge p-18 rounded-pill shadow-glow ease-snap animate-wiggle content-auto tab-4 tab-[3] tab-x scrollbar-hidden hocus:flex theme-midnight:bg-black any-hover:underline">',
      {},
      { utilitiesOnly: true },
    );
    for (const line of [
      '.content-auto { content-visibility: auto; }',
      '.scrollbar-hidden::-webkit-scrollbar { display: none; }',
      '.scrollbar-hidden { scrollbar-width: none; }',
      '.animate-wiggle { animation: wiggle 1s ease-in-out infinite; }',
      '.rounded-pill { border-radius: 9999px; }',
      '.bg-brand-500 { --tw-bg-opacity: 1; background-color: rgb(18 52 86 / var(--tw-bg-opacity, 1)); }',
      '.bg-mint { background-color: oklch(0.72 0.11 178); }',
      '.p-18 { padding: 4.5rem; }',
      '.font-display { font-family: "Inter", sans-serif; }',
      '.text-huge { font-size: 4rem; line-height: 1; }',
      '.ease-snap { transition-timing-function: cubic-bezier(0.2, 0, 0, 1); }',
      '.tab-4 { tab-size: 4; }',
      '.tab-\\[3\\] { tab-size: 3; }',
      '.hocus\\:flex:hover { display: flex; }',
      '.hocus\\:flex:focus { display: flex; }',
      '.theme-midnight\\:bg-black:where([data-theme="midnight"] *) {',
      '@media (any-hover: hover) {\n  .any-hover\\:underline { text-decoration-line: underline; }\n}',
      '@media (min-width: 120rem) {\n  .\\33xl\\:flex { display: flex; }\n}',
    ])
      expect(css).toContain(line);
    expect(css).toContain('--tw-shadow: 0 0 20px #123456;');
    expect(css).not.toContain('tab-x');
    expect(gen.generateJIT('<a class="animate-wiggle">')).toContain('@keyframes wiggle {');
    // @apply sees them too
    expect(gen.processCss('.btn { @apply p-18 hocus:content-auto; }', { strict: true })).toBe(
      '.btn { padding: 4.5rem; }\n.btn:hover { content-visibility: auto; }\n.btn:focus { content-visibility: auto; }\n',
    );
  });

  it('mergeCssConfig deep-merges theme.extend and appends plugins', () => {
    const base = { theme: { extend: { colors: { a: '#000' } } }, plugins: [() => {}] };
    const merged = mergeCssConfig(base, {
      theme: { extend: { colors: { b: '#fff' }, spacing: { 1: '1px' } } },
      plugins: [() => {}],
    });
    expect(merged.theme?.extend).toEqual({
      colors: { a: '#000', b: '#fff' },
      spacing: { 1: '1px' },
    });
    expect(merged.plugins).toHaveLength(2);
  });

  it('unsupported forms are reported, not silently dropped', () => {
    const r2 = extractCssConfig(
      '@theme { --color-*: initial; --perspective-near: 100px; --inset-shadow-sm: inset 0 1px #000; }',
    );
    expect(r2.notes).toEqual([
      expect.stringContaining('`--color-*: initial` (namespace reset) is not supported'),
      expect.stringContaining('`--perspective-near` (perspective) maps to a v4-only utility'),
      expect.stringContaining('`--inset-shadow-sm` (inset-shadow) maps to a v4-only utility'),
    ]);
    expect(r2.rootVars).toContain('--perspective-near: 100px;');
    expect(r2.config.theme).toBeUndefined();
  });
});

describe('matchUtilities bare values (Nakshora extension used by @utility --value(integer))', () => {
  const gen = new CSSGenerator({
    plugins: [
      (api: UtilityGenerator) => {
        api.matchUtilities(
          { tab: (v) => ({ tabSize: String(v) }) },
          { values: {}, bare: 'integer' },
        );
        api.matchUtilities(
          { op: (v) => ({ opacity: String(v) }) },
          { values: { half: '0.5' }, bare: 'percentage' },
        );
      },
    ],
  });
  it.each([
    ['tab-4', '.tab-4 { tab-size: 4; }\n'],
    ['tab-4.5', ''],
    ['tab-[4]', '.tab-\\[4\\] { tab-size: 4; }\n'],
    ['tab-x', ''],
    ['-tab-2', ''],
    ['hover:tab-3', '.hover\\:tab-3:hover { tab-size: 3; }\n'],
    ['op-half', '.op-half { opacity: 0.5; }\n'],
    ['op-40%', '.op-40\\% { opacity: 40%; }\n'],
    ['op-40', ''],
  ])('%s', (cls, css) => {
    expect(gen.compileClass(cls)).toBe(css);
  });
});
