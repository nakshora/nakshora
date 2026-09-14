# Migration Guide

## From Nakshora v1 (static CSS)

v1 was a single static file (`min.main.css`) with everything baked in.
v3 is a compiler. The v1 file is frozen at `minified-version/v1.0.0.css`; the
`min.main.css` URL now serves the v3 full build (`dist/css/nakshora.min.css`).

The whole v1 design system (palettes `neon-*`, `pastel-*`, `mono`, `forest`,
`ocean`, `sunset`, `brutal-*`; components `btn*`, `card*`, `input*`, `badge*`,
`progress*`, `alert*`, `tabs`/`tab`, `toggle`, `spinner-neon`, `navbar-glass`,
`glass`, `neu-light`, glow/gradient helpers; fluid `text-*` scale) is expressed
as a real Nakshora config in [`site/nakshora.config.mjs`](../site/nakshora.config.mjs):
palettes → `theme.extend.colors`, tokens → `theme.extend.*`, components →
`plugins[].addComponents`. Copy it as your `nakshora.config.js` to keep the v1
look on the v3 compiler; the landing page (`index.html`) is built exactly that way.

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

The utility grammar is Tailwind v3.4's: **11,343 static + 1,338 dynamic
classes** compile byte-identically (see [COMPATIBILITY.md](./COMPATIBILITY.md)
§1 for the measured list and §3 for the 15 v4-only features that are not
supported). Markup ports 1:1; the config needs a few edits — and
`nakshora migrate` does the mechanical ones for you.

### 1. Run the codemod

```bash
npx nakshora migrate            # dry run: shows every change
npx nakshora migrate --write    # apply
npx nakshora doctor             # verify the result
```

`migrate --from tailwind` (the default):

- copies `tailwind.config.{js,cjs,mjs,ts}` to `nakshora.config.*` (existing
  file is never overwritten), replaces the `import('tailwindcss').Config`
  type comment with `import('@nakshora/core').NakshoraConfig`, and rewrites
  `tailwindcss/defaultTheme`, `tailwindcss/colors` and `tailwindcss/plugin`
  imports to their `@nakshora/core` named exports;
- prints review notes for the keys that behave differently (below);
- rewrites the renamed utilities in your sources (`flex-grow` → `grow`,
  `flex-shrink` → `shrink`, `overflow-ellipsis` → `text-ellipsis`,
  `decoration-slice/clone` → `box-decoration-*`).

### 2. Review the config

| Tailwind                                                     | Nakshora                                                                                                              |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `@tailwind base; @tailwind components; @tailwind utilities;` | `@nakshora source;` (or `@nakshora base; @nakshora components; @nakshora utilities;`)                                 |
| `tailwind.config.js`                                         | `nakshora.config.{js,cjs,mjs,ts,json}` — same shape                                                                   |
| `npx tailwindcss -i in.css -o out.css`                       | `nakshora build in.css -o out.css --minify`                                                                           |
| `content`, `safelist`, `prefix`, `important`, `corePlugins`  | identical semantics                                                                                                   |
| `theme.screens` (5 breakpoints)                              | 10 breakpoints `xxs`…`5xl` by default; setting `theme.screens` **replaces** the scale, `theme.extend.screens` adds    |
| `darkMode: 'media'` (Tailwind default)                       | default is `'class'` (`.dark` ancestor); set `darkMode: 'media'` or `['selector', '[data-theme=dark]']` to keep yours |
| `@apply`, `theme()`, `screen()`                              | supported, including variants and `!important`                                                                        |
| arbitrary values / properties / variants                     | supported (`w-[37px]`, `[mask-type:luminance]`, `[&>*]:p-2`, `supports-[…]`, `has-[…]`)                               |
| `@layer components { … }` in author CSS                      | supported: emitted in the fixed order base → components → utilities                                                   |
| `plugin(fn)`, `plugin.withOptions`, official plugins         | run through the plugin adapter unchanged (typography, forms, aspect-ratio, container-queries verified)                |
| `presets`, `separator`                                       | `presets` accepted (theme merged); `separator` fixed to `:`                                                           |
| `@tailwind variants`, `theme.extend.screens` `raw:`          | ignored / not supported (see COMPATIBILITY §3)                                                                        |

### 3. Update the build integration

| Tailwind                             | Nakshora                                                        |
| ------------------------------------ | --------------------------------------------------------------- |
| `tailwindcss` in `postcss.config.js` | `@nakshora/postcss` ([POSTCSS.md](./POSTCSS.md))                |
| `@tailwindcss/vite`                  | `@nakshora/vite-plugin` ([VITE.md](./VITE.md))                  |
| `tailwindcss` CLI (`-i/-o/-w/-m`)    | `nakshora build/dev` (`-o`, `--watch`, `--minify`, `--content`) |
| Tailwind IntelliSense                | `nakshora lsp` language server ([EDITORS.md](./EDITORS.md))     |

Uninstall `tailwindcss` afterwards; `nakshora doctor` warns while both are
installed because the two PostCSS plugins would fight over `@apply`.
