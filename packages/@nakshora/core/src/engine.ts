// Nakshora Core — compilation engine
// Turns a class candidate (`md:hover:bg-red-500/50`) into CSS rules:
//   1. split variants / important / negative flags
//   2. resolve the utility (static table, functional table with theme values,
//      arbitrary values with type inference, arbitrary properties)
//   3. apply variants (selector formats, at-rules) with Tailwind semantics
//   4. produce sortable `CompiledRule`s
//
// The behaviour is deliberately aligned with tailwindcss@3.4.19 — see
// docs/COMPATIBILITY.md for the (documented) differences.

import { withAlphaValue } from './color';
import { STATIC_UTILITIES, type StaticUtilityDef } from './static-utilities';
import {
  DEFAULT_CONTAINER_MAX_SCREEN,
  DEFAULT_CONTAINER_MIN_SCREEN,
  screenToPx,
  splitPath as splitThemePath,
  type ResolvedTheme,
} from './theme';
import {
  buildFunctionalUtilities,
  CORE_PLUGIN_ORDER,
  type Decls,
  type FunctionalUtility,
} from './utilities';
import {
  coerceValue,
  escapeClassName,
  negateValue,
  normalizeAttributeSelectors,
  normalizeValue,
  splitAtTopLevelOnly,
  splitTypeHint,
  typeCheckers,
  type DataType,
} from './values';

// ───────────────────────────── types ─────────────────────────────

export interface AtRuleCond {
  kind: 'media' | 'supports' | 'container' | 'starting' | 'raw';
  /** params without the `@name`, e.g. `(min-width: 768px)` */
  params: string;
  /** sort weight (lower first) */
  sort: number;
  /** numeric min-width in px for media min conditions (used to merge/sort) */
  min?: number;
  /** numeric max-width in px */
  max?: number;
  /** user-authored (arbitrary variant) — never merged/rewritten */
  raw?: boolean;
}

export interface VariantBranch {
  /** cascade weight of this branch (assigned at registration; static variants only) */
  bit?: number;
  /** selector format containing `&` (the current selector) */
  format?: string;
  /** at-rule wrappers */
  atrules?: AtRuleCond[];
  /** declarations prepended to the utility (`content: var(--tw-content)`) */
  decls?: Decls;
  /**
   * `--tw-*-opacity` variables to strip (Tailwind's `removeAlphaVariables`):
   * `::marker` and `:visited` do not allow the alpha channel to be driven by
   * a custom property, so `color: rgb(r g b / var(--tw-text-opacity, 1))`
   * becomes `color: rgb(r g b )` and the variable declaration is dropped.
   */
  stripAlpha?: string[];
}

/**
 * Value-aware ordering hook of a variant family (Tailwind `matchVariant`
 * `sort` option): screens order by width, container queries by size + label.
 */
export interface VariantSortHook {
  /** family id — rules are compared only against hooks of the same family */
  id: string;
  value: unknown;
  modifier: string | null;
  compare: (
    a: { value: unknown; modifier: string | null },
    b: { value: unknown; modifier: string | null },
  ) => number;
}

/** What a functional variant's `match` may return. */
export type VariantMatchResult =
  | VariantBranch[]
  | {
      branches: VariantBranch[];
      /** index of the themed value (`aria-busy` → 0 …); arbitrary values use the last slot */
      slot?: number;
      fn?: VariantSortHook;
    };

export interface VariantMatch {
  branches: VariantBranch[];
  /** cascade weight (Tailwind variant bit); arbitrary variants sort by text instead */
  sort: number;
  /** config key that can disable it */
  key: string;
  /** raw text of an arbitrary variant (`[&:hover]`) */
  arbitrary?: string;
  /** functional variant → parallel branches share one weight */
  functional?: boolean;
  fn?: VariantSortHook;
}

export interface CompiledRule {
  /** plugin component rule (adjacent duplicates collapse) */
  component?: boolean;
  /** full selector, escaped, wrapped in `important` scope if configured */
  selector: string;
  decls: Decls;
  atrules: AtRuleCond[];
  /** sorting tuple */
  sort: RuleSort;
  /** the candidate that produced it */
  candidate: string;
  /** core plugin / group name */
  plugin: string;
  /** required `--tw-*` defaults group */
  defaults?: string;
  /** animation names referenced (for keyframe emission) */
  animations?: string[];
}

/** Sort position of a utility inside its layer (registration order). */
export interface UtilitySort {
  /** plugin index in core order */
  plugin: number;
  /** utility index within plugin table */
  utility: number;
  /** value index within the theme scale (arbitrary = large) */
  value: number;
  /** arbitrary property (`[color:red]`): sorted after real utilities, alphabetically */
  property?: string;
}

/**
 * Complete cascade position of a compiled rule — a port of Tailwind's
 * `Offsets.compare`: layer (plain utilities before variant rules, components
 * before utilities) → value-aware variant hooks (screens, containers) →
 * variant weights (highest first — the bit-mask) → parallel branch index →
 * arbitrary properties → registration order.
 */
export interface RuleSort extends UtilitySort {
  /** 0 when the rule has no variant, 1 otherwise */
  variant: number;
  /** 0 = components layer (plugin components, `.container`), 1 = utilities */
  layer: number;
  /** variant weights, highest first; strings are arbitrary variants (after every named one) */
  variants: (number | string)[];
  /** value-aware hooks with the weight of the variant that carries them */
  hooks?: (VariantSortHook & { bit: number })[];
  /** highest parallel-branch index of functional variants */
  parallel: number;
  /** insertion order for stability */
  seq: number;
}

export interface CatalogEntry {
  /** class name (without variants) */
  class: string;
  plugin: string;
  decls: Decls;
  selector?: string;
  defaults?: string;
  description: string;
  sort: UtilitySort;
}

export interface VariantDefinition {
  /** Variant name (prefix without the separator) */
  name: string;
  /** Config key (VariantsConfig) that toggles it */
  key: string;
  /**
   * Cascade weight (Tailwind's variant bit). Assigned by the engine in
   * Tailwind's registration order — plugin values are ignored.
   */
  sort: number;
  /** Static branches (for `hover`, `first`, …) */
  branches?: VariantBranch[];
  /** Functional resolver (`group-*`, `aria-*`, `min-[…]`, …). Receives the value after the dash and the `/modifier`. */
  match?: (
    value: string,
    modifier: string | null,
    ctx: VariantContext,
  ) => VariantMatchResult | null;
  /** Requires a value (`group-hover`, `aria-[…]`) */
  functional?: boolean;
  /** number of themed values (each reserves its own weight before the arbitrary slot) */
  slots?: number;
  /** value-aware ordering hook of a static variant (screens) */
  fn?: VariantSortHook;
  description: string;
}

export interface VariantContext {
  theme: ResolvedTheme;
}

export interface EngineOptions {
  theme: ResolvedTheme;
  darkMode: DarkModeConfig;
  /** returns false when a plugin/group is disabled */
  pluginEnabled: (name: string) => boolean;
  /** returns false when a variant (by config key or name) is disabled */
  variantEnabled: (key: string) => boolean;
  important: boolean | string;
  /** extra static utilities from plugins */
  extraStatic?: StaticUtilityDef[];
  /** extra functional utilities from plugins */
  extraFunctional?: FunctionalUtility[];
  /** extra variants from plugins */
  extraVariants?: VariantDefinition[];
  /** Nakshora policy: combine nested media queries into a single `@media` */
  combineMedia?: boolean;
  /** `[prop:value]` arbitrary properties */
  arbitraryProperties?: boolean;
  /** accept v4-style trailing `!` (`p-4!`) — default true */
  trailingImportant?: boolean;
  /** resolve `theme(path)` inside arbitrary values */
  themeFn?: (path: string) => string | undefined;
}

export type DarkModeConfig =
  | 'class'
  | 'media'
  | 'selector'
  | ['class', string]
  | ['selector', string]
  | ['variant', string | string[]]
  | false;

// ───────────────────────────── pseudo variants ─────────────────────────────

const PSEUDO_ELEMENTS: [string, string | string[], Decls?, string[]?][] = [
  ['first-letter', '&::first-letter'],
  ['first-line', '&::first-line'],
  ['marker', ['& *::marker', '&::marker'], undefined, ['--tw-text-opacity']],
  ['selection', ['& *::selection', '&::selection']],
  ['file', '&::file-selector-button'],
  ['placeholder', '&::placeholder'],
  ['backdrop', '&::backdrop'],
  ['before', '&::before', { content: 'var(--tw-content)' }],
  ['after', '&::after', { content: 'var(--tw-content)' }],
];

const VISITED_STRIP = ['--tw-text-opacity', '--tw-border-opacity', '--tw-bg-opacity'];

const PSEUDO_CLASSES: [string, string][] = [
  ['first', '&:first-child'],
  ['last', '&:last-child'],
  ['only', '&:only-child'],
  ['odd', '&:nth-child(odd)'],
  ['even', '&:nth-child(even)'],
  ['first-of-type', '&:first-of-type'],
  ['last-of-type', '&:last-of-type'],
  ['only-of-type', '&:only-of-type'],
  ['visited', '&:visited'],
  ['target', '&:target'],
  ['open', '&[open]'],
  ['default', '&:default'],
  ['checked', '&:checked'],
  ['indeterminate', '&:indeterminate'],
  ['placeholder-shown', '&:placeholder-shown'],
  ['autofill', '&:autofill'],
  ['optional', '&:optional'],
  ['required', '&:required'],
  ['valid', '&:valid'],
  ['invalid', '&:invalid'],
  ['in-range', '&:in-range'],
  ['out-of-range', '&:out-of-range'],
  ['read-only', '&:read-only'],
  ['empty', '&:empty'],
  ['focus-within', '&:focus-within'],
  ['hover', '&:hover'],
  ['focus', '&:focus'],
  ['focus-visible', '&:focus-visible'],
  ['active', '&:active'],
  ['enabled', '&:enabled'],
  ['disabled', '&:disabled'],
  // Nakshora / v4 additions
  ['inert', '&:is([inert], [inert] *)'],
  ['nth-last-child', '&:nth-last-child'],
];

