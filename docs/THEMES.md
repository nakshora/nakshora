# Themes & Presets

Nakshora ships five hand-crafted **theme presets** plus a fully open theme
system. Presets override the default palette (and typography) — everything
else (spacing, breakpoints, components) stays intact unless you override it.

## Built-in presets

Imported from `@nakshora/core`:

```js
import {
  neonTheme,
  pastelTheme,
  brutalistTheme,
  minimalistTheme,
  natureTheme,
} from '@nakshora/core';
```

### 🌃 Neon Cyber — `neonTheme`

High-saturation, futuristic palette for dark, glowing UIs.

```js
theme: { colors: neonTheme.colors, typography: neonTheme.typography }
```

Key palettes: `primary` (cyan), `secondary` (hot pink), `accent` (yellow),
`background` (deep navy), `surface`.

```html
<body class="bg-background-900 text-white">
  <div class="neon-card p-8"><p class="neon-text">Neon</p></div>
</body>
```

### 🌸 Pastel Dream — `pastelTheme`

Soft, muted tones for elegant, calming designs.
Key palettes: `primary` (soft blue), `secondary` (soft pink), `accent`,
`background`, `surface`.

### 🔨 Brutalist — `brutalistTheme`

Raw black/white with brutal accent colors. Zero ornamentation.
Pairs naturally with the `brutalist-card` / `brutalist-btn` components.

### 🤍 Ultra Minimalist — `minimalistTheme`

Clean grayscale + quiet "Minimal Ice" blues. Professional, quiet UIs.
Pairs with `minimalist-card` / `minimalist-btn`.

### 🌿 Nature Inspired — `natureTheme`

Earthy, organic greens and olives. Pairs with `gradient-nature`.

## Using a preset

```js
// nakshora.config.js
import { neonTheme } from '@nakshora/core';

export default {
  theme: {
    colors: neonTheme.colors,
    typography: neonTheme.typography,
    shadows: neonTheme.shadows,
  },
};
```

Or programmatically:

```js
import { CSSGenerator, neonTheme, applyPreset } from '@nakshora/core';

const generator = new CSSGenerator(applyPreset({}, neonTheme));
const css = generator.generate({ mode: 'full' });
```

## Mixing preset + custom

Preset values and your overrides merge (yours win):

```js
theme: {
  colors: {
    ...neonTheme.colors,
    brand: { 500: '#6d28d9' },   // add your own
  },
}
```

## Building a theme from scratch

```js
export default {
  theme: {
    colors: {
      brand: {
        50: '#f5f3ff',
        100: '#ede9fe',
        200: '#ddd6fe',
        300: '#c4b5fd',
        400: '#a78bfa',
        500: '#8b5cf6',
        600: '#7c3aed',
        700: '#6d28d9',
        800: '#5b21b6',
        900: '#4c1d95',
        950: '#2e1065',
      },
      ink: { 500: '#1e293b', 900: '#0f172a' },
    },
    typography: {
      fontSize: {
        sm: ['0.875rem', '1.4'],
        base: ['1.0625rem', '1.6'],
        lg: ['1.125rem', '1.75'],
        xl: ['1.5rem', '2'],
      },
      fontFamily: { sans: '"Space Grotesk", system-ui, sans-serif' },
    },
    borderRadius: { md: '0.75rem', lg: '1rem', xl: '1.5rem' },
    shadows: {
      lift: '0 12px 32px -12px rgba(76, 29, 149, 0.35)',
    },
    animation: {
      float: 'float 3s ease-in-out infinite',
    },
    keyframes: {
      float: '0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); }',
    },
  },
};
```

Every color automatically generates `text-*`, `bg-*`, `border-*`,
`from-*`, `via-*`, `to-*` utilities plus `--color-*` CSS variables.

## Theme tokens as CSS variables

All theme tokens are exposed on `:root`:

```css
:root {
  --color-brand-500: #8b5cf6;
  --spacing-4: 1rem;
  --text-base: 1.0625rem;
  --font-sans: 'Space Grotesk', system-ui, sans-serif;
  /* … */
}
```

Use them in your own custom CSS:

```css
.hero {
  color: var(--color-ink-900);
}
```

## v1 → v3 theme notes

The v1 CSS used theme names like `neon-purple`, `mono-100` baked into one
static file. In v3, presets are **config modules**: same visual language, but
compiled on demand, variant-aware and overridable. See [Migration](./MIGRATION.md).
