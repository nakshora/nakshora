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
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Breakpoint values in pixels (sorted ascending at generation time).
 */
export interface BreakpointConfig {
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
 * Keyframe configuration: keyframe name → CSS keyframe body.
 */
export type KeyframeConfig = Record<string, string>;

/**
 * Font family configuration.
 */
export type FontFamilyConfig = Record<string, string>;

/**
 * Complete theme configuration. Every section is optional —
 * missing sections fall back to the Nakshora defaults.
 */
export interface ThemeConfig {
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
  responsive?: boolean;
}

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
 * A PostCSS-compatible plugin.
 */
export interface Plugin {
  name: string;
  /** Mutate/extend the configuration before generation */
  config?: (config: NakshoraConfig) => void;
  /** Contribute extra utilities/components/base styles */
  handler?: (utilities: UtilityGenerator) => void;
}

/**
 * Generator interface handed to plugins.
 */
export interface UtilityGenerator {
  addUtilities(utilities: Record<string, CSSProperties>, group?: string): void;
  addComponents(components: Record<string, CSSProperties>): void;
  addBase(base: Record<string, CSSProperties>): void;
}

/**
 * Main Nakshora configuration object.
 */
export interface NakshoraConfig {
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
  utilities: number;
  responsiveRules: number;
  variantRules: number;
  totalRules: number;
  sizeBytes: number;
  minifiedSizeBytes: number;
}
