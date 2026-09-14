// Nakshora Core — functional utility table
// Mirrors the `matchUtilities` registrations of tailwindcss@3.4.19 core
// plugins (MIT). Static (value-less) utilities live in static-utilities.ts.
// Each entry maps a class prefix to a theme scale, the arbitrary-value types
// it accepts and a `build` function producing declarations.

import { withAlphaValue, withAlphaVariable } from './color';
import type { ResolvedTheme } from './theme';
import { fontFamilyToString, normalizeFontSize } from './theme';
import type { DataType } from './values';

export type Decls = Record<string, string>;

/** One rule produced by `FunctionalUtility.buildAll`. */
export interface FunctionalRuleShape {
  /** selector suffix (` > *`, `:hover`) or a template containing `&`; undefined = the class itself */
  selector?: string;
  decls: Decls;
  /** wrapping at-rules, e.g. `@media (min-width: 640px)` */
  atrules?: string[];
}

export interface FunctionalUtility {
  /** Tailwind core plugin name (used for ordering and `corePlugins` toggles) */
  plugin: string;
  /** class prefix without the trailing dash, e.g. `bg`, `translate-x` */
  prefix: string;
  /** resolved theme values (`key → value`) */
  values: Record<string, unknown>;
  /** accepted arbitrary-value types ([] → anything) */
  types: DataType[];
  /** the `position` type wins ambiguity contests (Tailwind `preferOnConflict`) */
  preferOnConflict?: boolean;
  /** `-prefix-value` allowed */
  negative?: boolean;
  /**
   * Bare (bracket-less) values accepted when no theme key matches — the v4
   * `--value(integer)` form (`tab-4`). Nakshora extension; Tailwind v3 has
   * no bare values outside the theme.
   */
  bare?: 'integer' | 'number' | 'percentage';
  /** `/modifier` semantics: colour alpha, fontSize line-height, any string, or a lookup map */
  modifier?: 'color' | 'lineHeight' | 'any' | Record<string, string>;
  /** selector suffix, e.g. ` > :not([hidden]) ~ :not([hidden])` */
  selector?: string;
  /** dynamic selector suffix (plugin `matchUtilities` returning `{ '&:hover': … }`) */
  selectorFor?: (value: unknown, modifier: string | null) => string | undefined;
  /** `--tw-*` defaults group needed by this utility */
  defaults?: string;
  /** produce declarations; return null to reject the value */
  build: (value: unknown, ctx: { modifier: string | null; key: string }) => Decls | null;
  /**
   * Plugin `matchUtilities`/`matchComponents` may emit several rules for one
   * value (`aspect-w-16` → `.aspect-w-16 {…}` + `.aspect-w-16 > * {…}`). When
   * present this supersedes `build`/`selector` for the emitted rules; `build`
   * is still used for the catalog description.
   */
  buildAll?: (value: unknown, modifier: string | null) => FunctionalRuleShape[] | null;
  /** short human description template (`{value}` placeholder) */
  describe: string;
}

const TRANSFORM_VALUE =
  'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))';
const FILTER_VALUE =
  'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)';
const BACKDROP_VALUE =
  'var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)';
export const CHILD_SELECTOR = ' > :not([hidden]) ~ :not([hidden])';

/** Tailwind's `transformThemeValue` — how raw theme entries become CSS values. */
export function transformThemeValue(themeKey: string, value: unknown): string {
  if (typeof value === 'function') value = (value as (o: object) => unknown)({});
  if (themeKey === 'fontSize' || themeKey === 'outline') {
    return String(Array.isArray(value) ? value[0] : value);
  }
  if (themeKey === 'fontFamily') return fontFamilyToString(value);
  if (
    [
      'boxShadow',
      'transitionProperty',
      'transitionDuration',
      'transitionDelay',
      'transitionTimingFunction',
      'backgroundImage',
      'backgroundSize',
      'backgroundColor',
      'cursor',
      'animation',
    ].includes(themeKey)
  ) {
    return String(Array.isArray(value) ? value.join(', ') : value);
  }
  if (['gridTemplateColumns', 'gridTemplateRows', 'objectPosition'].includes(themeKey)) {
    return typeof value === 'string' ? splitComma(value).join(' ') : String(value);
  }
  return String(value);
}

function splitComma(value: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of value) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      out.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/** Flatten `{ blue: { 500: '#…' }, white: '#fff' }` → `{ 'blue-500': '#…', white: '#fff' }`. */
export function flattenColorPalette(
  colors: Record<string, unknown> | undefined,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, value] of Object.entries(colors ?? {})) {
    if (value && typeof value === 'object') {
      for (const [shade, v] of Object.entries(
        flattenColorPalette(value as Record<string, unknown>),
      )) {
        out[shade === 'DEFAULT' ? name : `${name}-${shade}`] = v;
      }
    } else if (value !== undefined && value !== null) {
      out[name] = String(value);
    }
  }
  return out;
}

function toColorValue(value: unknown): string {
  return typeof value === 'function'
    ? String((value as (o: object) => unknown)({}))
    : String(value);
}

/** Fully transparent version of a colour for gradient stops (Tailwind semantics). */
function transparentTo(value: string): string {
  return withAlphaValue(value, '0', 'rgb(255 255 255 / 0)');
}

export interface UtilityTableOptions {
  /** `corePlugins` toggles — used to decide whether `*-opacity` variables are emitted */
  pluginEnabled: (name: string) => boolean;
}

/**
 * Build the functional utility table for a resolved theme, in Tailwind core
 * plugin order.
 */
