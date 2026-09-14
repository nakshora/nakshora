# Configuration Reference

Every configuration option Nakshora understands, with defaults.

Config files: `nakshora.config.{ts,js,mjs,cjs,json}` — auto-discovered by the
CLI (walking up from cwd), loadable from JS APIs, or passed inline to the
plugins. TypeScript configs require Node ≥ 22.18.

## Top-level options

```js
export default {
  content: './**/*.{html,js,ts,jsx,tsx,vue,astro,svelte,md}', // JIT mode
  purge: [], // legacy alias of content (string[])
  safelist: [], // classes always included (may include variants)
  blocklist: [], // classes never emitted (JIT)
  theme: {}, // theme overrides (deep-merged)
  presets: [], // configs/presets merged before `theme`
  variants: {}, // variant toggles
  corePlugins: {}, // group toggles
  darkMode: 'class', // 'class' | 'media' | 'selector' | ['selector', '[data-theme=dark]'] | ['variant', '&:where(.dark, .dark *)'] | false
  prefix: '', // class prefix, e.g. 'nk-' → .nk-flex
  important: false, // true | '#scope'
  preflight: true, // include the reset in `base`
  layers: false, // wrap output in real `@layer base/components/utilities`
  combineMedia: true, // `print:md:flex` → one `@media print and (min-width: 768px)`
  plugins: [], // Plugin objects / Tailwind plugin() / functions
  extractorPattern: undefined, // custom class-extractor regex
};
```

### `darkMode`

`'class'` (default): `dark:` rules become `.dark\:flex:is(.dark *)`.
`'media'`: `@media (prefers-color-scheme: dark)`. `'selector'` / `['selector', sel]`
/ `['class', sel]`: custom ancestor selector. `['variant', selectors]`: raw
selector template(s) with `&`. `false`: no `dark:` variant. See
[VARIANTS.md](./VARIANTS.md).

### `layers` — real cascade layers (opt-in)

By default output is flat (like Tailwind v3) so it wins against
unlayered third-party CSS. With `layers: true` every build (full and JIT)
starts with `@layer base, components, utilities;` and wraps the three
sections in `@layer` blocks, so your own unlayered CSS always overrides
utilities and the framework can be combined with other layered stylesheets:

```css
@layer base, components, utilities;
@layer base { … preflight, variables, keyframes … }
@layer components { … design-system + plugin components … }
@layer utilities { .flex { display: flex; } @media (min-width: 768px) { … } }
```

Author CSS `@layer components { .btn { @apply … } }` is expanded in place
either way.

### `content` — JIT sources

Accepts a string or array. Entries are:

- **glob patterns** → matching files are read and scanned for classes
- **existing file paths** → read
- **anything else** → treated as raw content (template strings)

When `content` is set, builds run in **JIT mode**: only classes found in the
content (plus `safelist`) are compiled — including all state variants.
Without `content`, builds run in **full mode** (all base + responsive
utilities; state variants are emitted in JIT mode only).

### `safelist`

Classes always emitted in JIT mode. Full variant syntax allowed:

```js
safelist: ['lg:flex', 'hover:bg-brand-500', 'dark:text-white'];
```

Useful for class names built dynamically at runtime.

### `theme` — all sections

Deep-merged over the defaults — override only what you change.

