// Nakshora Theme: Nature Inspired
// Organic, earthy, calm colors

import type { PresetConfig } from '../types';

export const natureTheme: PresetConfig = {
  name: 'nature',
  description: 'Earthy, organic, nature-inspired tones',
  colors: {
    // Primary: Forest Green
    primary: {
      50: '#f1f7f0',
      100: '#dcf0d9',
      200: '#c7e8c2',
      300: '#b3e0ab',
      400: '#9ed894',
      500: '#2d5016',
      600: '#264413',
      700: '#1f3210',
      800: '#18200d',
      900: '#110e0a',
    },
    // Secondary: Olive
    secondary: {
      50: '#f8f9f2',
      100: '#eff2d7',
      200: '#e6ebbc',
      300: '#dde4a1',
      400: '#d4dd86',
      500: '#6b8e23',
      600: '#5a741c',
      700: '#495a15',
      800: '#38400e',
      900: '#272607',
    },
    // Accent: Sage Green
    accent: {
      50: '#f5fbf6',
      100: '#e5f7e9',
      200: '#d5f3dc',
      300: '#c5efcf',
      400: '#b5ebc2',
      500: '#8fbc8f',
      600: '#799a79',
      700: '#637863',
      800: '#4d564d',
      900: '#373437',
    },
    // Background: Cream
    background: {
      50: '#fffff9',
      100: '#fffff2',
      200: '#fffce6',
      300: '#fffad9',
      400: '#fff8cc',
      500: '#f5f5f0',
      600: '#e0e0d9',
      700: '#cbcbc2',
      800: '#b6b6ab',
      900: '#a1a194',
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
      tight: '1.35',
      snug: '1.45',
      normal: '1.6',
      relaxed: '1.75',
      loose: '2.05',
    },
    letterSpacing: {
      tighter: '-0.02em',
      tight: '-0.01em',
      normal: '0em',
      wide: '0.01em',
      wider: '0.02em',
      widest: '0.04em',
    },
  },
};

export default natureTheme;
