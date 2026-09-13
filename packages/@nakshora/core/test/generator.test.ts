import { describe, expect, it } from 'vitest';
import {
  CSSGenerator,
  createGenerator,
  defaultTheme,
  extractClasses,
  minifyCss,
  mergeConfig,
  neonTheme,
  resolveThemeValue,
  splitClass,
  version,
  metadata,
  buildAICorpus,
  corpusToSFT,
  type NakshoraConfig,
} from '../src/index';

describe('CSSGenerator — full build', () => {
  const gen = new CSSGenerator();
  const full = gen.generate({ mode: 'full' });

  it('generates display utilities', () => {
    expect(full).toContain('.flex { display: flex; }');
    expect(full).toContain('.grid { display: grid; }');
    expect(full).toContain('.hidden { display: none; }');
  });

  it('generates spacing utilities (regression: mr-* must use the value, not the key)', () => {
    expect(full).toContain('.m-4 { margin: 1rem; }');
    expect(full).toContain('.mr-4 { margin-right: 1rem; }');
    expect(full).toContain('.p-6 { padding: 1.5rem; }');
    expect(full).toContain('.gap-2 { gap: 0.5rem; }');
    expect(full).not.toContain('.mr-4 { margin-right: 4; }');
  });

  it('generates color utilities for the full palette', () => {
    expect(full).toContain('.bg-blue-500 { background-color: #3b82f6; }');
    expect(full).toContain('.text-rose-400 { color: #fb7185; }');
    expect(full).toContain('.border-slate-900 { border-color: #0f172a; }');
    expect(full).toContain('.from-indigo-400');
    expect(full).toContain('.via-purple-500');
    expect(full).toContain('.to-pink-500');
  });

  it('generates CSS variables', () => {
    expect(full).toContain('--color-blue-500: #3b82f6;');
    expect(full).toContain('--spacing-4: 1rem;');
    expect(full).toContain('--text-2xl: 1.5rem;');
    expect(full).toContain('--font-sans:');
  });

  it('generates responsive variants for every breakpoint', () => {
    expect(full).toContain('@media (min-width: 640px) {');
    expect(full).toContain(
      '.sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }',
    );
    expect(full).toContain('.md\\:flex { display: flex; }');
    expect(full).toContain('.lg\\:p-4 { padding: 1rem; }');
    expect(full).toContain('.xl\\:text-center { text-align: center; }');
    expect(full).toContain('.2xl\\:max-w-4xl { max-width: 56rem; }');
  });

  it('omits state variants in the full build (JIT-only by design)', () => {
    expect(full).not.toContain('.hover\\:flex:hover');
    expect(full).not.toContain('.dark\\:');
  });

  it('emits base styles, keyframes and components', () => {
    expect(full).toContain('box-sizing: border-box;');
    expect(full).toContain('prefers-reduced-motion');
    expect(full).toContain('@keyframes spin');
    expect(full).toContain('@keyframes shimmer');
    expect(full).toContain('.neon-card');
    expect(full).toContain('.brutalist-card');
    expect(full).toContain('.glass {');
    expect(full).toContain('.skeleton-rect');
  });

  it('minifies CSS', () => {
    const min = minifyCss(full);
    expect(min.length).toBeLessThan(full.length);
    expect(min).not.toContain('/* Nakshora');
    expect(min).toContain('.flex{display:flex;}');
  });

  it('provides generation stats', () => {
    const stats = gen.getStats();
    expect(stats.utilities).toBeGreaterThan(2000);
    expect(stats.totalRules).toBeGreaterThan(10000);
    expect(stats.minifiedSizeBytes).toBeGreaterThan(0);
  });
});

