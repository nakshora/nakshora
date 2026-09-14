// Nakshora Core — default theme & configuration helpers

import type { NakshoraConfig, ThemeConfig, VariantsConfig, PresetConfig } from './types';
import defaultColors from './palette';

/**
 * Default theme configuration for Nakshora 3.0
 */
export const defaultTheme: ThemeConfig = {
  colors: defaultColors,
  spacing: {
    0: '0',
    px: '1px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    56: '14rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },
  typography: {
    fontSize: {
      xs: ['0.75rem', '1rem'],
      sm: ['0.875rem', '1.25rem'],
      base: ['1rem', '1.5rem'],
      lg: ['1.125rem', '1.75rem'],
      xl: ['1.25rem', '1.75rem'],
      '2xl': ['1.5rem', '2rem'],
      '3xl': ['1.875rem', '2.25rem'],
      '4xl': ['2.25rem', '2.5rem'],
      '5xl': ['3rem', '1'],
      '6xl': ['3.75rem', '1'],
      '7xl': ['4.5rem', '1'],
      '8xl': ['6rem', '1'],
      '9xl': ['8rem', '1'],
    },
    fontWeight: {
      thin: 100,
      extralight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      base: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },
  fontFamily: {
    sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
  breakpoints: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    glow: '0 0 20px 0 rgba(59, 130, 246, 0.5)',
  },
  borderRadius: {
    none: '0',
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  zIndex: {
    auto: 'auto',
    hide: -1,
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
  },
  opacity: {
    0: 0,
    5: 0.05,
    10: 0.1,
    20: 0.2,
    25: 0.25,
    30: 0.3,
    40: 0.4,
    50: 0.5,
    60: 0.6,
    70: 0.7,
    75: 0.75,
    80: 0.8,
    90: 0.9,
    95: 0.95,
    100: 1,
  },
  duration: {
    0: '0ms',
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    back: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  animation: {
    spin: 'spin 1s linear infinite',
    ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    bounce: 'bounce 1s infinite',
    fade: 'fade 300ms ease-out',
    slide: 'slide 300ms ease-out',
    shimmer: 'shimmer 1.5s linear infinite',
  },
  keyframes: {
    spin: 'from { transform: rotate(0deg); } to { transform: rotate(360deg); }',
    ping: '75%, 100% { transform: scale(2); opacity: 0; }',
    pulse: '50% { opacity: 0.5; }',
    bounce:
      '0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); } 50% { transform: none; animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }',
    fade: 'from { opacity: 0; } to { opacity: 1; }',
    slide:
      'from { transform: translateY(1rem); opacity: 0; } to { transform: translateY(0); opacity: 1; }',
    shimmer: 'from { background-position: 200% 0; } to { background-position: -200% 0; }',
  },
};

/**
 * Default variants configuration — every variant enabled.
 */
export const defaultVariants: VariantsConfig = {
  hover: true,
  focus: true,
  focusVisible: true,
  focusWithin: true,
  active: true,
  visited: true,
  disabled: true,
  firstChild: true,
  lastChild: true,
  group: true,
  groupHover: true,
  groupFocus: true,
  peer: true,
  peerHover: true,
  peerFocus: true,
  dark: true,
  responsive: true,
  maxResponsive: true,
  containerQueries: true,
  arbitraryVariants: true,
};

/**
 * Deep-merge two plain objects (arrays are replaced, not concatenated).
 */
export function deepMerge<T>(base: T, override: unknown): T {
  if (
    base === null ||
    override === null ||
    typeof base !== 'object' ||
    typeof override !== 'object' ||
    Array.isArray(base) ||
    Array.isArray(override)
  ) {
    return (override === undefined ? base : (override as T)) as T;
  }
  const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(override as Record<string, unknown>)) {
    if (value === undefined) continue;
    const existing = (base as Record<string, unknown>)[key];
    result[key] =
      existing !== undefined &&
      typeof existing === 'object' &&
      existing !== null &&
      !Array.isArray(existing)
        ? deepMerge(existing, value)
        : value;
  }
  return result as T;
}

/**
 * Merge Nakshora configurations.
 * `override` wins; theme sections are deep-merged; safelist/plugins concatenated.
 */
export function mergeConfig(
  base: Partial<NakshoraConfig> = {},
  override: Partial<NakshoraConfig> = {},
): NakshoraConfig {
  return {
    theme: deepMerge(base.theme ?? {}, override.theme ?? {}),
    variants: {
      ...defaultVariants,
      ...base.variants,
      ...override.variants,
    },
    content: override.content ?? base.content,
    purge: override.purge ?? base.purge ?? [],
    safelist: [...(base.safelist ?? []), ...(override.safelist ?? [])],
    plugins: [...(base.plugins ?? []), ...(override.plugins ?? [])],
    important: override.important ?? base.important ?? false,
    corePlugins: { ...base.corePlugins, ...override.corePlugins },
    extractorPattern: override.extractorPattern ?? base.extractorPattern,
  };
}

/**
 * Resolve a dot-path inside a theme object, e.g.
 * `resolveThemeValue(theme, 'colors.blue.500')` → `'#3b82f6'`.
 * Returns `null` when the path does not exist or is not scalar.
 */
export function resolveThemeValue(
  theme: Partial<ThemeConfig>,
  path: string,
): string | number | null {
  const keys = path.split('.');
  let current: unknown = theme;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as object)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return null;
    }
  }
  if (typeof current === 'string' || typeof current === 'number') return current;
  return null;
}

/**
 * Apply a theme preset (e.g. `neonTheme`) to a config, deep-merging
 * its colors/typography over the base theme.
 */
export function applyPreset(config: Partial<NakshoraConfig>, preset: PresetConfig): NakshoraConfig {
  return mergeConfig(config, {
    theme: {
      ...preset,
      typography: preset.typography as never,
    },
  });
}

export type { ThemeConfig, NakshoraConfig, VariantsConfig };
