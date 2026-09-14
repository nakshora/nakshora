# @nakshora/vite-plugin

**The smoothest Nakshora experience** — `import 'nakshora'` as a virtual CSS
module, `@nakshora …` at-rules inside your `.css` files, and HMR when your
markup changes.

[![npm version](https://img.shields.io/npm/v/@nakshora/vite-plugin?color=blue)](https://www.npmjs.com/package/@nakshora/vite-plugin)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/nakshora/nakshora/blob/main/LICENSE)
![node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)

Nakshora is a utility-first CSS framework with a JIT compiler and a
Tailwind-compatible class grammar: 3,091 utilities, state + responsive variants,
design components and theme presets, compiled down to only the classes you use.

## Install

```bash
npm install -D @nakshora/vite-plugin
```

`vite ^5 || ^6 || ^7 || ^8` is a peer dependency (each major is exercised by a real `vite build` in `test/integration.test.ts`; Vite 7+ needs Node ≥ 20.19).

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

Change a class in your markup → the virtual module is invalidated → HMR refresh.

## Options

```js
nakshora({
  config: {/* NakshoraConfig: theme, safelist, important, darkMode, plugins… */},
  content: ['./src/**/*.html'], // JIT globs relative to the project root (overrides config.content)
  minify: false, // Vite minifies in production anyway
  postcss: true, // also process @nakshora at-rules inside .css files
});
```

## How it works

1. **Virtual module** — `import 'nakshora'` (or `import 'virtual:nakshora'`)
   resolves to a generated CSS module:
   - `content` configured → **JIT** compile of exactly the classes you use
   - no content → full build
2. **PostCSS pipeline** — the plugin injects
   [@nakshora/postcss](https://www.npmjs.com/package/@nakshora/postcss) into
   Vite's CSS processing, so real `.css` files can use `@nakshora source;` and
   friends.
3. **HMR** — content paths are watched; on change the virtual module is
   invalidated and the browser updates without a full reload.

## CSS-file style

Prefer a classic entry file over the virtual module?

```css
/* src/nakshora.css */
@nakshora source;
```

```js
import './nakshora.css';
```

## Documentation

- [Vite guide](https://github.com/nakshora/nakshora/blob/main/docs/VITE.md)
- [Full setup guide](https://github.com/nakshora/nakshora/blob/main/docs/SETUP.md)
- [Configuration](https://github.com/nakshora/nakshora/blob/main/docs/CONFIGURATION.md)
- [JIT compiler](https://github.com/nakshora/nakshora/blob/main/docs/JIT.md)
- [Utilities by category](https://github.com/nakshora/nakshora/blob/main/docs/UTILITIES.md)
- [Themes & presets](https://github.com/nakshora/nakshora/blob/main/docs/THEMES.md)

## License

MIT © Rizwan Rahim Chowdhury —
[nakshora/nakshora](https://github.com/nakshora/nakshora)
