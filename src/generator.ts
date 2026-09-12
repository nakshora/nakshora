// Nakshora CSS Generator
// Core module for generating utility CSS classes

import { NakshoraConfig, ThemeConfig, CSSProperties, GenerationOptions } from './types';
import { defaultTheme, defaultVariants } from './config';

/**
 * Main CSS Generator class
 * Generates all CSS utilities from configuration
 */
export class CSSGenerator {
  private config: NakshoraConfig;
  private theme: ThemeConfig;
  private utilities: Map<string, CSSProperties> = new Map();

  constructor(config: Partial<NakshoraConfig> = {}) {
    this.config = {
      theme: { ...defaultTheme, ...config.theme },
      variants: { ...defaultVariants, ...config.variants },
      purge: config.purge || [],
      safelist: config.safelist || [],
      plugins: config.plugins || [],
      important: config.important || false,
      corePlugins: config.corePlugins || {},
    };
    this.theme = this.config.theme as ThemeConfig;
  }

  /**
   * Generate all CSS utilities
   */
  public generate(options: GenerationOptions = {}): string {
    let css = '';

    // Generate base styles
    css += this.generateBase();

    // Generate CSS variables
    css += this.generateVariables();

    // Generate utility classes
    css += this.generateDisplayUtilities();
    css += this.generateSpacingUtilities();
    css += this.generateTypographyUtilities();
    css += this.generateColorUtilities();
    css += this.generateFlexboxUtilities();
    css += this.generateGridUtilities();
    css += this.generateBorderUtilities();
    css += this.generateEffectsUtilities();
    css += this.generateTransformUtilities();
    css += this.generateTransitionUtilities();
    css += this.generateResponsiveUtilities();

    if (options.minify) {
      css = this.minifyCss(css);
    }

    return css;
  }

  /**
   * Generate base styles
   */
  private generateBase(): string {
    return `
/* Nakshora 2.0 - Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.5;
  color: #333;
  background-color: #fff;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
}

p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}

button {
  cursor: pointer;
  border: none;
  background: none;
}

a {
  color: inherit;
  text-decoration: none;
}
`;
  }

  /**
   * Generate CSS custom properties (variables)
   */
  private generateVariables(): string {
    let css = '\n:root {\n';

    // Color variables
    if (this.theme.colors) {
      for (const [colorName, shades] of Object.entries(this.theme.colors)) {
        for (const [shade, color] of Object.entries(shades)) {
          css += `  --color-${colorName}-${shade}: ${color};\n`;
        }
      }
    }

    // Spacing variables
    if (this.theme.spacing) {
      for (const [key, value] of Object.entries(this.theme.spacing)) {
        css += `  --spacing-${key}: ${value};\n`;
      }
    }

    // Font size variables
    if (this.theme.typography?.fontSize) {
      for (const [size, value] of Object.entries(this.theme.typography.fontSize)) {
        css += `  --font-size-${size}: ${value};\n`;
      }
    }

    css += '}\n';
    return css;
  }

  /**
   * Generate display utilities
   */
  private generateDisplayUtilities(): string {
    const displays = ['block', 'inline-block', 'inline', 'flex', 'grid', 'hidden', 'contents'];
    let css = '\n/* Display Utilities */\n';

    for (const display of displays) {
      const className = display === 'hidden' ? '.hidden' : `.${display}`;
      css += `${className} { display: ${display === 'hidden' ? 'none' : display}; }\n`;
    }

    // Position utilities
    const positions = ['static', 'relative', 'absolute', 'fixed', 'sticky'];
    css += '\n/* Position Utilities */\n';
    for (const pos of positions) {
      css += `.${pos} { position: ${pos}; }\n`;
    }

    return css;
  }