/** Legacy Nakshora 3.0 config keys → variant names */
export const LEGACY_VARIANT_KEYS: Record<string, string> = {
  focusVisible: 'focus-visible',
  focusWithin: 'focus-within',
  firstChild: 'first',
  lastChild: 'last',
  groupHover: 'group-hover',
  groupFocus: 'group-focus',
  peerHover: 'peer-hover',
  peerFocus: 'peer-focus',
};

const MEDIA_SORT = {
  supports: 100,
  motion: 200,
  contrast: 300,
  screen: 1000,
  container: 5000,
  orientation: 6000,
  direction: 6100,
  dark: 6200,
  forcedColors: 6300,
  print: 6400,
  starting: 6500,
  arbitrary: 7000,
};

/** Build a media condition for a screen value (`640px` → `(min-width: 640px)`). */
function minWidthCond(value: string, sortBase = MEDIA_SORT.screen): AtRuleCond {
  const px = screenToPx(value);
  return {
    kind: 'media',
    params: `(min-width: ${value})`,
    sort: sortBase + (Number.isNaN(px) ? 0 : px / 10),
    min: px,
  };
}

function maxWidthCond(value: string, sortBase = MEDIA_SORT.screen + 3000): AtRuleCond {
  const px = screenToPx(value);
  return {
    kind: 'media',
    params: `(max-width: ${value})`,
    sort: sortBase - (Number.isNaN(px) ? 0 : px / 10),
    max: px,
  };
}

/** `768px` → `767.98px` (max-width form) */
export function maxWidthValue(minValue: string): string {
  const m = /^(\d+(?:\.\d+)?)(px|rem|em)$/.exec(minValue.trim());
  if (!m) return minValue;
  const n = parseFloat(m[1]);
  const unit = m[2];
  const step = unit === 'px' ? 0.02 : 0.02 / 16;
  const v = n - step;
  return `${Number.isInteger(v) ? v : parseFloat(v.toFixed(4))}${unit}`;
}

// ───────────────────────────── engine ─────────────────────────────

export class Engine {
  readonly theme: ResolvedTheme;
  readonly options: EngineOptions;
  /** static class → defs (later wins for duplicates) */
  /**
   * class → every static rule registered for it. Core classes map to one rule;
   * plugin components (e.g. typography's `.prose`) register dozens of rules
   * for the same class (different selector suffixes / at-rules), all of which
   * must be emitted.
   */
  private readonly staticMap = new Map<string, (StaticUtilityDef & { index: number })[]>();
  /** prefix → functional utilities */
  private readonly functionalMap = new Map<string, (FunctionalUtility & { index: number })[]>();
  private readonly functional: (FunctionalUtility & { index: number })[];
  private readonly statics: (StaticUtilityDef & { index: number })[];
  private readonly variants = new Map<string, VariantDefinition>();
  private readonly functionalVariants: VariantDefinition[] = [];
  private readonly pluginIndex = new Map<string, number>();
  private readonly screens: [string, string][];
  private readonly cache = new Map<string, CompiledRule[]>();
  private seq = 0;

  constructor(options: EngineOptions) {
    this.options = options;
    this.theme = options.theme;
    CORE_PLUGIN_ORDER.forEach((p, i) => this.pluginIndex.set(p, i));
    this.screens = Object.entries(this.theme.screens).sort(
      (a, b) => screenToPx(a[1]) - screenToPx(b[1]),
    );

    // utilities
    this.statics = [...STATIC_UTILITIES, ...NAKSHORA_STATIC, ...(options.extraStatic ?? [])].map(
      (s, index) => ({ ...s, index }),
    );
    for (const s of this.statics) {
      if (!this.pluginIndex.has(s.p)) this.pluginIndex.set(s.p, this.pluginIndex.size + 1000);
      const list = this.staticMap.get(s.c);
      if (list) list.push(s);
      else this.staticMap.set(s.c, [s]);
    }
    this.functional = [
      ...buildFunctionalUtilities(this.theme, { pluginEnabled: options.pluginEnabled }),
      ...(options.extraFunctional ?? []),
    ].map((f, index) => ({ ...f, index }));
    for (const f of this.functional) {
      if (!this.pluginIndex.has(f.plugin))
        this.pluginIndex.set(f.plugin, this.pluginIndex.size + 1000);
      const list = this.functionalMap.get(f.prefix) ?? [];
      list.push(f);
      this.functionalMap.set(f.prefix, list);
    }

    // variants (plugin variants are slotted in at Tailwind's user-plugin position)
    this.buildVariants(options.extraVariants ?? []);
  }

  /** next free cascade weight (Tailwind variant bit) */
  private nextBit = 1;

  /**
   * Register a variant and reserve its cascade weights: one per static branch
   * (`marker` → 2, `dark` with two formats → 2), or `slots + 1` for a
   * functional variant (one per themed value, the last one for arbitrary
   * values) — exactly what Tailwind's `Offsets.recordVariant` does.
   */
  private registerVariant(input: Omit<VariantDefinition, 'sort'> & { sort?: number }): void {
    const bit = this.nextBit;
    const width = input.match ? (input.slots ?? 0) + 1 : (input.branches?.length ?? 1);
    this.nextBit += width;
    const v: VariantDefinition = { ...input, sort: bit };
    if (v.branches) v.branches = v.branches.map((b, i) => ({ ...b, bit: bit + i }));
    this.variants.set(v.name, v);
    if (v.match) this.functionalVariants.push(v);
    // keep longest-prefix-first for functional matching
    this.functionalVariants.sort((a, b) => b.name.length - a.name.length);
  }

  // ───────────────────────── variant table ─────────────────────────

