// Nakshora Core — TypeScript type definitions
// Every public type of the framework lives here.

/**
 * Color shade levels (50 = lightest, 950 = darkest)
 */
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

/**
 * Color names available in the default theme.
 * Custom color names are also supported through `ColorConfig`.
 */
export type ColorName =
  | 'slate'
  | 'gray'
  | 'zinc'
  | 'neutral'
  | 'stone'
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'emerald'
  | 'green'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose';

/**
 * Available breakpoint names in the default theme.
 * Custom breakpoint names are supported through `BreakpointConfig`.
 */
export type Breakpoint = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

/**
 * Breakpoint values (min-width). Numbers are pixels; strings are used as-is
 * (`'40rem'`). `null`/`0` removes a breakpoint. Merged with the 10 defaults
 * (xxs 200 · xs 400 · sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536 ·
 * 3xl 1920 · 4xl 2560 · 5xl 5000).
 */
export interface BreakpointConfig {
  xxs?: number | string | null;
  xs?: number | string | null;
  sm?: number | string | null;
  md?: number | string | null;
  lg?: number | string | null;
  xl?: number | string | null;
  '2xl'?: number | string | null;
  '3xl'?: number | string | null;
  '4xl'?: number | string | null;
  '5xl'?: number | string | null;
  [key: string]: number | string | null | undefined;
}

/**
 * Tailwind-style `screens`: replaces the whole breakpoint set (unlike
 * `breakpoints`, which merges). Object forms `{ min }`, `{ raw }` accepted.
 */
export type ScreensConfig = Record<
  string,
  string | number | { min?: string; max?: string; raw?: string } | null
>;

/**
 * `.container` behaviour.
 */
export interface ContainerConfig {
  /** add `margin-left/right: auto` */
  center?: boolean;
  /** horizontal padding, per breakpoint when an object */
  padding?: string | Record<string, string>;
  /** explicit max-width map (overrides `theme.screens`) */
  screens?: Record<string, string>;
  /** first breakpoint that contributes a `max-width` (default `sm`; `false` = all) */
  minScreen?: string | false;
  /** last breakpoint that contributes a `max-width` (default `2xl`; `false` = all) */
  maxScreen?: string | false;
}

/**
 * A single color palette: shade → CSS color value.
 */
export type ColorScale = {
  [key in ColorShade]?: string;
} & {
  [key: string]: string | undefined;
};

/**
 * Color configuration: palette name → color scale.
 */
export interface ColorConfig {
  [key: string]: ColorScale | string;
}

/**
 * Spacing scale configuration: key → CSS length value.
 */
export interface SpacingConfig {
  [key: string]: string;
}

/**
 * Typography configuration.
 */
export interface TypographyConfig {
  /** font-size → optional line-height pairs */
  fontSize: Record<string, string | [string, string]>;
  fontWeight: Record<string, number | string>;
  lineHeight: Record<string, string>;
  letterSpacing: Record<string, string>;
}

/**
 * Shadow configuration.
 */
export type ShadowConfig = Record<string, string>;

/**
 * Border radius configuration.
 */
export type BorderRadiusConfig = Record<string, string>;

/**
 * Z-index configuration.
 */
export type ZIndexConfig = Record<string, number | string>;

/**
 * Opacity configuration.
 */
export type OpacityConfig = Record<string, number | string>;

/**
 * Transition duration configuration.
 */
export type DurationConfig = Record<string, string>;

/**
 * Easing configuration.
 */
export type EasingConfig = Record<string, string>;

/**
 * Animation configuration: animation name → shorthand value.
 */
export type AnimationConfig = Record<string, string>;

/**
 * Keyframe configuration: keyframe name → CSS keyframe body (string) or
 * Tailwind-style object `{ from: { opacity: '0' }, to: { opacity: '1' } }`.
 */
export type KeyframeConfig = Record<string, string | Record<string, Record<string, string>>>;

/**
 * Font family configuration (string or array of family names).
 */
