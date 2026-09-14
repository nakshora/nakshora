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

Plugins extend the framework programmatically. A plugin is a function
`(api) => void`, an object `{ name, config?, handler }`, a Tailwind
`plugin(...)` / `plugin.withOptions(...)` object, or an official Tailwind
plugin (`@tailwindcss/typography`, `forms`, `aspect-ratio`,
`container-queries` are verified byte-identical).

```js
// nakshora.config.js
export default {
  plugins: [
    function (api) {
      // static utilities — take every variant, listed in the catalog / IntelliSense
      api.addUtilities({ '.content-auto': { 'content-visibility': 'auto' } });
      // dynamic utilities: tab-4 (theme) and tab-[3] (arbitrary)
      api.matchUtilities({ tab: (v) => ({ tabSize: v }) }, { values: api.theme('spacing') });
      // components (postcss-nested `&`), emitted after the built-in ones
      api.addComponents({
        '.card': { padding: api.theme('spacing.4'), '&:hover': { opacity: '0.9' } },
      });
      api.matchComponents({ 'card-w': (v) => ({ width: v }) }, { values: { sm: '20rem' } });
      // base layer
      api.addBase({ h1: { fontSize: api.theme('fontSize.2xl')[0] } });
      // variants: hocus:flex → :hover and :focus; nth-1:flex / nth-[3]:flex
      api.addVariant('hocus', ['&:hover', '&:focus']);
      api.matchVariant('nth', (v) => `&:nth-child(${v})`, { values: { 1: '1' } });
    },
  ],
};
```

`<a class="content-auto tab-4 tab-[3] card card-w-sm hocus:flex nth-[3]:flex md:hocus:p-2">`
compiles to:

```css
.content-auto {
  content-visibility: auto;
}
.card {
  padding: 1rem;
}
.card:hover {
  opacity: 0.9;
}
.tab-4 {
  tab-size: 1rem;
}
.tab-\[3\] {
  tab-size: 3;
}
.card-w-sm {
  width: 20rem;
}
.hocus\:flex:hover {
  display: flex;
}
.hocus\:flex:focus {
  display: flex;
}
.nth-\[3\]\:flex:nth-child(3) {
  display: flex;
}
@media (min-width: 768px) {
  .md\:hocus\:p-2:hover {
    padding: 0.5rem;
  }
  .md\:hocus\:p-2:focus {
    padding: 0.5rem;
  }
}
```

| Method                                          | Notes                                                                                     |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `addUtilities(rules, options?)`                 | object or array; keys are selectors (`.x`, `.x:hover`, `@media`), camelCase props allowed |
| `matchUtilities({ name: fn }, options?)`        | `options.values` (theme object) + arbitrary `name-[…]`; `fn(value, { modifier })`         |
| `addComponents(rules, options?)`                | same shape; nesting via `&`; adjacent identical selectors collapse                        |
| `matchComponents({ name: fn }, options?)`       | dynamic components                                                                        |
| `addBase(rules)`                                | appended to the base layer (after preflight and `--tw-*` defaults)                        |
| `addVariant(name, selector \| selectors \| fn)` | `&` placeholders, `@media …` strings, arrays for parallel branches                        |
| `matchVariant(name, fn, { values })`            | `name-key:` and `name-[…]:`                                                               |
| `theme(path, default?)`                         | resolved theme (`spacing.4`, `colors.blue.500`, `fontSize.2xl`)                           |
| `config(path, default?)`                        | resolved config (`darkMode`, `prefix`, …)                                                 |
| `corePlugins(name)`                             | whether a core group is enabled                                                           |
| `e(str)` / `prefix(selector)`                   | class escaping / prefix application                                                       |

Numeric values get `px` unless the property is unitless (`lineHeight`,
`zIndex`, `opacity`, …) — Tailwind semantics. The object form additionally
gets a `config(cfg)` hook that runs before theme resolution (extend the
theme, flip options). Every method above is exercised by
`packages/@nakshora/core/test/plugin-api.test.ts`.

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