  /**
   * Variants in Tailwind 3.4's registration order — the order *is* the
   * cascade: child → pseudo-elements → pseudo-classes → group-* → peer-* →
   * has/aria/data → plugin variants (built-in `@container` first) → supports →
   * motion/contrast → [dark when `class`] → screens (max-*, then min) →
   * orientation → direction → [dark otherwise] → forced-colors → print.
   * Nakshora extras (`inert`, `not-*`, `starting`) sit next to their
   * closest relatives.
   */
  private buildVariants(extra: VariantDefinition[]): void {
    const push = (v: Omit<VariantDefinition, 'sort'> & { sort?: number }): void =>
      this.registerVariant(v);

    // child
    push({
      name: '*',
      key: 'child',
      branches: [{ format: '& > *' }],
      description: 'direct children',
    });

    // pseudo elements
    for (const [name, fmt, decls, stripAlpha] of PSEUDO_ELEMENTS) {
      const formats = Array.isArray(fmt) ? fmt : [fmt];
      push({
        name,
        key: name,
        branches: formats.map((format) => ({ format, decls, stripAlpha })),
        description: `::${name} pseudo-element`,
      });
    }

    // pseudo classes
    const pseudoBranches = new Map<string, string>();
    for (const [name, fmt] of PSEUDO_CLASSES) {
      if (name === 'nth-last-child') continue;
      pseudoBranches.set(name, fmt);
      push({
        name,
        key: name,
        branches: [{ format: fmt, stripAlpha: name === 'visited' ? VISITED_STRIP : undefined }],
        description: `${fmt.slice(1)} state`,
      });
    }
    // not-* (v4 syntax, Nakshora extension)
    push({
      name: 'not',
      key: 'not',
      functional: true,
      match: (value) => {
        if (value.startsWith('[') && value.endsWith(']'))
          return [{ format: `&:not(${normalizeValue(value.slice(1, -1))})` }];
        const fmt = pseudoBranches.get(value);
        if (!fmt) return null;
        return [{ format: `&:not(${fmt.slice(1)})` }];
      },
      description: 'negated state (`not-hover:`, `not-[…]:`)',
    });

    // group-* / peer-*: every pseudo class, then the arbitrary form
    for (const kind of ['group', 'peer'] as const) {
      const combinator = kind === 'group' ? ' &' : ' ~ &';
      for (const [name, fmt] of PSEUDO_CLASSES) {
        if (name === 'nth-last-child') continue;
        const sel = fmt.slice(1); // strip &
        push({
          name: `${kind}-${name}`,
          key: `${kind}-${name}`,
          match: (_v, modifier) => [
            { format: `:merge(.${kind}${modifier ? `\\/${modifier}` : ''})${sel}${combinator}` },
          ],
          description: `${kind === 'group' ? 'parent .group' : 'preceding .peer sibling'} ${sel}`,
        });
      }
      push({
        name: kind,
        key: kind,
        functional: true,
        match: (value, modifier) => {
          if (!(value.startsWith('[') && value.endsWith(']'))) return null;
          const base = `:merge(.${kind}${modifier ? `\\/${modifier}` : ''})`;
          const sel = normalizeValue(value.slice(1, -1));
          if (sel.includes('&')) return [{ format: sel.replace(/&/g, base) + combinator }];
          return [{ format: `${base}${sel}${combinator}` }];
        },
        description: `${kind} arbitrary state (\`${kind}-[…]:\`)`,
      });
    }

    // has-[…] / group-has-[…] / peer-has-[…]
    const hasFamily = (kind: '' | 'group' | 'peer'): void => {
      const name = kind ? `${kind}-has` : 'has';
      push({
        name,
        key: name,
        functional: true,
        match: (value, modifier) => {
          if (!(value.startsWith('[') && value.endsWith(']'))) return null;
          const has = `:has(${normalizeValue(value.slice(1, -1))})`;
          if (!kind) return [{ format: `&${has}` }];
          const base = `:merge(.${kind}${modifier ? `\\/${modifier}` : ''})`;
          return [{ format: `${base}${has}${kind === 'group' ? ' &' : ' ~ &'}` }];
        },
        description: kind ? `${kind} :has() relational state` : ':has() relational state',
      });
    };
    hasFamily('');
    hasFamily('group');
    hasFamily('peer');

    // aria-* / data-*: themed values first (own weight each), then arbitrary
    for (const attr of ['aria', 'data'] as const) {
      const themed = Object.keys((this.theme[attr] as Record<string, string> | undefined) ?? {});
      for (const kind of ['', 'group', 'peer'] as const) {
        const name = kind ? `${kind}-${attr}` : attr;
        push({
          name,
          key: name,
          functional: true,
          slots: themed.length,
          match: (value, modifier) => {
            const selector = this.attrSelector(attr, value);
            if (!selector) return null;
            const slot = themed.indexOf(value);
            const format = kind
              ? `:merge(.${kind}${modifier ? `\\/${modifier}` : ''})${selector}${kind === 'group' ? ' &' : ' ~ &'}`
              : `&${selector}`;
            return { branches: [{ format }], slot: slot === -1 ? themed.length : slot };
          },
          description: `${kind ? `${kind} ` : ''}${attr} attribute state`,
        });
      }
    }

    // plugin position: built-in container queries, then user plugin variants
    const containers = this.theme.containers as Record<string, string>;
    const containerKeys = Object.keys(containers);
    const containerHook = (value: string, modifier: string | null): VariantSortHook => ({
      id: '@container',
      value,
      modifier,
      compare: compareContainers,
    });
    push({
      name: '@',
      key: 'containerQueries',
      functional: true,
      slots: containerKeys.length,
      match: (value, modifier) => {
        let size: string;
        if (value.startsWith('[') && value.endsWith(']')) size = normalizeValue(value.slice(1, -1));
        else if (containers[value] !== undefined) size = containers[value];
        else return null;
        const px = screenToPx(size);
        const slot = containerKeys.indexOf(value);
        return {
          branches: [
            {
              atrules: [
                {
                  kind: 'container',
                  params: `${modifier ? `${modifier} ` : ''}(min-width: ${size})`,
                  sort: MEDIA_SORT.container + (Number.isNaN(px) ? 0 : px / 10),
                  min: px,
                },
              ],
            },
          ],
          slot: slot === -1 ? containerKeys.length : slot,
          fn: containerHook(size, modifier),
        };
      },
      description: '@container size query',
    });
    for (const v of extra) push(v);

    // media-ish
    const media = (name: string, params: string, sort: number, description: string): void =>
      push({
        name,
        key: name,
        branches: [{ atrules: [{ kind: 'media', params, sort }] }],
        description,
      });
    const supportsThemed = Object.keys((this.theme.supports as Record<string, string>) ?? {});
    push({
      name: 'supports',
      key: 'supports',
      functional: true,
      slots: supportsThemed.length,
      match: (value) => {
        let check: string;
        if (value.startsWith('[') && value.endsWith(']')) {
          check = normalizeValue(value.slice(1, -1));
        } else {
          const themed = (this.theme.supports as Record<string, string>)[value];
          if (themed === undefined) return null;
          check = themed;
        }
        const isRaw = /^\w*\s*\(/.test(check);
        if (isRaw)
          check = check
            .replace(/\b(and|or|not)\b/g, ' $1 ')
            .replace(/\s+/g, ' ')
            .trim();
        else check = check.includes(':') ? `(${check})` : `(${check}: var(--tw))`;
        const slot = supportsThemed.indexOf(value);
        return {
          branches: [{ atrules: [{ kind: 'supports', params: check, sort: MEDIA_SORT.supports }] }],
          slot: slot === -1 ? supportsThemed.length : slot,
        };
      },
      description: '@supports feature query',
    });
    media(
      'motion-safe',
      '(prefers-reduced-motion: no-preference)',
      MEDIA_SORT.motion,
      'user allows motion',
    );
    media(
      'motion-reduce',
      '(prefers-reduced-motion: reduce)',
      MEDIA_SORT.motion + 1,
      'user prefers reduced motion',
    );
    media(
      'contrast-more',
      '(prefers-contrast: more)',
      MEDIA_SORT.contrast,
      'user prefers more contrast',
    );
    media(
      'contrast-less',
      '(prefers-contrast: less)',
      MEDIA_SORT.contrast + 1,
      'user prefers less contrast',
    );

    // dark: `class` keeps the pre-3.4 position (before screens), everything
    // else sorts after direction — Tailwind's `isLegacyDarkMode`.
    const dark = this.options.darkMode;
    const legacyDark = dark === 'class' || (Array.isArray(dark) && dark[0] === 'class');
    const pushDark = (): void => {
      if (dark === false) return;
      const [mode, selector] = Array.isArray(dark) ? dark : [dark, undefined];
      let branches: VariantBranch[];
      if (mode === 'media') {
        branches = [
          {
            atrules: [
              { kind: 'media', params: '(prefers-color-scheme: dark)', sort: MEDIA_SORT.dark },
            ],
          },
        ];
      } else if (mode === 'variant') {
        const formats = (
          Array.isArray(selector) ? selector : [selector ?? '&:is(.dark *)']
        ) as string[];
        branches = formats.map((format) => this.formatToBranch(format, MEDIA_SORT.dark));
      } else if (mode === 'selector') {
        const sel = (selector as string | undefined) ?? '.dark';
        branches = [{ format: `&:where(${sel}, ${sel} *)` }];
      } else {
        const sel = (selector as string | undefined) ?? '.dark';
        branches = [{ format: `&:is(${sel} *)` }];
      }
      push({ name: 'dark', key: 'dark', branches, description: 'dark mode' });
    };
    if (legacyDark) pushDark();

    // screens: max-* family, `max-[…]`, min family, `min-[…]`
    const minHook = (px: number): VariantSortHook => ({
      id: 'min-screens',
      value: px,
      modifier: null,
      compare: (a, b) => (a.value as number) - (b.value as number),
    });
    const maxHook = (px: number): VariantSortHook => ({
      id: 'max-screens',
      value: px,
      modifier: null,
      compare: (a, b) => (b.value as number) - (a.value as number),
    });
    for (const [name, value] of this.screens) {
      push({
        name: `max-${name}`,
        key: 'maxResponsive',
        branches: [{ atrules: [maxWidthCond(maxWidthValue(value))] }],
        fn: maxHook(screenToPx(value)),
        description: `max-width ${maxWidthValue(value)}`,
      });
    }
    push({
      name: 'max',
      key: 'maxResponsive',
      functional: true,
      match: (value) => {
        if (!(value.startsWith('[') && value.endsWith(']'))) return null;
        const v = normalizeValue(value.slice(1, -1));
        if (!typeCheckers.length(v)) return null;
        return { branches: [{ atrules: [maxWidthCond(v)] }], fn: maxHook(screenToPx(v)) };
      },
      description: 'arbitrary max-width',
    });
    for (const [name, value] of this.screens) {
      push({
        name,
        key: 'responsive',
        branches: [{ atrules: [minWidthCond(value)] }],
        fn: minHook(screenToPx(value)),
        description: `min-width ${value}`,
      });
    }
    push({
      name: 'min',
      key: 'responsive',
      functional: true,
      match: (value) => {
        if (!(value.startsWith('[') && value.endsWith(']'))) return null;
        const v = normalizeValue(value.slice(1, -1));
        if (!typeCheckers.length(v)) return null;
        return { branches: [{ atrules: [minWidthCond(v)] }], fn: minHook(screenToPx(v)) };
      },
      description: 'arbitrary min-width',
    });

    media('portrait', '(orientation: portrait)', MEDIA_SORT.orientation, 'portrait orientation');
    media(
      'landscape',
      '(orientation: landscape)',
      MEDIA_SORT.orientation + 1,
      'landscape orientation',
    );
    // direction
    push({
      name: 'ltr',
      key: 'ltr',
      branches: [{ format: '&:where([dir="ltr"], [dir="ltr"] *)' }],
      description: 'left-to-right documents',
    });
    push({
      name: 'rtl',
      key: 'rtl',
      branches: [{ format: '&:where([dir="rtl"], [dir="rtl"] *)' }],
      description: 'right-to-left documents',
    });
    if (!legacyDark) pushDark();
    media(
      'forced-colors',
      '(forced-colors: active)',
      MEDIA_SORT.forcedColors,
      'forced colours mode',
    );
    media('print', 'print', MEDIA_SORT.print, 'print media');
    push({
      name: 'starting',
      key: 'starting',
      branches: [{ atrules: [{ kind: 'starting', params: '', sort: MEDIA_SORT.starting }] }],
      description: '@starting-style (entry transitions)',
    });
  }

  /** `@media (…) { &:not(.light *) }` / `&:is(.dark *)` / `@media (…)` → branch */
  private formatToBranch(format: string, sort: number): VariantBranch {
    const f = format.trim();
    const m = /^@([\w-]+)\s*([^{]*?)\s*(?:\{\s*(.*?)\s*\})?$/.exec(f);
    if (!m) return { format: f };
    const kind: AtRuleCond['kind'] =
      m[1] === 'media'
        ? 'media'
        : m[1] === 'supports'
          ? 'supports'
          : m[1] === 'container'
            ? 'container'
            : 'raw';
    const inner = m[3];
    return {
      atrules: [{ kind, params: kind === 'raw' ? `${m[1]} ${m[2]}` : m[2], sort }],
      format: inner && inner !== '&' ? inner : undefined,
    };
  }

  private attrSelector(kind: 'aria' | 'data', value: string): string | null {
    if (value.startsWith('[') && value.endsWith(']')) {
      return `[${kind}-${normalizeAttributeSelectors(normalizeValue(value.slice(1, -1)))}]`;
    }
    const themed = (this.theme[kind] as Record<string, string> | undefined)?.[value];
    if (themed === undefined) return null;
    return `[${kind}-${themed}]`;
  }

  /** Public: variant definitions (docs / IntelliSense). */
  getVariants(): VariantDefinition[] {
    return [...this.variants.values()];
  }

  getScreens(): [string, string][] {
    return this.screens;
  }

  // ───────────────────────── catalog ─────────────────────────

  /** Every value-bearing utility class the theme defines (no variants, no arbitrary values). */
  buildCatalog(): CatalogEntry[] {
    const out: CatalogEntry[] = [];
    const seenStatic = new Set<string>();
    for (const s of this.statics) {
      if (!this.options.pluginEnabled(s.p)) continue;
      // one catalog entry per class (plugin components register many rules)
      if (seenStatic.has(s.c)) continue;
      seenStatic.add(s.c);
      out.push({
        class: s.c,
        plugin: s.p,
        decls: Object.fromEntries(s.d),
        selector: s.s,
        defaults: s.df,
        description: s.d.map(([k, v]) => `${k}: ${v}`).join('; '),
        sort: { plugin: this.pluginIndex.get(s.p) ?? 9999, utility: s.index, value: 0 },
      });
    }
    for (const f of this.functional) {
      if (!this.options.pluginEnabled(f.plugin)) continue;
      let vi = 0;
      for (const [key, raw] of Object.entries(f.values)) {
        vi++;
        const cls = key === 'DEFAULT' ? f.prefix : `${f.prefix}-${key}`;
        const decls = f.build(raw, { modifier: null, key });
        if (!decls) continue;
        out.push({
          class: cls,
          plugin: f.plugin,
          decls,
          selector: f.selector,
          defaults: f.defaults,
          description: f.describe.replace('{value}', String(Array.isArray(raw) ? raw[0] : raw)),
          sort: { plugin: this.pluginIndex.get(f.plugin) ?? 9999, utility: f.index, value: vi },
        });
        if (f.negative) {
          const neg = this.negate(raw);
          if (neg !== null) {
            const nd = f.build(neg, { modifier: null, key });
            if (nd)
              out.push({
                class: `-${cls}`,
                plugin: f.plugin,
                decls: nd,
                selector: f.selector,
                defaults: f.defaults,
                description: f.describe.replace('{value}', neg),
                sort: {
                  plugin: this.pluginIndex.get(f.plugin) ?? 9999,
                  utility: f.index,
                  value: vi + 0.5,
                },
              });
          }
        }
      }
    }
    // container
    if (this.options.pluginEnabled('container')) {
      out.push({
        class: 'container',
        plugin: 'container',
        decls: { width: '100%' },
        description: 'responsive fixed-width container',
        sort: { plugin: this.pluginIndex.get('container') ?? 1, utility: 0, value: 0 },
      });
    }
    // dedupe (later wins)
    const seen = new Map<string, number>();
    const result: CatalogEntry[] = [];
    for (const e of out) {
      const idx = seen.get(e.class);
      if (idx !== undefined) result[idx] = e;
      else {
        seen.set(e.class, result.length);
        result.push(e);
      }
    }
    return result;
  }

  private negate(raw: unknown): string | null {
    return negateValue(Array.isArray(raw) ? raw[0] : raw);
  }

  // ───────────────────────── compile ─────────────────────────

  /** Compile one candidate into rules (empty when unknown). Cached. */
  compile(candidate: string): CompiledRule[] {
    const cached = this.cache.get(candidate);
    if (cached) return cached;
    const rules = this.compileUncached(candidate);
    this.cache.set(candidate, rules);
    return rules;
  }

  private compileUncached(candidate: string): CompiledRule[] {
    if (!candidate || candidate.length > 256) return [];
    const parts = splitAtTopLevelOnly(candidate, ':');
    let base = parts[parts.length - 1];
    const variantNames = parts.slice(0, -1);
    if (!base) return [];
    // `!` (leading — Tailwind v3) or trailing (v4)
    let important = false;
    if (base.startsWith('!')) {
      important = true;
      base = base.slice(1);
    } else if (base.endsWith('!') && this.options.trailingImportant !== false) {
      // v4-style trailing `!` (Nakshora extension, documented)
      important = true;
      base = base.slice(0, -1);
    }
    let negative = false;
    if (base.startsWith('-')) {
      negative = true;
      base = base.slice(1);
    }
    if (!base || base.startsWith('-') || base.startsWith('!')) return [];

    const resolved = this.resolveUtility(base, negative);
    if (resolved.length === 0) return [];

    // variants, innermost first
    const variantMatches: VariantMatch[] = [];
    for (let i = variantNames.length - 1; i >= 0; i--) {
      const m = this.resolveVariant(variantNames[i]);
      if (!m) return [];
      variantMatches.push(m);
    }

    const rules: CompiledRule[] = [];
    const escaped = `.${escapeClassName(candidate)}`;
    for (const u of resolved) {
      // Variants are applied to the class node only; the utility's own selector
      // suffix (`::placeholder`, ` > :not([hidden]) ~ :not([hidden])`) is appended
      // afterwards — exactly what Tailwind's `finalizeSelector` does.
      const suffix = u.selector ?? '';
      const isTemplate = suffix.includes('&');
      let branches: {
        selector: string;
        atrules: AtRuleCond[];
        decls: Decls;
        weights?: number[];
        parallel?: number;
      }[] = [{ selector: escaped, atrules: [...(u.atrules ?? [])], decls: { ...u.decls } }];
      // Tailwind cascade bookkeeping: every applied variant contributes its
      // weight (bit); parallel branches of a *static* variant each own a bit
      // (`marker` → `& *::marker` before `&::marker`), functional ones share
      // the weight and are told apart by their branch index.
      const weights: (number | string)[] = [];
      const hooks: (VariantSortHook & { bit: number })[] = [];
      let parallel = 0;
      for (const vm of variantMatches) {
        if (vm.arbitrary) weights.push(vm.arbitrary);
        else if (vm.functional || vm.branches.length === 1) weights.push(vm.sort);
        if (vm.fn) hooks.push({ ...vm.fn, bit: vm.sort });
        const next: typeof branches = [];
        for (const b of branches) {
          vm.branches.forEach((vb, bi) => {
            if (!vm.arbitrary && !vm.functional && vm.branches.length > 1)
              b.weights = [...(b.weights ?? []), vb.bit ?? vm.sort + bi];
            if (vm.functional && vm.branches.length > 1) parallel = Math.max(parallel, bi);
            const selector = vb.format ? applyFormat(b.selector, vb.format) : b.selector;
            let decls =
              vb.decls && !Object.keys(vb.decls).some((k) => k in b.decls)
                ? { ...vb.decls, ...b.decls }
                : b.decls;
            if (vb.stripAlpha) decls = removeAlphaVariables(decls, vb.stripAlpha);
            next.push({
              selector,
              atrules: [...b.atrules, ...(vb.atrules ?? [])],
              decls,
              weights: b.weights,
              parallel: Math.max(b.parallel ?? 0, vm.functional ? bi : 0),
            });
          });
        }
        branches = next;
      }
      for (const b of branches) {
        const withSuffix = suffix
          ? isTemplate
            ? suffix.replace(/&/g, b.selector)
            : splitAtTopLevelOnly(b.selector, ',')
                .map((part) => part.trim() + suffix)
                .join(', ')
          : b.selector;
        let selector = finalizeSelector(withSuffix);
        // selector-list siblings survive only when no variant was applied
        if (u.siblings?.length && variantMatches.length === 0) {
          const ownParts = splitAtTopLevelOnly(selector, ',').map((p) => p.trim());
          let i = 0;
          selector = u.siblings
            .map((part) => (part === '&' ? (ownParts[i++] ?? '') : part))
            .filter(Boolean)
            .join(', ');
        }
        selector = this.wrapImportant(selector);
        const bang = important || this.options.important === true;
        const decls = bang
          ? Object.fromEntries(
              Object.entries(b.decls).map(([k, v]) => [
                k,
                v.endsWith('!important') ? v : `${v} !important`,
              ]),
            )
          : b.decls;
        rules.push({
          selector,
          decls,
          atrules: this.mergeAtRules(b.atrules),
          sort: {
            variant: variantMatches.length ? 1 : 0,
            layer: u.component || u.plugin === 'container' ? 0 : 1,
            // a bit mask: the same variant applied twice (`hover:hover:x`) sets one bit
            variants: [...new Set([...weights, ...(b.weights ?? [])])].sort(compareWeights),
            // outermost variant first — the order Tailwind walks `options`
            hooks: hooks.length ? [...hooks].reverse() : undefined,
            parallel: Math.max(parallel, b.parallel ?? 0),
            plugin: u.sort.plugin,
            utility: u.sort.utility,
            value: u.sort.value,
            property: u.sort.property,
            seq: this.seq++,
          },
          candidate,
          plugin: u.plugin,
          defaults: u.defaults,
          animations: u.animations,
          component: u.component,
        });
      }
    }
    return dedupeRules(rules);
  }

  private wrapImportant(selector: string): string {
    const imp = this.options.important;
    if (typeof imp === 'string' && imp.trim()) {
      const scopes = imp
        .trim()
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      return splitAtTopLevelOnly(selector, ',')
        .map((s) => s.trim())
        .flatMap((sel) => scopes.map((scope) => (sel.includes(scope) ? sel : `${scope} ${sel}`)))
        .join(', ');
    }
    return selector;
  }

  /**
   * Order at-rules outermost-first (the leftmost variant is the outermost
   * wrapper, as in Tailwind) and — Nakshora policy — collapse every
   * non-arbitrary `@media` condition into a single combined query
   * (`print:md:` → `@media print and (min-width: 768px)`). Nested min-widths
   * keep the largest, max-widths the smallest; the combined query sits where
   * the outermost media query was. Arbitrary (`[@media(...)]:`) queries are
   * never rewritten.
   */
  private mergeAtRules(accumulated: AtRuleCond[]): AtRuleCond[] {
    if (accumulated.length <= 1) return accumulated;
    const outerFirst = [...accumulated].reverse();
    if (this.options.combineMedia === false) return outerFirst;
    const mergeable = outerFirst.filter((a) => a.kind === 'media' && !a.raw);
    if (mergeable.length <= 1) return outerFirst;
    const types: string[] = [];
    const features: string[] = [];
    let minCond: AtRuleCond | undefined;
    let maxCond: AtRuleCond | undefined;
    for (const m of mergeable) {
      for (const part of m.params.split(/\s+and\s+/)) {
        const p = part.trim();
        if (/^(not\s+|only\s+)?(all|print|screen|speech)$/.test(p)) {
          if (!types.includes(p)) types.push(p);
        } else if (
          m.min !== undefined &&
          !Number.isNaN(m.min) &&
          /^\(min-width: [^)]+\)$/.test(p)
        ) {
          if (!minCond || m.min > (minCond.min as number)) minCond = m;
        } else if (
          m.max !== undefined &&
          !Number.isNaN(m.max) &&
          /^\(max-width: [^)]+\)$/.test(p)
        ) {
          if (!maxCond || m.max < (maxCond.max as number)) maxCond = m;
        } else if (!features.includes(p)) features.push(p);
      }
    }
    const parts = [
      ...types,
      ...(minCond ? [minCond.params] : []),
      ...(maxCond ? [maxCond.params] : []),
      ...features,
    ];
    const combined: AtRuleCond = {
      kind: 'media',
      params: parts.join(' and '),
      sort: Math.max(...mergeable.map((m) => m.sort)),
      min: minCond?.min,
      max: maxCond?.max,
    };
    const out: AtRuleCond[] = [];
    let placed = false;
    for (const a of outerFirst) {
      if (a.kind === 'media' && !a.raw) {
        if (!placed) {
          out.push(combined);
          placed = true;
        }
        continue;
      }
      out.push(a);
    }
    return out;
  }