export type FontFamilyConfig = Record<string, string | string[]>;

/** A theme scale: key → value (functions are resolved with `{ theme }`). */
export type ThemeScale = Record<string, unknown>;

/**
 * Theme section names understood by the engine. These are the Tailwind v3
 * keys; the Nakshora 3.0 aliases (`breakpoints`, `shadows`, `duration`,
 * `easing`, `typography`) are still accepted and mapped onto them.
 */
export interface TailwindThemeKeys {
  screens?: ScreensConfig;
  container?: ContainerConfig;
  containers?: Record<string, string>;
  supports?: Record<string, string>;
  data?: Record<string, string>;
  aria?: Record<string, string>;
  fontSize?: Record<
    string,
    | string
    | [string, string]
    | [string, { lineHeight?: string; letterSpacing?: string; fontWeight?: string | number }]
  >;
  fontWeight?: Record<string, string | number>;
  lineHeight?: Record<string, string>;
  letterSpacing?: Record<string, string>;
  boxShadow?: ShadowConfig;
  transitionDuration?: DurationConfig;
  transitionTimingFunction?: EasingConfig;
  transitionProperty?: Record<string, string>;
  transitionDelay?: Record<string, string>;
  [scale: string]: unknown;
}

/**
 * Complete theme configuration. Every section is optional —
 * missing sections fall back to the defaults (Tailwind v3.4 scales plus
 * Nakshora extras). Use `extend` to add to a scale instead of replacing it.
 */
export interface ThemeConfig extends TailwindThemeKeys {
  colors?: ColorConfig;
  spacing?: SpacingConfig;
  /** Nakshora alias for `fontSize`/`fontWeight`/`lineHeight`/`letterSpacing` */
  typography?: Partial<TypographyConfig>;
  fontFamily?: FontFamilyConfig;
  /** Merged into the default 10-step scale (Tailwind `screens` replaces it) */
  breakpoints?: BreakpointConfig;
  /** alias for `boxShadow` */
  shadows?: ShadowConfig;
  borderRadius?: BorderRadiusConfig;
  zIndex?: ZIndexConfig;
  opacity?: OpacityConfig;
  /** alias for `transitionDuration` */
  duration?: DurationConfig;
  /** alias for `transitionTimingFunction` */
  easing?: EasingConfig;
  animation?: AnimationConfig;
  keyframes?: KeyframeConfig;
  /** Tailwind `extend`: deep-merged over every scale */
  extend?: Partial<Omit<ThemeConfig, 'extend'>>;
}

/**
 * State-variant configuration. Every flag defaults to `true`.
 * Disable variants you never use to shrink your full build.
 */
export interface VariantsConfig {
  hover?: boolean;
  focus?: boolean;
  focusVisible?: boolean;
  focusWithin?: boolean;
  active?: boolean;
  visited?: boolean;
  disabled?: boolean;
  firstChild?: boolean;
  lastChild?: boolean;
  group?: boolean;
  groupHover?: boolean;
  groupFocus?: boolean;
  peer?: boolean;
  peerHover?: boolean;
  peerFocus?: boolean;
  dark?: boolean;
  /** `sm:` … `5xl:` and `min-[…]:` */
  responsive?: boolean;
  /** `max-sm:` … `max-5xl:` and `max-[…]:` */
  maxResponsive?: boolean;
  /** `@md:` / `@[400px]:` container queries */
  containerQueries?: boolean;
  /** `[&>*]:` / `[@media(…)]:` arbitrary variants */
  arbitraryVariants?: boolean;
  /** any other variant name (`print`, `aria`, `has`, `before`, …) */
  [variant: string]: boolean | undefined;
}

/**
 * Dark-mode strategy (Tailwind-compatible).
 * - `'class'` (default): `.dark` ancestor → `:is(.dark *)`
 * - `'media'`: `@media (prefers-color-scheme: dark)`
 * - `'selector'`: `:where(.dark, .dark *)`
 * - `['class' | 'selector', '.theme-dark']`: custom selector
 * - `['variant', '&:where(.dark, .dark *)']`: raw selector format(s)
 */
