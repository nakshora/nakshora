// Nakshora Core — public API
// The JIT CSS compiler & engine, themes, config helpers and AI assets.

import { CSSGenerator, createGenerator, STATE_VARIANTS, preflight } from './generator';
import {
  Engine,
  applyFormat,
  finalizeSelector,
  candidatePermutations,
  maxWidthValue,
  clearCatalogCache,
} from './engine';
import { resolveTheme, DEFAULT_SCREENS, SCREEN_GUIDE, splitPath, screenToPx } from './theme';
import { plugin } from './plugin-api';
import { parseCss, serializeCss, minifyCssSafe, walkRules, classesInCss } from './css-ast';
import { processAuthorCss, ApplyError } from './apply';
import { escapeClassName, normalizeValue, coerceValue } from './values';
import { parseColor, formatColor, withAlphaValue, withAlphaVariable } from './color';
import {
  defaultTheme,
  defaultVariants,
  mergeConfig,
  resolveThemeValue,
  applyPreset,
  deepMerge,
} from './config';
import { defaultColors } from './palette';
import { buildUtilityList, GROUP_CATEGORIES, categoryForPlugin } from './registry';
import { componentCss, componentNames } from './components';
import {
  extractClasses,
  minifyCss,
  splitClass,
  escapeClass,
  stringifyDecls,
  classToSelector,
  formatBytes,
  byteLength,
} from './util';
import { neonTheme } from './themes/neon';
import { pastelTheme } from './themes/pastel';
import { brutalistTheme } from './themes/brutalist';
import { minimalistTheme } from './themes/minimalist';
import { natureTheme } from './themes/nature';
import { buildAICorpus, corpusToSFT } from './ai';

export { CSSGenerator, createGenerator, STATE_VARIANTS, preflight };
export type { VariantDef, ResolvedBreakpoint } from './generator';
export {
  Engine,
  applyFormat,
  finalizeSelector,
  candidatePermutations,
  maxWidthValue,
  clearCatalogCache,
};
export type {
  CompiledRule,
  VariantDefinition,
  VariantBranch,
  AtRuleCond,
  EngineOptions,
  CatalogEntry,
} from './engine';
export { resolveTheme, DEFAULT_SCREENS, SCREEN_GUIDE, splitPath, screenToPx };
export type { ResolvedTheme } from './theme';
export { plugin };
export type { PluginAPI, TailwindPluginObject } from './plugin-api';
export { parseCss, serializeCss, minifyCssSafe, walkRules, classesInCss };
export { ContentCache, contentHash, scanSources } from './content-cache';
export type { ContentCacheStats, ScanFs } from './content-cache';
export type { CssNode, CssRoot, CssRule, CssDecl, CssAtRule } from './css-ast';
export { processAuthorCss, ApplyError };
export { extractCssConfig, mergeCssConfig, hasCssConfig, THEME_NAMESPACES } from './css-config';
export type { CssConfigResult } from './css-config';
export { escapeClassName, normalizeValue, coerceValue };
export { parseColor, formatColor, withAlphaValue, withAlphaVariable };
export type { FunctionalUtility } from './utilities';
export type { StaticUtilityDef } from './static-utilities';
export type {
  NakshoraConfig,
  ThemeConfig,
  VariantsConfig,
  ColorConfig,
  ColorScale,
  ColorName,
  ColorShade,
  SpacingConfig,
  TypographyConfig,
  BreakpointConfig,
  Breakpoint,
  ScreensConfig,
  ContainerConfig,
  DarkMode,
  ThemeScale,
  ShadowConfig,
  BorderRadiusConfig,
  ZIndexConfig,
  OpacityConfig,
  DurationConfig,
  EasingConfig,
  AnimationConfig,
  KeyframeConfig,
  FontFamilyConfig,
  CSSProperties,
  UtilityRule,
  UtilityGenerator,
  Plugin,
  PresetConfig,
  PresetName,
  GenerationOptions,
  BuildOptions,
  GenerationStats,
} from './types';
export { defaultTheme, defaultVariants, mergeConfig, resolveThemeValue, applyPreset, deepMerge };
export { defaultColors };
export { buildUtilityList, GROUP_CATEGORIES, categoryForPlugin };
export { componentCss, componentNames };
export {
  extractClasses,
  minifyCss,
  splitClass,
  escapeClass,
  stringifyDecls,
  classToSelector,
  formatBytes,
  byteLength,
};
export { neonTheme, pastelTheme, brutalistTheme, minimalistTheme, natureTheme };
export { buildAICorpus, corpusToSFT };
export type { AICorpus, AICategory, AIUtilityEntry } from './ai';

// Version
import { version } from './version';
export { version };

// Package metadata
export const metadata = {
  name: 'nakshora',
  version,
  description: 'The modern, ultra-fast, utility-first CSS framework with a JIT compiler',
  author: 'Rizwan Rahim Chowdhury',
  maintainer: 'RRC Development',
  license: 'MIT',
  repository: 'https://github.com/nakshora/nakshora',
  homepage: 'https://nakshora.dev',
  documentation: 'https://github.com/nakshora/nakshora/blob/main/docs',
};

// Default export (convenience bundle of the most-used exports)
const nakshora = {
  CSSGenerator,
  createGenerator,
  defaultTheme,
  defaultVariants,
  mergeConfig,
  resolveThemeValue,
  applyPreset,
  deepMerge,
  neonTheme,
  pastelTheme,
  brutalistTheme,
  minimalistTheme,
  natureTheme,
  version,
  metadata,
};

export default nakshora;
