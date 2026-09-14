// Theme parity: the resolved default theme must contain every scale/key of
// tailwindcss@3.4.19's resolved default theme with identical values.
// Nakshora extras (documented in docs/COMPATIBILITY.md §4) are the only
// allowed additions.

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolveTheme, DEFAULT_SCREENS, screenToPx, splitPath } from '../src/index';

const tw = JSON.parse(
  readFileSync(new URL('./fixtures/tailwind-3.4.19-theme.json', import.meta.url), 'utf8'),
) as Record<string, Record<string, unknown>>;

// keys where Nakshora deliberately differs
const SKIP = new Set(['screens', 'container']);
// Nakshora additions on top of Tailwind's scales
const EXTRAS: Record<string, string[]> = {
  animation: ['fade', 'slide', 'shimmer'],
  keyframes: ['fade', 'slide', 'shimmer'],
  borderRadius: ['xs'],
  boxShadow: ['glow'],
  lineHeight: ['base'],
  maxWidth: ['screen-xxs', 'screen-xs', 'screen-3xl', 'screen-4xl', 'screen-5xl'],
  rotate: ['135', '225', '270', '315', '360'],
  scale: ['175', '200'],
  textDecorationThickness: ['thin'],
  transitionTimingFunction: ['back'],
  zIndex: ['hide'],
};

describe('resolveTheme() vs tailwindcss@3.4.19 default theme', () => {
  const theme = resolveTheme() as Record<string, Record<string, unknown>>;

  it('has every Tailwind scale with identical values', () => {
    const problems: string[] = [];
    for (const [key, scale] of Object.entries(tw)) {
      if (SKIP.has(key)) continue;
      const ours = theme[key];
      if (!ours) {
        problems.push(`missing scale ${key}`);
        continue;
      }
      for (const [k, v] of Object.entries(scale)) {
        if (JSON.stringify(ours[k]) !== JSON.stringify(v))
          problems.push(`${key}.${k}: ${JSON.stringify(ours[k])} ≠ ${JSON.stringify(v)}`);
      }
      for (const k of Object.keys(ours)) {
        if (!(k in scale) && !(EXTRAS[key] ?? []).includes(k))
          problems.push(`${key}.${k}: undocumented extra key`);
      }
    }
    expect(problems).toEqual([]);
  });

  it('ships the 10-step breakpoint scale', () => {
    expect(DEFAULT_SCREENS).toEqual({
      xxs: '200px',
      xs: '400px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
      '4xl': '2560px',
      '5xl': '5000px',
    });
    // sm–2xl are byte-identical to Tailwind
    for (const k of ['sm', 'md', 'lg', 'xl', '2xl']) expect(theme.screens[k]).toBe(tw.screens[k]);
    expect(screenToPx('40rem')).toBe(640);
  });

  it('merges `breakpoints` (Nakshora) and replaces with `screens` (Tailwind)', () => {
    const merged = resolveTheme({ breakpoints: { wide: 1800, xxs: null } });
    expect(merged.screens.wide).toBe('1800px');
    expect(merged.screens.xxs).toBeUndefined();
    expect(merged.screens.md).toBe('768px');
    const replaced = resolveTheme({ screens: { tablet: '640px', desktop: { min: '1024px' } } });
    expect(Object.keys(replaced.screens)).toEqual(['tablet', 'desktop']);
    expect(replaced.screens.desktop).toBe('1024px');
  });

  it('supports `extend`, function values and legacy aliases', () => {
    const t = resolveTheme({
      extend: { colors: { brand: { 500: '#123456' } }, spacing: { 128: '32rem' } },
      shadows: { soft: '0 1px 2px red' },
      duration: { 250: '250ms' },
      easing: { snap: 'steps(2)' },
      typography: { fontSize: { huge: '5rem' } },
    } as never) as Record<string, Record<string, unknown>>;
    expect((t.colors.brand as Record<string, string>)[500]).toBe('#123456');
    expect((t.colors.blue as Record<string, string>)[500]).toBe('#3b82f6');
    expect(t.spacing[128]).toBe('32rem');
    expect(t.padding[128]).toBe('32rem'); // derived scales follow spacing
    expect(t.boxShadow.soft).toBe('0 1px 2px red');
    expect(t.transitionDuration[250]).toBe('250ms');
    expect(t.transitionTimingFunction.snap).toBe('steps(2)');
    expect(t.fontSize.huge).toBe('5rem');
    expect((t.backgroundColor.brand as Record<string, string>)[500]).toBe('#123456');
  });

  it('splitPath handles dots and brackets', () => {
    expect(splitPath('colors.blue.500')).toEqual(['colors', 'blue', '500']);
    expect(splitPath('spacing[2.5]')).toEqual(['spacing', '2.5']);
    expect(splitPath("fontFamily['sans']")).toEqual(['fontFamily', 'sans']);
  });
});
