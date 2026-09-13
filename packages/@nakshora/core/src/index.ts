// Nakshora Core — public API
// The JIT CSS compiler & engine, themes, config helpers and AI assets.

import { CSSGenerator, createGenerator, STATE_VARIANTS } from './generator';
import {
  defaultTheme,
  defaultVariants,
  mergeConfig,
  resolveThemeValue,
  applyPreset,
  deepMerge,
} from './config';
import { defaultColors } from './palette';
import { buildUtilityList, GROUP_CATEGORIES } from './registry';
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

export { CSSGenerator, createGenerator, STATE_VARIANTS };
export type { VariantDef, ResolvedBreakpoint } from './generator';
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
export { buildUtilityList, GROUP_CATEGORIES };
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
export const version = '3.0.0';

// Package metadata
export const metadata = {
  name: 'nakshora',
  version: '3.0.0',
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