describe('CSSGenerator — JIT mode', () => {
  const gen = new CSSGenerator();
  const html = [
    '<div class="flex items-center gap-4 px-4 py-2 bg-blue-500 text-white rounded-lg">',
    '  <button class="bg-blue-600 hover:bg-blue-700 focus:outline-none md:grid md:grid-cols-2">',
    '    <span class="group-hover:opacity-100 dark:opacity-70">hi</span>',
    '  </button>',
    '</div>',
  ].join('');

  it('only emits classes found in content', () => {
    const jit = gen.generateFromContent(html);
    expect(jit).toContain('.flex { display: flex; }');
    expect(jit).toContain('.bg-blue-500 { background-color: #3b82f6; }');
    expect(jit).not.toContain('.grid { display: grid; }'); // not used at base level
    expect(jit).not.toContain('.p-6 { padding: 1.5rem; }');
  });

  it('expands state variants', () => {
    const jit = gen.generateFromContent(html);
    expect(jit).toContain('.hover\\:bg-blue-700:hover { background-color: #1d4ed8; }');
    expect(jit).toContain('.dark .dark\\:opacity-70 { opacity: 0.7; }');
    expect(jit).toContain('.group:hover .group-hover\\:opacity-100 { opacity: 1; }');
  });

  it('expands responsive prefixes', () => {
    const jit = gen.generateFromContent(html);
    expect(jit).toContain('@media (min-width: 768px) {');
    expect(jit).toContain('.md\\:grid { display: grid; }');
    expect(jit).toContain(
      '.md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }',
    );
  });

  it('supports responsive + state combinations', () => {
    const jit = gen.generateFromContent('<a class="lg:hover:bg-rose-500 x">y</a>');
    expect(jit).toContain('@media (min-width: 1024px) {');
    expect(jit).toContain('.lg\\:hover\\:bg-rose-500:hover { background-color: #f43f5e; }');
  });

  it('handles escaped HTML class syntax', () => {
    const jit = gen.generateFromContent('<div class="hover\\:scale-105">x</div>');
    expect(jit).toContain('.hover\\:scale-105:hover { transform: scale(1.05); }');
  });

  it('honours safelist', () => {
    const g2 = new CSSGenerator({ safelist: ['lg:flex'] });
    const out = g2.generateFromContent('<div class="p-1">x</div>');
    expect(out).toContain('.p-1 { padding: 0.25rem; }');
    expect(out).toContain('.lg\\:flex { display: flex; }');
  });

  it('includes keyframes only for animations that are used', () => {
    const jit = gen.generateFromContent('<div class="animate-spin">x</div>');
    expect(jit).toContain('@keyframes spin');
    expect(jit).not.toContain('@keyframes bounce');
    const none = gen.generateFromContent('<div class="p-4">x</div>');
    expect(none).not.toContain('@keyframes');
  });
});

