// The utility catalog is memoised across Engine instances keyed by the
// resolved theme + enabled core plugins. These tests pin the isolation rules
// and measure the speed-up (reported, with a loose floor so CI never flakes).

import { describe, expect, it } from 'vitest';
import { CSSGenerator, Engine, resolveTheme, clearCatalogCache } from '../src/index';

const opts = (theme = resolveTheme({}), disabled: string[] = []) => ({
  theme,
  darkMode: 'class' as const,
  pluginEnabled: (p: string) => !disabled.includes(p),
  variantEnabled: () => true,
  important: false,
});

describe('catalog memoisation', () => {
  it('two engines with the same theme share one catalog; different themes / plugins do not', () => {
    clearCatalogCache();
    const a = new Engine(opts()).buildCatalog();
    const b = new Engine(opts()).buildCatalog();
    expect(b).toBe(a);
    const other = new Engine(
      opts(resolveTheme({ extend: { colors: { brand: '#123456' } } })),
    ).buildCatalog();
    expect(other).not.toBe(a);
    expect(other.some((e) => e.class === 'bg-brand')).toBe(true);
    expect(a.some((e) => e.class === 'bg-brand')).toBe(false);
    const noFlex = new Engine(opts(resolveTheme({}), ['display'])).buildCatalog();
    expect(noFlex).not.toBe(a);
    expect(noFlex.some((e) => e.class === 'flex')).toBe(false);
    expect(a.some((e) => e.class === 'flex')).toBe(true);
  });

  it('engines with plugin-added utilities never share', () => {
    clearCatalogCache();
    const base = new Engine(opts()).buildCatalog();
    const withPlugin = new CSSGenerator({
      plugins: [
        ({ addUtilities }: { addUtilities: (u: Record<string, unknown>) => void }) =>
          addUtilities({ '.tw-x': { color: 'red' } }),
      ],
    }).getUtilities();
    expect(withPlugin.some((u) => u.class === 'tw-x')).toBe(true);
    expect(base.some((e) => e.class === 'tw-x')).toBe(false);
    // and the memoised default catalog is untouched afterwards
    expect(new Engine(opts()).buildCatalog()).toBe(base);
    expect(new CSSGenerator().getUtilities().some((u) => u.class === 'tw-x')).toBe(false);
  });

  it('generator-level catalogs are copies (prefix applied) and do not leak between configs', () => {
    const plain = new CSSGenerator().getUtilities();
    const prefixed = new CSSGenerator({ prefix: 'nk-' }).getUtilities();
    expect(prefixed[0].class.startsWith('nk-')).toBe(true);
    expect(plain.some((u) => u.class.startsWith('nk-'))).toBe(false);
    expect(new CSSGenerator().getUtilities().some((u) => u.class.startsWith('nk-'))).toBe(false);
  });

  it('cache miss builds in tens of ms, cache hit is effectively free', () => {
    clearCatalogCache();
    const t0 = performance.now();
    new Engine(opts()).buildCatalog();
    const cold = performance.now() - t0;
    const t1 = performance.now();
    for (let i = 0; i < 20; i++) new Engine(opts()).buildCatalog();
    const warm = (performance.now() - t1) / 20;
    console.log(
      `catalog cold ${cold.toFixed(1)} ms, warm (new Engine + hit) ${warm.toFixed(2)} ms`,
    );
    expect(warm).toBeLessThan(cold);
  });
});
