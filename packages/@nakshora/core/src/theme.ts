// Nakshora Core — theme resolution
//
// The resolved theme is Tailwind-3.4-shaped (`theme.colors`, `theme.spacing`,
// `theme.fontSize`, `theme.screens`, …) so that Tailwind configs, Tailwind
// plugins and the `theme()` CSS function all work unchanged. Nakshora's
// historical keys (`typography.fontSize`, `breakpoints`, `shadows`,
// `duration`, `easing`) are accepted as aliases and mapped onto the
// Tailwind-shaped keys, so existing Nakshora configs keep working.

import type { ThemeConfig } from './types';
import { defaultColors } from './palette';
import { tailwindDefaults } from './tailwind-defaults';

export type Scale = Record<string, unknown>;
export type ResolvedTheme = Record<string, Scale> & {
  colors: Record<string, string | Record<string, string>>;
  spacing: Record<string, string>;
  screens: Record<string, string>;
};

/**
 * The 10-step breakpoint scale (200px → 5000px). `sm`–`2xl` are the exact
 * Tailwind values; `xxs`/`xs` cover folded/tiny screens and `3xl`–`5xl`
 * Full HD, QHD and 4K+/video-wall canvases.
 */
export const DEFAULT_SCREENS: Record<string, string> = {
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
};

/** Human-readable device guide for each breakpoint (docs + AI corpus). */
export const SCREEN_GUIDE: Record<string, string> = {
  xxs: 'tiny / folded screens, wearables',
  xs: 'small phones',
  sm: 'large phones',
  md: 'tablets',
  lg: 'laptops',
  xl: 'desktops',
  '2xl': 'large desktops',
  '3xl': 'Full HD (1080p) monitors, TVs',
  '4xl': 'QHD / 2K monitors',
  '5xl': '4K+, video walls, ultra-wide',
};

/**
 * `.container` follows the classic `sm`…`2xl` range only: a 200px or a
 * 5000px-wide `.container` is never what a design wants, and this keeps the
 * generated `.container` rules byte-identical to Tailwind's. Configurable via
 * `theme.container.minScreen` / `theme.container.maxScreen` (breakpoint names,
 * or `false` to lift the bound) or an explicit `theme.container.screens` map.
 */
export const DEFAULT_CONTAINER_MIN_SCREEN = 'sm';
export const DEFAULT_CONTAINER_MAX_SCREEN = '2xl';

const FRACTIONS: Record<string, string> = {
  '1/2': '50%',
  '1/3': '33.333333%',
  '2/3': '66.666667%',
  '1/4': '25%',
  '2/4': '50%',
  '3/4': '75%',
  '1/5': '20%',
  '2/5': '40%',
  '3/5': '60%',
  '4/5': '80%',
  '1/6': '16.666667%',
  '2/6': '33.333333%',
  '3/6': '50%',
  '4/6': '66.666667%',
  '5/6': '83.333333%',
  '1/12': '8.333333%',
  '2/12': '16.666667%',
  '3/12': '25%',
  '4/12': '33.333333%',
  '5/12': '41.666667%',
  '6/12': '50%',
  '7/12': '58.333333%',
  '8/12': '66.666667%',
  '9/12': '75%',
  '10/12': '83.333333%',
  '11/12': '91.666667%',
};
const FRACTIONS_SMALL: Record<string, string> = Object.fromEntries(
  Object.entries(FRACTIONS).filter(
    ([k]) => !k.endsWith('/5') && !k.endsWith('/6') && !k.endsWith('/12'),
  ),
);
const FRACTIONS_SIXTHS: Record<string, string> = Object.fromEntries(
  Object.entries(FRACTIONS).filter(([k]) => !k.endsWith('/12')),
);

