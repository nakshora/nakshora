// Nakshora Theme: Pastel Dream
// Soft, calming, harmonious palette

import { PresetConfig } from './types';

export const pastelTheme: PresetConfig = {
  name: 'pastel',
  colors: {
    // Primary: Soft Blue
    primary: {
      50: '#f7f9ff',
      100: '#e8eeff',
      200: '#d0dcff',
      300: '#b8caff',
      400: '#a0c4ff',
      500: '#88b8ff',
      600: '#6d9fd9',
      700: '#5286b3',
      800: '#376d8d',
      900: '#1c5467',
    },
    // Secondary: Soft Pink
    secondary: {
      50: '#ffe8ed',
      100: '#ffd0db',
      200: '#ffb7c7',
      300: '#ffb7b2',
      400: '#ff9fa5',
      500: '#ff8798',
      600: '#d9698b',
      700: '#b34b7e',
      800: '#8d2d71',
      900: '#671064',
    },
    // Accent: Peach
    accent: {
      50: '#ffeee6',
      100: '#ffd3b6',
      200: '#ffd3b6',
      300: '#ffb8a0',
      400: '#ff9d8a',
      500: '#ff8274',
      600: '#d9675c',
      700: '#b34c44',
      800: '#8d312c',
      900: '#671614',
    },
    // Background: Soft Purple
    background: {
      50: '#f5f1ff',
      100: '#e8deff',
      200: '#d0bcff',
      300: '#b89aff',
      400: '#a078ff',
      500: '#8856ff',
      600: '#6d44d9',
      700: '#5232b3',
      800: '#37208d',
      900: '#1c0e67',
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
      normal: '1.6',
      relaxed: '1.75',
      loose: '2.1',
    },
    letterSpacing: {
      tighter: '-0.03em',
      tight: '-0.015em',
      normal: '0em',
      wide: '0.015em',
      wider: '0.03em',
      widest: '0.06em',
    },
  },
};

export default pastelTheme;
