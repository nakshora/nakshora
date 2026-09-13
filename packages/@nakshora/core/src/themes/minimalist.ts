// Nakshora Theme: Minimalist
// Clean, modern, professional

import type { PresetConfig } from '../types';

export const minimalistTheme: PresetConfig = {
  name: 'minimalist',
  description: 'Clean grayscale and quiet Minimal Ice palettes for professional UI',
  colors: {
    // Primary: Dark Blue
    primary: {
      50: '#f0f4f9',
      100: '#dbe3ed',
      200: '#c7d2e1',
      300: '#b3c1d5',
      400: '#9fb0c9',
      500: '#2c3e50',
      600: '#253547',
      700: '#1e2d3e',
      800: '#172535',
      900: '#101d2c',
    },
    // Secondary: Slate
    secondary: {
      50: '#f7f9fb',
      100: '#eef2f5',
      200: '#e5ecf0',
      300: '#dce6eb',
      400: '#d3e0e6',
      500: '#34495e',
      600: '#2d3e4f',
      700: '#263340',
      800: '#1f2831',
      900: '#181d22',
    },
    // Accent: Sky Blue
    accent: {
      50: '#ecf5ff',
      100: '#d4e6ff',
      200: '#a8ccff',
      300: '#7cb3ff',
      400: '#509aff',
      500: '#3498db',
      600: '#2a7ab8',
      700: '#205c95',
      800: '#164072',
      900: '#0c244f',
    },
    // Background: Light Gray
    background: {
      50: '#ffffff',
      100: '#f8f9fa',
      200: '#f1f3f5',
      300: '#eaecf0',
      400: '#e3e5eb',
      500: '#dcdfe6',
      600: '#c0c3cc',
      700: '#a4a8b3',
      800: '#888c99',
      900: '#6c7080',
    },
  },
  typography: {
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
    },
    fontWeight: {
      thin: 100,
      extralight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    lineHeight: {
      tight: '1.3',
      snug: '1.4',
      normal: '1.5',
      relaxed: '1.7',
      loose: '2',
    },
    letterSpacing: {
      tighter: '-0.04em',
      tight: '-0.02em',
      normal: '0em',
      wide: '0.02em',
      wider: '0.04em',
      widest: '0.08em',
    },
  },
};

export default minimalistTheme;