  // ───────────────────────── variants ─────────────────────────

  private variantCache = new Map<string, VariantMatch | null>();

  resolveVariant(name: string): VariantMatch | null {
    const cached = this.variantCache.get(name);
    if (cached !== undefined) return cached;
    const result = this.resolveVariantUncached(name);
    this.variantCache.set(name, result);
    return result;
  }

  private variantAllowed(def: VariantDefinition): boolean {
    if (!this.options.variantEnabled(def.key)) return false;
    if (def.name !== def.key && !this.options.variantEnabled(def.name)) return false;
    if (
      (def.name.startsWith('group-') || def.name === 'group') &&
      !this.options.variantEnabled('group')
    )
      return false;
    if (
      (def.name.startsWith('peer-') || def.name === 'peer') &&
      !this.options.variantEnabled('peer')
    )
      return false;
    return true;
  }

  private resolveVariantUncached(name: string): VariantMatch | null {
    if (!name) return null;
    // arbitrary variant
    if (name.startsWith('[') && name.endsWith(']')) {
      if (!this.options.variantEnabled('arbitraryVariants')) return null;
      const inner = normalizeValue(name.slice(1, -1));
      if (inner.startsWith('@')) {
        const m = /^@([a-zA-Z-]+)\s*(.*)$/.exec(inner);
        if (!m) return null;
        const kindName = m[1];
        const params = m[2].trim();
        const kind: AtRuleCond['kind'] =
          kindName === 'media'
            ? 'media'
            : kindName === 'supports'
              ? 'supports'
              : kindName === 'container'
                ? 'container'
                : 'raw';
        const cond: AtRuleCond = {
          kind,
          params: kind === 'raw' ? `${kindName} ${params}` : params,
          sort: MEDIA_SORT.arbitrary,
          raw: true,
        };
        const mm = /^\((min|max)-width:\s*([^)]+)\)$/.exec(params);
        if (mm && kind === 'media') {
          const px = screenToPx(mm[2]);
          if (mm[1] === 'min') cond.min = px;
          else cond.max = px;
        }
        return {
          branches: [{ atrules: [cond] }],
          sort: 0,
          arbitrary: name,
          key: 'arbitraryVariants',
        };
      }
      if (!inner.includes('&')) return null;
      return {
        branches: [{ format: inner }],
        sort: 0,
        arbitrary: name,
        key: 'arbitraryVariants',
      };
    }
    // static
    const def = this.variants.get(name);
    if (def && def.branches && !def.functional) {
      if (!this.variantAllowed(def)) return null;
      return { branches: def.branches, sort: def.sort, key: def.key, fn: def.fn };
    }
    // functional: `<name>-<value>[/modifier]` or `<name>/<modifier>` (group/nav)
    for (const fv of this.functionalVariants) {
      let rest: string | null = null;
      if (fv.name === '@') {
        if (name.startsWith('@')) rest = name.slice(1);
      } else if (name === fv.name && !fv.functional) rest = '';
      else if (name.startsWith(`${fv.name}-`)) rest = name.slice(fv.name.length + 1);
      else if (name.startsWith(`${fv.name}/`)) rest = name.slice(fv.name.length);
      if (rest === null) continue;
      if (!this.variantAllowed(fv)) continue;
      const slashSplit = splitModifier(rest);
      const value = slashSplit.value;
      let modifier = slashSplit.modifier;
      if (modifier !== null && modifier.startsWith('[') && modifier.endsWith(']'))
        modifier = normalizeValue(modifier.slice(1, -1));
      const result = fv.match!(value, modifier, { theme: this.theme });
      if (!result) continue;
      const r = Array.isArray(result) ? { branches: result } : result;
      if (r.branches.length === 0) continue;
      return {
        branches: r.branches,
        sort: fv.sort + Math.min(r.slot ?? fv.slots ?? 0, fv.slots ?? 0),
        key: fv.key,
        functional: true,
        fn: r.fn,
      };
    }
    // plain `group`/`peer` with a name only: `group/nav:` is not a variant by itself
    return null;
  }

  // ───────────────────────── utilities ─────────────────────────

  private resolveUtility(base: string, negative: boolean): ResolvedUtility[] {
    const out: ResolvedUtility[] = [];
    // arbitrary property: [prop:value]
    if (base.startsWith('[') && base.endsWith(']') && !negative) {
      if (this.options.arbitraryProperties === false) return [];
      const inner = base.slice(1, -1);
      const idx = inner.indexOf(':');
      if (idx <= 0) return [];
      const prop = inner.slice(0, idx).trim();
      const value = normalizeValue(this.resolveThemeFn(inner.slice(idx + 1)), { property: prop });
      if (!/^(--[\w-]+|[a-zA-Z][\w-]*)$/.test(prop) || !value || !isValidArbitraryValue(value))
        return [];
      return [
        {
          decls: { [prop]: value },
          plugin: 'arbitraryProperties',
          sort: { plugin: 99999, utility: 0, value: 0, property: prop },
        },
      ];
    }

    // static exact match
    if (!negative) {
      for (const s of this.staticMap.get(base) ?? []) {
        if (!this.options.pluginEnabled(s.p)) continue;
        out.push({
          decls: Object.fromEntries(s.d),
          selector: s.s,
          siblings: s.sl,
          component: s.pc,
          plugin: s.p,
          defaults: s.df,
          atrules: s.at?.map(parseAtRule),
          sort: { plugin: this.pluginIndex.get(s.p) ?? 9999, utility: s.index, value: 0 },
        });
      }
      if (base === 'container' && this.options.pluginEnabled('container'))
        out.push(...this.containerRules());
    }
    // functional: DEFAULT (`border`, `shadow`, `rounded`)
    const tryPrefix = (prefix: string, modifier: string): void => {
      const list = this.functionalMap.get(prefix);
      if (!list) return;
      const matches: {
        u: FunctionalUtility & { index: number };
        r: ResolvedUtility[];
        types: DataType[];
        arbitrary: boolean;
      }[] = [];
      for (const u of list) {
        if (!this.options.pluginEnabled(u.plugin)) continue;
        const r = this.resolveFunctional(u, modifier, negative);
        if (r) matches.push({ u, r: r.rules, types: r.types, arbitrary: r.arbitrary });
      }
      if (matches.length === 0) return;
      const arbitrary = matches.filter((m) => m.arbitrary);
      if (arbitrary.length > 1) {
        // Tailwind ambiguity resolution
        const withoutAny = arbitrary.filter((m) => !m.types.includes('any'));
        const pick = (ms: typeof arbitrary): (typeof arbitrary)[number] | undefined => {
          if (ms.length === 1) return ms[0];
          return ms.find((m) => m.u.preferOnConflict);
        };
        const chosen = pick(withoutAny) ?? pick(arbitrary);
        if (!chosen) return; // ambiguous → emit nothing (Tailwind warns)
        out.push(...chosen.r);
        for (const m of matches) if (!m.arbitrary) out.push(...m.r);
        return;
      }
      for (const m of matches) out.push(...m.r);
    };
    tryPrefix(base, 'DEFAULT');
    for (const [prefix, modifier] of candidatePermutations(base)) tryPrefix(prefix, modifier);
    return out;
  }

  private resolveFunctional(
    u: FunctionalUtility & { index: number },
    modifier: string,
    negative: boolean,
  ): { rules: ResolvedUtility[]; types: DataType[]; arbitrary: boolean } | null {
    const sortBase = { plugin: this.pluginIndex.get(u.plugin) ?? 9999, utility: u.index };
    let lastArgs: [unknown, string | null] | null = null;
    const build = (value: unknown, ctx: { modifier: string | null; key: string }): Decls | null => {
      lastArgs = [value, ctx.modifier];
      return u.build(value, ctx);
    };
    const make = (
      decls: Decls | null,
      value: number,
      types: DataType[],
      arbitrary: boolean,
      animations?: string[],
    ) => {
      if (!decls) return null;
      const common = {
        plugin: u.plugin,
        defaults: u.defaults,
        sort: { ...sortBase, value },
        animations,
      };
      if (u.buildAll && lastArgs) {
        const shapes = u.buildAll(lastArgs[0], lastArgs[1]);
        if (!shapes || shapes.length === 0) return null;
        return {
          rules: shapes.map((sh) => ({
            ...common,
            decls: sh.decls,
            selector: sh.selector,
            atrules: sh.atrules?.map(parseAtRule),
          })),
          types,
          arbitrary,
        };
      }
      const selector =
        u.selectorFor && lastArgs
          ? (u.selectorFor(lastArgs[0], lastArgs[1]) ?? u.selector)
          : u.selector;
      return { rules: [{ ...common, decls, selector }], types, arbitrary };
    };
    const keys = Object.keys(u.values);

    // ── split `/modifier` when the utility supports one ──
    let valueKey = modifier;
    let mod: string | null = null;
    if (u.modifier) {
      const split = splitModifier(modifier);
      if (split.modifier !== null) {
        valueKey = split.value;
        mod = split.modifier;
      }
    }
    if (valueKey === '' && mod !== null) valueKey = 'DEFAULT';

    // ── direct theme value (full modifier first: `w-1/2`) ──
    const direct = (key: string): unknown =>
      Object.prototype.hasOwnProperty.call(u.values, key) ? u.values[key] : undefined;
    let themeValue = direct(modifier);
    let usedKey = modifier;
    if (themeValue === undefined && mod !== null) {
      themeValue = direct(valueKey);
      usedKey = valueKey;
    } else if (themeValue !== undefined) {
      mod = null; // the whole modifier was a key (e.g. `w-1/2`)
    }
    if (themeValue !== undefined) {
      const idx = keys.indexOf(usedKey) + 1;
      if (negative) {
        if (!u.negative) return null;
        const neg = this.negate(themeValue);
        if (neg === null) return null;
        return make(build(neg, { modifier: null, key: usedKey }), idx + 0.5, [], false);
      }
      const modValue = mod === null ? null : this.resolveModifier(u, mod);
      if (mod !== null && modValue === null) return null;
      if (u.modifier === 'color' && modValue !== null) {
        const color = String(
          typeof themeValue === 'function'
            ? (themeValue as (o: object) => unknown)({})
            : themeValue,
        );
        const withAlpha = withAlphaValue(color, modValue, '');
        if (withAlpha === '') return null;
        return make(
          build(withAlpha, { modifier: modValue, key: usedKey }),
          idx,
          [],
          false,
          undefined,
        );
      }
      const decls = build(themeValue, { modifier: modValue, key: usedKey });
      const animations =
        u.plugin === 'animation' && decls ? animationNames(decls.animation) : undefined;
      return make(decls, idx, [], false, animations);
    }

    // ── arbitrary value ──
    const arb = mod !== null ? valueKey : modifier;
    if (!(arb.startsWith('[') && arb.endsWith(']'))) return null;
    const raw = arb.slice(1, -1);
    if (!raw) return null;
    const { hint } = splitTypeHint(raw);
    const types: DataType[] = u.types.length ? u.types : ['any'];
    if (hint && !types.includes(hint as DataType)) return null;
    const coerced = coerceValue(
      this.resolveThemeFn(raw),
      types.filter((t) => t !== 'lookup'),
      {},
    );
    if (!coerced) return null;
    const value = coerced.value;
    if (!isValidArbitraryValue(value)) return null;
    if (negative) {
      if (!u.negative) return null;
      const neg = negateValue(value);
      if (neg === null) return null;
      return make(build(neg, { modifier: null, key: arb }), 1e6, types, true);
    }
    const modValue = mod === null ? null : this.resolveModifier(u, mod);
    if (mod !== null && modValue === null) return null;
    if (u.modifier === 'color' && modValue !== null) {
      const withAlpha = withAlphaValue(value, modValue, '');
      if (withAlpha === '') return null;
      return make(build(withAlpha, { modifier: modValue, key: arb }), 1e6, types, true);
    }
    const decls = build(value, { modifier: modValue, key: arb });
    const animations =
      u.plugin === 'animation' && decls ? animationNames(decls.animation) : undefined;
    return make(decls, 1e6, types, true, animations);
  }

  /** `/50` → `0.5` (opacity scale), `/[.3]` → `.3`; fontSize modifier → lineHeight */
  private resolveModifier(u: FunctionalUtility, mod: string): string | null {
    if (mod.startsWith('[') && mod.endsWith(']')) return normalizeValue(mod.slice(1, -1)) || null;
    if (u.modifier === 'lineHeight') {
      const lh = (this.theme.lineHeight as Record<string, string>)[mod];
      return lh === undefined ? null : String(lh);
    }
    if (u.modifier === 'any') return mod;
    if (u.modifier && typeof u.modifier === 'object') {
      const v = u.modifier[mod];
      return v === undefined ? null : String(v);
    }
    const op = (this.theme.opacity as Record<string, string>)[mod];
    return op === undefined ? null : String(op);
  }

  /** Replace `theme(path)` / `theme(path/alpha)` inside an arbitrary value. */
  resolveThemeFn(value: string): string {
    if (!value.includes('theme(')) return value;
    return value.replace(/theme\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g, (whole, inner: string) => {
      const path = inner.trim().replace(/^['"]|['"]$/g, '');
      const resolved = this.options.themeFn ? this.options.themeFn(path) : this.lookupTheme(path);
      return resolved === undefined ? whole : resolved;
    });
  }

  /** Resolve `colors.red.500`, `spacing[2.5]`, `colors.red.500/50%` against the theme. */
  lookupTheme(path: string): string | undefined {
    let alpha: string | undefined;
    const slash = path.lastIndexOf('/');
    if (slash !== -1 && !path.slice(slash).includes(']')) {
      alpha = path.slice(slash + 1).trim();
      path = path.slice(0, slash).trim();
    }
    const keys = splitThemePath(path);
    let cur: unknown = this.theme;
    for (const key of keys) {
      if (cur === null || typeof cur !== 'object') return undefined;
      cur = (cur as Record<string, unknown>)[key];
    }
    if (cur === undefined) return undefined;
    if (typeof cur === 'function') cur = (cur as (o: object) => unknown)({});
    if (Array.isArray(cur)) cur = keys[0] === 'fontSize' ? cur[0] : cur.join(', ');
    if (cur && typeof cur === 'object') {
      const d = (cur as Record<string, unknown>).DEFAULT;
      if (d === undefined) return undefined;
      cur = d;
    }
    const str = String(cur);
    return alpha !== undefined ? withAlphaValue(str, alpha) : str;
  }

  /** `.container` rules (width + per-screen max-width up to `theme.container.maxScreen`). */
  private containerRules(): ResolvedUtility[] {
    const container = (this.theme.container ?? {}) as {
      center?: boolean;
      padding?: string | Record<string, string>;
      screens?: Record<string, string>;
      minScreen?: string | false;
      maxScreen?: string | false;
    };
    const plugin = this.pluginIndex.get('container') ?? 1;
    const screens = container.screens
      ? Object.entries(container.screens).sort((a, b) => screenToPx(a[1]) - screenToPx(b[1]))
      : this.screens;
    // Nakshora policy: with the 10-step scale, `.container` only follows the
    // classic `sm`…`2xl` range unless `theme.container.{minScreen,maxScreen}`
    // (or an explicit `container.screens`) say otherwise.
    const minScreen =
      container.minScreen === undefined ? DEFAULT_CONTAINER_MIN_SCREEN : container.minScreen;
    const maxScreen =
      container.maxScreen === undefined ? DEFAULT_CONTAINER_MAX_SCREEN : container.maxScreen;
    const lower =
      minScreen === false || container.screens || this.theme.screens[minScreen] === undefined
        ? 0
        : screenToPx(this.theme.screens[minScreen]);
    const limit =
      maxScreen === false || container.screens || this.theme.screens[maxScreen] === undefined
        ? Infinity
        : screenToPx(this.theme.screens[maxScreen]);
    const paddingFor = (screen: string): Decls => {
      const p = container.padding;
      if (p === undefined) return {};
      if (typeof p === 'string')
        return screen === 'DEFAULT' ? { 'padding-right': p, 'padding-left': p } : {};
      const v = p[screen];
      return v === undefined ? {} : { 'padding-right': v, 'padding-left': v };
    };
    const rules: ResolvedUtility[] = [
      {
        decls: {
          width: '100%',
          ...(container.center ? { 'margin-right': 'auto', 'margin-left': 'auto' } : {}),
          ...paddingFor('DEFAULT'),
        },
        plugin: 'container',
        sort: { plugin, utility: 0, value: 0 },
      },
    ];
    let i = 1;
    for (const [name, value] of screens) {
      const px = screenToPx(value);
      if (Number.isNaN(px) || px <= 0) continue;
      if (px < lower || px > limit) continue;
      rules.push({
        decls: { 'max-width': value, ...paddingFor(name) },
        plugin: 'container',
        atrules: [minWidthCond(value)],
        sort: { plugin, utility: 0, value: i++ },
      });
    }
    return rules;
  }
}

// ───────────────────────────── helpers ─────────────────────────────

export interface ResolvedUtility {
  decls: Decls;
  selector?: string;
  /** extra selector-list parts without the class (see `StaticUtilityDef.sl`) */
  siblings?: string[];
  /** plugin component rule (see `StaticUtilityDef.pc`) */
  component?: boolean;
  plugin: string;
  defaults?: string;
  atrules?: AtRuleCond[];
  sort: UtilitySort;
  animations?: string[];
}

/** Weight of a rule's at-rule wrappers (0 for bare rules). */
export function atSortKey(rule: CompiledRule): number {
  if (rule.atrules.length === 0) return 0;
  return rule.atrules.reduce((acc, a) => acc + a.sort, 0);
}

/**
 * Variant weights, highest first. Named variants are numbers (their
 * registration bit); arbitrary variants are strings and sort after every
 * named one, alphabetically — Tailwind remaps arbitrary-variant bits to
 * `fastCompare` order above all reserved bits.
 */
function compareWeights(a: number | string, b: number | string): number {
  if (typeof a === 'number' && typeof b === 'number') return b - a;
  if (typeof a === 'number') return 1;
  if (typeof b === 'number') return -1;
  return b < a ? -1 : b > a ? 1 : 0;
}

/** Big-int-free `a.variants - b.variants`: compare the sorted weight lists lexicographically. */
function compareVariantMask(a: (number | string)[], b: (number | string)[]): number {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    const c = compareWeights(a[i], b[i]);
    if (c !== 0) return -c;
  }
  return a.length - b.length;
}

