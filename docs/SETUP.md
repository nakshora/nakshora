# ⭐ Nakshora — Full Setup Guide

The complete, end-to-end guide: from an empty machine to a deployed project
with Nakshora. Every step is tested against **Nakshora 3.0**.

---

## 📑 Table of contents

1. [Prerequisites](#1-prerequisites)
2. [Option A — Vite (recommended)](#2-option-a-vite-recommended)
3. [Option B — PostCSS (webpack, Laravel, Gulp, any bundler)](#3-option-b-postcss)
4. [Option C — CLI only (plain HTML, no bundler)](#4-option-c-cli-only-plain-html-no-bundler)
5. [Option D — Next.js (App & Pages router)](#5-option-d-nextjs)
6. [Option E — Plain HTML + CDN (no build at all)](#6-option-e-plain-html--cdn)
7. [Verifying your setup](#7-verifying-your-setup)
8. [Dark mode](#8-dark-mode)
9. [Theming](#9-theming)
10. [Publishing & deployment](#10-publishing--deployment)
11. [Checklist](#11-checklist)

---

## 1. Prerequisites

| Tool          | Minimum                     | Check                |
| ------------- | --------------------------- | -------------------- |
| Node.js       | 18.0.0 (22 LTS recommended) | `node -v`            |
| npm or pnpm   | npm 9+ / pnpm 9+            | `npm -v` / `pnpm -v` |
| A code editor | any                         | —                    |

> 💡 TypeScript config files (`nakshora.config.ts`) need Node ≥ 22.18
> (native type stripping). On older Node use `.js`/`.mjs`/`.json`.

---

## 2. Option A — Vite (recommended)

The Vite plugin gives you a virtual CSS module, PostCSS `@nakshora` support
and HMR for JIT content changes.

### Step 1 — create a Vite project

```bash
npm create vite@latest my-app -- --template vanilla
cd my-app
```

### Step 2 — install Nakshora

```bash
npm install @nakshora/vite-plugin
# or: pnpm add -D @nakshora/vite-plugin
```

### Step 3 — configure the plugin

```js
// vite.config.js
import { defineConfig } from 'vite';
import { nakshora } from '@nakshora/vite-plugin';

export default defineConfig({
  plugins: [
    nakshora({
      // JIT: scan these files for class names — only used classes are compiled
      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
      // optional theme / config overrides (see Configuration.md)
      config: {
        theme: {},
        safelist: [],
      },
    }),
  ],
});
```

### Step 4 — import the stylesheet

```js
// src/main.js
import 'nakshora'; // ← injects the compiled Nakshora CSS
import './app.js';
```

(Alternatively use a real CSS file: `src/nakshora.css` containing
`@nakshora source;` and `import './nakshora.css'`.)

### Step 5 — run

```bash
npm run dev
```

Open the URL Vite prints. Change classes in your source → the browser
refreshes automatically (HMR).

### Production build

```bash
npm run build   # Vite bundles + minifies the JIT CSS
npm run preview
```

---

## 3. Option B — PostCSS

Works with webpack, Laravel Vite/Tailwind pipelines, Gulp, esbuild-postcss —
any tool that runs PostCSS.

### Step 1 — install

```bash
npm install -D @nakshora/postcss postcss
```

### Step 2 — configure

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('@nakshora/postcss')({
      config: {
        content: ['./src/**/*.{html,js,ts,jsx,tsx}'], // JIT mode
        safelist: ['lg:flex'],
      },
      minify: false, // let your bundler minify
    }),
  ],
};
```

### Step 3 — entry CSS

```css
/* src/nakshora.css */
@nakshora source; /* base + variables + keyframes + utilities + components */

/* or, to control layers yourself: */
@nakshora base;
@nakshora variables;
@nakshora keyframes;
@nakshora utilities; /* JIT when content is configured */
@nakshora components;
```

Import `src/nakshora.css` in your app. See the [PostCSS docs](./POSTCSS.md)
for all at-rules.

---

## 4. Option C — CLI only (plain HTML, no bundler)

Perfect for static sites, email templates, or any environment without a
bundler.

### Step 1 — install (global or local)

```bash
npm install -g @nakshora/cli
# or locally: npm install -D @nakshora/cli
```

### Step 2 — scaffold

```bash
mkdir my-site && cd my-site
nakshora init
```

This creates:

```
my-site/
├── nakshora.config.js   # content globs, theme, plugins…
└── nakshora.css         # @nakshora source; @nakshora utilities;
```

### Step 3 — write your markup

```html
<!-- index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Nakshora site</title>
    <link rel="stylesheet" href="nakshora.css" />
  </head>
  <body>
    <div class="min-h-screen flex items-center justify-center bg-slate-900">
      <div class="glass p-8 text-center">
        <h1 class="text-3xl font-bold text-white">Hello, Nakshora 🎸</h1>
        <button class="neon-btn mt-6">Wow</button>
      </div>
    </div>
  </body>
</html>
```

### Step 4 — build

```bash
nakshora build nakshora.css -o nakshora.css --minify
```

Replaces the at-rules with only the classes it found in your content globs
(JIT). Watch mode:

```bash
nakshora dev nakshora.css -o nakshora.css
```

See the full [CLI reference](./CLI.md).

---

## 5. Option D — Next.js

### App Router

```bash
npm install -D @nakshora/postcss postcss
```

```js
// postcss.config.mjs
import nakshora from '@nakshora/postcss';

export default {
  plugins: {
    nakshora: nakshora({
      config: {
        content: ['./app/**/*.{js,jsx,ts,tsx,mdx}'],
      },
    }),
  },
};
```

```css
/* app/globals.css */
@nakshora source;
```

```js
// app/layout.js
import './globals.css';
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Pages Router

Same, but the entry CSS is `styles/globals.css` imported in `_app.js`.

> Next.js already runs PostCSS, so the plugin needs no bundler changes.
> For dev HMR of JIT content, run `nakshora dev` alongside or rely on Next's
> CSS rebuild on file changes.

---

## 6. Option E — Plain HTML + CDN

Zero build step. Use the static full build (base + responsive; state
variants require JIT — see note below).

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/nakshora/nakshora@main/dist/css/nakshora.min.css"
/>
```

```html
<div class="flex items-center gap-4 p-6 max-w-3xl mx-auto">
  <h1 class="text-2xl font-bold text-gray-900">CDN mode</h1>
</div>
```

> ⚠️ The CDN file is a **full build**: every base + responsive utility.
> `hover:` / `dark:` / `group-*` variants are JIT-only — for those, use the
> CLI (Option C) to compile a project-specific bundle and host it yourself.

---

## 7. Verifying your setup

### a) Check the generated CSS

Build and inspect:

```bash
nakshora inspect | head -50        # full build, first 50 lines
nakshora build -o /tmp/n.css && wc -c /tmp/n.css
```

Expected markers:

```css
/*! Nakshora v3.0.0 — … */
*, ::before, ::after { box-sizing: border-box; … }
:root { --color-blue-500: #3b82f6; … }
@keyframes spin { … }
.flex { display: flex; }
@media (min-width: 640px) { .sm\:flex { display: flex; } }
.glass { … }   /* components */
```

### b) Sanity test in the browser

```html
<div class="flex items-center gap-4">
  <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
    Hover me
  </button>
  <div class="md:grid md:grid-cols-2 gap-4">
    <div class="p-4 bg-emerald-100">a</div>
    <div class="p-4 bg-sky-100">b</div>
  </div>
</div>
```

- Button changes color on hover → variants work (JIT)
- The two boxes go side-by-side at ≥768px → responsive works

### c) Run the framework test suite (if you cloned the repo)

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm test          # 53 tests
pnpm type-check
pnpm lint
```

---

## 8. Dark mode

Class-based dark mode (opt in by adding `class="dark"` to `<html>`):

```html
<html class="dark">
  <body>
    <div class="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Adapts to .dark</div>
  </body>
</html>
```

Toggle from JS:

```js
document.documentElement.classList.toggle('dark');
```

`dark:` is a JIT variant — make sure your content globs include the markup
that uses it.

---

## 9. Theming

Override any theme section in the config (deep-merged with defaults):

```js
// nakshora.config.js
export default {
  theme: {
    colors: {
      brand: { 500: '#6d28d9', 600: '#5b21b6' }, // → text-brand-500, bg-brand-600…
      blue: { 500: '#123456' }, // override a single shade
    },
    spacing: { 21: '5.25rem' }, // add scale keys
    fontFamily: { sans: '"Inter", system-ui, sans-serif' },
    borderRadius: { lg: '1rem' },
    breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536, wide: 1800 },
    shadows: { glow: '0 0 24px rgba(59,130,246,.5)' },
    animation: { wiggle: 'wiggle 1s ease-in-out infinite' },
    keyframes: { wiggle: '0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); }' },
  },
};
```

Or apply a built-in preset (neon, pastel, brutalist, minimalist, nature):

```js
import { neonTheme } from '@nakshora/core';

export default {
  theme: { colors: neonTheme.colors, typography: neonTheme.typography },
};
```

Full details: [Configuration](./CONFIGURATION.md) and [Themes](./THEMES.md).

---

## 10. Publishing & deployment

| Target            | Do this                                                                         |
| ----------------- | ------------------------------------------------------------------------------- |
| Static site (CLI) | `nakshora build nakshora.css -o dist/nakshora.min.css --minify`, upload `dist/` |
| Vite/webpack      | normal `npm run build` — the CSS is bundled & minified                          |
| Next.js           | normal `next build`                                                             |
| Self-hosted CDN   | host `dist/css/nakshora.min.css` (full build) or a JIT bundle per project       |

CI publishing of the framework packages themselves (npm + GitHub Packages)
is fully automatic — see [Publishing](./PUBLISHING.md).

---

## 11. Checklist

- [ ] Node ≥ 18 (22 LTS recommended) installed
- [ ] Package installed (`@nakshora/vite-plugin` / `@nakshora/postcss` / `@nakshora/cli`)
- [ ] Integration configured (Vite plugin / postcss config / CLI config)
- [ ] `content` globs cover all files that contain classes
- [ ] `import 'nakshora'` (or entry CSS with `@nakshora source;`)
- [ ] Build succeeds; generated CSS contains your classes
- [ ] Hover/variant + responsive behavior verified in browser
- [ ] Dark mode (optional) toggling works
- [ ] Production build minified and deployed

Stuck? → [Troubleshooting](./TROUBLESHOOTING.md)