export type DarkMode =
  | 'class'
  | 'media'
  | 'selector'
  | ['class', string]
  | ['selector', string]
  | ['variant', string | string[]]
  | false;

/**
 * CSS declarations object (property → value).
 */
export interface CSSProperties {
  [key: string]: string | number | undefined;
}

/**
 * A single generated utility rule.
 */
export interface UtilityRule {
  /** Class name without the leading dot, e.g. `mt-4` */
  class: string;
  /** Utility category, e.g. `spacing` (used for docs & AI export) */
  category: string;
  /** `corePlugins` group key that controls this utility */
  group: string;
  /** CSS declarations for the rule */
  decls: CSSProperties;
  /** Human-readable description (docs / AI training) */
  description?: string;
  /** Whether state variants (hover:, focus:, …) are supported */
  variantable?: boolean;
  /** Whether responsive prefixes (sm:, md:, …) are supported */
  responsive?: boolean;
}

/**
 * A Nakshora plugin (object form).
 */
export interface Plugin {
  name?: string;
  /** Mutate the configuration before generation (Nakshora 3.0 form) or a Tailwind `config` object */
  config?: ((config: NakshoraConfig) => void) | Record<string, unknown>;
  /** Contribute utilities / components / base styles / variants */
  handler?: (api: UtilityGenerator) => void;
}

/**
 * An unmodified Tailwind plugin: `plugin(fn, config)` objects and
 * `@tailwindcss/forms()` & co. Tailwind's `PluginAPI` uses generic callbacks
 * (`matchUtilities<T, U>`) that are not structurally assignable to ours, so
 * the handler is typed as the bare `Function` interface: every callable is
 * assignable to it, and — because `Function` has no call signature — it does
 * not disturb the contextual typing of plain `{ handler: (api) => … }`
 * Nakshora plugins (`api` stays `UtilityGenerator`). `normalizePlugin`
 * validates the shape at runtime.
 */
export interface TailwindPluginLike {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  handler: Function;
  config?: unknown;
}

/** A `plugin.withOptions(…)` result used without calling it (`plugins: [typography]`). */
export interface TailwindOptionsPluginLike {
  __isOptionsFunction: true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (options?: any): TailwindPluginLike;
}

/** Anything accepted in `plugins: […]`. */
export type PluginInput =
  Plugin | ((api: UtilityGenerator) => void) | TailwindPluginLike | TailwindOptionsPluginLike;

/**
 * Plugin API handed to plugins — a superset of Tailwind's.
 */
export interface UtilityGenerator {
  addUtilities(
    utilities: Record<string, unknown> | Record<string, unknown>[],
    options?: unknown,
  ): void;
  matchUtilities(
    utilities: Record<
      string,
      (
        value: unknown,
        extra: { modifier: string | null },
      ) => Record<string, unknown> | Record<string, unknown>[] | null | undefined
    >,
    options?: unknown,
  ): void;
  addComponents(
    components: Record<string, unknown> | Record<string, unknown>[],
    options?: unknown,
  ): void;
  matchComponents(
    components: Record<
      string,
      (
        value: unknown,
        extra: { modifier: string | null },
      ) => Record<string, unknown> | Record<string, unknown>[] | null | undefined
    >,
    options?: unknown,
  ): void;
  addBase(base: Record<string, unknown> | Record<string, unknown>[]): void;
  addVariant(
    name: string,
    definition: string | string[] | ((api: { separator?: string }) => string | string[] | void),
  ): void;
  matchVariant(
    name: string,
    fn: (value: string, extra: { modifier: string | null }) => string | string[],
    options?: { values?: Record<string, string> },
  ): void;
  theme(path?: string, defaultValue?: unknown): unknown;
  config(path?: string, defaultValue?: unknown): unknown;
  corePlugins(name: string): boolean;
  e(className: string): string;
  prefix(selector: string): string;
}

