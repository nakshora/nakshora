// Nakshora TypeScript Type Definitions
// This file defines all types and interfaces for the framework

/**
 * Color shade levels
 */
export type ColorShade = 
  | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

/**
 * Color names available in Nakshora
 */
export type ColorName = 
  | 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'pink' 
  | 'orange' | 'teal' | 'indigo' | 'cyan' | 'slate' | 'gray' 
  | 'zinc' | 'neutral' | 'stone' | 'amber' | 'lime' | 'emerald' 
  | 'sky' | 'violet' | 'fuchsia' | 'rose' | 'brown';

/**
 * Available breakpoint names
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Breakpoint values in pixels
 */
export interface BreakpointConfig {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

/**
 * Color configuration
 */
export interface ColorConfig {
  [key: string]: {
    [key in ColorShade]?: string;
  };
}

/**
 * Spacing scale configuration
 */
export interface SpacingConfig {
  [key: string | number]: string;
}

/**
 * Theme configuration
 */
export interface ThemeConfig {
  colors: ColorConfig;
  spacing: SpacingConfig;
  typography: TypographyConfig;
  breakpoints: BreakpointConfig;
  shadows?: ShadowConfig;
  borderRadius?: BorderRadiusConfig;
  zIndex?: ZIndexConfig;
  opacity?: OpacityConfig;
  duration?: DurationConfig;
  animation?: AnimationConfig;
}

/**
 * Typography configuration
 */
export interface TypographyConfig {
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    thin: number;
    extralight: number;
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
    black: number;
  };
  lineHeight: {
    tight: string;
    snug: string;
    normal: string;
    relaxed: string;
    loose: string;
  };
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
    widest: string;
  };
}

/**
 * Shadow configuration
 */
export interface ShadowConfig {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

/**
 * Border radius configuration
 */
export interface BorderRadiusConfig {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

/**
 * Z-index configuration
 */
export interface ZIndexConfig {
  hide: number;
  auto: string;
  [key: number]: number;
}

/**
 * Opacity configuration
 */
export interface OpacityConfig {
  [key: number]: string;
}

/**
 * Transition duration configuration
 */
export interface DurationConfig {
  [key: string]: string;
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  [key: string]: string;
}

/**
 * Variants configuration (hover, focus, etc.)
 */
export interface VariantsConfig {
  hover?: boolean;
  focus?: boolean;
  active?: boolean;
  disabled?: boolean;
  group?: boolean;
  firstChild?: boolean;
  lastChild?: boolean;
  dark?: boolean;
  responsive?: boolean;
}

/**
 * Main Nakshora configuration object
 */
export interface NakshoraConfig {
  theme: Partial<ThemeConfig>;
  variants?: VariantsConfig;
  purge?: string[];
  safelist?: string[];
  plugins?: Plugin[];
  important?: boolean | string;
  corePlugins?: {
    [key: string]: boolean;
  };
  extractorPattern?: string;
}

/**
 * Plugin interface
 */
export interface Plugin {
  name: string;
  config: (config: NakshoraConfig) => void;
  handler?: (utilities: UtilityGenerator) => void;
}

/**
 * Utility Generator interface
 */
export interface UtilityGenerator {
  addUtilities(utilities: UtilityMap): void;
  addComponents(components: ComponentMap): void;
  addBase(base: BaseStyles): void;
  matchUtilities(matcher: UtilityMatcher): void;
}

/**
 * Utility map for generated CSS classes
 */
export interface UtilityMap {
  [key: string]: CSSProperties;
}

/**
 * Component map
 */
export interface ComponentMap {
  [key: string]: CSSProperties;
}

/**
 * Base styles
 */
export interface BaseStyles {
  [key: string]: CSSProperties;
}

/**
 * Utility matcher function
 */
export interface UtilityMatcher {
  (matchValue: string): CSSProperties | null;
}

/**
 * CSS Properties object
 */
export interface CSSProperties {
  [key: string]: string | number | undefined;
}

/**
 * Preset configuration for pre-built themes
 */
export interface PresetConfig {
  name: 'neon' | 'pastel' | 'brutalist' | 'minimalist' | 'nature';
  colors: ColorConfig;
  typography: TypographyConfig;
}

/**
 * Generation options
 */
export interface GenerationOptions {
  minify?: boolean;
  sourceMap?: boolean;
  selector?: string;
  important?: boolean;
}

/**
 * Build options
 */
export interface BuildOptions {
  input: string;
  output: string;
  minify?: boolean;
  sourceMap?: boolean;
  watch?: boolean;
}