/**
 * Cascade order of compiled rules — a port of Tailwind's `Offsets.compare`:
 * layer (utilities before their variant rules; components first) →
 * value-aware hooks of a shared variant family, when the variants applied
 * *after* it are the same (screens by width, containers by size) → variant
 * mask (highest weight first) → parallel branch index → arbitrary properties
 * (after utilities, alphabetically) → registration order → candidate text. Shared by the
 * generator (utilities layer) and `@apply` (sibling rules), so both emit the
 * order Tailwind does.
 */
export function compareRules(a: CompiledRule, b: CompiledRule): number {
  if (a.sort.variant !== b.sort.variant) return a.sort.variant - b.sort.variant;
  if (a.sort.layer !== b.sort.layer) return a.sort.layer - b.sort.layer;
  if (a.sort.hooks && b.sort.hooks) {
    for (const ah of a.sort.hooks) {
      for (const bh of b.sort.hooks) {
        if (ah.id !== bh.id) continue;
        // Tailwind compares every same-family pair, which is only a
        // consistent comparator while one side carries a single hook of the
        // family. When both stack the same family twice (`lg:xl:` vs
        // `md:sm:`) its result is a sort artefact; Nakshora compares the
        // outermost hooks only so the order stays total and input-independent.
        if (
          a.sort.hooks.filter((h) => h.id === ah.id).length > 1 &&
          b.sort.hooks.filter((h) => h.id === bh.id).length > 1 &&
          (a.sort.hooks.find((h) => h.id === ah.id) !== ah ||
            b.sort.hooks.find((h) => h.id === bh.id) !== bh)
        )
          continue;
        const cut = Math.max(ah.bit, bh.bit);
        const after = (r: CompiledRule): (number | string)[] =>
          r.sort.variants.filter((w) => typeof w === 'string' || w > cut);
        if (compareVariantMask(after(a), after(b)) !== 0) continue;
        const c = ah.compare(
          { value: ah.value, modifier: ah.modifier },
          { value: bh.value, modifier: bh.modifier },
        );
        if (c !== 0) return c;
      }
    }
  }
  const mask = compareVariantMask(a.sort.variants, b.sort.variants);
  if (mask !== 0) return mask;
  if (a.sort.parallel !== b.sort.parallel) return a.sort.parallel - b.sort.parallel;
  const ap = a.sort.property !== undefined ? 1 : 0;
  const bp = b.sort.property !== undefined ? 1 : 0;
  if (ap !== bp) return ap - bp;
  if (ap && a.sort.property !== b.sort.property)
    return (a.sort.property as string) < (b.sort.property as string) ? -1 : 1;
  if (a.sort.plugin !== b.sort.plugin) return a.sort.plugin - b.sort.plugin;
  if (a.sort.utility !== b.sort.utility) return a.sort.utility - b.sort.utility;
  // Same utility (e.g. two `p-*` values): Tailwind generates candidates in
  // code-unit order (`p-12` < `p-2` < `p-4`, `hover:sm:x` < `sm:hover:x`) and
  // the stable sort keeps that order for equal offsets.
  if (a.candidate !== b.candidate) return a.candidate < b.candidate ? -1 : 1;
  return a.sort.seq - b.sort.seq;
}

