// Nakshora Theme: Neon Cyber
// Modern, vibrant, high-contrast design

import { PresetConfig, ColorConfig, TypographyConfig } from './types';

export const neonTheme: PresetConfig = {
  name: 'neon',
  colors: {
    // Primary: Cyan
    primary: {
      50: '#e0f7ff',
      100: '#b3edff',
      200: '#80e1ff',
      300: '#4dd4ff',
      400: '#1ac8ff',
      500: '#00d9ff',
      600: '#00b8d4',
      700: '#0097a9',
      800: '#00767e',
      900: '#005563',
    },
    // Secondary: Hot Pink
    secondary: {
      50: '#ffe0f0',
      100: '#ffb3d9',
      200: '#ff80c2',
      300: '#ff4dab',
      400: '#ff1a94',
      500: '#ff006e',
      600: '#d40058',
      700: '#a90042',
      800: '#7e002c',
      900: '#530016',
    },
    // Accent: Yellow
    accent: {
      50: '#fffff0',
      100: '#ffffd9',
      200: '#ffffb3',
      300: '#ffff80',
      400: '#ffff4d',
      500: '#ffbe0b',
      600: '#d4a008',
      700: '#a98005',
      800: '#7e6002',
      900: '#534000',
    },
    // Background: Dark
    background: {
      50: '#f0f0f0',
      100: '#e0e0e0',
      200: '#c0c0c0',
      300: '#a0a0a0',
      400: '#808080',
      500: '#1a1a2e',
      600: '#16213e',
      700: '#0f3460',
      800: '#0a1929',
      900: '#050d1a',
    },
    // Surface: Navy
    surface: {
      50: '#ecf0ff',
      100: '#d4e1ff',
      200: '#a8c2ff',
      300: '#7ca3ff',
      400: '#5084ff',
      500: '#2465ff',
      600: '#1c4dd9',
      700: '#1435b3',
      800: '#0d258c',
      900: '#061566',
    },
  },
  typography: {
    fontSize: {
      xs: '11px',
      sm: '13px',
      base: '15px',
      lg: '17px',
      xl: '19px',
      '2xl': '23px',
      '3xl': '29px',
      '4xl': '35px',
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
      tight: '1.2',
      snug: '1.35',
      normal: '1.5',
      relaxed: '1.65',
      loose: '2',
    },
    letterSpacing: {
      tighter: '-0.08em',
      tight: '-0.04em',
      normal: '0em',
      wide: '0.04em',
      wider: '0.08em',
      widest: '0.12em',
    },
  },
};

export default neonTheme;