  /**
   * Generate spacing utilities (margin & padding)
   */
  private generateSpacingUtilities(): string {
    let css = '\n/* Spacing Utilities */\n';

    if (!this.theme.spacing) return css;

    // Margin utilities
    for (const [key, value] of Object.entries(this.theme.spacing)) {
      css += `.m-${key} { margin: ${value}; }\n`;
      css += `.mx-${key} { margin-left: ${value}; margin-right: ${value}; }\n`;
      css += `.my-${key} { margin-top: ${value}; margin-bottom: ${value}; }\n`;
      css += `.mt-${key} { margin-top: ${value}; }\n`;
      css += `.mb-${key} { margin-bottom: ${value}; }\n`;
      css += `.ml-${key} { margin-left: ${value}; }\n`;
      css += `.mr-${key} { margin-right: ${key}; }\n`;
    }

    // Padding utilities
    for (const [key, value] of Object.entries(this.theme.spacing)) {
      css += `.p-${key} { padding: ${value}; }\n`;
      css += `.px-${key} { padding-left: ${value}; padding-right: ${value}; }\n`;
      css += `.py-${key} { padding-top: ${value}; padding-bottom: ${value}; }\n`;
      css += `.pt-${key} { padding-top: ${value}; }\n`;
      css += `.pb-${key} { padding-bottom: ${value}; }\n`;
      css += `.pl-${key} { padding-left: ${value}; }\n`;
      css += `.pr-${key} { padding-right: ${value}; }\n`;
    }

    // Gap utilities
    css += '\n/* Gap Utilities */\n';
    for (const [key, value] of Object.entries(this.theme.spacing)) {
      css += `.gap-${key} { gap: ${value}; }\n`;
    }

    return css;
  }

  /**
   * Generate typography utilities
   */
  private generateTypographyUtilities(): string {
    let css = '\n/* Typography Utilities */\n';

    if (!this.theme.typography) return css;

    // Font size utilities
    if (this.theme.typography.fontSize) {
      for (const [size, value] of Object.entries(this.theme.typography.fontSize)) {
        css += `.text-${size} { font-size: ${value}; }\n`;
      }
    }

    // Font weight utilities
    if (this.theme.typography.fontWeight) {
      for (const [weight, value] of Object.entries(this.theme.typography.fontWeight)) {
        css += `.font-${weight} { font-weight: ${value}; }\n`;
      }
    }

    // Text alignment utilities
    css += '.text-left { text-align: left; }\n';
    css += '.text-center { text-align: center; }\n';
    css += '.text-right { text-align: right; }\n';
    css += '.text-justify { text-align: justify; }\n';

    // Text transform utilities
    css += '.uppercase { text-transform: uppercase; }\n';
    css += '.lowercase { text-transform: lowercase; }\n';
    css += '.capitalize { text-transform: capitalize; }\n';

    // Line height utilities
    if (this.theme.typography.lineHeight) {
      for (const [height, value] of Object.entries(this.theme.typography.lineHeight)) {
        css += `.leading-${height} { line-height: ${value}; }\n`;
      }
    }

    // Letter spacing utilities
    if (this.theme.typography.letterSpacing) {
      for (const [spacing, value] of Object.entries(this.theme.typography.letterSpacing)) {
        css += `.tracking-${spacing} { letter-spacing: ${value}; }\n`;
      }
    }

    return css;
  }

  /**
   * Generate color utilities
   */
  private generateColorUtilities(): string {
    let css = '\n/* Color Utilities */\n';

    if (!this.theme.colors) return css;

    // Text color utilities
    css += '\n/* Text Colors */\n';
    for (const [colorName, shades] of Object.entries(this.theme.colors)) {
      for (const [shade, color] of Object.entries(shades)) {
        css += `.text-${colorName}-${shade} { color: ${color}; }\n`;
      }
    }

    // Background color utilities
    css += '\n/* Background Colors */\n';
    for (const [colorName, shades] of Object.entries(this.theme.colors)) {
      for (const [shade, color] of Object.entries(shades)) {
        css += `.bg-${colorName}-${shade} { background-color: ${color}; }\n`;
      }
    }

    // Border color utilities
    css += '\n/* Border Colors */\n';
    for (const [colorName, shades] of Object.entries(this.theme.colors)) {
      for (const [shade, color] of Object.entries(shades)) {
        css += `.border-${colorName}-${shade} { border-color: ${color}; }\n`;
      }
    }

    return css;
  }