/** Tailwind container-queries `sort`: by size, then labelled before unlabelled, labels alphabetically. */
function compareContainers(
  a: { value: unknown; modifier: string | null },
  b: { value: unknown; modifier: string | null },
): number {
  const av = parseFloat(String(a.value));
  const bv = parseFloat(String(b.value));
  if (Number.isNaN(av) || Number.isNaN(bv)) return 0;
  if (av - bv !== 0) return av - bv;
  const al = a.modifier ?? '';
  const bl = b.modifier ?? '';
  if (al === '' && bl !== '') return 1;
  if (al !== '' && bl === '') return -1;
  return al.localeCompare(bl, 'en', { numeric: true });
}

/**
 * Drop rules that are exact duplicates (same selector, at-rules and
 * declarations) of an earlier rule for the same candidate. A byte-identical
 * repeat has no cascade effect, so removing it is always safe; it happens when
 * a plugin re-registers something Nakshora ships natively (e.g. loading
 * `@tailwindcss/container-queries`).
 */
function dedupeRules(rules: CompiledRule[]): CompiledRule[] {
  if (rules.length < 2) return rules;
  const seen = new Set<string>();
  const out: CompiledRule[] = [];
  const atKey = (r: CompiledRule): string =>
    r.atrules.map((a) => `${a.kind} ${a.params}`).join('|');
  for (const r of rules) {
    const key = `${r.selector}\u0000${atKey(r)}\u0000${JSON.stringify(r.decls)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    // Tailwind's `collapseAdjacentRules`: adjacent rules with the same
    // selector and wrappers merge into one (plugin components emit these).
    const prev = out[out.length - 1];
    if (
      prev &&
      r.component &&
      prev.component &&
      prev.selector === r.selector &&
      atKey(prev) === atKey(r) &&
      prev.plugin === r.plugin &&
      !Object.keys(r.decls).some((k) => k in prev.decls)
    ) {
      prev.decls = { ...prev.decls, ...r.decls };
      continue;
    }
    out.push(r);
  }
  return out;
}

/**
 * Port of Tailwind's `removeAlphaVariables`: drop the `--tw-*-opacity`
 * declarations and the `/ var(--tw-*-opacity[, 1])` alpha slot that uses them.
 */
export function removeAlphaVariables(decls: Decls, toRemove: string[]): Decls {
  const out: Decls = {};
  for (const [prop, raw] of Object.entries(decls)) {
    if (toRemove.includes(prop)) continue;
    let value = raw;
    for (const name of toRemove) {
      if (value.includes(`/ var(${name})`)) value = value.replace(`/ var(${name})`, '');
      else if (value.includes(`/ var(${name}, 1)`)) value = value.replace(`/ var(${name}, 1)`, '');
    }
    out[prop] = value;
  }
  return out;
}

/** `@media (min-width: 640px)` → AtRuleCond */
export function parseAtRule(text: string): AtRuleCond {
  const m = /^@([\w-]+)\s*(.*)$/.exec(text.trim());
  const name = m ? m[1] : 'media';
  const params = m ? m[2].trim() : '';
  const kind: AtRuleCond['kind'] =
    name === 'media'
      ? 'media'
      : name === 'supports'
        ? 'supports'
        : name === 'container'
          ? 'container'
          : 'raw';
  return { kind, params: kind === 'raw' ? `${name} ${params}` : params, sort: 9000, raw: true };
}

function animationNames(value: string | undefined): string[] {
  if (!value) return [];
  return splitAtTopLevelOnly(value, ',')
    .map((part) => part.trim().split(/\s+/)[0])
    .filter(
      (n) =>
        n &&
        !/^(none|inherit|initial|unset|revert)$/.test(n) &&
        !/^\d/.test(n) &&
        !/^(infinite|linear|ease|normal|reverse|alternate|forwards|backwards|both|running|paused)$/.test(
          n,
        ),
    );
}

/** Tailwind's `candidatePermutations`: yields [prefix, modifier] pairs from the longest prefix down. */
export function* candidatePermutations(candidate: string): Generator<[string, string]> {
  let lastIndex = Infinity;
  while (lastIndex >= 0) {
    let dashIdx: number;
    let wasSlash = false;
    if (lastIndex === Infinity && candidate.endsWith(']')) {
      const bracketIdx = candidate.indexOf('[');
      if (candidate[bracketIdx - 1] === '-') dashIdx = bracketIdx - 1;
      else if (candidate[bracketIdx - 1] === '/') {
        dashIdx = bracketIdx - 1;
        wasSlash = true;
      } else dashIdx = -1;
    } else if (lastIndex === Infinity && candidate.includes('/')) {
      dashIdx = candidate.lastIndexOf('/');
      wasSlash = true;
    } else {
      dashIdx = candidate.lastIndexOf('-', lastIndex);
    }
    if (dashIdx < 0) break;
    const prefix = candidate.slice(0, dashIdx);
    const modifier = wasSlash ? candidate.slice(dashIdx) : candidate.slice(dashIdx + 1);
    lastIndex = dashIdx - 1;
    if (prefix === '' || modifier === '/') continue;
    yield [prefix, modifier];
  }
}

/** Split `value/modifier` at the last top-level slash (`text-[20px]/[30px]`, `red-500/50`). */
export function splitModifier(input: string): { value: string; modifier: string | null } {
  const slashIdx = input.lastIndexOf('/');
  if (slashIdx === -1) return { value: input, modifier: null };
  const arbitraryStart = input.lastIndexOf('[', slashIdx);
  const arbitraryEnd = input.indexOf(']', slashIdx);
  const nextToArbitrary = input[slashIdx - 1] === ']' || input[slashIdx + 1] === '[';
  if (!nextToArbitrary && arbitraryStart !== -1 && arbitraryEnd !== -1) {
    // the slash is inside brackets: `[calc(1/2)]` — look for a previous one
    const prev = input.lastIndexOf('/', arbitraryStart);
    if (prev === -1) return { value: input, modifier: null };
    return { value: input.slice(0, prev), modifier: input.slice(prev + 1) };
  }
  if (
    input.startsWith('[') &&
    input.endsWith(']') &&
    !input.includes(']/[') &&
    !input.includes(']/')
  ) {
    return { value: input, modifier: null };
  }
  return { value: input.slice(0, slashIdx), modifier: input.slice(slashIdx + 1) };
}

/** Balanced brackets/quotes, no `;` or braces at top level. */
export function isValidArbitraryValue(value: string): boolean {
  let depthParen = 0;
  let depthBracket = 0;
  let quote: string | null = null;
  for (let i = 0; i < value.length; i++) {
    const ch = value[i];
    if (quote) {
      if (ch === '\\') i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === '(') depthParen++;
    else if (ch === ')') {
      if (--depthParen < 0) return false;
    } else if (ch === '[') depthBracket++;
    else if (ch === ']') {
      if (--depthBracket < 0) return false;
    } else if (ch === ';' || ch === '{' || ch === '}') return false;
  }
  return depthParen === 0 && depthBracket === 0 && quote === null;
}

const MERGE_RE = /:merge\(((?:[^()]|\([^()]*\))*)\)/g;

/**
 * Apply a variant format (`&:hover`, `:merge(.group):hover &`) to the current
 * selector. Implements Tailwind's `:merge()` semantics: when the current
 * selector already contains the same `:merge(x)`, the format's attachments
 * (pseudos following the merge) are appended to the existing one and the
 * rest of the format collapses (`group-hover:group-focus:` → `.group:hover:focus`).
 */
export function applyFormat(current: string, format: string): string {
  const merges = [...current.matchAll(MERGE_RE)];
  if (merges.length) {
    let fmt = format;
    for (const m of [...format.matchAll(MERGE_RE)]) {
      const existing = merges.find((e) => e[1] === m[1]);
      if (!existing) continue;
      const after = format.slice((m.index ?? 0) + m[0].length);
      const attMatch = /^((?:[^\s>+~&])*)(\s*[>+~]?\s*)?/.exec(after);
      const attachments = attMatch?.[1] ?? '';
      const combinator = attMatch?.[2] ?? '';
      const insertAt = (existing.index ?? 0) + existing[0].length;
      current = current.slice(0, insertAt) + attachments + current.slice(insertAt);
      fmt = fmt.replace(m[0] + attachments + combinator, '');
    }
    format = fmt;
  }
  return format.replace(/&/g, current);
}

const PSEUDO_ELEMENT_PROPS: Record<string, string[]> = {
  '::after': ['terminal', 'jumpable'],
  '::backdrop': ['terminal', 'jumpable'],
  '::before': ['terminal', 'jumpable'],
  '::cue': ['terminal'],
  '::cue-region': ['terminal'],
  '::first-letter': ['terminal', 'jumpable'],
  '::first-line': ['terminal', 'jumpable'],
  '::grammar-error': ['terminal'],
  '::marker': ['terminal', 'jumpable'],
  '::part': ['terminal', 'actionable'],
  '::placeholder': ['terminal', 'jumpable'],
  '::selection': ['terminal', 'jumpable'],
  '::slotted': ['terminal'],
  '::spelling-error': ['terminal'],
  '::target-text': ['terminal'],
  '::file-selector-button': ['terminal', 'actionable'],
  '::deep': ['actionable'],
  '::v-deep': ['actionable'],
  '::ng-deep': ['actionable'],
  ':after': ['terminal', 'jumpable'],
  ':before': ['terminal', 'jumpable'],
  ':first-letter': ['terminal', 'jumpable'],
  ':first-line': ['terminal', 'jumpable'],
};
const DEFAULT_PSEUDO_PROPS = ['terminal', 'actionable'];

interface SelToken {
  text: string;
  kind: 'combinator' | 'pseudo' | 'other';
  /** pseudo name including colons, without args */
  name?: string;
}

/** Tokenise a single complex selector into compound pieces and combinators. */
function tokenizeSelector(sel: string): SelToken[] {
  const tokens: SelToken[] = [];
  let i = 0;
  const n = sel.length;
  const readBalanced = (open: string, close: string): string => {
    let depth = 0;
    let quote: string | null = null;
    const start = i;
    while (i < n) {
      const ch = sel[i];
      if (quote) {
        if (ch === '\\') i++;
        else if (ch === quote) quote = null;
      } else if (ch === '"' || ch === "'") quote = ch;
      else if (ch === open) depth++;
      else if (ch === close) {
        depth--;
        if (depth === 0) {
          i++;
          break;
        }
      }
      i++;
    }
    return sel.slice(start, i);
  };
  while (i < n) {
    const ch = sel[i];
    if (ch === ' ' || ch === '>' || ch === '~' || ch === '+') {
      let j = i;
      while (j < n && (sel[j] === ' ' || sel[j] === '>' || sel[j] === '~' || sel[j] === '+')) j++;
      tokens.push({ text: sel.slice(i, j), kind: 'combinator' });
      i = j;
      continue;
    }
    if (ch === ':') {
      let j = i + 1;
      if (sel[j] === ':') j++;
      while (j < n && /[\w-]/.test(sel[j])) j++;
      const name = sel.slice(i, j);
      i = j;
      let args = '';
      if (sel[i] === '(') args = readBalanced('(', ')');
      tokens.push({ text: name + args, kind: 'pseudo', name });
      continue;
    }
    if (ch === '[') {
      tokens.push({ text: readBalanced('[', ']'), kind: 'other' });
      continue;
    }
    // class / id / tag / universal / nesting — read until next delimiter
    let j = i;
    while (j < n) {
      const c = sel[j];
      if (c === '\\') {
        j += 2;
        continue;
      }
      if (c === ':' || c === '[' || c === ' ' || c === '>' || c === '~' || c === '+') break;
      if ((c === '.' || c === '#') && j > i) break;
      j++;
    }
    tokens.push({ text: sel.slice(i, j), kind: 'other' });
    i = j;
  }
  return tokens;
}

function pseudoProps(name: string): string[] {
  return PSEUDO_ELEMENT_PROPS[name] ?? DEFAULT_PSEUDO_PROPS;
}
function isPseudoElement(tok: SelToken): boolean {
  return (
    tok.kind === 'pseudo' &&
    ((tok.name as string).startsWith('::') ||
      PSEUDO_ELEMENT_PROPS[tok.name as string] !== undefined)
  );
}

/**
 * Finalise a selector: drop `:merge()` wrappers and move pseudo-elements to
 * the end of the selector (Tailwind `movePseudos` semantics):
 * `.x::before:hover` → `.x:hover::before`, `.x::before > *` → `.x > *::before`.
 */
export function finalizeSelector(selector: string): string {
  const out = selector.replace(/:merge\(((?:[^()]|\([^()]*\))*)\)/g, '$1');
  if (!out.includes(':')) return out;
  return splitAtTopLevelOnly(out, ',')
    .map((sel) => {
      const tokens = tokenizeSelector(sel.trim());
      let buffer: SelToken[] = [];
      let lastSeen: SelToken | null = null;
      const keep: SelToken[] = [];
      for (const tok of tokens) {
        if (tok.kind === 'combinator') {
          // non-jumpable pseudo-elements stay where they are
          const stay = buffer.filter((b) => !pseudoProps(b.name as string).includes('jumpable'));
          buffer = buffer.filter((b) => !stay.includes(b));
          for (const s of stay) keep.push(s);
          keep.push(tok);
          lastSeen = null;
          continue;
        }
        if (tok.kind === 'pseudo') {
          if (isPseudoElement(tok) && pseudoProps(tok.name as string).includes('terminal')) {
            lastSeen = tok;
            buffer.push(tok);
            continue;
          }
          if (lastSeen && pseudoProps(lastSeen.name as string).includes('actionable')) {
            buffer.push(tok);
            continue;
          }
          lastSeen = null;
        }
        keep.push(tok);
      }
      // Buffer entries attached to a non-jumpable element that never crossed a
      // combinator are still moved (they were terminal at the end).
      return [...keep, ...buffer]
        .map((t) => t.text)
        .join('')
        .trim();
    })
    .join(', ');
}

// ───────────────────────────── Nakshora static extras ─────────────────────────────

/** Static utilities Nakshora ships on top of Tailwind's set (all valid CSS). */
export const NAKSHORA_STATIC: StaticUtilityDef[] = [
  { p: 'animation', c: 'animation-paused', d: [['animation-play-state', 'paused']] },
  { p: 'animation', c: 'animation-running', d: [['animation-play-state', 'running']] },
  { p: 'whitespace', c: 'break-spaces', d: [['white-space', 'break-spaces']] },
  { p: 'fontStretch', c: 'font-stretch-normal', d: [['font-stretch', 'normal']] },
  { p: 'fontStretch', c: 'font-stretch-ultra-condensed', d: [['font-stretch', 'ultra-condensed']] },
  { p: 'fontStretch', c: 'font-stretch-extra-condensed', d: [['font-stretch', 'extra-condensed']] },
  { p: 'fontStretch', c: 'font-stretch-condensed', d: [['font-stretch', 'condensed']] },
  { p: 'fontStretch', c: 'font-stretch-semi-condensed', d: [['font-stretch', 'semi-condensed']] },
  { p: 'fontStretch', c: 'font-stretch-semi-expanded', d: [['font-stretch', 'semi-expanded']] },
  { p: 'fontStretch', c: 'font-stretch-expanded', d: [['font-stretch', 'expanded']] },
  { p: 'fontStretch', c: 'font-stretch-extra-expanded', d: [['font-stretch', 'extra-expanded']] },
  { p: 'fontStretch', c: 'font-stretch-ultra-expanded', d: [['font-stretch', 'ultra-expanded']] },
  { p: 'fieldSizing', c: 'field-sizing-content', d: [['field-sizing', 'content']] },
  { p: 'fieldSizing', c: 'field-sizing-fixed', d: [['field-sizing', 'fixed']] },
  { p: 'colorScheme', c: 'scheme-normal', d: [['color-scheme', 'normal']] },
  { p: 'colorScheme', c: 'scheme-dark', d: [['color-scheme', 'dark']] },
  { p: 'colorScheme', c: 'scheme-light', d: [['color-scheme', 'light']] },
  { p: 'colorScheme', c: 'scheme-light-dark', d: [['color-scheme', 'light dark']] },
  { p: 'colorScheme', c: 'scheme-only-dark', d: [['color-scheme', 'only dark']] },
  { p: 'colorScheme', c: 'scheme-only-light', d: [['color-scheme', 'only light']] },
];
