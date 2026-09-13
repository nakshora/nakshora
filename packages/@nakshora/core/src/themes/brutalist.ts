// Nakshora Theme: Brutalist
// Minimalist, stark, no-nonsense approach

import type { PresetConfig } from '../types';

export const brutalistTheme: PresetConfig = {
  name: 'brutalist',
  description: 'Raw, high-contrast primary colors with zero ornamentation',
  colors: {
    // Primary: Black
    primary: {
      50: '#f5f5f5',
      100: '#ebebeb',
      200: '#d7d7d7',
      300: '#c3c3c3',
      400: '#afafaf',
      500: '#000000',
      600: '#000000',
      700: '#000000',
      800: '#000000',
      900: '#000000',
    },
    // Secondary: White
    secondary: {
      50: '#ffffff',
      100: '#ffffff',
      200: '#ffffff',
      300: '#ffffff',
      400: '#ffffff',
      500: '#ffffff',
      600: '#ffffff',
      700: '#ffffff',
      800: '#ffffff',
      900: '#ffffff',
    },
    // Accent: Gray
    accent: {
      50: '#f9f9f9',
      100: '#f3f3f3',
      200: '#e7e7e7',
      300: '#dbdbdb',
      400: '#cfcfcf',
      500: '#333333',
      600: '#2a2a2a',
      700: '#212121',
      800: '#181818',
      900: '#0f0f0f',
    },
    // Background: White
    background: {
      50: '#ffffff',
      100: '#fafafa',
      200: '#f5f5f5',
      300: '#f0f0f0',
      400: '#ebebeb',
      500: '#e6e6e6',
      600: '#c0c0c0',
      700: '#9a9a9a',
      800: '#747474',
      900: '#4e4e4e',
    },
  },
  typography: {
    fontSize: {
      xs: '11px',
      sm: '12px',
      base: '14px',
      lg: '16px',
      xl: '18px',
      '2xl': '22px',
      '3xl': '28px',
      '4xl': '34px',
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
      tight: '1.1',
      snug: '1.25',
      normal: '1.4',
      relaxed: '1.6',
      loose: '1.9',
    },
    letterSpacing: {
      tighter: '-0.1em',
      tight: '-0.05em',
      normal: '0em',
      wide: '0.05em',
      wider: '0.1em',
      widest: '0.15em',
    },
  },
};

export default brutalistTheme;