describe('CSSGenerator — options & config', () => {
  it('important: true appends !important', () => {
    const gen = new CSSGenerator({ important: true });
    const css = gen.generate({ mode: 'full' });
    expect(css).toContain('.flex { display: flex !important; }');
  });

  it('important: "#app" scopes every rule', () => {
    const gen = new CSSGenerator({ important: '#app' });
    const css = gen.generateFromContent('<div class="p-4">x</div>');
    expect(css).toContain('#app .p-4 { padding: 1rem; }');
  });

  it('corePlugins can disable groups', () => {
    const gen = new CSSGenerator({ corePlugins: { margin: false } });
    const css = gen.generate({ mode: 'full' });
    expect(css).not.toContain('.m-4 {');
    expect(css).toContain('.p-4 { padding: 1rem; }');
  });

  it('variants can be disabled', () => {
    const gen = new CSSGenerator({ variants: { responsive: false, dark: false } });
    const css = gen.generateFromContent('<div class="md:flex dark:hidden">x</div>');
    expect(css).not.toContain('min-width'); // no responsive media queries
    expect(css).not.toContain('.dark');
  });

  it('deep-merges theme overrides', () => {
    const cfg = mergeConfig(
      {},
      {
        theme: {
          colors: { blue: { 500: '#123456' } },
          spacing: { 99: '99px' },
        },
      },
    );
    const gen = new CSSGenerator(cfg);
    const css = gen.generate({ mode: 'full' });
    expect(css).toContain('.bg-blue-500 { background-color: #123456; }');
    // other shades survive the deep merge
    expect(css).toContain('.bg-blue-400 { background-color: #60a5fa; }');
    expect(css).toContain('.m-99 { margin: 99px; }');
  });

  it('supports custom breakpoints', () => {
    const gen = new CSSGenerator({ theme: { breakpoints: { sm: 640, md: 768, wide: 1800 } } });
    const css = gen.generate({ mode: 'full' });
    expect(css).toContain('@media (min-width: 1800px) {');
    expect(css).toContain('.wide\\:flex { display: flex; }');
  });

  it('supports plugins (addUtilities)', () => {
    const gen = new CSSGenerator({
      plugins: [
        {
          name: 'test-plugin',
          handler: (api) => {
            api.addUtilities({ 'my-cool-class': { color: 'hotpink' } }, 'plugin');
            api.addBase({ h1: { margin: '1rem 0' } });
          },
        },
      ],
    });
    const css = gen.generate({ mode: 'full' });
    expect(css).toContain('.my-cool-class { color: hotpink; }');
    expect(css).toContain('h1 { margin: 1rem 0; }');
  });

  it('applies presets', () => {
    const gen = new CSSGenerator({ theme: { colors: neonTheme.colors } });
    const css = gen.generate({ mode: 'full' });
    expect(css).toContain('.text-primary-500 { color: #00d9ff; }');
    expect(css).toContain('.bg-secondary-500 { background-color: #ff006e; }');
  });
});

describe('helpers', () => {
  it('extractClasses finds tokens and unescapes', () => {
    const classes = extractClasses(['<div class="flex mt-4 hover\\:bg-blue-500">x</div>']);
    expect(classes.has('flex')).toBe(true);
    expect(classes.has('mt-4')).toBe(true);
    expect(classes.has('hover:bg-blue-500')).toBe(true);
  });

  it('splitClass splits variants from base', () => {
    expect(splitClass('md:hover:bg-blue-500')).toEqual({
      prefixes: ['md', 'hover'],
      base: 'bg-blue-500',
    });
    expect(splitClass('flex')).toEqual({ prefixes: [], base: 'flex' });
  });

  it('resolveThemeValue resolves dot paths', () => {
    expect(resolveThemeValue(defaultTheme, 'colors.blue.500')).toBe('#3b82f6');
    expect(resolveThemeValue(defaultTheme, 'spacing.4')).toBe('1rem');
    expect(resolveThemeValue(defaultTheme, 'nope.nope')).toBeNull();
  });

  it('exposes version & metadata', () => {
    expect(version).toBe('3.0.0');
    expect(metadata.name).toBe('nakshora');
    expect(createGenerator()).toBeInstanceOf(CSSGenerator);
  });
});

describe('AI corpus', () => {
  it('builds a structured corpus of every utility', () => {
    const corpus = buildAICorpus({} as NakshoraConfig);
    expect(corpus.framework).toBe('nakshora');
    expect(corpus.utilityCount).toBeGreaterThan(2000);
    expect(corpus.categories.length).toBeGreaterThan(10);
    const spacing = corpus.categories.find((c) => c.id === 'margin');
    expect(spacing).toBeDefined();
    expect(spacing!.utilities.some((u) => u.class === 'm-4')).toBe(true);
    expect(corpus.variants.some((v) => v.prefix === 'hover')).toBe(true);
    expect(corpus.breakpoints.some((b) => b.name === 'md')).toBe(true);
  });

  it('converts corpus to SFT jsonl', () => {
    const corpus = buildAICorpus({});
    const jsonl = corpusToSFT(corpus, 50);
    const lines = jsonl.trim().split('\n');
    expect(lines.length).toBe(50);
    const first = JSON.parse(lines[0]);
    expect(first.messages[0].role).toBe('user');
    expect(first.messages[1].role).toBe('assistant');
    expect(first.messages[0].content).toContain('Nakshora');
  });
});