/** Nakshora additions on top of the Tailwind defaults (kept for 3.0 compat). */
const NAKSHORA_EXTRAS: Record<string, Scale> = {
  boxShadow: { glow: '0 0 20px 0 rgba(59, 130, 246, 0.5)' },
  borderRadius: { xs: '0.125rem' },
  zIndex: { hide: '-1' },
  transitionTimingFunction: { back: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
  animation: {
    fade: 'fade 300ms ease-out',
    slide: 'slide 300ms ease-out',
    shimmer: 'shimmer 1.5s linear infinite',
  },
  keyframes: {
    fade: { from: { opacity: '0' }, to: { opacity: '1' } },
    slide: {
      from: { transform: 'translateY(1rem)', opacity: '0' },
      to: { transform: 'translateY(0)', opacity: '1' },
    },
    shimmer: {
      from: { 'background-position': '200% 0' },
      to: { 'background-position': '-200% 0' },
    },
  },
  lineHeight: { base: '1.5' },
  scale: { 175: '1.75', 200: '2' },
  rotate: { 135: '135deg', 225: '225deg', 270: '270deg', 315: '315deg', 360: '360deg' },
  textDecorationThickness: { thin: '1px' },
};

function isObj(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

/** Deep merge; `null` in `override` deletes the key. Arrays replace. */
export function mergeScale<T>(base: T, override: unknown): T {
  if (!isObj(base) || !isObj(override)) {
    return (override === undefined ? base : override) as T;
  }
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(override)) {
    if (v === undefined) continue;
    if (v === null) {
      delete out[k];
      continue;
    }
    const cur = out[k];
    out[k] = isObj(cur) && isObj(v) ? mergeScale(cur, v) : v;
  }
  return out as T;
}

/** Tailwind `theme.fontSize` entries may be `[size, {lineHeight,…}]`; normalise to `[size, lineHeight?]`. */
export function normalizeFontSize(value: unknown): {
  size: string;
  lineHeight?: string;
  letterSpacing?: string;
  fontWeight?: string;
} {
  if (Array.isArray(value)) {
    const [size, rest] = value as [string, unknown];
    if (isObj(rest)) {
      return {
        size,
        lineHeight: rest.lineHeight as string | undefined,
        letterSpacing: rest.letterSpacing as string | undefined,
        fontWeight: rest.fontWeight === undefined ? undefined : String(rest.fontWeight),
      };
    }
    return { size, lineHeight: rest as string | undefined };
  }
  return { size: String(value) };
}

/** Font families may be arrays (Tailwind) or strings (Nakshora); emit a string. */
export function fontFamilyToString(value: unknown): string {
  if (Array.isArray(value)) return value.join(', ');
  if (isObj(value) && 'fontFamily' in value) return String(value.fontFamily);
  return String(value);
}

function spacingDerived(
  spacing: Record<string, string>,
  extra: Record<string, string>,
): Record<string, string> {
  return { ...spacing, ...extra };
}

/** Map Nakshora's legacy theme keys onto Tailwind-shaped keys. */
function normalizeUserTheme(
  user: Partial<ThemeConfig> & Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...user };
  const typography = user.typography as Record<string, unknown> | undefined;
  if (typography) {
    delete out.typography;
    // `typography` in Tailwind plugin land (prose) is an object of modifiers —
    // if this object looks like Nakshora's { fontSize, fontWeight… } map it.
    const nakKeys = ['fontSize', 'fontWeight', 'lineHeight', 'letterSpacing'];
    if (nakKeys.some((k) => k in typography)) {
      for (const k of nakKeys) if (typography[k] !== undefined) out[k] = typography[k];
      const rest = Object.fromEntries(
        Object.entries(typography).filter(([k]) => !nakKeys.includes(k)),
      );
      if (Object.keys(rest).length) out.typography = rest;
    } else {
      out.typography = typography;
    }
  }
  if (user.breakpoints !== undefined) {
    delete out.breakpoints;
    const bp: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(user.breakpoints)) {
      if (v === undefined) continue;
      bp[k] = v === null ? null : typeof v === 'number' ? (v <= 0 ? null : `${v}px`) : v;
    }
    out.breakpointsMerge = bp; // merged (Nakshora semantics) — see resolveTheme
  }
  if (user.shadows !== undefined) {
    delete out.shadows;
    out.boxShadow = mergeScale((out.boxShadow as Scale) ?? {}, user.shadows);
  }
  if (user.duration !== undefined) {
    delete out.duration;
    out.transitionDuration = mergeScale((out.transitionDuration as Scale) ?? {}, user.duration);
  }
  if (user.easing !== undefined) {
    delete out.easing;
    out.transitionTimingFunction = mergeScale(
      (out.transitionTimingFunction as Scale) ?? {},
      user.easing,
    );
  }
  return out;
}

/** Convert Nakshora string keyframes (`from { … } to { … }`) into objects. */
export function parseKeyframeString(body: string): Record<string, Record<string, string>> {
  const out: Record<string, Record<string, string>> = {};
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    const sel = m[1].trim();
    const decls: Record<string, string> = {};
    for (const part of m[2].split(';')) {
      const idx = part.indexOf(':');
      if (idx === -1) continue;
      decls[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
    }
    out[sel] = decls;
  }
  return out;
}

export interface ResolveThemeOptions {
  /** Extra default scales contributed by plugins (`plugin.config.theme`). */
  pluginTheme?: Record<string, unknown>[];
}