  /**
   * Generate flexbox utilities
   */
  private generateFlexboxUtilities(): string {
    let css = '\n/* Flexbox Utilities */\n';

    // Flex direction
    css += '.flex-row { flex-direction: row; }\n';
    css += '.flex-col { flex-direction: column; }\n';
    css += '.flex-row-reverse { flex-direction: row-reverse; }\n';
    css += '.flex-col-reverse { flex-direction: column-reverse; }\n';

    // Flex wrap
    css += '.flex-wrap { flex-wrap: wrap; }\n';
    css += '.flex-nowrap { flex-wrap: nowrap; }\n';

    // Justify content
    css += '.justify-start { justify-content: flex-start; }\n';
    css += '.justify-center { justify-content: center; }\n';
    css += '.justify-end { justify-content: flex-end; }\n';
    css += '.justify-between { justify-content: space-between; }\n';
    css += '.justify-around { justify-content: space-around; }\n';
    css += '.justify-evenly { justify-content: space-evenly; }\n';

    // Align items
    css += '.items-start { align-items: flex-start; }\n';
    css += '.items-center { align-items: center; }\n';
    css += '.items-end { align-items: flex-end; }\n';
    css += '.items-stretch { align-items: stretch; }\n';
    css += '.items-baseline { align-items: baseline; }\n';

    // Align content
    css += '.content-start { align-content: flex-start; }\n';
    css += '.content-center { align-content: center; }\n';
    css += '.content-end { align-content: flex-end; }\n';

    // Flex grow/shrink
    css += '.flex-1 { flex: 1 1 0%; }\n';
    css += '.flex-auto { flex: 1 1 auto; }\n';
    css += '.flex-none { flex: none; }\n';

    return css;
  }

  /**
   * Generate grid utilities
   */
  private generateGridUtilities(): string {
    let css = '\n/* Grid Utilities */\n';

    for (let i = 1; i <= 12; i++) {
      css += `.grid-cols-${i} { grid-template-columns: repeat(${i}, minmax(0, 1fr)); }\n`;
      css += `.grid-rows-${i} { grid-template-rows: repeat(${i}, minmax(0, 1fr)); }\n`;
    }

    return css;
  }

  /**
   * Generate border utilities
   */
  private generateBorderUtilities(): string {
    let css = '\n/* Border Utilities */\n';

    // Border width
    css += '.border { border-width: 1px; border-style: solid; }\n';
    css += '.border-2 { border-width: 2px; border-style: solid; }\n';
    css += '.border-4 { border-width: 4px; border-style: solid; }\n';
    css += '.border-8 { border-width: 8px; border-style: solid; }\n';

    // Border sides
    css += '.border-t { border-top-width: 1px; border-top-style: solid; }\n';
    css += '.border-b { border-bottom-width: 1px; border-bottom-style: solid; }\n';
    css += '.border-l { border-left-width: 1px; border-left-style: solid; }\n';
    css += '.border-r { border-right-width: 1px; border-right-style: solid; }\n';

    // Border radius
    css += '.rounded { border-radius: 0.25rem; }\n';
    css += '.rounded-sm { border-radius: 0.125rem; }\n';
    css += '.rounded-md { border-radius: 0.375rem; }\n';
    css += '.rounded-lg { border-radius: 0.5rem; }\n';
    css += '.rounded-xl { border-radius: 0.75rem; }\n';
    css += '.rounded-2xl { border-radius: 1rem; }\n';
    css += '.rounded-full { border-radius: 9999px; }\n';

    return css;
  }

