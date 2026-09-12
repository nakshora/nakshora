# Nakshora 2.0 - Configuration API Reference

Complete guide to all configuration options for Nakshora 2.0.

---

## 📋 Table of Contents

1. [Basic Configuration](#basic-configuration)
2. [Theme Configuration](#theme-configuration)
3. [Variants Configuration](#variants-configuration)
4. [TypeScript Configuration](#typescript-configuration)
5. [Advanced Options](#advanced-options)
6. [Examples](#examples)

---

## Basic Configuration

### Default Configuration Structure

```typescript
interface NakshoraConfig {
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
```

---

## Theme Configuration

### Complete Theme Object

```typescript
interface ThemeConfig {
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
```

### Colors

```typescript
// Color configuration with shades
const colors = {
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    // ... up to 900
    900: '#7f1d1d',
  },
  blue: {
    // Similar structure
  },
  // ... other colors
};
```

**Usage in HTML:**
```html
<p class="text-red-500">Red text</p>
<div class="bg-blue-100">Light blue background</div>
<div class="border-2 border-green-600">Green border</div>
```

### Spacing

```typescript
const spacing = {
  0: '0',
  1: '0.25rem',     // 4px
  2: '0.5rem',      // 8px
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px
  // ... up to 96
  96: '24rem',      // 384px
};
```

**Usage in HTML:**
```html
<div class="p-4">Padding 16px</div>
<div class="m-8">Margin 32px</div>
<div class="gap-6">Gap 24px</div>
```

### Typography

```typescript
const typography = {
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
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};
```

### Breakpoints

```typescript
const breakpoints = {
  xs: 0,           // Extra small (mobile)
  sm: 640,         // Small (landscape mobile)
  md: 768,         // Medium (tablet)
  lg: 1024,        // Large (desktop)
  xl: 1280,        // Extra large
  '2xl': 1536,     // 2X Extra large
};
```

**Usage with responsive prefixes:**
```html
<div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
  Responsive width
</div>
```

### Shadows

```typescript
const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
};
```

### Border Radius

```typescript
const borderRadius = {
  none: '0px',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  full: '9999px',
};
```

### Z-Index

```typescript
const zIndex = {
  hide: -1,
  auto: 'auto',
  0: 0,
  10: 10,
  20: 20,
  30: 30,
  40: 40,
  50: 50,
};
```

### Opacity

```typescript
const opacity = {
  0: '0',
  5: '0.05',
  10: '0.1',
  25: '0.25',
  50: '0.5',
  75: '0.75',
  100: '1',
};
```

---

## Variants Configuration

### Available Variants

```typescript
interface VariantsConfig {
  hover?: boolean;        // Enable hover: prefix
  focus?: boolean;        // Enable focus: prefix
  active?: boolean;       // Enable active: prefix
  disabled?: boolean;     // Enable disabled: prefix
  group?: boolean;        // Enable group: prefix
  firstChild?: boolean;   // Enable first-child: prefix
  lastChild?: boolean;    // Enable last-child: prefix
  dark?: boolean;         // Enable dark: prefix
  responsive?: boolean;   // Enable responsive prefixes (sm:, md:, etc.)
}
```

### Configuration Example

```typescript
const variants = {
  hover: true,
  focus: true,
  active: true,
  disabled: true,
  group: false,
  dark: true,
  responsive: true,
};
```

### Variant Usage in HTML

```html
<!-- Hover variant -->
<button class="bg-blue-500 hover:bg-blue-600">Hover me</button>

<!-- Focus variant -->
<input class="border focus:border-blue-500" />

<!-- Responsive variant -->
<div class="w-full md:w-1/2 lg:w-1/3">Responsive</div>

<!-- Group variant -->
<div class="group">
  <div class="text-gray-600 group-hover:text-blue-600">Text changes on parent hover</div>
</div>

<!-- Dark variant -->
<div class="bg-white dark:bg-gray-900">Dark mode support</div>
```

---

## TypeScript Configuration

### Complete TypeScript Config File

Create `nakshora.config.ts`:

```typescript
import { NakshoraConfig } from 'nakshora';

const config: NakshoraConfig = {
  theme: {
    colors: {
      // Define your colors
      brand: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        500: '#0284c7',
        900: '#0c2d6b',
      },
    },
    spacing: {
      // Add custom spacing values
      'custom': '10px',
    },
    breakpoints: {
      // Add custom breakpoints
      'mobile': '480px',
      'tablet': '768px',
    },
  },
  variants: {
    hover: true,
    focus: true,
    responsive: true,
  },
  purge: [
    './src/**/*.html',
    './src/**/*.jsx',
    './src/**/*.tsx',
  ],
};

export default config;
```

---

## Advanced Options

### Purging Unused CSS

```typescript
const config: NakshoraConfig = {
  purge: [
    // Scan these files for used utilities
    './src/**/*.html',
    './src/**/*.js',
    './src/**/*.jsx',
    './src/**/*.ts',
    './src/**/*.tsx',
    './src/**/*.vue',
    './src/**/*.svelte',
  ],
};
```

### Safelist (Never Purge)

```typescript
const config: NakshoraConfig = {
  // Keep these utilities even if not found in scanned files
  safelist: [
    'text-red-500',
    'bg-blue-600',
    'border-2',
    // Patterns with regex
    /^text-/,
    /^bg-/,
  ],
};
```

### Important Flag

```typescript
// Make all utilities !important
const config: NakshoraConfig = {
  important: true,
};

// Or scope to a selector
const config: NakshoraConfig = {
  important: '.nakshora',
};
```

### Core Plugins

```typescript
const config: NakshoraConfig = {
  corePlugins: {
    // Disable specific feature generators
    spacing: true,
    colors: true,
    display: false,  // Disable display utilities
    margin: false,   // Disable margin utilities
  },
};
```

---

## Examples

### Example 1: Minimal Config

```typescript
import { NakshoraConfig } from 'nakshora';

const config: NakshoraConfig = {
  theme: {},  // Use defaults
  variants: {
    responsive: true,
  },
};

export default config;
```

### Example 2: Custom Color Scheme

```typescript
const config: NakshoraConfig = {
  theme: {
    colors: {
      primary: {
        50: '#f0f0f0',
        500: '#3b82f6',
        900: '#1e3a8a',
      },
      secondary: {
        50: '#ffe8e8',
        500: '#ef4444',
        900: '#7f1d1d',
      },
    },
  },
};
```

### Example 3: Extended Spacing

```typescript
const config: NakshoraConfig = {
  theme: {
    spacing: {
      0: '0',
      1: '0.25rem',
      2: '0.5rem',
      // ... default values
      128: '32rem',      // Custom: 512px
      256: '64rem',      // Custom: 1024px
    },
  },
};
```

### Example 4: Custom Breakpoints

```typescript
const config: NakshoraConfig = {
  theme: {
    breakpoints: {
      'xs': '0',
      'mobile': '480px',    // Custom mobile
      'sm': '640px',
      'tablet': '1000px',   // Custom tablet
      'md': '768px',
      'lg': '1024px',
      'desktop': '1400px',  // Custom desktop
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
};
```

### Example 5: Full Custom Config

```typescript
const config: NakshoraConfig = {
  theme: {
    colors: {
      brand: {
        light: '#e8f5e9',
        main: '#4caf50',
        dark: '#2e7d32',
      },
    },
    spacing: {
      px: '1px',
      0: '0',
      1: '0.25rem',
      2: '0.5rem',
    },
    typography: {
      fontSize: {
        sm: '14px',
        base: '16px',
        lg: '18px',
      },
    },
  },
  variants: {
    hover: true,
    focus: true,
    active: true,
    dark: true,
    responsive: true,
  },
  purge: ['./src/**/*.{html,jsx,tsx}'],
  important: false,
};

export default config;
```

---

## 🔗 Related Documentation

- [Installation Guide](INSTALLATION.md)
- [Getting Started](GETTING_STARTED.md)
- [Utilities Reference](UTILITIES.md)
- [Themes Guide](THEMES.md)

---

**Happy configuring! 🎯**
