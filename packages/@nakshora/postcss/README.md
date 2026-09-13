# @nakshora/postcss

**Nakshora for any PostCSS pipeline** — webpack, Next.js, Laravel, Gulp,
esbuild, Rollup. Adds the `@nakshora …` at-rules so a plain `.css` file compiles
to utility-first CSS (full build or JIT).

[![npm version](https://img.shields.io/npm/v/@nakshora/postcss?color=blue)](https://www.npmjs.com/package/@nakshora/postcss)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/nakshora/nakshora/blob/main/LICENSE)
![node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)

Nakshora is a utility-first CSS framework with a JIT compiler and a
Tailwind-compatible class grammar. On Vite, prefer
[@nakshora/vite-plugin](https://www.npmjs.com/package/@nakshora/vite-plugin)
(it wraps this plugin and adds a virtual module + HMR). No bundler at all? Use
[@nakshora/cli](https://www.npmjs.com/package/@nakshora/cli).

## Install

```bash
npm install -D @nakshora/postcss postcss
```

`postcss ^8.4` is a peer dependency.

## Quick start

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('@nakshora/postcss')({
      config: {
        content: ['./src/**/*.{html,js,ts,jsx,tsx,blade.php}'],
        safelist: ['lg:flex'],
      },
    }),
  ],
};
```

```css
/* src/nakshora.css */
@nakshora source;
```

```js
// main.js
import './src/nakshora.css';
```

ESM config files work the same way:

```js
// postcss.config.mjs
import nakshora from '@nakshora/postcss';

export default {
  plugins: [nakshora({ content: ['./src/**/*.{html,js,ts,jsx,tsx}'] })],
};
```

## At-rules

| At-rule                            | Emits                                                                        |
| ---------------------------------- | ---------------------------------------------------------------------------- |
| `@nakshora source;`                | base + variables + keyframes + utilities + components (JIT when content set) |
| `@nakshora base;`                  | base layer only                                                              |
| `@nakshora variables;` (or `vars`) | `:root` CSS variables only                                                   |
| `@nakshora keyframes;`             | all `@keyframes`                                                             |
| `@nakshora utilities;`             | utilities (JIT when content is configured)                                   |
| `@nakshora components;`            | built-in design components (glass, neon, brutalist, minimalist, skeletons)   |

## Options

```js
nakshora({
  config: {/* full NakshoraConfig — theme, content, safelist, important, plugins… */},
  content: ['./src/**/*.html'], // JIT content (globs or raw strings) — overrides config.content
  minify: false, // minify the generated CSS
});
```

Content globs resolve relative to the **directory of the CSS file being
processed** (or `process.cwd()` when the file is in-memory).

## Documentation

- [PostCSS guide](https://github.com/nakshora/nakshora/blob/main/docs/POSTCSS.md)
- [Full setup guide](https://github.com/nakshora/nakshora/blob/main/docs/SETUP.md)
- [Configuration](https://github.com/nakshora/nakshora/blob/main/docs/CONFIGURATION.md)
- [JIT compiler](https://github.com/nakshora/nakshora/blob/main/docs/JIT.md)
- [Utilities by category](https://github.com/nakshora/nakshora/blob/main/docs/UTILITIES.md)

## License

MIT © Rizwan Rahim Chowdhury —
[nakshora/nakshora](https://github.com/nakshora/nakshora)