export function buildFunctionalUtilities(
  theme: ResolvedTheme,
  options: UtilityTableOptions,
): FunctionalUtility[] {
  const t = theme as Record<string, Record<string, unknown>>;
  const list: FunctionalUtility[] = [];
  const scale = (key: string): Record<string, unknown> => t[key] ?? {};
  const withoutDefault = (v: Record<string, unknown>): Record<string, unknown> => {
    const { DEFAULT: _d, ...rest } = v;
    void _d;
    return rest;
  };

  const simple = (
    plugin: string,
    prefix: string,
    themeKey: string,
    props: string[],
    opts: Partial<FunctionalUtility> & { filterDefault?: boolean; describe?: string } = {},
  ): void => {
    const { filterDefault, ...rest } = opts;
    let values = scale(themeKey);
    if (filterDefault) values = withoutDefault(values);
    list.push({
      plugin,
      prefix,
      values,
      types: [],
      describe: opts.describe ?? `${props.join(' / ')}: {value}`,
      build: (value) => {
        const v = transformThemeValue(themeKey, value);
        return Object.fromEntries(props.map((p) => [p, v]));
      },
      ...rest,
    });
  };

  const colorUtility = (
    plugin: string,
    prefix: string,
    themeKey: string,
    props: string[],
    opacityVar: string | null,
    opacityPlugin: string | null,
    extra: Partial<FunctionalUtility> = {},
  ): void => {
    const useVar =
      opacityVar !== null && (opacityPlugin === null || options.pluginEnabled(opacityPlugin));
    list.push({
      plugin,
      prefix,
      values: withoutDefault(flattenColorPalette(scale(themeKey))),
      types: ['color', 'any'],
      modifier: 'color',
      describe: `${props.join(' / ')}: {value}`,
      build: (value, { modifier }) => {
        const color = toColorValue(value);
        if (!useVar || modifier !== null) return Object.fromEntries(props.map((p) => [p, color]));
        return withAlphaVariable(color, props, opacityVar as string);
      },
      ...extra,
    });
  };

  const opacityUtility = (
    plugin: string,
    prefix: string,
    themeKey: string,
    variable: string,
    extra: Partial<FunctionalUtility> = {},
  ): void => {
    list.push({
      plugin,
      prefix,
      values: scale(themeKey),
      types: [],
      describe: `${variable}: {value}`,
      build: (value) => ({ [variable]: String(value) }),
      ...extra,
    });
  };

  const transformUtility = (
    plugin: string,
    prefix: string,
    themeKey: string,
    vars: string[],
    negative = true,
  ): void => {
    list.push({
      plugin,
      prefix,
      values: scale(themeKey),
      types: [],
      negative,
      defaults: 'transform',
      describe: `${vars.join(' / ')}: {value}`,
      build: (value) => ({
        ...Object.fromEntries(vars.map((v) => [v, String(value)])),
        transform: TRANSFORM_VALUE,
      }),
    });
  };

  const filterUtility = (
    plugin: string,
    prefix: string,
    themeKey: string,
    variable: string,
    fn: string,
    negative = false,
  ): void => {
    list.push({
      plugin,
      prefix,
      values: scale(themeKey),
      types: [],
      negative,
      defaults: 'filter',
      describe: `${variable}: ${fn}({value})`,
      build: (value) => ({
        [variable]: value === '' ? ' ' : `${fn}(${String(value)})`,
        filter: FILTER_VALUE,
      }),
    });
  };

  const backdropUtility = (
    plugin: string,
    prefix: string,
    themeKey: string,
    variable: string,
    fn: string,
    negative = false,
  ): void => {
    list.push({
      plugin,
      prefix,
      values: scale(themeKey),
      types: [],
      negative,
      defaults: 'backdrop-filter',
      describe: `${variable}: ${fn}({value})`,
      build: (value) => ({
        [variable]: value === '' ? ' ' : `${fn}(${String(value)})`,
        '-webkit-backdrop-filter': BACKDROP_VALUE,
        'backdrop-filter': BACKDROP_VALUE,
      }),
    });
  };

  // ── layout ──
  simple('inset', 'inset', 'inset', ['inset'], { negative: true });
  simple('inset', 'inset-x', 'inset', ['left', 'right'], { negative: true });
  simple('inset', 'inset-y', 'inset', ['top', 'bottom'], { negative: true });
  simple('inset', 'start', 'inset', ['inset-inline-start'], { negative: true });
  simple('inset', 'end', 'inset', ['inset-inline-end'], { negative: true });
  for (const side of ['top', 'right', 'bottom', 'left'])
    simple('inset', side, 'inset', [side], { negative: true });
  simple('zIndex', 'z', 'zIndex', ['z-index'], { negative: true });
  simple('order', 'order', 'order', ['order'], { negative: true });
  simple('gridColumn', 'col', 'gridColumn', ['grid-column']);
  simple('gridColumnStart', 'col-start', 'gridColumnStart', ['grid-column-start'], {
    negative: true,
  });
  simple('gridColumnEnd', 'col-end', 'gridColumnEnd', ['grid-column-end'], { negative: true });
  simple('gridRow', 'row', 'gridRow', ['grid-row']);
  simple('gridRowStart', 'row-start', 'gridRowStart', ['grid-row-start'], { negative: true });
  simple('gridRowEnd', 'row-end', 'gridRowEnd', ['grid-row-end'], { negative: true });
  simple('margin', 'm', 'margin', ['margin'], { negative: true });
  simple('margin', 'mx', 'margin', ['margin-left', 'margin-right'], { negative: true });
  simple('margin', 'my', 'margin', ['margin-top', 'margin-bottom'], { negative: true });
  simple('margin', 'ms', 'margin', ['margin-inline-start'], { negative: true });
  simple('margin', 'me', 'margin', ['margin-inline-end'], { negative: true });
  simple('margin', 'mt', 'margin', ['margin-top'], { negative: true });
  simple('margin', 'mr', 'margin', ['margin-right'], { negative: true });
  simple('margin', 'mb', 'margin', ['margin-bottom'], { negative: true });
  simple('margin', 'ml', 'margin', ['margin-left'], { negative: true });
  list.push({
    plugin: 'lineClamp',
    prefix: 'line-clamp',
    values: scale('lineClamp'),
    types: [],
    describe: 'clamp text to {value} lines',
    build: (value) => ({
      overflow: 'hidden',
      display: '-webkit-box',
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': String(value),
    }),
  });
  simple('aspectRatio', 'aspect', 'aspectRatio', ['aspect-ratio']);
  simple('size', 'size', 'size', ['width', 'height']);
  simple('height', 'h', 'height', ['height']);
  simple('maxHeight', 'max-h', 'maxHeight', ['max-height']);
  simple('minHeight', 'min-h', 'minHeight', ['min-height']);
  simple('width', 'w', 'width', ['width']);
  simple('minWidth', 'min-w', 'minWidth', ['min-width']);
  simple('maxWidth', 'max-w', 'maxWidth', ['max-width']);
  simple('flex', 'flex', 'flex', ['flex']);
  simple('flexShrink', 'flex-shrink', 'flexShrink', ['flex-shrink']);
  simple('flexShrink', 'shrink', 'flexShrink', ['flex-shrink']);
  simple('flexGrow', 'flex-grow', 'flexGrow', ['flex-grow']);
  simple('flexGrow', 'grow', 'flexGrow', ['flex-grow']);
  simple('flexBasis', 'basis', 'flexBasis', ['flex-basis']);
  for (const [prefix, vars] of [
    ['border-spacing', ['--tw-border-spacing-x', '--tw-border-spacing-y']],
    ['border-spacing-x', ['--tw-border-spacing-x']],
    ['border-spacing-y', ['--tw-border-spacing-y']],
  ] as const) {
    list.push({
      plugin: 'borderSpacing',
      prefix,
      values: scale('borderSpacing'),
      types: [],
      defaults: 'border-spacing',
      describe: 'border-spacing: {value}',
      build: (value) => ({
        ...Object.fromEntries(vars.map((v) => [v, String(value)])),
        'border-spacing': 'var(--tw-border-spacing-x) var(--tw-border-spacing-y)',
      }),
    });
  }
  simple('transformOrigin', 'origin', 'transformOrigin', ['transform-origin']);
  transformUtility('translate', 'translate-x', 'translate', ['--tw-translate-x']);
  transformUtility('translate', 'translate-y', 'translate', ['--tw-translate-y']);
  transformUtility('rotate', 'rotate', 'rotate', ['--tw-rotate']);
  transformUtility('skew', 'skew-x', 'skew', ['--tw-skew-x']);
  transformUtility('skew', 'skew-y', 'skew', ['--tw-skew-y']);
  transformUtility('scale', 'scale', 'scale', ['--tw-scale-x', '--tw-scale-y']);
  transformUtility('scale', 'scale-x', 'scale', ['--tw-scale-x']);
  transformUtility('scale', 'scale-y', 'scale', ['--tw-scale-y']);
  simple('animation', 'animate', 'animation', ['animation']);
  simple('cursor', 'cursor', 'cursor', ['cursor']);
  simple('scrollMargin', 'scroll-m', 'scrollMargin', ['scroll-margin'], { negative: true });
  simple(
    'scrollMargin',
    'scroll-mx',
    'scrollMargin',
    ['scroll-margin-left', 'scroll-margin-right'],
    { negative: true },
  );
  simple(
    'scrollMargin',
    'scroll-my',
    'scrollMargin',
    ['scroll-margin-top', 'scroll-margin-bottom'],
    { negative: true },
  );
  simple('scrollMargin', 'scroll-ms', 'scrollMargin', ['scroll-margin-inline-start'], {
    negative: true,
  });
  simple('scrollMargin', 'scroll-me', 'scrollMargin', ['scroll-margin-inline-end'], {
    negative: true,
  });
  simple('scrollMargin', 'scroll-mt', 'scrollMargin', ['scroll-margin-top'], { negative: true });
  simple('scrollMargin', 'scroll-mr', 'scrollMargin', ['scroll-margin-right'], { negative: true });
  simple('scrollMargin', 'scroll-mb', 'scrollMargin', ['scroll-margin-bottom'], { negative: true });
  simple('scrollMargin', 'scroll-ml', 'scrollMargin', ['scroll-margin-left'], { negative: true });
  simple('scrollPadding', 'scroll-p', 'scrollPadding', ['scroll-padding']);
  simple('scrollPadding', 'scroll-px', 'scrollPadding', [
    'scroll-padding-left',
    'scroll-padding-right',
  ]);
  simple('scrollPadding', 'scroll-py', 'scrollPadding', [
    'scroll-padding-top',
    'scroll-padding-bottom',
  ]);
  simple('scrollPadding', 'scroll-ps', 'scrollPadding', ['scroll-padding-inline-start']);
  simple('scrollPadding', 'scroll-pe', 'scrollPadding', ['scroll-padding-inline-end']);
  simple('scrollPadding', 'scroll-pt', 'scrollPadding', ['scroll-padding-top']);
  simple('scrollPadding', 'scroll-pr', 'scrollPadding', ['scroll-padding-right']);
  simple('scrollPadding', 'scroll-pb', 'scrollPadding', ['scroll-padding-bottom']);
  simple('scrollPadding', 'scroll-pl', 'scrollPadding', ['scroll-padding-left']);
  simple('listStyleType', 'list', 'listStyleType', ['list-style-type']);
  simple('listStyleImage', 'list-image', 'listStyleImage', ['list-style-image']);
  simple('columns', 'columns', 'columns', ['columns']);
  simple('gridAutoColumns', 'auto-cols', 'gridAutoColumns', ['grid-auto-columns']);
  simple('gridAutoRows', 'auto-rows', 'gridAutoRows', ['grid-auto-rows']);
  simple('gridTemplateColumns', 'grid-cols', 'gridTemplateColumns', ['grid-template-columns']);
  simple('gridTemplateRows', 'grid-rows', 'gridTemplateRows', ['grid-template-rows']);
  simple('gap', 'gap', 'gap', ['gap']);
  simple('gap', 'gap-x', 'gap', ['column-gap']);
  simple('gap', 'gap-y', 'gap', ['row-gap']);
  list.push({
    plugin: 'space',
    prefix: 'space-x',
    values: scale('space'),
    types: [],
    negative: true,
    selector: CHILD_SELECTOR,
    describe: 'horizontal space between children: {value}',
    build: (value) => ({
      '--tw-space-x-reverse': '0',
      'margin-right': `calc(${String(value)} * var(--tw-space-x-reverse))`,
      'margin-left': `calc(${String(value)} * calc(1 - var(--tw-space-x-reverse)))`,
    }),
  });
  list.push({
    plugin: 'space',
    prefix: 'space-y',
    values: scale('space'),
    types: [],
    negative: true,
    selector: CHILD_SELECTOR,
    describe: 'vertical space between children: {value}',
    build: (value) => ({
      '--tw-space-y-reverse': '0',
      'margin-top': `calc(${String(value)} * calc(1 - var(--tw-space-y-reverse)))`,
      'margin-bottom': `calc(${String(value)} * var(--tw-space-y-reverse))`,
    }),
  });
  list.push({
    plugin: 'divideWidth',
    prefix: 'divide-x',
    values: scale('divideWidth'),
    types: ['line-width', 'length', 'any'],
    selector: CHILD_SELECTOR,
    defaults: 'border-width',
    describe: 'vertical divider width between children: {value}',
    build: (value) => ({
      '--tw-divide-x-reverse': '0',
      'border-right-width': `calc(${String(value)} * var(--tw-divide-x-reverse))`,
      'border-left-width': `calc(${String(value)} * calc(1 - var(--tw-divide-x-reverse)))`,
    }),
  });
  list.push({
    plugin: 'divideWidth',
    prefix: 'divide-y',
    values: scale('divideWidth'),
    types: ['line-width', 'length', 'any'],
    selector: CHILD_SELECTOR,
    defaults: 'border-width',
    describe: 'horizontal divider width between children: {value}',
    build: (value) => ({
      '--tw-divide-y-reverse': '0',
      'border-top-width': `calc(${String(value)} * calc(1 - var(--tw-divide-y-reverse)))`,
      'border-bottom-width': `calc(${String(value)} * var(--tw-divide-y-reverse))`,
    }),
  });
  colorUtility(
    'divideColor',
    'divide',
    'divideColor',
    ['border-color'],
    '--tw-divide-opacity',
    'divideOpacity',
    {
      selector: CHILD_SELECTOR,
    },
  );
  opacityUtility('divideOpacity', 'divide-opacity', 'divideOpacity', '--tw-divide-opacity', {
    selector: CHILD_SELECTOR,
  });

  // ── borders ──
  simple('borderRadius', 'rounded', 'borderRadius', ['border-radius']);
  simple('borderRadius', 'rounded-s', 'borderRadius', [
    'border-start-start-radius',
    'border-end-start-radius',
  ]);
  simple('borderRadius', 'rounded-e', 'borderRadius', [
    'border-start-end-radius',
    'border-end-end-radius',
  ]);
  simple('borderRadius', 'rounded-t', 'borderRadius', [
    'border-top-left-radius',
    'border-top-right-radius',
  ]);
  simple('borderRadius', 'rounded-r', 'borderRadius', [
    'border-top-right-radius',
    'border-bottom-right-radius',
  ]);
  simple('borderRadius', 'rounded-b', 'borderRadius', [
    'border-bottom-right-radius',
    'border-bottom-left-radius',
  ]);
  simple('borderRadius', 'rounded-l', 'borderRadius', [
    'border-top-left-radius',
    'border-bottom-left-radius',
  ]);
  simple('borderRadius', 'rounded-ss', 'borderRadius', ['border-start-start-radius']);
  simple('borderRadius', 'rounded-se', 'borderRadius', ['border-start-end-radius']);
  simple('borderRadius', 'rounded-ee', 'borderRadius', ['border-end-end-radius']);
  simple('borderRadius', 'rounded-es', 'borderRadius', ['border-end-start-radius']);
  simple('borderRadius', 'rounded-tl', 'borderRadius', ['border-top-left-radius']);
  simple('borderRadius', 'rounded-tr', 'borderRadius', ['border-top-right-radius']);
  simple('borderRadius', 'rounded-br', 'borderRadius', ['border-bottom-right-radius']);
  simple('borderRadius', 'rounded-bl', 'borderRadius', ['border-bottom-left-radius']);
  const lw: Partial<FunctionalUtility> = { types: ['line-width', 'length'] };
  simple('borderWidth', 'border', 'borderWidth', ['border-width'], lw);
  simple('borderWidth', 'border-x', 'borderWidth', ['border-left-width', 'border-right-width'], lw);
  simple('borderWidth', 'border-y', 'borderWidth', ['border-top-width', 'border-bottom-width'], lw);
  simple('borderWidth', 'border-s', 'borderWidth', ['border-inline-start-width'], lw);
  simple('borderWidth', 'border-e', 'borderWidth', ['border-inline-end-width'], lw);
  simple('borderWidth', 'border-t', 'borderWidth', ['border-top-width'], lw);
  simple('borderWidth', 'border-r', 'borderWidth', ['border-right-width'], lw);
  simple('borderWidth', 'border-b', 'borderWidth', ['border-bottom-width'], lw);
  simple('borderWidth', 'border-l', 'borderWidth', ['border-left-width'], lw);
  colorUtility(
    'borderColor',
    'border',
    'borderColor',
    ['border-color'],
    '--tw-border-opacity',
    'borderOpacity',
  );
  colorUtility(
    'borderColor',
    'border-x',
    'borderColor',
    ['border-left-color', 'border-right-color'],
    '--tw-border-opacity',
    'borderOpacity',
  );
  colorUtility(
    'borderColor',
    'border-y',
    'borderColor',
    ['border-top-color', 'border-bottom-color'],
    '--tw-border-opacity',
    'borderOpacity',
  );
  colorUtility(
    'borderColor',
    'border-s',
    'borderColor',
    ['border-inline-start-color'],
    '--tw-border-opacity',
    'borderOpacity',
  );
  colorUtility(
    'borderColor',
    'border-e',
    'borderColor',
    ['border-inline-end-color'],
    '--tw-border-opacity',
    'borderOpacity',
  );
  colorUtility(
    'borderColor',
    'border-t',
    'borderColor',
    ['border-top-color'],
    '--tw-border-opacity',
    'borderOpacity',
  );
  colorUtility(
    'borderColor',
    'border-r',
    'borderColor',
    ['border-right-color'],
    '--tw-border-opacity',
    'borderOpacity',
  );
  colorUtility(
    'borderColor',
    'border-b',
    'borderColor',
    ['border-bottom-color'],
    '--tw-border-opacity',
    'borderOpacity',
  );
  colorUtility(
    'borderColor',
    'border-l',
    'borderColor',
    ['border-left-color'],
    '--tw-border-opacity',
    'borderOpacity',
  );
  opacityUtility('borderOpacity', 'border-opacity', 'borderOpacity', '--tw-border-opacity');

  // ── backgrounds ──
  colorUtility(
    'backgroundColor',
    'bg',
    'backgroundColor',
    ['background-color'],
    '--tw-bg-opacity',
    'backgroundOpacity',
  );
  opacityUtility('backgroundOpacity', 'bg-opacity', 'backgroundOpacity', '--tw-bg-opacity');
  simple('backgroundImage', 'bg', 'backgroundImage', ['background-image'], {
    types: ['lookup', 'image', 'url'],
  });
  const stops = flattenColorPalette(scale('gradientColorStops'));
  list.push({
    plugin: 'gradientColorStops',
    prefix: 'from',
    values: stops,
    types: ['color', 'any'],
    modifier: 'color',
    defaults: 'gradient-color-stops',
    describe: 'gradient start colour: {value}',
    build: (value) => {
      const color = toColorValue(value);
      return {
        '--tw-gradient-from': `${color} var(--tw-gradient-from-position)`,
        '--tw-gradient-to': `${transparentTo(color)} var(--tw-gradient-to-position)`,
        '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)',
      };
    },
  });
  list.push({
    plugin: 'gradientColorStops',
    prefix: 'from',
    values: scale('gradientColorStopPositions'),
    types: ['length', 'percentage'],
    defaults: 'gradient-color-stops',
    describe: 'gradient start position: {value}',
    build: (value) => ({ '--tw-gradient-from-position': String(value) }),
  });
  list.push({
    plugin: 'gradientColorStops',
    prefix: 'via',
    values: stops,
    types: ['color', 'any'],
    modifier: 'color',
    defaults: 'gradient-color-stops',
    describe: 'gradient middle colour: {value}',
    build: (value) => {
      const color = toColorValue(value);
      return {
        '--tw-gradient-to': `${transparentTo(color)}  var(--tw-gradient-to-position)`,
        '--tw-gradient-stops': `var(--tw-gradient-from), ${color} var(--tw-gradient-via-position), var(--tw-gradient-to)`,
      };
    },
  });
  list.push({
    plugin: 'gradientColorStops',
    prefix: 'via',
    values: scale('gradientColorStopPositions'),
    types: ['length', 'percentage'],
    defaults: 'gradient-color-stops',
    describe: 'gradient middle position: {value}',
    build: (value) => ({ '--tw-gradient-via-position': String(value) }),
  });
  list.push({
    plugin: 'gradientColorStops',
    prefix: 'to',
    values: stops,
    types: ['color', 'any'],
    modifier: 'color',
    defaults: 'gradient-color-stops',
    describe: 'gradient end colour: {value}',
    build: (value) => ({
      '--tw-gradient-to': `${toColorValue(value)} var(--tw-gradient-to-position)`,
    }),
  });
  list.push({
    plugin: 'gradientColorStops',
    prefix: 'to',
    values: scale('gradientColorStopPositions'),
    types: ['length', 'percentage'],
    defaults: 'gradient-color-stops',
    describe: 'gradient end position: {value}',
    build: (value) => ({ '--tw-gradient-to-position': String(value) }),
  });
  simple('backgroundSize', 'bg', 'backgroundSize', ['background-size'], {
    types: ['lookup', 'length', 'percentage', 'size'],
  });
  simple('backgroundPosition', 'bg', 'backgroundPosition', ['background-position'], {
    types: ['lookup', 'position'],
    preferOnConflict: true,
  });
  colorUtility('fill', 'fill', 'fill', ['fill'], null, null);
  colorUtility('stroke', 'stroke', 'stroke', ['stroke'], null, null, {
    types: ['color', 'url', 'any'],
  });
  simple('strokeWidth', 'stroke', 'strokeWidth', ['stroke-width'], {
    types: ['length', 'number', 'percentage'],
  });
  simple('objectPosition', 'object', 'objectPosition', ['object-position']);
  simple('padding', 'p', 'padding', ['padding']);
  simple('padding', 'px', 'padding', ['padding-left', 'padding-right']);
  simple('padding', 'py', 'padding', ['padding-top', 'padding-bottom']);
  simple('padding', 'ps', 'padding', ['padding-inline-start']);
  simple('padding', 'pe', 'padding', ['padding-inline-end']);
  simple('padding', 'pt', 'padding', ['padding-top']);
  simple('padding', 'pr', 'padding', ['padding-right']);
  simple('padding', 'pb', 'padding', ['padding-bottom']);
  simple('padding', 'pl', 'padding', ['padding-left']);
  simple('textIndent', 'indent', 'textIndent', ['text-indent'], { negative: true });
  list.push({
    plugin: 'verticalAlign',
    prefix: 'align',
    values: {},
    types: [],
    describe: 'vertical-align: {value}',
    build: (value) => ({ 'vertical-align': String(value) }),
  });

  // ── typography ──
  simple('fontFamily', 'font', 'fontFamily', ['font-family'], {
    types: ['lookup', 'generic-name', 'family-name'],
  });
  list.push({
    plugin: 'fontSize',
    prefix: 'text',
    values: scale('fontSize'),
    types: ['absolute-size', 'relative-size', 'length', 'percentage'],
    modifier: 'lineHeight',
    describe: 'font-size: {value}',
    build: (value, { modifier }) => {
      const f = normalizeFontSize(value);
      if (modifier !== null) return { 'font-size': f.size, 'line-height': modifier };
      const out: Decls = { 'font-size': f.size };
      if (f.lineHeight !== undefined) out['line-height'] = f.lineHeight;
      if (f.letterSpacing !== undefined) out['letter-spacing'] = f.letterSpacing;
      if (f.fontWeight !== undefined) out['font-weight'] = f.fontWeight;
      return out;
    },
  });
  simple('fontWeight', 'font', 'fontWeight', ['font-weight'], {
    types: ['lookup', 'number', 'any'],
  });
  simple('lineHeight', 'leading', 'lineHeight', ['line-height']);
  simple('letterSpacing', 'tracking', 'letterSpacing', ['letter-spacing'], { negative: true });
  colorUtility('textColor', 'text', 'textColor', ['color'], '--tw-text-opacity', 'textOpacity');
  opacityUtility('textOpacity', 'text-opacity', 'textOpacity', '--tw-text-opacity');
  colorUtility(
    'textDecorationColor',
    'decoration',
    'textDecorationColor',
    ['text-decoration-color'],
    null,
    null,
  );
  simple(
    'textDecorationThickness',
    'decoration',
    'textDecorationThickness',
    ['text-decoration-thickness'],
    {
      types: ['length', 'percentage'],
    },
  );
  simple(
    'textUnderlineOffset',
    'underline-offset',
    'textUnderlineOffset',
    ['text-underline-offset'],
    {
      types: ['length', 'percentage', 'any'],
    },
  );
  colorUtility(
    'placeholderColor',
    'placeholder',
    'placeholderColor',
    ['color'],
    '--tw-placeholder-opacity',
    'placeholderOpacity',
    {
      selector: '::placeholder',
    },
  );
  opacityUtility(
    'placeholderOpacity',
    'placeholder-opacity',
    'placeholderOpacity',
    '--tw-placeholder-opacity',
    {
      selector: '::placeholder',
    },
  );
  colorUtility('caretColor', 'caret', 'caretColor', ['caret-color'], null, null);
  colorUtility('accentColor', 'accent', 'accentColor', ['accent-color'], null, null);
  simple('opacity', 'opacity', 'opacity', ['opacity']);

  // ── effects ──
  list.push({
    plugin: 'boxShadow',
    prefix: 'shadow',
    values: scale('boxShadow'),
    types: ['shadow'],
    defaults: 'box-shadow',
    describe: 'box-shadow: {value}',
    build: (value) => {
      const v = transformThemeValue('boxShadow', value);
      return {
        '--tw-shadow': v === 'none' ? '0 0 #0000' : v,
        '--tw-shadow-colored': v === 'none' ? '0 0 #0000' : colorizeShadow(v),
        'box-shadow':
          'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
      };
    },
  });
  list.push({
    plugin: 'boxShadowColor',
    prefix: 'shadow',
    values: withoutDefault(flattenColorPalette(scale('boxShadowColor'))),
    types: ['color', 'any'],
    modifier: 'color',
    describe: 'shadow colour: {value}',
    build: (value) => ({
      '--tw-shadow-color': toColorValue(value),
      '--tw-shadow': 'var(--tw-shadow-colored)',
    }),
  });
  simple('outlineWidth', 'outline', 'outlineWidth', ['outline-width'], {
    types: ['length', 'number', 'percentage'],
  });
  simple('outlineOffset', 'outline-offset', 'outlineOffset', ['outline-offset'], {
    types: ['length', 'number', 'percentage', 'any'],
    negative: true,
  });
  colorUtility('outlineColor', 'outline', 'outlineColor', ['outline-color'], null, null);
  list.push({
    plugin: 'ringWidth',
    prefix: 'ring',
    values: scale('ringWidth'),
    types: ['length'],
    defaults: 'ring-width',
    describe: 'ring width: {value}',
    build: (value) => ({
      '--tw-ring-offset-shadow':
        'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
      '--tw-ring-shadow': `var(--tw-ring-inset) 0 0 0 calc(${String(value)} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
      'box-shadow':
        'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
    }),
  });
  colorUtility(
    'ringColor',
    'ring',
    'ringColor',
    ['--tw-ring-color'],
    '--tw-ring-opacity',
    'ringOpacity',
  );
  opacityUtility('ringOpacity', 'ring-opacity', 'ringOpacity', '--tw-ring-opacity', {
    values: withoutDefault(scale('ringOpacity')),
  });
  simple('ringOffsetWidth', 'ring-offset', 'ringOffsetWidth', ['--tw-ring-offset-width'], {
    types: ['length'],
  });
  colorUtility(
    'ringOffsetColor',
    'ring-offset',
    'ringOffsetColor',
    ['--tw-ring-offset-color'],
    null,
    null,
  );
  filterUtility('blur', 'blur', 'blur', '--tw-blur', 'blur');
  filterUtility('brightness', 'brightness', 'brightness', '--tw-brightness', 'brightness');
  filterUtility('contrast', 'contrast', 'contrast', '--tw-contrast', 'contrast');
  list.push({
    plugin: 'dropShadow',
    prefix: 'drop-shadow',
    values: scale('dropShadow'),
    types: [],
    defaults: 'filter',
    describe: 'drop-shadow filter: {value}',
    build: (value) => ({
      '--tw-drop-shadow': Array.isArray(value)
        ? value.map((v) => `drop-shadow(${v})`).join(' ')
        : `drop-shadow(${String(value)})`,
      filter: FILTER_VALUE,
    }),
  });
  filterUtility('grayscale', 'grayscale', 'grayscale', '--tw-grayscale', 'grayscale');
  filterUtility('hueRotate', 'hue-rotate', 'hueRotate', '--tw-hue-rotate', 'hue-rotate', true);
  filterUtility('invert', 'invert', 'invert', '--tw-invert', 'invert');
  filterUtility('saturate', 'saturate', 'saturate', '--tw-saturate', 'saturate');
  filterUtility('sepia', 'sepia', 'sepia', '--tw-sepia', 'sepia');
  backdropUtility('backdropBlur', 'backdrop-blur', 'backdropBlur', '--tw-backdrop-blur', 'blur');
  backdropUtility(
    'backdropBrightness',
    'backdrop-brightness',
    'backdropBrightness',
    '--tw-backdrop-brightness',
    'brightness',
  );
  backdropUtility(
    'backdropContrast',
    'backdrop-contrast',
    'backdropContrast',
    '--tw-backdrop-contrast',
    'contrast',
  );
  backdropUtility(
    'backdropGrayscale',
    'backdrop-grayscale',
    'backdropGrayscale',
    '--tw-backdrop-grayscale',
    'grayscale',
  );
  backdropUtility(
    'backdropHueRotate',
    'backdrop-hue-rotate',
    'backdropHueRotate',
    '--tw-backdrop-hue-rotate',
    'hue-rotate',
    true,
  );
  backdropUtility(
    'backdropInvert',
    'backdrop-invert',
    'backdropInvert',
    '--tw-backdrop-invert',
    'invert',
  );
  backdropUtility(
    'backdropOpacity',
    'backdrop-opacity',
    'backdropOpacity',
    '--tw-backdrop-opacity',
    'opacity',
  );
  backdropUtility(
    'backdropSaturate',
    'backdrop-saturate',
    'backdropSaturate',
    '--tw-backdrop-saturate',
    'saturate',
  );
  backdropUtility(
    'backdropSepia',
    'backdrop-sepia',
    'backdropSepia',
    '--tw-backdrop-sepia',
    'sepia',
  );
  list.push({
    plugin: 'transitionProperty',
    prefix: 'transition',
    values: scale('transitionProperty'),
    types: [],
    describe: 'transition-property: {value}',
    build: (value) => {
      const v = transformThemeValue('transitionProperty', value);
      if (v === 'none') return { 'transition-property': 'none' };
      const duration = scale('transitionDuration').DEFAULT;
      const timing = scale('transitionTimingFunction').DEFAULT;
      return {
        'transition-property': v,
        ...(timing === undefined
          ? {}
          : {
              'transition-timing-function': transformThemeValue('transitionTimingFunction', timing),
            }),
        ...(duration === undefined
          ? {}
          : { 'transition-duration': transformThemeValue('transitionDuration', duration) }),
      };
    },
  });
  simple('transitionDelay', 'delay', 'transitionDelay', ['transition-delay']);
  simple('transitionDuration', 'duration', 'transitionDuration', ['transition-duration'], {
    filterDefault: true,
  });
  simple(
    'transitionTimingFunction',
    'ease',
    'transitionTimingFunction',
    ['transition-timing-function'],
    { filterDefault: true },
  );
  simple('willChange', 'will-change', 'willChange', ['will-change']);
  list.push({
    plugin: 'content',
    prefix: 'content',
    values: scale('content'),
    types: [],
    describe: 'content: {value}',
    build: (value) => ({ '--tw-content': String(value), content: 'var(--tw-content)' }),
  });

  // ── container queries (built in; mirrors @tailwindcss/container-queries) ──
  // `@container` → inline-size, `@container-normal`, `@container/name`.
  list.push({
    plugin: 'containerQueries',
    prefix: '@container',
    values: { DEFAULT: 'inline-size', normal: 'normal' },
    types: [],
    modifier: 'any',
    describe: 'container-type: {value}',
    build: (value, { modifier }) => ({
      'container-type': String(value),
      ...(modifier ? { 'container-name': modifier } : {}),
    }),
  });

  return list;
}

const SHADOW_KEYWORDS = new Set(['inset', 'inherit', 'initial', 'revert', 'unset']);
const SHADOW_LENGTH = /^-?(\d+|\.\d+)(.*?)$/;

interface ParsedShadow {
  raw: string;
  keyword?: string;
  x?: string;
  y?: string;
  blur?: string;
  spread?: string;
  color?: string;
  unknown?: string[];
  valid: boolean;
}

/** Tailwind's `parseBoxShadowValue` (MIT). */
export function parseBoxShadowValue(input: string): ParsedShadow[] {
  return splitComma(input).map((shadow) => {
    const value = shadow.trim();
    const result: ParsedShadow = { raw: value, valid: false };
    const parts = value.split(/ +(?![^(]*\))/g);
    const seen = new Set<string>();
    for (const part of parts) {
      if (!seen.has('KEYWORD') && SHADOW_KEYWORDS.has(part)) {
        result.keyword = part;
        seen.add('KEYWORD');
      } else if (SHADOW_LENGTH.test(part)) {
        if (!seen.has('X')) {
          result.x = part;
          seen.add('X');
        } else if (!seen.has('Y')) {
          result.y = part;
          seen.add('Y');
        } else if (!seen.has('BLUR')) {
          result.blur = part;
          seen.add('BLUR');
        } else if (!seen.has('SPREAD')) {
          result.spread = part;
          seen.add('SPREAD');
        }
      } else if (!result.color) {
        result.color = part;
      } else {
        (result.unknown ??= []).push(part);
      }
    }
    result.valid = result.x !== undefined && result.y !== undefined;
    return result;
  });
}

function colorizeShadow(value: string): string {
  return parseBoxShadowValue(value)
    .map((s) => {
      if (!s.valid) return s.raw;
      return [s.keyword, s.x, s.y, s.blur, s.spread, 'var(--tw-shadow-color)', ...(s.unknown ?? [])]
        .filter(Boolean)
        .join(' ');
    })
    .join(', ');
}

/** Tailwind core plugin order — used to sort utilities in the output. */
export const CORE_PLUGIN_ORDER = [
  'preflight',
  'container',
  'accessibility',
  'pointerEvents',
  'visibility',
  'position',
  'inset',
  'isolation',
  'zIndex',
  'order',
  'gridColumn',
  'gridColumnStart',
  'gridColumnEnd',
  'gridRow',
  'gridRowStart',
  'gridRowEnd',
  'float',
  'clear',
  'margin',
  'boxSizing',
  'lineClamp',
  'display',
  'aspectRatio',
  'size',
  'height',
  'maxHeight',
  'minHeight',
  'width',
  'minWidth',
  'maxWidth',
  'flex',
  'flexShrink',
  'flexGrow',
  'flexBasis',
  'tableLayout',
  'captionSide',
  'borderCollapse',
  'borderSpacing',
  'transformOrigin',
  'translate',
  'rotate',
  'skew',
  'scale',
  'transform',
  'animation',
  'cursor',
  'touchAction',
  'userSelect',
  'resize',
  'scrollSnapType',
  'scrollSnapAlign',
  'scrollSnapStop',
  'scrollMargin',
  'scrollPadding',
  'listStylePosition',
  'listStyleType',
  'listStyleImage',
  'appearance',
  'columns',
  'breakBefore',
  'breakInside',
  'breakAfter',
  'gridAutoColumns',
  'gridAutoFlow',
  'gridAutoRows',
  'gridTemplateColumns',
  'gridTemplateRows',
  'flexDirection',
  'flexWrap',
  'placeContent',
  'placeItems',
  'alignContent',
  'alignItems',
  'justifyContent',
  'justifyItems',
  'gap',
  'space',
  'divideWidth',
  'divideStyle',
  'divideColor',
  'divideOpacity',
  'placeSelf',
  'alignSelf',
  'justifySelf',
  'overflow',
  'overscrollBehavior',
  'scrollBehavior',
  'textOverflow',
  'hyphens',
  'whitespace',
  'textWrap',
  'wordBreak',
  'borderRadius',
  'borderWidth',
  'borderStyle',
  'borderColor',
  'borderOpacity',
  'backgroundColor',
  'backgroundOpacity',
  'backgroundImage',
  'gradientColorStops',
  'boxDecorationBreak',
  'backgroundSize',
  'backgroundAttachment',
  'backgroundClip',
  'backgroundPosition',
  'backgroundRepeat',
  'backgroundOrigin',
  'fill',
  'stroke',
  'strokeWidth',
  'objectFit',
  'objectPosition',
  'padding',
  'textAlign',
  'textIndent',
  'verticalAlign',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'textTransform',
  'fontStyle',
  'fontVariantNumeric',
  'lineHeight',
  'letterSpacing',
  'textColor',
  'textOpacity',
  'textDecoration',
  'textDecorationColor',
  'textDecorationStyle',
  'textDecorationThickness',
  'textUnderlineOffset',
  'fontSmoothing',
  'placeholderColor',
  'placeholderOpacity',
  'caretColor',
  'accentColor',
  'opacity',
  'backgroundBlendMode',
  'mixBlendMode',
  'boxShadow',
  'boxShadowColor',
  'outlineStyle',
  'outlineWidth',
  'outlineOffset',
  'outlineColor',
  'ringWidth',
  'ringColor',
  'ringOpacity',
  'ringOffsetWidth',
  'ringOffsetColor',
  'blur',
  'brightness',
  'contrast',
  'dropShadow',
  'grayscale',
  'hueRotate',
  'invert',
  'saturate',
  'sepia',
  'filter',
  'backdropBlur',
  'backdropBrightness',
  'backdropContrast',
  'backdropGrayscale',
  'backdropHueRotate',
  'backdropInvert',
  'backdropOpacity',
  'backdropSaturate',
  'backdropSepia',
  'backdropFilter',
  'transitionProperty',
  'transitionDelay',
  'transitionDuration',
  'transitionTimingFunction',
  'willChange',
  'contain',
  'content',
  'forcedColorAdjust',
  // Nakshora built-ins that Tailwind ships as plugins
  'containerQueries',
];

/** `--tw-*` custom-property defaults per group (Tailwind `addDefaults`). */
export const DEFAULTS_GROUPS: Record<string, Record<string, string>> = {
  'border-spacing': { '--tw-border-spacing-x': '0', '--tw-border-spacing-y': '0' },
  transform: {
    '--tw-translate-x': '0',
    '--tw-translate-y': '0',
    '--tw-rotate': '0',
    '--tw-skew-x': '0',
    '--tw-skew-y': '0',
    '--tw-scale-x': '1',
    '--tw-scale-y': '1',
  },
  'touch-action': { '--tw-pan-x': ' ', '--tw-pan-y': ' ', '--tw-pinch-zoom': ' ' },
  'scroll-snap-type': { '--tw-scroll-snap-strictness': 'proximity' },
  'gradient-color-stops': {
    '--tw-gradient-from-position': ' ',
    '--tw-gradient-via-position': ' ',
    '--tw-gradient-to-position': ' ',
  },
  'font-variant-numeric': {
    '--tw-ordinal': ' ',
    '--tw-slashed-zero': ' ',
    '--tw-numeric-figure': ' ',
    '--tw-numeric-spacing': ' ',
    '--tw-numeric-fraction': ' ',
  },
  'box-shadow': {
    '--tw-ring-offset-shadow': '0 0 #0000',
    '--tw-ring-shadow': '0 0 #0000',
    '--tw-shadow': '0 0 #0000',
    '--tw-shadow-colored': '0 0 #0000',
  },
  'ring-width': {
    '--tw-ring-inset': ' ',
    '--tw-ring-offset-width': '0px',
    '--tw-ring-offset-color': '#fff',
    '--tw-ring-color': 'rgb(59 130 246 / 0.5)',
    '--tw-ring-offset-shadow': '0 0 #0000',
    '--tw-ring-shadow': '0 0 #0000',
    '--tw-shadow': '0 0 #0000',
    '--tw-shadow-colored': '0 0 #0000',
  },
  filter: {
    '--tw-blur': ' ',
    '--tw-brightness': ' ',
    '--tw-contrast': ' ',
    '--tw-grayscale': ' ',
    '--tw-hue-rotate': ' ',
    '--tw-invert': ' ',
    '--tw-saturate': ' ',
    '--tw-sepia': ' ',
    '--tw-drop-shadow': ' ',
  },
  'backdrop-filter': {
    '--tw-backdrop-blur': ' ',
    '--tw-backdrop-brightness': ' ',
    '--tw-backdrop-contrast': ' ',
    '--tw-backdrop-grayscale': ' ',
    '--tw-backdrop-hue-rotate': ' ',
    '--tw-backdrop-invert': ' ',
    '--tw-backdrop-opacity': ' ',
    '--tw-backdrop-saturate': ' ',
    '--tw-backdrop-sepia': ' ',
  },
  contain: {
    '--tw-contain-size': ' ',
    '--tw-contain-layout': ' ',
    '--tw-contain-paint': ' ',
    '--tw-contain-style': ' ',
  },
  'border-width': {},
};