  /**
   * Generate effects utilities (shadow, opacity, blur)
   */
  private generateEffectsUtilities(): string {
    let css = '\n/* Effects Utilities */\n';

    // Shadow utilities
    if (this.theme.shadows) {
      for (const [key, value] of Object.entries(this.theme.shadows)) {
        css += `.shadow-${key} { box-shadow: ${value}; }\n`;
      }
    }

    // Opacity utilities
    if (this.theme.opacity) {
      for (const [key, value] of Object.entries(this.theme.opacity)) {
        css += `.opacity-${key} { opacity: ${value}; }\n`;
      }
    }

    // Blur utilities
    css += '.blur-0 { filter: blur(0); }\n';
    css += '.blur-sm { filter: blur(4px); }\n';
    css += '.blur { filter: blur(8px); }\n';
    css += '.blur-md { filter: blur(12px); }\n';
    css += '.blur-lg { filter: blur(16px); }\n';

    return css;
  }

  /**
   * Generate transform utilities
   */
  private generateTransformUtilities(): string {
    let css = '\n/* Transform Utilities */\n';

    // Scale
    for (let i = 50; i <= 150; i += 10) {
      css += `.scale-${i} { transform: scale(${i / 100}); }\n`;
    }

    // Rotate
    for (let i = 0; i <= 360; i += 45) {
      css += `.rotate-${i} { transform: rotate(${i}deg); }\n`;
    }

    // Translate
    if (this.theme.spacing) {
      for (const [key, value] of Object.entries(this.theme.spacing)) {
        css += `.translate-x-${key} { transform: translateX(${value}); }\n`;
        css += `.translate-y-${key} { transform: translateY(${value}); }\n`;
      }
    }

    return css;
  }

  /**
   * Generate transition utilities
   */
  private generateTransitionUtilities(): string {
    let css = '\n/* Transition Utilities */\n';

    css += '.transition { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }\n';
    css += '.transition-fast { transition-duration: 100ms; }\n';
    css += '.transition-slow { transition-duration: 300ms; }\n';

    // Duration utilities
    if (this.theme.duration) {
      for (const [key, value] of Object.entries(this.theme.duration)) {
        css += `.duration-${key} { transition-duration: ${value}; }\n`;
      }
    }

    // Easing utilities
    css += '.ease-linear { transition-timing-function: linear; }\n';
    css += '.ease-in { transition-timing-function: cubic-bezier(0.4, 0, 1, 1); }\n';
    css += '.ease-out { transition-timing-function: cubic-bezier(0, 0, 0.2, 1); }\n';
    css += '.ease-in-out { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }\n';

    return css;
  }

  /**
   * Generate responsive utilities using media queries
   */
  private generateResponsiveUtilities(): string {
    let css = '\n/* Responsive Utilities */\n';

    if (!this.theme.breakpoints) return css;

    const breakpoints = this.theme.breakpoints;

    // Small screen
    if (breakpoints.sm) {
      css += `\n@media (min-width: ${breakpoints.sm}px) {\n`;
      css += '  /* sm: utilities */\n';
      if (this.theme.spacing) {
        for (const [key] of Object.entries(this.theme.spacing)) {
          css += `  .sm\\:w-${key} { width: var(--spacing-${key}); }\n`;
        }
      }
      css += '}\n';
    }

    // Medium screen
    if (breakpoints.md) {
      css += `\n@media (min-width: ${breakpoints.md}px) {\n`;
      css += '  /* md: utilities */\n';
      css += '}\n';
    }

    // Large screen
    if (breakpoints.lg) {
      css += `\n@media (min-width: ${breakpoints.lg}px) {\n`;
      css += '  /* lg: utilities */\n';
      css += '}\n';
    }

    // Extra large screen
    if (breakpoints.xl) {
      css += `\n@media (min-width: ${breakpoints.xl}px) {\n`;
      css += '  /* xl: utilities */\n';
      css += '}\n';
    }

    // 2X Large screen
    if (breakpoints['2xl']) {
      css += `\n@media (min-width: ${breakpoints['2xl']}px) {\n`;
      css += '  /* 2xl: utilities */\n';
      css += '}\n';
    }

    return css;
  }

  /**
   * Minify CSS
   */
  private minifyCss(css: string): string {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\s*([{}:;,])\s*/g, '$1') // Remove whitespace around punctuation
      .trim();
  }
}

export default CSSGenerator;
