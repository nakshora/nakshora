/**
 * Color shade levels (50 = lightest, 950 = darkest)
 */
type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;
/**
 * Color names available in the default theme.
 * Custom color names are also supported through `ColorConfig`.
 */
type ColorName = 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone' | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'emerald' | 'green' | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose';
/**
 * Available breakpoint names in the default theme.
 * Custom breakpoint names are supported through `BreakpointConfig`.
 */
type Breakpoint = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
/**
 * Breakpoint values (min-width). Numbers are pixels; strings are used as-is
 * (`'40rem'`). `null`/`0` removes a breakpoint. Merged with the 10 defaults
 * (xxs 200 · xs 400 · sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536 ·
 * 3xl 1920 · 4xl 2560 · 5xl 5000).
 */
interface BreakpointConfig {
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
type ScreensConfig = Record<string, string | number | {
    min?: string;
    max?: string;
    raw?: string;
} | null>;
/**
 * `.container` behaviour.
 */
interface ContainerConfig {
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
type ColorScale = {
    [key in ColorShade]?: string;
} & {
    [key: string]: string | undefined;
};
/**
 * Color configuration: palette name → color scale.
 */
interface ColorConfig {
    [key: string]: ColorScale | string;
}
/**
 * Spacing scale configuration: key → CSS length value.
 */
interface SpacingConfig {
    [key: string]: string;
}
/**
 * Typography configuration.
 */
interface TypographyConfig {
    /** font-size → optional line-height pairs */
    fontSize: Record<string, string | [string, string]>;
    fontWeight: Record<string, number | string>;
    lineHeight: Record<string, string>;
    letterSpacing: Record<string, string>;
}
/**
 * Shadow configuration.
 */
type ShadowConfig = Record<string, string>;
/**
 * Border radius configuration.
 */
type BorderRadiusConfig = Record<string, string>;
/**
 * Z-index configuration.
 */
type ZIndexConfig = Record<string, number | string>;
/**
 * Opacity configuration.
 */
type OpacityConfig = Record<string, number | string>;
/**
 * Transition duration configuration.
 */
type DurationConfig = Record<string, string>;
/**
 * Easing configuration.
 */
type EasingConfig = Record<string, string>;
/**
 * Animation configuration: animation name → shorthand value.
 */
type AnimationConfig = Record<string, string>;
/**
 * Keyframe configuration: keyframe name → CSS keyframe body (string) or
 * Tailwind-style object `{ from: { opacity: '0' }, to: { opacity: '1' } }`.
 */
type KeyframeConfig = Record<string, string | Record<string, Record<string, string>>>;
/**
 * Font family configuration (string or array of family names).
 */
type FontFamilyConfig = Record<string, string | string[]>;
/** A theme scale: key → value (functions are resolved with `{ theme }`). */
type ThemeScale = Record<string, unknown>;
/**
 * Theme section names understood by the engine. These are the Tailwind v3
 * keys; the Nakshora 3.0 aliases (`breakpoints`, `shadows`, `duration`,
 * `easing`, `typography`) are still accepted and mapped onto them.
 */
interface TailwindThemeKeys {
    screens?: ScreensConfig;
    container?: ContainerConfig;
    containers?: Record<string, string>;
    supports?: Record<string, string>;
    data?: Record<string, string>;
    aria?: Record<string, string>;
    fontSize?: Record<string, string | [string, string] | [string, {
        lineHeight?: string;
        letterSpacing?: string;
        fontWeight?: string | number;
    }]>;
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
interface ThemeConfig extends TailwindThemeKeys {
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
interface VariantsConfig {
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
type DarkMode = 'class' | 'media' | 'selector' | ['class', string] | ['selector', string] | ['variant', string | string[]] | false;
/**
 * CSS declarations object (property → value).
 */
interface CSSProperties {
    [key: string]: string | number | undefined;
}
/**
 * A single generated utility rule.
 */
interface UtilityRule {
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
interface Plugin {
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
interface TailwindPluginLike {
    handler: Function;
    config?: unknown;
}
/** A `plugin.withOptions(…)` result used without calling it (`plugins: [typography]`). */
interface TailwindOptionsPluginLike {
    __isOptionsFunction: true;
    (options?: any): TailwindPluginLike;
}
/** Anything accepted in `plugins: […]`. */
type PluginInput = Plugin | ((api: UtilityGenerator) => void) | TailwindPluginLike | TailwindOptionsPluginLike;
/**
 * Plugin API handed to plugins — a superset of Tailwind's.
 */
interface UtilityGenerator {
    addUtilities(utilities: Record<string, unknown> | Record<string, unknown>[], options?: unknown): void;
    matchUtilities(utilities: Record<string, (value: unknown, extra: {
        modifier: string | null;
    }) => Record<string, unknown> | Record<string, unknown>[] | null | undefined>, options?: unknown): void;
    addComponents(components: Record<string, unknown> | Record<string, unknown>[], options?: unknown): void;
    matchComponents(components: Record<string, (value: unknown, extra: {
        modifier: string | null;
    }) => Record<string, unknown> | Record<string, unknown>[] | null | undefined>, options?: unknown): void;
    addBase(base: Record<string, unknown> | Record<string, unknown>[]): void;
    addVariant(name: string, definition: string | string[] | ((api: {
        separator?: string;
    }) => string | string[] | void)): void;
    matchVariant(name: string, fn: (value: string, extra: {
        modifier: string | null;
    }) => string | string[], options?: {
        values?: Record<string, string>;
    }): void;
    theme(path?: string, defaultValue?: unknown): unknown;
    config(path?: string, defaultValue?: unknown): unknown;
    corePlugins(name: string): boolean;
    e(className: string): string;
    prefix(selector: string): string;
}
/**
 * Main Nakshora configuration object.
 */
interface NakshoraConfig {
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
type PresetName = 'neon' | 'pastel' | 'brutalist' | 'minimalist' | 'nature';
/**
 * A built-in theme preset.
 */
interface PresetConfig {
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
interface GenerationOptions {
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
interface BuildOptions {
    input: string;
    output: string;
    minify?: boolean;
    watch?: boolean;
    mode?: 'full' | 'jit';
}
/**
 * Statistics about a generated stylesheet.
 */
interface GenerationStats {
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

/**
 * Escape a class name for use in a CSS selector.
 * `hover:bg-blue-500` → `hover\:bg-blue-500`
 */
declare function escapeClass(className: string): string;
/**
 * Convert a CSSProperties object into a declaration block body,
 * e.g. `{ margin: '1rem' }` → `margin: 1rem`.
 * Respects `important` by appending `!important` to each value.
 */
declare function stringifyDecls(decls: CSSProperties, important?: boolean): string;
/**
 * Convert a class name + suffix into a full CSS selector,
 * e.g. `('hover:bg-blue-500', ':hover')` → `.hover\:bg-blue-500:hover`
 */
declare function classToSelector(className: string, suffix?: string, ancestor?: string): string;
/**
 * Extract candidate class tokens from HTML/JSX/template content.
 * Uses the Tailwind-compatible extractor (arbitrary values, variants,
 * modifiers) and unescapes HTML-escaped variant syntax (`hover\:bg-blue-500`).
 */
declare function extractClasses(content: string[], pattern?: string): Set<string>;
/**
 * Split a (possibly variant-prefixed) class into its parts:
 * `sm:hover:bg-blue-500` → { prefixes: ['sm','hover'], base: 'bg-blue-500' }
 */
declare function splitClass(token: string): {
    prefixes: string[];
    base: string;
};
/**
 * CSS minifier. Parses the stylesheet and re-serialises it without
 * whitespace or comments — strings, `url()` contents and custom-property
 * values are never touched (a regex minifier broke `content: 'a b'`).
 */
declare function minifyCss(css: string): string;
/**
 * Byte length of a string (UTF-8).
 */
declare function byteLength(str: string): number;
/**
 * Format a byte count for humans (12.3 KB)
 */
declare function formatBytes(bytes: number): string;

type Scale = Record<string, unknown>;
type ResolvedTheme = Record<string, Scale> & {
    colors: Record<string, string | Record<string, string>>;
    spacing: Record<string, string>;
    screens: Record<string, string>;
};
/**
 * The 10-step breakpoint scale (200px → 5000px). `sm`–`2xl` are the exact
 * Tailwind values; `xxs`/`xs` cover folded/tiny screens and `3xl`–`5xl`
 * Full HD, QHD and 4K+/video-wall canvases.
 */
declare const DEFAULT_SCREENS: Record<string, string>;
/** Human-readable device guide for each breakpoint (docs + AI corpus). */
declare const SCREEN_GUIDE: Record<string, string>;
interface ResolveThemeOptions {
    /** Extra default scales contributed by plugins (`plugin.config.theme`). */
    pluginTheme?: Record<string, unknown>[];
}
/**
 * Resolve the final theme: Tailwind defaults ⊕ Nakshora extras ⊕ plugin
 * theme ⊕ user `theme` (deep-merged) ⊕ user `theme.extend` (deep-merged).
 * Function values (`({ theme }) => …`) are resolved lazily against the
 * merged theme, exactly like Tailwind.
 */
declare function resolveTheme(userTheme?: Partial<ThemeConfig> | undefined, options?: ResolveThemeOptions): ResolvedTheme;
/**
 * Split `colors.blue.500` / `spacing[1.5]` / `colors[blue][500]` into keys,
 * treating quoted or bracketed segments as literal keys (`spacing[2.5]`).
 */
declare function splitPath(path: string): string[];
/** Numeric breakpoint in px (`'640px'` → 640, `'40rem'` → 640). Returns NaN for raw queries. */
declare function screenToPx(value: string): number;

interface StaticUtilityDef {
    /** core plugin name (used by corePlugins toggles) */
    p: string;
    /** class name */
    c: string;
    /** selector suffix relative to the class (e.g. ` > :not([hidden]) ~ :not([hidden])`) */
    s?: string;
    /** declarations */
    d: [string, string][];
    /** --tw-* defaults group required by this utility */
    df?: string;
    /** at-rule wrappers (plugin utilities only), e.g. `@media (min-width: 640px)` */
    at?: string[];
    /**
     * Full selector list for plugin components that share one rule between
     * several classes (`.form-input, .form-textarea { … }`): every part in
     * order, with `&` standing for the parts that contain this class. Used
     * verbatim when the class is used without variants; with a variant only the
     * `&` parts survive — Tailwind's `eliminateIrrelevantSelectors`.
     */
    sl?: string[];
    /** plugin component rule (adjacent duplicates collapse like Tailwind's `collapseAdjacentRules`) */
    pc?: true;
}

/**
 * Escape a class name for use in a selector (CSS.escape semantics).
 * `2xl:flex` → `\32xl\:flex`, `w-1/2` → `w-1\/2`, `bg-[#fff]` → `bg-\[\#fff\]`.
 */
declare function escapeClassName(className: string): string;
/**
 * Normalise an arbitrary value: `--x` → `var(--x)`, `_` → space (except `\_`),
 * math operator spacing, `url()` left untouched.
 */
declare function normalizeValue(value: string, context?: {
    property?: string;
}, isRoot?: boolean): string;
type DataType = 'any' | 'color' | 'url' | 'image' | 'length' | 'percentage' | 'position' | 'lookup' | 'generic-name' | 'family-name' | 'number' | 'line-width' | 'absolute-size' | 'relative-size' | 'shadow' | 'size' | 'bg-size' | 'angle' | 'time' | 'integer';
/**
 * Coerce an arbitrary value against a list of accepted types. Returns the
 * matched type and the normalised value, or null when nothing matches.
 * An explicit hint (`[length:…]`) short-circuits inference.
 */
declare function coerceValue(raw: string, types: DataType[], context?: {
    property?: string;
}): {
    type: DataType;
    value: string;
} | null;

type Decls = Record<string, string>;
/** One rule produced by `FunctionalUtility.buildAll`. */
interface FunctionalRuleShape {
    /** selector suffix (` > *`, `:hover`) or a template containing `&`; undefined = the class itself */
    selector?: string;
    decls: Decls;
    /** wrapping at-rules, e.g. `@media (min-width: 640px)` */
    atrules?: string[];
}
interface FunctionalUtility {
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
    /** `/modifier` semantics: colour alpha, fontSize line-height, any string, or a lookup map */
    modifier?: 'color' | 'lineHeight' | 'any' | Record<string, string>;
    /** selector suffix, e.g. ` > :not([hidden]) ~ :not([hidden])` */
    selector?: string;
    /** dynamic selector suffix (plugin `matchUtilities` returning `{ '&:hover': … }`) */
    selectorFor?: (value: unknown, modifier: string | null) => string | undefined;
    /** `--tw-*` defaults group needed by this utility */
    defaults?: string;
    /** produce declarations; return null to reject the value */
    build: (value: unknown, ctx: {
        modifier: string | null;
        key: string;
    }) => Decls | null;
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

interface AtRuleCond {
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
interface VariantBranch {
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
interface VariantSortHook {
    /** family id — rules are compared only against hooks of the same family */
    id: string;
    value: unknown;
    modifier: string | null;
    compare: (a: {
        value: unknown;
        modifier: string | null;
    }, b: {
        value: unknown;
        modifier: string | null;
    }) => number;
}
/** What a functional variant's `match` may return. */
type VariantMatchResult = VariantBranch[] | {
    branches: VariantBranch[];
    /** index of the themed value (`aria-busy` → 0 …); arbitrary values use the last slot */
    slot?: number;
    fn?: VariantSortHook;
};
interface VariantMatch {
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
interface CompiledRule {
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
interface UtilitySort {
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
interface RuleSort extends UtilitySort {
    /** 0 when the rule has no variant, 1 otherwise */
    variant: number;
    /** 0 = components layer (plugin components, `.container`), 1 = utilities */
    layer: number;
    /** variant weights, highest first; strings are arbitrary variants (after every named one) */
    variants: (number | string)[];
    /** value-aware hooks with the weight of the variant that carries them */
    hooks?: (VariantSortHook & {
        bit: number;
    })[];
    /** highest parallel-branch index of functional variants */
    parallel: number;
    /** insertion order for stability */
    seq: number;
}
interface CatalogEntry {
    /** class name (without variants) */
    class: string;
    plugin: string;
    decls: Decls;
    selector?: string;
    defaults?: string;
    description: string;
    sort: UtilitySort;
}
interface VariantDefinition {
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
    match?: (value: string, modifier: string | null, ctx: VariantContext) => VariantMatchResult | null;
    /** Requires a value (`group-hover`, `aria-[…]`) */
    functional?: boolean;
    /** number of themed values (each reserves its own weight before the arbitrary slot) */
    slots?: number;
    /** value-aware ordering hook of a static variant (screens) */
    fn?: VariantSortHook;
    description: string;
}
interface VariantContext {
    theme: ResolvedTheme;
}
/** Test/benchmark hook: drop memoised catalogs. */
declare function clearCatalogCache(): void;
interface EngineOptions {
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
type DarkModeConfig = 'class' | 'media' | 'selector' | ['class', string] | ['selector', string] | ['variant', string | string[]] | false;
/** `768px` → `767.98px` (max-width form) */
declare function maxWidthValue(minValue: string): string;
declare class Engine {
    readonly theme: ResolvedTheme;
    readonly options: EngineOptions;
    /** static class → defs (later wins for duplicates) */
    /**
     * class → every static rule registered for it. Core classes map to one rule;
     * plugin components (e.g. typography's `.prose`) register dozens of rules
     * for the same class (different selector suffixes / at-rules), all of which
     * must be emitted.
     */
    private readonly staticMap;
    /** prefix → functional utilities */
    private readonly functionalMap;
    private readonly functional;
    private readonly statics;
    private readonly variants;
    private readonly functionalVariants;
    private readonly pluginIndex;
    private readonly screens;
    private readonly cache;
    private seq;
    constructor(options: EngineOptions);
    /** next free cascade weight (Tailwind variant bit) */
    private nextBit;
    /**
     * Register a variant and reserve its cascade weights: one per static branch
     * (`marker` → 2, `dark` with two formats → 2), or `slots + 1` for a
     * functional variant (one per themed value, the last one for arbitrary
     * values) — exactly what Tailwind's `Offsets.recordVariant` does.
     */
    private registerVariant;
    /**
     * Variants in Tailwind 3.4's registration order — the order *is* the
     * cascade: child → pseudo-elements → pseudo-classes → group-* → peer-* →
     * has/aria/data → plugin variants (built-in `@container` first) → supports →
     * motion/contrast → [dark when `class`] → screens (max-*, then min) →
     * orientation → direction → [dark otherwise] → forced-colors → print.
     * Nakshora extras (`inert`, `not-*`, `starting`) sit next to their
     * closest relatives.
     */
    private buildVariants;
    /** `@media (…) { &:not(.light *) }` / `&:is(.dark *)` / `@media (…)` → branch */
    private formatToBranch;
    private attrSelector;
    /** Public: variant definitions (docs / IntelliSense). */
    getVariants(): VariantDefinition[];
    getScreens(): [string, string][];
    /** Every value-bearing utility class the theme defines (no variants, no arbitrary values). */
    /**
     * Full catalog (one entry per value-bearing class). Memoised per *resolved
     * theme + enabled core plugins* across Engine instances: the Vite/PostCSS
     * plugins create a fresh generator per build, and the catalog (11k entries,
     * ~35 ms) only depends on those inputs. Engines with plugin-added utilities
     * are not shared (their extras are per instance). Entries are shared by
     * reference — callers must treat them as read-only.
     */
    buildCatalog(): CatalogEntry[];
    private catalogMemo;
    /** Cache key: theme JSON + which core plugins are enabled. */
    private catalogKey;
    private buildCatalogUncached;
    private negate;
    /** Compile one candidate into rules (empty when unknown). Cached. */
    compile(candidate: string): CompiledRule[];
    private compileUncached;
    private wrapImportant;
    /**
     * Order at-rules outermost-first (the leftmost variant is the outermost
     * wrapper, as in Tailwind) and — Nakshora policy — collapse every
     * non-arbitrary `@media` condition into a single combined query
     * (`print:md:` → `@media print and (min-width: 768px)`). Nested min-widths
     * keep the largest, max-widths the smallest; the combined query sits where
     * the outermost media query was. Arbitrary (`[@media(...)]:`) queries are
     * never rewritten.
     */
    private mergeAtRules;
    private variantCache;
    resolveVariant(name: string): VariantMatch | null;
    private variantAllowed;
    private resolveVariantUncached;
    private resolveUtility;
    private resolveFunctional;
    /** `/50` → `0.5` (opacity scale), `/[.3]` → `.3`; fontSize modifier → lineHeight */
    private resolveModifier;
    /** Replace `theme(path)` / `theme(path/alpha)` inside an arbitrary value. */
    resolveThemeFn(value: string): string;
    /** Resolve `colors.red.500`, `spacing[2.5]`, `colors.red.500/50%` against the theme. */
    lookupTheme(path: string): string | undefined;
    /** `.container` rules (width + per-screen max-width up to `theme.container.maxScreen`). */
    private containerRules;
}
/** Tailwind's `candidatePermutations`: yields [prefix, modifier] pairs from the longest prefix down. */
declare function candidatePermutations(candidate: string): Generator<[string, string]>;
/**
 * Apply a variant format (`&:hover`, `:merge(.group):hover &`) to the current
 * selector. Implements Tailwind's `:merge()` semantics: when the current
 * selector already contains the same `:merge(x)`, the format's attachments
 * (pseudos following the merge) are appended to the existing one and the
 * rest of the format collapses (`group-hover:group-focus:` → `.group:hover:focus`).
 */
declare function applyFormat(current: string, format: string): string;
/**
 * Finalise a selector: drop `:merge()` wrappers and move pseudo-elements to
 * the end of the selector (Tailwind `movePseudos` semantics):
 * `.x::before:hover` → `.x:hover::before`, `.x::before > *` → `.x > *::before`.
 */
declare function finalizeSelector(selector: string): string;

/**
 * Human-readable category labels. Keys are category ids (used in docs URLs
 * and the AI corpus); the engine's core-plugin names map onto them through
 * `categoryForPlugin()`.
 */
declare const GROUP_CATEGORIES: Record<string, string>;
/** Category id for a core plugin / plugin group name. */
declare function categoryForPlugin(plugin: string): string;
/**
 * Build the utility catalog for a theme (value-bearing classes, no variants).
 * Kept for backwards compatibility — `CSSGenerator#getUtilities()` is the
 * preferred entry point because it honours `corePlugins`, `prefix` and plugins.
 */
declare function buildUtilityList(theme?: Partial<ThemeConfig>): UtilityRule[];

/**
 * A single state-variant definition (public, documentation-oriented view).
 */
interface VariantDef {
    /** Class prefix, e.g. `hover` */
    prefix: string;
    /** Selector suffix appended to the class, e.g. `:hover` */
    suffix: string;
    /** Ancestor selector prepended (group/peer/dark strategies) */
    ancestor: string;
    /** Key in VariantsConfig that toggles this variant */
    configKey: keyof VariantsConfig;
    description: string;
}
/**
 * The classic state variants (documentation + AI corpus). The engine supports
 * many more — see `CSSGenerator#getVariantNames()`.
 */
declare const STATE_VARIANTS: VariantDef[];
interface ResolvedBreakpoint {
    name: string;
    px: number;
    /** raw min-width value (`640px`, `40rem`) */
    value: string;
}
declare class CSSGenerator {
    readonly config: NakshoraConfig;
    /** the fully resolved theme (Tailwind-shaped scales) */
    readonly theme: ResolvedTheme;
    readonly engine: Engine;
    private readonly variantCfg;
    private readonly breakpoints;
    private catalog;
    private catalogByClass;
    private readonly pluginBase;
    private readonly pluginRawCss;
    private readonly corePluginsEnabled;
    constructor(config?: Partial<NakshoraConfig>);
    /**
     * Generate the stylesheet.
     *
     * - `full` mode (default): base styles, CSS variables, keyframes, every
     *   utility + its responsive variants, and the component set.
     * - `jit` mode: only the utilities found in `options.content`
     *   (state variants and variant combinations included).
     */
    generate(options?: GenerationOptions): string;
    /** Generate JIT CSS from explicit content */
    generateFromContent(content: string | string[], options?: GenerationOptions): string;
    /** All utility rules in catalog order (value-bearing classes, no variants) */
    getUtilities(): UtilityRule[];
    /** Look up a single utility by (base) class name */
    getUtility(className: string): UtilityRule | undefined;
    /** Every variant name the engine knows (static + functional prefixes) */
    getVariantNames(): string[];
    /** Variant definitions (docs / IntelliSense) */
    getVariantDefinitions(): VariantDefinition[];
    /** Resolved breakpoints, ascending */
    getBreakpoints(): ResolvedBreakpoint[];
    /** Compile a single candidate to CSS (empty string when unknown) */
    compileClass(candidate: string): string;
    /** Statistics about a generated stylesheet */
    /**
     * Statistics for a stylesheet (default: the full build). Computed on the
     * parsed CSS, not with regexes: a "rule" is a style rule with a selector,
     * "responsive" means it sits inside a `@media`/`@container` at-rule,
     * "variant" means at least one selector in the list carries a variant
     * prefix (an escaped `\:` in the class part), and keyframe steps
     * (`from`, `to`, `50%`) are excluded from all three.
     */
    getStats(css?: string): GenerationStats;
    minify(css: string): string;
    /** Expand `@apply`, `theme()`, `screen()` and `@screen` in author CSS */
    processCss(css: string, options?: {
        strict?: boolean;
    }): string;
    /** Resolve a theme path (`colors.blue.500`, `spacing[2.5]`) */
    themeValue(path: string): string | undefined;
    /** Base styles (reset, `--tw-*` defaults, plugin base) */
    getBase(): string;
    /** `:root` CSS variables */
    getVariables(): string;
    /** `@keyframes` for the referenced animations (all when `names` is omitted) */
    getKeyframes(names?: Set<string>): string;
    /**
     * Full utility set.
     * @param includeVariants when true (default) the classic state variants
     *   (`STATE_VARIANTS`) are included — the standard full build omits them.
     */
    getUtilitiesFull(includeVariants?: boolean, options?: {
        screens?: 'all' | 'core' | string[];
    }): string;
    /**
     * Screens that get responsive variants in the *full* build. Default
     * (`'core'`): the classic `sm`–`2xl` set, so the extended 10-step scale
     * does not multiply the CDN bundle (every screen is always available in
     * JIT mode). `'all'` or an explicit list opt in.
     */
    private fullBuildScreens;
    private reprefix;
    /** Design-paradigm component CSS */
    getComponents(): string;
    private hasContent;
    private getContentFromConfig;
    private isVariantEnabled;
    private buildCatalog;
    /** Compile candidates → ordered CSS text plus bookkeeping */
    private compileCandidates;
    /** Sort rules (variant weight → plugin → utility → value) and serialise with grouped at-rules. */
    private serializeRules;
    private baseStyles;
    /** `*, ::before, ::after { --tw-… }` defaults required by composed utilities */
    private twDefaults;
    private variables;
    private keyframes;
    private components;
    private wrapLayer;
    private generateFull;
    /**
     * Compile a JIT build from content.
     * @param internal.utilitiesOnly emit only the utilities section (no base/variables/keyframes/components)
     */
    generateJIT(content: string | string[] | undefined, options?: GenerationOptions, internal?: {
        utilitiesOnly?: boolean;
    }): string;
    /**
     * JIT build from an already-extracted candidate set (see `ContentCache`):
     * skips the extractor entirely, otherwise identical to `generateJIT`.
     */
    generateJITFromCandidates(candidates: Iterable<string>, options?: GenerationOptions, internal?: {
        utilitiesOnly?: boolean;
    }): string;
    private generateJITPretty;
    /** Components layer — only the built-in blocks whose classes appear in `candidates`. */
    private componentsFor;
}
/** Tailwind-compatible preflight (v3.4) with Nakshora's font stack applied. */
declare function preflight(theme: ResolvedTheme): string;
/**
 * Convenience one-shot generator.
 */
declare function createGenerator(config?: Partial<NakshoraConfig>): CSSGenerator;

interface CssDecl {
    type: 'decl';
    prop: string;
    value: string;
    important?: boolean;
}
interface CssRule {
    type: 'rule';
    selector: string;
    nodes: CssNode[];
}
interface CssAtRule {
    type: 'atrule';
    name: string;
    params: string;
    /** undefined for statement at-rules (`@import x;`) */
    nodes?: CssNode[];
}
interface CssComment {
    type: 'comment';
    text: string;
}
type CssNode = CssDecl | CssRule | CssAtRule | CssComment;
interface CssRoot {
    type: 'root';
    nodes: CssNode[];
}
/** Parse a stylesheet. Tolerant: unterminated blocks are closed at EOF. */
declare function parseCss(css: string): CssRoot;
interface SerializeOptions {
    minify?: boolean;
    indent?: string;
}
/** Serialise an AST. Pretty output mirrors Nakshora's one-line rule style. */
declare function serializeCss(root: CssRoot | CssNode[], options?: SerializeOptions): string;
/** Safe minifier: parse → serialise. Never touches string contents. */
declare function minifyCssSafe(css: string): string;
type CssInJs = {
    [key: string]: string | number | CssInJs | CssInJs[] | undefined | null;
};

interface TailwindPluginObject {
    handler: (api: PluginAPI) => void;
    config?: Record<string, unknown>;
}
interface MatchOptions {
    values?: Record<string, unknown>;
    type?: DataType | Array<DataType | [DataType, {
        preferOnConflict?: boolean;
    }]>;
    supportsNegativeValues?: boolean;
    modifiers?: 'any' | Record<string, string>;
    respectPrefix?: boolean;
    respectImportant?: boolean;
}
interface PluginAPI {
    addUtilities(utilities: CssInJs | CssInJs[], options?: unknown): void;
    matchUtilities(utilities: Record<string, (value: unknown, extra: {
        modifier: string | null;
    }) => CssInJs | CssInJs[]>, options?: MatchOptions): void;
    addComponents(components: CssInJs | CssInJs[], options?: unknown): void;
    matchComponents(components: Record<string, (value: unknown, extra: {
        modifier: string | null;
    }) => CssInJs | CssInJs[]>, options?: MatchOptions): void;
    addBase(base: CssInJs | CssInJs[]): void;
    addVariant(name: string, definition: string | string[] | ((api: {
        container?: unknown;
        separator?: string;
        modifySelectors?: unknown;
    }) => string | string[] | void)): void;
    matchVariant(name: string, fn: (value: string, extra: {
        modifier: string | null;
    }) => string | string[], options?: {
        values?: Record<string, string>;
        /** Tailwind value-aware ordering (`screens`, container sizes) */
        sort?: (a: {
            value: unknown;
            modifier: string | null;
        }, b: {
            value: unknown;
            modifier: string | null;
        }) => number;
    }): void;
    theme(path?: string, defaultValue?: unknown): unknown;
    config(path?: string, defaultValue?: unknown): unknown;
    corePlugins(name: string): boolean;
    e(className: string): string;
    prefix(selector: string): string;
    variants(path?: string, defaultValue?: unknown): unknown;
    /** Nakshora: add raw CSS to the utilities layer */
    addCss?(css: string): void;
}
/** Tailwind `plugin()` helper so configs can `import { plugin } from '@nakshora/core'`. */
declare function plugin(handler: (api: PluginAPI) => void, config?: Record<string, unknown>): TailwindPluginObject;
declare namespace plugin {
    var withOptions: <T>(pluginFunction: (options?: T) => (api: PluginAPI) => void, configFunction?: (options?: T) => Record<string, unknown>) => ((options?: T) => TailwindPluginObject) & {
        __isOptionsFunction: true;
    };
}

declare class ApplyError extends Error {
    readonly candidate?: string | undefined;
    constructor(message: string, candidate?: string | undefined);
}
interface ProcessOptions {
    /** throw on unknown `@apply` classes (default true) */
    strict?: boolean;
}
/**
 * Expand `@apply` directives, `theme()`/`screen()` functions and `@screen`
 * at-rules in author CSS. Returns the transformed stylesheet.
 */
declare function processAuthorCss(css: string, engine: Engine, options?: ProcessOptions): string;

interface ParsedColor {
    mode: 'rgb' | 'hsl';
    color: string[];
    alpha?: string;
}
/**
 * Parse a CSS colour into channels. Returns `null` when the value is not a
 * colour we can decompose (keywords like `inherit`, `currentColor`,
 * `var(--x)` without a fallback we can read, `color-mix()` …).
 */
declare function parseColor(value: unknown, { loose }?: {
    loose?: boolean | undefined;
}): ParsedColor | null;
declare function formatColor({ mode, color, alpha }: ParsedColor): string;
/**
 * `withAlphaValue('#3b82f6', '0.5')` → `rgb(59 130 246 / 0.5)`.
 * Falls back to `defaultValue` (or the raw colour) when it cannot be parsed.
 */
declare function withAlphaValue(color: string, alpha: string, defaultValue?: string): string;
/**
 * Tailwind's `withAlphaVariable`: emits `--tw-x-opacity: 1` plus the colour
 * expressed with `var(--tw-x-opacity, 1)` so `*-opacity-*` utilities compose.
 * Colours that already carry an alpha channel, keywords and unparsable
 * values are emitted as-is.
 */
declare function withAlphaVariable(color: string, properties: string | string[], variable: string): Record<string, string>;

/**
 * Default theme configuration for Nakshora 3.0
 */
declare const defaultTheme: ThemeConfig;
/**
 * Default variants configuration — every variant enabled.
 */
declare const defaultVariants: VariantsConfig;
/**
 * Deep-merge two plain objects (arrays are replaced, not concatenated).
 */
declare function deepMerge<T>(base: T, override: unknown): T;
/**
 * Merge Nakshora configurations.
 * `override` wins; theme sections are deep-merged; safelist/plugins concatenated.
 */
declare function mergeConfig(base?: Partial<NakshoraConfig>, override?: Partial<NakshoraConfig>): NakshoraConfig;
/**
 * Resolve a dot-path inside a theme object, e.g.
 * `resolveThemeValue(theme, 'colors.blue.500')` → `'#3b82f6'`.
 * Returns `null` when the path does not exist or is not scalar.
 */
declare function resolveThemeValue(theme: Partial<ThemeConfig>, path: string): string | number | null;
/**
 * Apply a theme preset (e.g. `neonTheme`) to a config, deep-merging
 * its colors/typography over the base theme.
 */
declare function applyPreset(config: Partial<NakshoraConfig>, preset: PresetConfig): NakshoraConfig;

declare const defaultColors: ColorConfig;

declare const componentCss: Record<string, string>;
declare const componentNames: string[];

declare const neonTheme: PresetConfig;

declare const pastelTheme: PresetConfig;

declare const brutalistTheme: PresetConfig;

declare const minimalistTheme: PresetConfig;

declare const natureTheme: PresetConfig;

interface AIUtilityEntry {
    class: string;
    css: string;
    description: string;
    category: string;
    example: string;
    responsiveExamples: string[];
    variantExamples: string[];
}
interface AICategory {
    id: string;
    name: string;
    utilities: AIUtilityEntry[];
}
interface AICorpus {
    framework: 'nakshora';
    version: string;
    generatedAt: string;
    description: string;
    howToUse: string[];
    variants: {
        prefix: string;
        description: string;
        example: string;
    }[];
    breakpoints: {
        name: string;
        min: string;
        example: string;
        description?: string;
    }[];
    categories: AICategory[];
    utilityCount: number;
}
/**
 * Build the full AI corpus for the given configuration.
 */
declare function buildAICorpus(config?: Partial<NakshoraConfig>, version?: string): AICorpus;
/**
 * Convert a corpus into SFT (instruction-tuning) JSONL lines.
 * Each line: {"messages":[{"role":"user","content":...},{"role":"assistant","content":...}]}
 */
declare function corpusToSFT(corpus: AICorpus, limit?: number): string;

interface ContentCacheStats {
    hits: number;
    misses: number;
    entries: number;
}
/** FNV-1a 32-bit — cheap content stamp for raw strings. */
declare function contentHash(text: string): string;
declare class ContentCache {
    private readonly pattern?;
    private readonly entries;
    private hits;
    private misses;
    constructor(pattern?: string | undefined);
    /**
     * Candidates for one source. `key` identifies the source (file path or
     * `raw:<n>`), `stamp` its version (`${mtimeMs}:${size}` for files, a hash
     * for strings). `read` is only called on a miss.
     */
    candidatesFor(key: string, stamp: string, read: () => string): Set<string>;
    /** Raw content chunk (no path): stamped by hash. */
    candidatesForText(text: string, key?: string): Set<string>;
    /** Drop sources that no longer exist (call after a glob pass with the live key set). */
    retain(keys: Iterable<string>): void;
    /** Union of several candidate sets, in a deterministic (sorted) order. */
    static union(sets: Iterable<Set<string>>): Set<string>;
    stats(): ContentCacheStats;
    clear(): void;
}
/** Minimal file-system surface `scanSources` needs (injected so core stays platform neutral). */
interface ScanFs {
    stat: (path: string) => {
        mtimeMs: number;
        size: number;
    } | null;
    read: (path: string) => string;
}
/**
 * Resolve content sources to a candidate set using the cache: file paths are
 * stamped by mtime+size, raw strings by hash. `files` are absolute paths
 * (already globbed by the caller); `raw` are inline template strings.
 * Returns a sorted candidate set so output never depends on scan order.
 */
declare function scanSources(cache: ContentCache, fs: ScanFs, files: readonly string[], raw?: readonly string[]): Set<string>;

declare const version = "3.0.0";

declare const metadata: {
    name: string;
    version: string;
    description: string;
    author: string;
    maintainer: string;
    license: string;
    repository: string;
    homepage: string;
    documentation: string;
};
declare const nakshora: {
    CSSGenerator: typeof CSSGenerator;
    createGenerator: typeof createGenerator;
    defaultTheme: ThemeConfig;
    defaultVariants: VariantsConfig;
    mergeConfig: typeof mergeConfig;
    resolveThemeValue: typeof resolveThemeValue;
    applyPreset: typeof applyPreset;
    deepMerge: typeof deepMerge;
    neonTheme: PresetConfig;
    pastelTheme: PresetConfig;
    brutalistTheme: PresetConfig;
    minimalistTheme: PresetConfig;
    natureTheme: PresetConfig;
    version: string;
    metadata: {
        name: string;
        version: string;
        description: string;
        author: string;
        maintainer: string;
        license: string;
        repository: string;
        homepage: string;
        documentation: string;
    };
};

export { type AICategory, type AICorpus, type AIUtilityEntry, type AnimationConfig, ApplyError, type AtRuleCond, type BorderRadiusConfig, type Breakpoint, type BreakpointConfig, type BuildOptions, CSSGenerator, type CSSProperties, type CatalogEntry, type ColorConfig, type ColorName, type ColorScale, type ColorShade, type CompiledRule, type ContainerConfig, ContentCache, type ContentCacheStats, type CssAtRule, type CssDecl, type CssNode, type CssRoot, type CssRule, DEFAULT_SCREENS, type DarkMode, type DurationConfig, type EasingConfig, Engine, type EngineOptions, type FontFamilyConfig, type FunctionalUtility, GROUP_CATEGORIES, type GenerationOptions, type GenerationStats, type KeyframeConfig, type NakshoraConfig, type OpacityConfig, type Plugin, type PluginAPI, type PresetConfig, type PresetName, type ResolvedBreakpoint, type ResolvedTheme, SCREEN_GUIDE, STATE_VARIANTS, type ScanFs, type ScreensConfig, type ShadowConfig, type SpacingConfig, type StaticUtilityDef, type TailwindPluginObject, type ThemeConfig, type ThemeScale, type TypographyConfig, type UtilityGenerator, type UtilityRule, type VariantBranch, type VariantDef, type VariantDefinition, type VariantsConfig, type ZIndexConfig, applyFormat, applyPreset, brutalistTheme, buildAICorpus, buildUtilityList, byteLength, candidatePermutations, categoryForPlugin, classToSelector, clearCatalogCache, coerceValue, componentCss, componentNames, contentHash, corpusToSFT, createGenerator, deepMerge, nakshora as default, defaultColors, defaultTheme, defaultVariants, escapeClass, escapeClassName, extractClasses, finalizeSelector, formatBytes, formatColor, maxWidthValue, mergeConfig, metadata, minifyCss, minifyCssSafe, minimalistTheme, natureTheme, neonTheme, normalizeValue, parseColor, parseCss, pastelTheme, plugin, preflight, processAuthorCss, resolveTheme, resolveThemeValue, scanSources, screenToPx, serializeCss, splitClass, splitPath, stringifyDecls, version, withAlphaValue, withAlphaVariable };
