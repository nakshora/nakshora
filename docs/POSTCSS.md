# PostCSS Plugin

`@nakshora/postcss` — Nakshora for any PostCSS pipeline (webpack, Laravel,
Gulp, esbuild, Next.js, …).

## Install

```bash
npm install -D @nakshora/postcss postcss
```

(`postcss ^8.4` is a peer dependency.)

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

## Options

```js
nakshora({
  config: { /* full NakshoraConfig — theme, content, safelist, important… */ },
  content: string | string[],  // JIT content (globs or raw strings) — overrides config.content
  minify: false,               // minify generated CSS
})
```

Content globs are resolved relative to the **directory of the CSS file being
processed** (or `process.cwd()` when the file is in-memory).

## At-rules

| At-rule                             | Emits                                                                        |
| ----------------------------------- | ---------------------------------------------------------------------------- |
| `@nakshora source;`                 | base + variables + keyframes + utilities + components (JIT when content set) |
| `@nakshora base;`                   | base layer only                                                              |
| `@nakshora variables;` (or `vars`)  | `:root` CSS variables only                                                   |
| `@nakshora keyframes;`              | all `@keyframes`                                                             |
| `@nakshora utilities;` (or `utils`) | the full utilities set (JIT when content set)                                |
| `@nakshora components;`             | design components only                                                       |

Everything else in your CSS is passed through untouched.

### Layered example

```css
@nakshora base;
@nakshora variables;

/* your overrides / custom CSS — wins over Nakshora utilities below? no: */
/* later rules win. Put @nakshora utilities LAST to override with utilities: */

@nakshora keyframes;
@nakshora utilities;
@nakshora components;
```

## JIT mode

When `content` is provided (option or `config.content`), `source` and
`utilities` compile **only the classes found in the content** — including
responsive and state variants:

```css
/* with content: <button class="bg-blue-500 hover:bg-blue-600 md:px-6">…</button> */
@nakshora utilities;
```

```css
.bg-blue-500 {
  background-color: #3b82f6;
}
.hover\:bg-blue-600:hover {
  background-color: #2563eb;
}
@media (min-width: 768px) {
  .md\:px-6 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}
```

## Webpack example

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
};
```

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('@nakshora/postcss')({
      config: { content: ['src/**/*.{html,js,ts,jsx,tsx}'] },
    }),
  ],
};
```

## Laravel (Vite)

```js
// vite.config.js (Laravel)
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { nakshora } from '@nakshora/vite-plugin'; // ← easiest path

export default defineConfig({
  plugins: [
    laravel({ input: ['resources/css/app.css', 'resources/js/app.js'] }),
    nakshora({ content: ['./resources/**/*.{php,js,vue}'] }),
  ],
});
```

`resources/css/app.css`:

```css
@nakshora source;
```
