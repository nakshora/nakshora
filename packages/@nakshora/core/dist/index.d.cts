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
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
/**
 * Breakpoint values in pixels (sorted ascending at generation time).
 */
interface BreakpointConfig {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
    [key: string]: number | undefined;
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
 * Keyframe configuration: keyframe name → CSS keyframe body.
 */
type KeyframeConfig = Record<string, string>;
/**
 * Font family configuration.
 */
type FontFamilyConfig = Record<string, string>;
/**
 * Complete theme configuration. Every section is optional —
 * missing sections fall back to the Nakshora defaults.
 */
interface ThemeConfig {
    colors?: ColorConfig;
    spacing?: SpacingConfig;
    typography?: Partial<TypographyConfig>;
    fontFamily?: FontFamilyConfig;
    breakpoints?: BreakpointConfig;
    shadows?: ShadowConfig;
    borderRadius?: BorderRadiusConfig;
    zIndex?: ZIndexConfig;
    opacity?: OpacityConfig;
    duration?: DurationConfig;
    easing?: EasingConfig;
    animation?: AnimationConfig;
    keyframes?: KeyframeConfig;
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
    responsive?: boolean;
}
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
 * A PostCSS-compatible plugin.
 */
interface Plugin {
    name: string;
    /** Mutate/extend the configuration before generation */
    config?: (config: NakshoraConfig) => void;
    /** Contribute extra utilities/components/base styles */
    handler?: (utilities: UtilityGenerator) => void;
}
/**
 * Generator interface handed to plugins.
 */
interface UtilityGenerator {
    addUtilities(utilities: Record<string, CSSProperties>, group?: string): void;
    addComponents(components: Record<string, CSSProperties>): void;
    addBase(base: Record<string, CSSProperties>): void;
}
/**
 * Main Nakshora configuration object.
 */
interface NakshoraConfig {
    /** Theme overrides (deep-merged with defaults) */
    theme?: Partial<ThemeConfig>;
    /** Variant toggles (all default to true) */
    variants?: VariantsConfig;
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
    plugins?: Plugin[];
    /**
     * `true` → every declaration is marked `!important`.
     * `'#app'` → every rule is scoped under the given selector.
     */
    important?: boolean | string;
    /** Toggle individual utility groups on/off */
    corePlugins?: Record<string, boolean>;
    /** Custom class-extractor regex (JIT mode) */
    extractorPattern?: string;
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
    utilities: number;
    responsiveRules: number;
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
 * Handles escaped variant syntax (`hover\:bg-blue-500`) used in HTML.
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
 * Lightweight CSS minifier.
 * Removes comments, collapses whitespace, trims around punctuation.
 * Safe for Nakshora's generated output (no strings containing braces).
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

/**
 * A single state-variant definition.
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
 * All built-in state variants, in cascade order.
 */
declare const STATE_VARIANTS: VariantDef[];
interface ResolvedBreakpoint {
    name: string;
    px: number;
}
declare class CSSGenerator {
    readonly config: NakshoraConfig;
    private readonly theme;
    private readonly variantCfg;
    private readonly utilities;
    private readonly breakpoints;
    private readonly utilityByClass;
    private readonly extraBase;
    private readonly extraComponents;
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
    /** All utility rules in catalog order */
    getUtilities(): UtilityRule[];
    /** Look up a single utility by (base) class name */
    getUtility(className: string): UtilityRule | undefined;
    /** Statistics about a generated stylesheet */
    getStats(css?: string): GenerationStats;
    minify(css: string): string;
    /** Base styles (reset, defaults, reduced-motion) */
    getBase(): string;
    /** `:root` CSS variables */
    getVariables(): string;
    /** `@keyframes` for the referenced animations */
    getKeyframes(names?: Set<string>): string;
    /**
     * Full utility set.
     * @param includeVariants when true (default) state variants are included
     *   as well — the standard full build omits them (JIT-only) to stay lean.
     */
    getUtilitiesFull(includeVariants?: boolean): string;
    /** Design-paradigm component CSS */
    getComponents(): string;
    private hasContent;
    private getContentFromConfig;
    private enabledVariants;
    private enabledBreakpoints;
    private isGroupEnabled;
    /** Wrap a selector with the `important` scope when configured as a string */
    private wrapSelector;
    private emitRule;
    private baseStyles;
    private variables;
    private keyframes;
    private components;
    private generateFull;
    /**
     * Compile a JIT build from content.
     * @param internal.utilitiesOnly emit only the utilities section (no base/variables/keyframes/components)
     */
    generateJIT(content: string | string[] | undefined, _options: GenerationOptions, internal?: {
        utilitiesOnly?: boolean;
    }): string;
}
/**
 * Convenience one-shot generator.
 */
declare function createGenerator(config?: Partial<NakshoraConfig>): CSSGenerator;

/**
 * Default theme configuration for Nakshora 3.0
 */
declare const defaultTheme: ThemeConfig;
/**
 * Default variants configuration — every variant enabled.
 */
declare const defaultVariants: Required<VariantsConfig>;
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

/**
 * Build the complete list of utility rules for a resolved theme.
 */
declare function buildUtilityList(theme: Required<ThemeConfig>): UtilityRule[];
/**
 * Group key → human-readable category name (for docs/AI export).
 */
declare const GROUP_CATEGORIES: Record<string, string>;

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
    defaultVariants: Required<VariantsConfig>;
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

export { type AICategory, type AICorpus, type AIUtilityEntry, type AnimationConfig, type BorderRadiusConfig, type Breakpoint, type BreakpointConfig, type BuildOptions, CSSGenerator, type CSSProperties, type ColorConfig, type ColorName, type ColorScale, type ColorShade, type DurationConfig, type EasingConfig, type FontFamilyConfig, GROUP_CATEGORIES, type GenerationOptions, type GenerationStats, type KeyframeConfig, type NakshoraConfig, type OpacityConfig, type Plugin, type PresetConfig, type PresetName, type ResolvedBreakpoint, STATE_VARIANTS, type ShadowConfig, type SpacingConfig, type ThemeConfig, type TypographyConfig, type UtilityGenerator, type UtilityRule, type VariantDef, type VariantsConfig, type ZIndexConfig, applyPreset, brutalistTheme, buildAICorpus, buildUtilityList, byteLength, classToSelector, componentCss, componentNames, corpusToSFT, createGenerator, deepMerge, nakshora as default, defaultColors, defaultTheme, defaultVariants, escapeClass, extractClasses, formatBytes, mergeConfig, metadata, minifyCss, minimalistTheme, natureTheme, neonTheme, pastelTheme, resolveThemeValue, splitClass, stringifyDecls, version };
