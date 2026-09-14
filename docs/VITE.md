# Vite Plugin

`@nakshora/vite-plugin` — the smoothest Nakshora experience: virtual CSS
module, PostCSS `@nakshora` support and HMR.

## Install

```bash
npm install -D @nakshora/vite-plugin
```

(`vite ^5 || ^6 || ^7 || ^8` is a peer dependency; every major is exercised by a real `vite build` in the test suite. Vite 7+ needs Node ≥ 20.19.)

## Quick start

```js
// vite.config.js
import { defineConfig } from 'vite';
import { nakshora } from '@nakshora/vite-plugin';

export default defineConfig({
  plugins: [
    nakshora({
      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
    }),
  ],
});
```

```js
// src/main.js
import 'nakshora'; // ← all of Nakshora, compiled for your content
```

```bash
npm run dev
```

That's it. Change classes → HMR refresh.

## Options

```js
nakshora({
  config: { /* NakshoraConfig: theme, safelist, important, plugins… */ },
  content: string | string[],  // JIT globs relative to the project root (overrides config.content)
  minify: false,               // Vite minifies in production anyway
  postcss: true,               // also process @nakshora at-rules in .css files
})
```

## How it works

1. **Virtual module** — `import 'nakshora'` (or `import 'virtual:nakshora'`)
   resolves to a virtual CSS module the plugin generates on the fly:
   - `content` configured → **JIT** compile of exactly your classes
   - no content → full build
2. **PostCSS pipeline** — the plugin injects `@nakshora/postcss` into Vite's
   CSS processing, so real `.css` files can use `@nakshora source;` etc.
3. **HMR** — content directories are watched; on change the virtual module is
   invalidated and the browser refreshes.

## CSS-file style

Instead of the virtual module, keep a classic entry file:

```css
/* src/nakshora.css */
@nakshora source;
```

```js
// src/main.js
import './nakshora.css';
```

Every `.css` file in the project goes through the bundled PostCSS plugin, so
`@nakshora …` at-rules, `@apply`, `theme()` and `@screen` work in any
stylesheet (see [POSTCSS.md](POSTCSS.md#apply-theme-screen-and-screen)).

## Framework wrappers

- **Vue 3 + Vite** — same as vanilla; `content: ['*.html', 'src/**/*.{vue,js,ts}']`
- **React + Vite** — `content: ['index.html', 'src/**/*.{js,ts,jsx,tsx}']`
- **SvelteKit** — `content: ['src/**/*.{svelte,js,ts}']`
- **SolidJS / Preact / Lit** — same pattern with your extension list

## Production

```bash
npm run build
```

Vite bundles the compiled CSS into your output (hashed, minified,
tree-sized by JIT).
