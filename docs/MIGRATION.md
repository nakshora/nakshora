# Migration Guide

## From Nakshora v1 (static CSS)

v1 was a single static file (`min.main.css`) with everything baked in.
v3 is a compiler.

| v1                                        | v3                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------- |
| `<link href="…/min.main.css">`            | JIT build via CLI/Vite/PostCSS, or the new CDN file                       |
| `text-mono-100`, `bg-neon-purple-500`     | presets: `text-primary-500` with `neonTheme` colors (or default palettes) |
| `.card-neon`, `.btn-neon`, `.glass-light` | `.neon-card`, `.neon-btn`, `.glass` / `.glass-light`                      |
| `.skeleton-rect`, `.skeleton-circle`      | unchanged names, same behavior                                            |
| `.animate-neonGlow`, `.hover-lift`        | `.animate-*` from theme.animation; `.hover-lift` unchanged                |
| `uhd:` / `k8:` breakpoints                | custom breakpoints in config (`theme.breakpoints`)                        |

Typical migration:

```bash
npm install -D @nakshora/cli
nakshora init
```

```js
// nakshora.config.js
import { neonTheme } from '@nakshora/core';

export default {
  content: ['./**/*.html'],
  theme: { colors: neonTheme.colors },
};
```

Then point your HTML at the compiled file.

### Renamed component classes (v1 → v3)

| v1 class          | v3 class                 |
| ----------------- | ------------------------ |
| `.card-neon`      | `.neon-card`             |
| `.btn-neon`       | `.neon-btn`              |
| `.glass-light`    | `.glass-light` (same)    |
| `.brutalist-card` | `.brutalist-card` (same) |
| `.hover-lift`     | `.hover-lift` (same)     |
| `.gradient-text`  | `.gradient-text` (same)  |

## From Nakshora v2

v2's `CSSGenerator` API is preserved:

```js
import { CSSGenerator } from '@nakshora/core';
const css = new CSSGenerator({ theme: { … } }).generate({ minify: true });
```

Changes:

- Fixed: `.mr-*`/`-right` spacing utilities emitted the scale **key**
  instead of the value (bug) — now correct.
- Fixed: responsive media queries were empty stubs — now every utility has
  real responsive variants.
- Added: state variants (`hover:`, `dark:`, `group-*`, `peer-*`, …) in JIT.
- Added: sizing/inset/z-index/overflow/visibility/filters/cursors groups,
  named `max-w-*` scale, gradients, `sr-only`, animation keyframes.
- `generate({ mode: 'full' | 'jit' })` — `jit` is automatic when `content`
  is set.
- New: `getBase/getVariables/getKeyframes/getUtilitiesFull/getComponents`,
  `getStats`, `getUtilities`, `generateFromContent`, AI corpus exports.
- Themes now import correctly (v2 shipped broken `./types` imports) and
  gained a `description` field.
- Config: `content` preferred over `purge`; deep-merge in `mergeConfig`.

## From Tailwind CSS

The utility surface is intentionally familiar, so most markup ports 1:1.
Differences:

| Tailwind                                                     | Nakshora                                                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `@tailwind base; @tailwind components; @tailwind utilities;` | `@nakshora source;` (or layered at-rules)                                |
| `tailwind.config.js`                                         | `nakshora.config.{js,ts,json}`                                           |
| `npx tailwindcss -i in.css -o out.css`                       | `nakshora build in.css -o out.css --minify`                              |
| `content: []`                                                | `content: []` (same semantics)                                           |
| `darkMode: 'class'`                                          | `dark:` variants (class strategy built in)                               |
| arbitrary values `w-[37px]`                                  | spacing scale + custom `theme.spacing` keys (no bracket syntax)          |
| `@layer`                                                     | fixed layer order: base → variables → keyframes → utilities → components |
| plugins via `plugin(...)`                                    | plugin objects with `handler(api)` (addUtilities/addComponents/addBase)  |

Arbitrary-value patterns: add the needed token to the theme instead:

```js
theme: { spacing: { 37: '37px' } } // → w-37, p-37, …
```
