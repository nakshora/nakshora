// Nakshora 2.0 - Main Entry Point
// Export all public APIs

export { default as CSSGenerator } from './generator';
export * from './types';
export { defaultTheme, defaultVariants, mergeConfig, resolveThemeValue } from './config';

// Export themes
export { neonTheme } from './themes/neon';
export { pastelTheme } from './themes/pastel';
export { brutalistTheme } from './themes/brutalist';
export { minimalistTheme } from './themes/minimalist';
export { natureTheme } from './themes/nature';

// Version
export const version = '2.0.0';

// Package metadata
export const metadata = {
  name: 'nakshora',
  version: '2.0.0',
  description: 'The world\'s most advanced utility-first CSS framework',
  author: 'Rizwan Rahim Chowdhury',
  maintainer: 'RRC Development',
  license: 'MIT',
  repository: 'https://github.com/nakshora/nakshora',
  homepage: 'https://nakshora.dev',
  documentation: 'https://docs.nakshora.dev',
};

// Default export
export default {
  CSSGenerator,
  defaultTheme,
  defaultVariants,
  mergeConfig,
  resolveThemeValue,
  neonTheme,
  pastelTheme,
  brutalistTheme,
  minimalistTheme,
  natureTheme,
  version,
  metadata,
};