| Section                    | Default keys                                                                       | Notes                                                                   |
| -------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `colors`                   | 22 palettes × shades 50–950                                                        | `brand: {500: '#hex'}` or `blue: {500: '#hex'}` (single-shade override) |
| `spacing`                  | `0 px 0.5 1 … 96`                                                                  | key → CSS length                                                        |
| `typography.fontSize`      | `xs sm base lg xl 2xl 3xl 4xl 5xl 6xl 7xl 8xl 9xl`                                 | value or `[size, lineHeight]`                                           |
| `typography.fontWeight`    | `thin … black`                                                                     | 100–900                                                                 |
| `typography.lineHeight`    | `none tight snug base relaxed loose`                                               |                                                                         |
| `typography.letterSpacing` | `tighter tight normal wide wider widest`                                           |                                                                         |
| `fontFamily`               | `sans, mono`                                                                       |                                                                         |
| `breakpoints`              | `xxs:200 xs:400 sm:640 md:768 lg:1024 xl:1280 2xl:1536 3xl:1920 4xl:2560 5xl:5000` | px, merged + re-sorted; `null` removes; `screens` replaces (Tailwind)   |
| `shadows`                  | `none sm base md lg xl 2xl inner glow`                                             |                                                                         |
| `borderRadius`             | `none xs sm md lg xl 2xl 3xl full`                                                 |                                                                         |
| `zIndex`                   | `auto hide 0 10 20 30 40 50`                                                       |                                                                         |
| `opacity`                  | `0 5 10 20 … 100`                                                                  |                                                                         |
| `duration`                 | `0 75 100 150 200 300 500 700 1000`                                                | ms                                                                      |
| `easing`                   | `linear in out in-out back`                                                        |                                                                         |
| `animation`                | `spin ping pulse bounce fade slide shimmer`                                        | name → shorthand                                                        |
| `keyframes`                | matches the animation names                                                        | name → keyframe body                                                    |

```js
theme: {
  colors: { brand: { 500: '#6d28d9' } },
  breakpoints: { wide: 1800, xxs: null }, // adds wide:/max-wide:, drops xxs:
  animation: { wiggle: 'wiggle 1s ease-in-out infinite' },
  keyframes: {
    wiggle: '0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); }',
  },
}
```

### `variants` — toggles (all default `true`)

```
hover, focus, focusVisible, focusWithin, active, visited, disabled,
firstChild, lastChild, group, groupHover, groupFocus,
peer, peerHover, peerFocus, dark, responsive, maxResponsive, containerQueries
```

`responsive: false` removes every screen prefix (min, max, arbitrary) and the
`.container` caps; `maxResponsive: false` removes only `max-*`.

```js
variants: { visited: false, focusWithin: false } // shrink full builds / disable
```

### `corePlugins` — group toggles

Disable whole utility groups to shrink builds:

```
base, variables, animations, components, backgrounds, borderColor,
borderRadius, borders, cursors, display, effects, filters, flex, gap,
grid, inset, margin, opacity, padding, position, sizing, shadows,
textColor, textDecoration, transforms, transitions, typography, whitespace, zIndex, overflow, visibility, gradients, plugin
```

```js
corePlugins: { transforms: false, whitespace: false }
```

`components: false` removes Nakshora's built-in showcase blocks (`.glass`,
`.neon-btn`, `.brutalist-card`, …). It never affects components you register
yourself with `addComponents` / `matchComponents` — those belong to the
`plugin-components` group. `preflight: false` (or the top-level
`preflight: false`) drops the Tailwind reset; `variables: false` drops the
`:root { --color-*, --spacing-*, … }` block; `container: false` removes
`.container` so a plugin can define its own.

### `important`

```js
important: true; // every declaration gets !important
important: '#app'; // every rule is scoped: #app .flex { … }
```

### `extractorPattern`

Custom regex (with the `g` flag) for class extraction in JIT mode:

```js
extractorPattern: '[[\\w\\\\:/.-]+';
```

## Plugins

Plugins extend the framework programmatically.

```js
{
  name: 'my-plugin',
  config(cfg) { /* mutate/extend config before generation */ },
  handler(api) {
    api.addUtilities({ '.my-cool': { color: 'hotpink' } }, 'myGroup');
    api.addComponents({ '.my-component': { padding: '1rem' } });
    api.addBase({ 'h1': { margin: '1rem 0' } });
  }
}
```

- `addUtilities(declarations, group)` — utilities participate in responsive
  - variant expansion (JIT).
- `addComponents(declarations)` — emitted after the built-in components.
- `addBase(declarations)` — appended to the base layer.

## Presets

Built-in presets export `colors` (+ typography, shadows, …):

```js
import {
  neonTheme,
  pastelTheme,
  brutalistTheme,
  minimalistTheme,
  natureTheme,
} from '@nakshora/core';

export default { theme: { colors: neonTheme.colors, typography: neonTheme.typography } };
```

See [Themes](./THEMES.md).
