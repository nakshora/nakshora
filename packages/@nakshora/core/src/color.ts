// Nakshora Core — colour parsing & alpha composition
// Ported behaviour: Tailwind CSS 3.4 `util/color.js` (MIT).
// Every colour utility is emitted as `rgb(r g b / var(--tw-*-opacity, 1))`
// so the legacy `*-opacity-*` utilities and the `/50` modifier compose.

const HEX = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i;
const SHORT_HEX = /^#([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i;
const VALUE = `(?:\\d+|\\d*\\.\\d+)%?`;
const SEP = `(?:\\s*,\\s*|\\s+)`;
const ALPHA_SEP = `\\s*[,/]\\s*`;
const CUSTOM_PROPERTY = `var\\(--(?:[^ )]*?)(?:,(?:[^ )]*?|var\\(--[^ )]*?\\)))?\\)`;
const RGB = new RegExp(
  `^(rgba?)\\(\\s*(${VALUE}|${CUSTOM_PROPERTY})(?:${SEP}(${VALUE}|${CUSTOM_PROPERTY}))?(?:${SEP}(${VALUE}|${CUSTOM_PROPERTY}))?(?:${ALPHA_SEP}(${VALUE}|${CUSTOM_PROPERTY}))?\\s*\\)$`,
);
const HSL = new RegExp(
  `^(hsla?)\\(\\s*((?:${VALUE})(?:deg|rad|grad|turn)?|${CUSTOM_PROPERTY})(?:${SEP}(${VALUE}|${CUSTOM_PROPERTY}))?(?:${SEP}(${VALUE}|${CUSTOM_PROPERTY}))?(?:${ALPHA_SEP}(${VALUE}|${CUSTOM_PROPERTY}))?\\s*\\)$`,
);

export interface ParsedColor {
  mode: 'rgb' | 'hsl';
  color: string[];
  alpha?: string;
}

export const NAMED_COLORS: Record<string, [number, number, number]> = {
  black: [0, 0, 0],
  white: [255, 255, 255],
  red: [255, 0, 0],
  green: [0, 128, 0],
  blue: [0, 0, 255],
  yellow: [255, 255, 0],
  cyan: [0, 255, 255],
  magenta: [255, 0, 255],
  gray: [128, 128, 128],
  grey: [128, 128, 128],
  silver: [192, 192, 192],
  maroon: [128, 0, 0],
  olive: [128, 128, 0],
  lime: [0, 255, 0],
  aqua: [0, 255, 255],
  teal: [0, 128, 128],
  navy: [0, 0, 128],
  fuchsia: [255, 0, 255],
  purple: [128, 0, 128],
  orange: [255, 165, 0],
  hotpink: [255, 105, 180],
  rebeccapurple: [102, 51, 153],
  tomato: [255, 99, 71],
  gold: [255, 215, 0],
  coral: [255, 127, 80],
  salmon: [250, 128, 114],
  crimson: [220, 20, 60],
  indigo: [75, 0, 130],
  violet: [238, 130, 238],
  pink: [255, 192, 203],
  brown: [165, 42, 42],
  tan: [210, 180, 140],
  khaki: [240, 230, 140],
  turquoise: [64, 224, 208],
  skyblue: [135, 206, 235],
  steelblue: [70, 130, 180],
  slategray: [112, 128, 144],
  darkgray: [169, 169, 169],
  lightgray: [211, 211, 211],
  whitesmoke: [245, 245, 245],
  ivory: [255, 255, 240],
  beige: [245, 245, 220],
  wheat: [245, 222, 179],
  chocolate: [210, 105, 30],
  firebrick: [178, 34, 34],
  darkred: [139, 0, 0],
  darkgreen: [0, 100, 0],
  darkblue: [0, 0, 139],
  royalblue: [65, 105, 225],
  dodgerblue: [30, 144, 255],
  deepskyblue: [0, 191, 255],
  limegreen: [50, 205, 50],
  forestgreen: [34, 139, 34],
  seagreen: [46, 139, 87],
  springgreen: [0, 255, 127],
  orangered: [255, 69, 0],
  darkorange: [255, 140, 0],
  plum: [221, 160, 221],
  orchid: [218, 112, 214],
  lavender: [230, 230, 250],
  mintcream: [245, 255, 250],
  azure: [240, 255, 255],
  aliceblue: [240, 248, 255],
  honeydew: [240, 255, 240],
  linen: [250, 240, 230],
  snow: [255, 250, 250],
  seashell: [255, 245, 238],
  transparent: [0, 0, 0],
};