/**
 * Resolve the final theme: Tailwind defaults ⊕ Nakshora extras ⊕ plugin
 * theme ⊕ user `theme` (deep-merged) ⊕ user `theme.extend` (deep-merged).
 * Function values (`({ theme }) => …`) are resolved lazily against the
 * merged theme, exactly like Tailwind.
 */
export function resolveTheme(
  userTheme: Partial<ThemeConfig> | undefined = {},
  options: ResolveThemeOptions = {},
): ResolvedTheme {
  // 1. defaults
  let merged: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(tailwindDefaults)) merged[k] = v;
  merged.colors = defaultColors;
  merged.screens = { ...DEFAULT_SCREENS };
  merged.container = {};
  merged.containers = {
    xs: '20rem',
    sm: '24rem',
    md: '28rem',
    lg: '32rem',
    xl: '36rem',
    '2xl': '42rem',
    '3xl': '48rem',
    '4xl': '56rem',
    '5xl': '64rem',
    '6xl': '72rem',
    '7xl': '80rem',
  };
  merged.aria = tailwindDefaults.aria ?? {
    busy: 'busy="true"',
    checked: 'checked="true"',
    disabled: 'disabled="true"',
    expanded: 'expanded="true"',
    hidden: 'hidden="true"',
    pressed: 'pressed="true"',
    readonly: 'readonly="true"',
    required: 'required="true"',
    selected: 'selected="true"',
  };
  merged.supports = {};
  merged.data = {};
  for (const [k, v] of Object.entries(NAKSHORA_EXTRAS)) {
    merged[k] = mergeScale((merged[k] as Scale) ?? {}, v);
  }

  // 2. plugin theme contributions (defaults, lower precedence than user)
  for (const pt of options.pluginTheme ?? []) {
    const { extend, ...rest } = pt as { extend?: Record<string, unknown> } & Record<
      string,
      unknown
    >;
    for (const [k, v] of Object.entries(rest)) {
      merged[k] = typeof v === 'function' ? v : mergeScale((merged[k] as Scale) ?? {}, v);
    }
    if (extend)
      for (const [k, v] of Object.entries(extend))
        merged[k] = mergeScale((merged[k] as Scale) ?? {}, v);
  }

  // 3. user theme
  const user = normalizeUserTheme({ ...(userTheme as Record<string, unknown>) });
  const { extend, breakpointsMerge, ...rest } = user as {
    extend?: Record<string, unknown>;
    breakpointsMerge?: Record<string, unknown>;
  } & Record<string, unknown>;
  for (const [k, v] of Object.entries(rest)) {
    if (v === undefined) continue;
    if (k === 'screens' || k === 'container') {
      // Tailwind semantics: `theme.screens` replaces the whole set.
      merged[k] = typeof v === 'function' ? v : normaliseScreens(v as Scale);
      continue;
    }
    if (k === 'keyframes' && isObj(v)) {
      const kf: Scale = {};
      for (const [name, body] of Object.entries(v))
        kf[name] = typeof body === 'string' ? parseKeyframeString(body) : body;
      merged[k] = mergeScale((merged[k] as Scale) ?? {}, kf);
      continue;
    }
    merged[k] = typeof v === 'function' ? v : mergeScale((merged[k] as Scale) ?? {}, v);
  }
  if (breakpointsMerge)
    merged.screens = sortScreens(
      normaliseScreens(mergeScale(merged.screens as Scale, breakpointsMerge)),
    );
  if (extend) {
    for (const [k, v] of Object.entries(extend)) {
      if (v === undefined) continue;
      merged[k] = typeof v === 'function' ? v : mergeScale((merged[k] as Scale) ?? {}, v);
    }
  }

  // 4. resolve function-valued scales lazily (`({ theme }) => theme('colors')`)
  const resolved: Record<string, unknown> = {};
  const resolving = new Set<string>();
  const themeFn = (path: string, fallback?: unknown): unknown => {
    const value = lookup(path);
    return value === undefined ? fallback : value;
  };
  const getScale = (key: string): unknown => {
    if (key in resolved) return resolved[key];
    let value = merged[key];
    if (typeof value === 'function') {
      if (resolving.has(key)) return {};
      resolving.add(key);
      value = (
        value as (api: {
          theme: typeof themeFn;
          colors: typeof defaultColors;
          breakpoints: unknown;
        }) => unknown
      )({
        theme: themeFn,
        colors: defaultColors,
        breakpoints: (screens: Record<string, string>) =>
          Object.fromEntries(Object.entries(screens).map(([k, v]) => [`screen-${k}`, v])),
      });
      resolving.delete(key);
    }
    resolved[key] = value;
    return value;
  };
  const lookup = (path: string): unknown => {
    const [head, ...tail] = splitPath(path);
    let cur: unknown = getScale(head);
    for (const key of tail) {
      if (!isObj(cur)) return undefined;
      cur = cur[key];
    }
    return cur;
  };
  for (const key of Object.keys(merged)) getScale(key);
  merged = resolved;

  // 5. derived spacing-based scales (Tailwind composes these from `spacing`)
  const spacing = merged.spacing as Record<string, string>;
  const derive = (key: string, extra: Record<string, string>) => {
    merged[key] = spacingDerived(spacing, {
      ...extra,
      ...((merged[key] as Record<string, string>) ?? {}),
    });
  };
  derive('inset', { auto: 'auto', ...FRACTIONS_SMALL, full: '100%' });
  derive('margin', { auto: 'auto' });
  derive('padding', {});
  derive('gap', {});
  derive('space', {});
  derive('scrollMargin', {});
  derive('scrollPadding', {});
  derive('borderSpacing', {});
  derive('textIndent', {});
  derive('translate', { ...FRACTIONS_SMALL, full: '100%' });
  derive('width', {
    auto: 'auto',
    ...FRACTIONS,
    full: '100%',
    screen: '100vw',
    svw: '100svw',
    lvw: '100lvw',
    dvw: '100dvw',
    min: 'min-content',
    max: 'max-content',
    fit: 'fit-content',
  });
  derive('height', {
    auto: 'auto',
    ...FRACTIONS_SIXTHS,
    full: '100%',
    screen: '100vh',
    svh: '100svh',
    lvh: '100lvh',
    dvh: '100dvh',
    min: 'min-content',
    max: 'max-content',
    fit: 'fit-content',
  });
  derive('size', {
    auto: 'auto',
    ...FRACTIONS,
    full: '100%',
    min: 'min-content',
    max: 'max-content',
    fit: 'fit-content',
  });
  derive('minWidth', { full: '100%', min: 'min-content', max: 'max-content', fit: 'fit-content' });
  derive('minHeight', {
    full: '100%',
    screen: '100vh',
    svh: '100svh',
    lvh: '100lvh',
    dvh: '100dvh',
    min: 'min-content',
    max: 'max-content',
    fit: 'fit-content',
  });
  derive('maxHeight', {
    none: 'none',
    full: '100%',
    screen: '100vh',
    svh: '100svh',
    lvh: '100lvh',
    dvh: '100dvh',
    min: 'min-content',
    max: 'max-content',
    fit: 'fit-content',
  });
  derive('flexBasis', { auto: 'auto', ...FRACTIONS, full: '100%' });
  const screens = merged.screens as Record<string, string>;
  const screenMax = Object.fromEntries(Object.entries(screens).map(([k, v]) => [`screen-${k}`, v]));
  derive('maxWidth', {
    none: 'none',
    xs: '20rem',
    sm: '24rem',
    md: '28rem',
    lg: '32rem',
    xl: '36rem',
    '2xl': '42rem',
    '3xl': '48rem',
    '4xl': '56rem',
    '5xl': '64rem',
    '6xl': '72rem',
    '7xl': '80rem',
    full: '100%',
    min: 'min-content',
    max: 'max-content',
    fit: 'fit-content',
    prose: '65ch',
    ...screenMax,
  });
  merged.columns = {
    auto: 'auto',
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: '10',
    11: '11',
    12: '12',
    '3xs': '16rem',
    '2xs': '18rem',
    xs: '20rem',
    sm: '24rem',
    md: '28rem',
    lg: '32rem',
    xl: '36rem',
    '2xl': '42rem',
    '3xl': '48rem',
    '4xl': '56rem',
    '5xl': '64rem',
    '6xl': '72rem',
    '7xl': '80rem',
    ...((merged.columns as Scale) ?? {}),
  };
  merged.lineClamp = merged.lineClamp ?? { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6' };
  merged.divideWidth = {
    ...((merged.borderWidth as Scale) ?? {}),
    ...((merged.divideWidth as Scale) ?? {}),
  };
  merged.ringOffsetWidth = merged.ringOffsetWidth ?? {
    0: '0px',
    1: '1px',
    2: '2px',
    4: '4px',
    8: '8px',
  };
  merged.strokeWidth = merged.strokeWidth ?? { 0: '0', 1: '1', 2: '2' };
  merged.textUnderlineOffset = merged.textUnderlineOffset ?? {
    0: '0px',
    1: '1px',
    2: '2px',
    4: '4px',
    8: '8px',
    auto: 'auto',
  };
  merged.transitionDelay = merged.transitionDelay ?? {
    0: '0s',
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  };
  merged.listStyleImage = merged.listStyleImage ?? { none: 'none' };
  merged.content = merged.content ?? { none: 'none' };
  // colour-derived scales
  const colors = merged.colors as Record<string, unknown>;
  const colorScale = (key: string, extra: Record<string, unknown> = {}) => {
    merged[key] = { ...colors, ...extra, ...((merged[key] as Scale) ?? {}) };
  };
  colorScale('accentColor', { auto: 'auto' });
  colorScale('backgroundColor');
  colorScale('borderColor', {
    DEFAULT: (colors.gray as Record<string, string>)?.[200] ?? 'currentColor',
  });
  colorScale('boxShadowColor');
  colorScale('caretColor');
  colorScale('divideColor', { DEFAULT: (merged.borderColor as Scale).DEFAULT });
  colorScale('fill', { none: 'none' });
  colorScale('gradientColorStops');
  colorScale('outlineColor');
  colorScale('placeholderColor');
  colorScale('ringColor', { DEFAULT: (colors.blue as Record<string, string>)?.[500] ?? '#3b82f6' });
  colorScale('ringOffsetColor');
  colorScale('stroke', { none: 'none' });
  colorScale('textColor');
  colorScale('textDecorationColor');
  // opacity-derived scales
  const opacity = merged.opacity as Scale;
  for (const key of [
    'backgroundOpacity',
    'borderOpacity',
    'divideOpacity',
    'placeholderOpacity',
    'ringOpacity',
    'textOpacity',
    'backdropOpacity',
  ]) {
    merged[key] = { ...opacity, ...((merged[key] as Scale) ?? {}) };
  }
  (merged.ringOpacity as Scale).DEFAULT ??= '0.5';
  for (const [k, src] of [
    ['backdropBlur', 'blur'],
    ['backdropBrightness', 'brightness'],
    ['backdropContrast', 'contrast'],
    ['backdropGrayscale', 'grayscale'],
    ['backdropHueRotate', 'hueRotate'],
    ['backdropInvert', 'invert'],
    ['backdropSaturate', 'saturate'],
    ['backdropSepia', 'sepia'],
  ] as const) {
    merged[k] = { ...((merged[src] as Scale) ?? {}), ...((merged[k] as Scale) ?? {}) };
  }

  return merged as ResolvedTheme;
}