/**
 * Main Nakshora configuration object.
 */
export interface NakshoraConfig {
  /** Theme overrides (deep-merged with defaults) */
  theme?: Partial<ThemeConfig>;
  /** Variant toggles (all default to true) */
  variants?: VariantsConfig;
  /** Dark-mode strategy (default `'class'`) */
  darkMode?: DarkMode;
  /** Theme presets applied before `theme` (Tailwind `presets`) */
  presets?: Array<Partial<NakshoraConfig> | PresetConfig>;
  /** Class prefix, e.g. `'nk-'` (Tailwind `prefix`) */
  prefix?: string;
  /** Emit real `@layer base/components/utilities` blocks (opt-in) */
  layers?: boolean;
  /**
   * Collapse stacked media variants into one query
   * (`print:md:flex` → `@media print and (min-width: 768px)`; default true).
   * `false` nests them like Tailwind (`@media print { @media (min-width: 768px) { … } }`).
   */
  combineMedia?: boolean;
  /** Include the preflight reset in `base` (default true) */
  preflight?: boolean;
  /**
   * JIT content sources. Accepts raw file contents or glob patterns.
   * When set, only the utilities found in the content are generated.
   */
  content?: string | string[];
  /**
   * Legacy alias for `content` (Tailwind-compatible).
   * `content` wins when both are set.
   */
  purge?: string[];
  /** Classes always included, even in JIT mode (may include variants) */
  safelist?: string[];
  /** Plugin list */
  plugins?: PluginInput[];
  /**
   * `true` → every declaration is marked `!important`.
   * `'#app'` → every rule is scoped under the given selector.
   */
  important?: boolean | string;
  /** Toggle individual utility groups on/off (`{ preflight: false }`) or an allow-list array */
  corePlugins?: Record<string, boolean> | string[];
  /** Custom class-extractor regex (JIT mode) */
  extractorPattern?: string;
  /** Classes never emitted (JIT mode) */
  blocklist?: string[];
}

/**
 * Theme preset identifier (built-in presets)
 */
export type PresetName = 'neon' | 'pastel' | 'brutalist' | 'minimalist' | 'nature';

/**
 * A built-in theme preset.
 */
export interface PresetConfig {
  name: PresetName;
  description: string;
  colors: ColorConfig;
  typography: Partial<TypographyConfig>;
  shadows?: ShadowConfig;
  borderRadius?: BorderRadiusConfig;
  animation?: AnimationConfig;
  keyframes?: KeyframeConfig;
}

/**
 * Generation options for `CSSGenerator.generate()`.
 */
export interface GenerationOptions {
  /** Minify the output CSS */
  minify?: boolean;
  /**
   * `full` (default) → base + all utilities + responsive variants.
   * `jit` → only the utilities found in `content` (state variants too).
   */
  mode?: 'full' | 'jit';
  /** Raw content for JIT mode (string or string array) */
  content?: string | string[];
  /**
   * Full mode only: which breakpoints get responsive variants.
   * `'core'` (default) = `sm md lg xl 2xl`; `'all'` = every configured screen;
   * or an explicit list of names. JIT mode always supports every screen.
   */
  screens?: 'all' | 'core' | string[];
  /**
   * Source maps are provided by your bundler (Vite, PostCSS, webpack).
   * Kept for API compatibility — has no effect.
   */
  sourceMap?: boolean;
}

/**
 * Build options used by the CLI.
 */
export interface BuildOptions {
  input: string;
  output: string;
  minify?: boolean;
  watch?: boolean;
  mode?: 'full' | 'jit';
}

/**
 * Statistics about a generated stylesheet.
 */
export interface GenerationStats {
  /** utilities in the catalog (value-bearing classes without variants) */
  utilities: number;
  /** rules wrapped in a responsive `@media` */
  responsiveRules: number;
  /** rules carrying at least one variant */
  variantRules: number;
  totalRules: number;
  sizeBytes: number;
  minifiedSizeBytes: number;
}