/**
 * Parse a CSS colour into channels. Returns `null` when the value is not a
 * colour we can decompose (keywords like `inherit`, `currentColor`,
 * `var(--x)` without a fallback we can read, `color-mix()` …).
 */
export function parseColor(value: unknown, { loose = false } = {}): ParsedColor | null {
  if (typeof value !== 'string') return null;
  value = value.trim();
  if (value === 'transparent') return { mode: 'rgb', color: ['0', '0', '0'], alpha: '0' };
  const named = NAMED_COLORS[(value as string).toLowerCase()];
  if (named && value !== 'transparent') return { mode: 'rgb', color: named.map(String) };

  const hex = (value as string)
    .replace(SHORT_HEX, (_, r, g, b, a) => ['#', r, r, g, g, b, b, a ? a + a : ''].join(''))
    .match(HEX);
  if (hex !== null) {
    return {
      mode: 'rgb',
      color: [parseInt(hex[1], 16), parseInt(hex[2], 16), parseInt(hex[3], 16)].map(String),
      alpha: hex[4] ? (parseInt(hex[4], 16) / 255).toString() : undefined,
    };
  }
  const match = (value as string).match(RGB) ?? (value as string).match(HSL);
  if (match === null) return null;
  const color = [match[2], match[3], match[4]].filter(Boolean).map(String);
  // rgb(var(--x)) / hsl(var(--x)) — a single custom property standing in for all channels
  if (color.length === 2 && color[0].startsWith('var(')) {
    return { mode: match[1] as 'rgb' | 'hsl', color: [color[0]], alpha: color[1] };
  }
  if (!loose && color.length !== 3) return null;
  if (color.length < 3 && !color.some((p) => /^var\(.*?\)$/.test(p))) return null;
  return { mode: match[1].replace('a', '') as 'rgb' | 'hsl', color, alpha: match[5]?.toString() };
}

export function formatColor({ mode, color, alpha }: ParsedColor): string {
  const hasAlpha = alpha !== undefined;
  return `${mode}(${color.join(' ')}${hasAlpha ? ` / ${alpha}` : ''})`;
}

/**
 * `withAlphaValue('#3b82f6', '0.5')` → `rgb(59 130 246 / 0.5)`.
 * Falls back to `defaultValue` (or the raw colour) when it cannot be parsed.
 */
export function withAlphaValue(color: string, alpha: string, defaultValue?: string): string {
  const parsed = parseColor(color, { loose: true });
  if (parsed === null) return defaultValue ?? color;
  return formatColor({ ...parsed, alpha });
}

/**
 * Tailwind's `withAlphaVariable`: emits `--tw-x-opacity: 1` plus the colour
 * expressed with `var(--tw-x-opacity, 1)` so `*-opacity-*` utilities compose.
 * Colours that already carry an alpha channel, keywords and unparsable
 * values are emitted as-is.
 */
export function withAlphaVariable(
  color: string,
  properties: string | string[],
  variable: string,
): Record<string, string> {
  const props = Array.isArray(properties) ? properties : [properties];
  const parsed = parseColor(color);
  if (parsed === null || parsed.alpha !== undefined) {
    return Object.fromEntries(props.map((p) => [p, color]));
  }
  const value = formatColor({ ...parsed, alpha: `var(${variable}, 1)` });
  return { [variable]: '1', ...Object.fromEntries(props.map((p) => [p, value])) };
}

/** `isColor('#fff')` → true; used by arbitrary-value type inference */
export function isColor(value: string): boolean {
  return parseColor(value, { loose: true }) !== null;
}