/** Ascending by pixel width (unparseable values keep their position at the end). */
function sortScreens(screens: Record<string, string>): Record<string, string> {
  const px = (v: string): number => {
    const n = screenToPx(v);
    return Number.isNaN(n) ? Infinity : n;
  };
  return Object.fromEntries(Object.entries(screens).sort((a, b) => px(a[1]) - px(b[1])));
}

function normaliseScreens(v: Scale): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, val] of Object.entries(v)) {
    if (val === null || val === undefined) continue;
    if (typeof val === 'number') {
      if (val > 0) out[k] = `${val}px`;
      continue;
    }
    if (isObj(val)) {
      // Tailwind object form { min: '640px' } / { max: … } / { raw: … }
      if (typeof val.min === 'string') out[k] = val.min;
      else if (typeof val.raw === 'string') out[k] = val.raw;
      continue;
    }
    out[k] = String(val);
  }
  return out;
}

/**
 * Split `colors.blue.500` / `spacing[1.5]` / `colors[blue][500]` into keys,
 * treating quoted or bracketed segments as literal keys (`spacing[2.5]`).
 */
export function splitPath(path: string): string[] {
  const keys: string[] = [];
  let cur = '';
  let i = 0;
  while (i < path.length) {
    const ch = path[i];
    if (ch === '[') {
      const end = path.indexOf(']', i);
      if (cur) {
        keys.push(cur);
        cur = '';
      }
      keys.push(path.slice(i + 1, end === -1 ? undefined : end).replace(/^['"]|['"]$/g, ''));
      i = end === -1 ? path.length : end + 1;
      if (path[i] === '.') i++;
      continue;
    }
    if (ch === '.') {
      // `spacing.1.5` → keep numeric-dot keys together when the joined key exists
      keys.push(cur);
      cur = '';
    } else cur += ch;
    i++;
  }
  if (cur) keys.push(cur);
  return keys.filter((k) => k !== '');
}

/** Numeric breakpoint in px (`'640px'` → 640, `'40rem'` → 640). Returns NaN for raw queries. */
export function screenToPx(value: string): number {
  const m = /^(\d+(?:\.\d+)?)(px|rem|em)?$/.exec(value.trim());
  if (!m) return NaN;
  const n = parseFloat(m[1]);
  return m[2] === 'rem' || m[2] === 'em' ? n * 16 : n;
}
