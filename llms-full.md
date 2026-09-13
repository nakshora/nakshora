# Nakshora — Complete Documentation (for LLMs)

> This file is the complete Nakshora documentation assembled into a single document.
> Framework: Nakshora v3 — utility-first CSS framework with a JIT compiler.


<!-- ===== README.md (#readme-md) ===== -->

<div align="center">

![Nakshora](img/android-chrome-512x512.png)

# Nakshora

**The modern, ultra-fast, utility-first CSS framework with a JIT compiler.**

[![Test & Quality](https://github.com/nakshora/nakshora/actions/workflows/test.yml/badge.svg)](https://github.com/nakshora/nakshora/actions/workflows/test.yml)
[![Release & Publish](https://github.com/nakshora/nakshora/actions/workflows/release.yml/badge.svg)](https://github.com/nakshora/nakshora/actions/workflows/release.yml)
[![Performance](https://github.com/nakshora/nakshora/actions/workflows/performance.yml/badge.svg)](https://github.com/nakshora/nakshora/actions/workflows/performance.yml)
[![@nakshora/core version](https://img.shields.io/npm/v/@nakshora/core?color=blue)](https://www.npmjs.com/package/@nakshora/core)
[![npm downloads](https://img.shields.io/npm/dm/@nakshora/core)](https://www.npmjs.com/package/@nakshora/core)
![node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![code style](https://img.shields.io/badge/code_style-prettier-f7b93e)](https://prettier.io)
[![AI-ready](https://img.shields.io/badge/AI%20ready-llms.txt%20%C2%B7%20corpus%20%C2%B7%20SFT-8b5cf6)](docs/AI_TRAINING.md)

<br/>

`3,091 utilities` · `29 categories` · `22 color palettes` · `5 theme presets` · `zero runtime JS` · `~4 ms JIT build`

</div>

---

## ✨ Features

|                                 |                                                                                                                                                                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ⚡ **JIT compiler**             | Only the classes you use are compiled — KB-sized CSS from a 3,091-utility catalog                                                                                                                                        |
| 🎨 **Utility-first**            | 3,091 utilities across 29 categories: layout, spacing, sizing, flexbox, grid, typography, colors, borders, effects, transforms, transitions, animations                                                                  |
| 🌈 **22 palettes × 11 shades**  | `slate gray zinc neutral stone red orange amber yellow lime emerald green teal cyan sky blue indigo violet purple fuchsia pink rose` — auto-generates `text-*` `bg-*` `border-*` `from-*` `via-*` `to-*` + CSS variables |
| 📱 **Mobile-first responsive**  | `sm:` `md:` `lg:` `xl:` `2xl:` (640–1536px) — custom breakpoints supported                                                                                                                                               |
| 🧩 **State variants**           | `hover:` `focus:` `active:` `disabled:` `first:` `last:` `dark:` `group-hover:` `group-focus:` `peer-hover:` `peer-focus:` `focus-visible:` `focus-within:` `visited:` — combinable: `md:hover:bg-blue-600`              |
| 🧊 **Design components**        | Glassmorphism (`.glass*`), Neon Cyber (`.neon-*`), Brutalism (`.brutalist-*`), Minimalism (`.minimalist-*`), skeletons (`.skeleton-*`), helpers (`.hover-lift`, `.gradient-*`)                                           |
| 🎭 **5 theme presets**          | Neon Cyber · Pastel Dream · Brutalist · Ultra Minimalist · Nature Inspired — plus a fully open theme system                                                                                                              |
| 🤖 **AI-ready**                 | `llms.txt`, `llms-full.md`, structured utility corpus (`ai/corpus.json`) and SFT dataset (`ai/sft-train.jsonl`) — teach any LLM Nakshora in one command                                                                  |
| 🔌 **First-class integrations** | Vite plugin (virtual module + HMR), PostCSS plugin, CLI, programmatic API — Tailwind-compatible config & class grammar                                                                                                   |
| 🚀 **Automatic publishing**     | Changesets + GitHub Actions: version bump → npm (with provenance) → GitHub Packages mirror → GitHub Release with tarballs, all on merge                                                                                  |
| ✅ **Engineered**               | pnpm monorepo, TypeScript strict, 53 tests, ESLint 9 + Prettier, dual ESM/CJS builds + d.ts, Node 18/20/22 CI matrix                                                                                                     |

## 🚀 Quick start

### Vite (recommended)

```bash
npm install -D @nakshora/vite-plugin
```

```js
// vite.config.js
import { defineConfig } from 'vite';
import { nakshora } from '@nakshora/vite-plugin';

export default defineConfig({
  plugins: [
    nakshora({
      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'], // JIT
    }),
  ],
});
```

```js
// src/main.js
import 'nakshora';
```

### PostCSS (webpack, Next.js, Laravel…)

```bash
npm install -D @nakshora/postcss postcss
```

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('@nakshora/postcss')({
      config: { content: ['./src/**/*.{html,js,ts,jsx,tsx}'] },
    }),
  ],
};
```

```css
/* your entry css */
@nakshora source;
```

### CLI (no bundler)

```bash
npm install -D @nakshora/cli
nakshora init
nakshora build nakshora.css -o dist/nakshora.min.css --minify
```

→ **The complete path** (every integration, dark mode, theming, deployment): [Full Setup Guide](docs/SETUP.md)

## 🧱 Markup, not ceremony

```html
<button
  class="px-5 py-2.5 bg-blue-500 text-white font-semibold rounded-lg
               hover:bg-blue-600 active:scale-95 transition shadow-md"
>
  Click me
</button>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="glass p-6 rounded-xl">
    <h3 class="text-lg font-bold text-white">Glassmorphism</h3>
    <p class="mt-2 text-sm text-slate-300">Backdrop blur, zero config.</p>
  </div>
  <div class="neon-card p-6">
    <p class="neon-text font-bold">NEON CYBER</p>
  </div>
  <div class="brutalist-card p-6">
    <button class="brutalist-btn mt-2">RAW</button>
  </div>
</div>

<!-- dark mode: class="dark" on <html> -->
<div class="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-4">
  Adapts automatically.
</div>
```

Compiled (JIT) — only what you used:

```css
.bg-blue-500 {
  background-color: #3b82f6;
}
.hover\:bg-blue-600:hover {
  background-color: #2563eb;
}
@media (min-width: 640px) {
  .sm\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
/* … a few KB, not a few hundred KB … */
```

## 📦 Packages

| Package                                                   | Description                                           | Install                          |
| --------------------------------------------------------- | ----------------------------------------------------- | -------------------------------- |
| [`@nakshora/core`](packages/@nakshora/core)               | JIT CSS compiler & engine — zero runtime dependencies | `npm i @nakshora/core`           |
| [`@nakshora/cli`](packages/@nakshora/cli)                 | `nakshora init / build / dev / inspect / export:ai`   | `npm i -D @nakshora/cli`         |
| [`@nakshora/postcss`](packages/@nakshora/postcss)         | `@nakshora source;` / `@nakshora utilities;` at-rules | `npm i -D @nakshora/postcss`     |
| [`@nakshora/vite-plugin`](packages/@nakshora/vite-plugin) | `import 'nakshora'` + HMR + PostCSS pipeline          | `npm i -D @nakshora/vite-plugin` |

## 📚 Documentation

| Start here                                      | Reference                                                                                      |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [Getting Started](docs/GETTING_STARTED.md)      | [Utilities (3,091, by category)](docs/UTILITIES.md)                                            |
| [⭐ Full Setup Guide](docs/SETUP.md)            | [Variants](docs/VARIANTS.md) · [Responsive](docs/RESPONSIVE.md)                                |
| [Installation](docs/INSTALLATION.md)            | [Configuration](docs/CONFIGURATION.md) · [JIT Compiler](docs/JIT.md)                           |
| [Migration (v1/v2/Tailwind)](docs/MIGRATION.md) | [Themes & Presets](docs/THEMES.md) · [Design Components](docs/utilities/13-components.md)      |
|                                                 | [CLI](docs/CLI.md) · [PostCSS](docs/POSTCSS.md) · [Vite](docs/VITE.md) · [JS API](docs/API.md) |

Operations: [Publishing](docs/PUBLISHING.md) · [Performance](docs/PERFORMANCE.md) · [Troubleshooting](docs/TROUBLESHOOTING.md) · [Development](docs/DEVELOPMENT.md) · [Examples](docs/EXAMPLES.md) · [Legacy v2 docs](docs/archive)

## 🤖 AI / LLM training

Nakshora ships machine-readable knowledge of the entire framework:

| Asset                                      | Use                                                      |
| ------------------------------------------ | -------------------------------------------------------- |
| [`llms.txt`](llms.txt)                     | Concise context for any LLM (llms.txt standard)          |
| [`llms-full.md`](llms-full.md)             | Complete documentation, single file (RAG / long-context) |
| [`ai/corpus.json`](ai/corpus.json)         | Structured corpus — every utility, its CSS, examples     |
| [`ai/sft-train.jsonl`](ai/sft-train.jsonl) | SFT dataset (800 examples, `messages` format)            |

```bash
# regenerate from source (they can never drift from the compiler)
pnpm ai:export
```

→ [AI Training Guide](docs/AI_TRAINING.md)

## ⚡ Performance

```
operation                                ms
────────────────────────────────────────────────
full build (3,091 utilities)             ~18
JIT build (200 lines of HTML)            ~4
JIT build + minify                       < 1
```

| Build                        | Size                          |
| ---------------------------- | ----------------------------- |
| full (all base + responsive) | ~860 KB → **~740 KB min**     |
| typical project (JIT)        | **~15 KB min**                |
| runtime JS                   | **0 bytes** (pure CSS output) |

→ [Performance details](docs/PERFORMANCE.md)

## 🚀 Automatic publishing

Push a changeset to `main` → CI tests (Node 18/20/22) → bumps versions → **publishes to npm with provenance** → mirrors to **GitHub Packages** → creates a **GitHub Release** with changelog + tarballs.

```bash
pnpm changeset:add     # in your PR — that's the whole release process
```

→ [Publishing docs](docs/PUBLISHING.md)

## 🏗️ Monorepo

```
nakshora/
├── packages/@nakshora/core          # JIT engine (the heart)
├── packages/@nakshora/cli           # CLI (bin: nakshora)
├── packages/@nakshora/postcss       # PostCSS plugin
├── packages/@nakshora/vite-plugin   # Vite plugin
├── tools/ts-config                  # shared TypeScript config
├── scripts/                         # benchmarks, docs/AI generators
├── docs/                            # full documentation
├── ai/                              # LLM training assets
└── .github/workflows/               # test · release · performance
```

```bash
corepack enable && pnpm install --frozen-lockfile
pnpm build && pnpm test && pnpm lint
```

## 🏷️ Keywords

`css` `framework` `utility-first` `tailwind` `responsive` `jit` `compiler` `postcss` `vite` `cli` `monorepo` `dark-mode` `glassmorphism` `neon` `brutalist` `css-variables` `a11y` `ai-training`

## 👥 Community

- **Website** — [nakshora.dev](https://nakshora.dev)
- **GitHub** — [nakshora/nakshora](https://github.com/nakshora/nakshora)
- **Issues** — [report bugs & request features](https://github.com/nakshora/nakshora/issues)
- **Contributing** — [DEVELOPMENT.md](docs/DEVELOPMENT.md) · [CONTRIBUTING.md](CONTRIBUTING.md)

## 📄 License

[MIT](LICENSE) © Rizwan Rahim Chowdhury (RRC Development)

---

<div align="center">

**Built with** ❤️ **by** [Rizwan Rahim Chowdhury](https://rrc.bsdc.info.bd) **/ RRC Development**

_“A naksha is a pattern. Nakshora draws your interface.”_

</div>


<!-- ===== docs/GETTING_STARTED.md (#docs-getting-started-md) ===== -->

# Getting Started

Build your first Nakshora UI in about five minutes.

> 🧭 Want the complete path (all integrations, dark mode, theming,
> deployment)? Read the [Full Setup Guide](./SETUP.md).

## 1. Install

```bash
# Vite project (recommended)
npm install -D @nakshora/vite-plugin

# or PostCSS
npm install -D @nakshora/postcss postcss

# or CLI (no bundler)
npm install -D @nakshora/cli
```

## 2. Configure (Vite example)

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
import 'nakshora';
```

## 3. Write markup

```html
<!-- index.html -->
<body
  class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6"
>
  <div class="glass p-10 max-w-md w-full text-center">
    <h1 class="text-4xl font-black text-white tracking-tight">Nakshora</h1>
    <p class="mt-3 text-slate-300 leading-relaxed">
      Utility-first CSS with a JIT compiler, neon/glass/brutalist components and first-class dark
      mode.
    </p>
    <button class="neon-btn mt-6">Get started</button>
  </div>
</body>
```

## 4. Run & build

```bash
npm run dev     # dev server with HMR
npm run build   # production bundle
```

## 5. Your first component

### Button

```html
<button
  class="px-5 py-2.5 bg-blue-500 text-white font-semibold rounded-lg
               hover:bg-blue-600 active:scale-95 transition shadow-md"
>
  Click me
</button>
```

### Card

```html
<div
  class="bg-white rounded-xl shadow-md border border-slate-200 p-6 max-w-sm
            hover-lift dark:bg-slate-800 dark:border-slate-700"
>
  <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Card title</h2>
  <p class="mt-2 text-slate-600 dark:text-slate-300">
    Cards are just utilities — compose them however you like.
  </p>
  <a href="#" class="inline-block mt-4 text-blue-500 hover:text-blue-600 font-medium">
    Learn more →
  </a>
</div>
```

### Responsive grid

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- cards… -->
</div>
```

## Next steps

- [Full Setup Guide](./SETUP.md) — every integration, step by step
- [Utilities Reference](./UTILITIES.md) — all 3,000+ classes
- [Variants](./VARIANTS.md) — `hover:`, `dark:`, `group-*`, `peer-*`
- [Responsive](./RESPONSIVE.md) — breakpoints & mobile-first
- [Themes](./THEMES.md) — neon, pastel, brutalist, minimalist, nature
- [AI Training](./AI_TRAINING.md) — teach LLMs Nakshora


<!-- ===== docs/SETUP.md (#docs-setup-md) ===== -->

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


<!-- ===== docs/INSTALLATION.md (#docs-installation-md) ===== -->

# Installation

## Package registry (npmjs.com)

```bash
npm install @nakshora/core          # engine only (library usage)
npm install -D @nakshora/cli        # CLI
npm install -D @nakshora/postcss    # PostCSS plugin
npm install -D @nakshora/vite-plugin # Vite plugin
```

`pnpm add -D …` and `yarn add -D …` work identically.

| Package                 | Size (gzip, dist) | Needs             |
| ----------------------- | ----------------- | ----------------- |
| `@nakshora/core`        | ~25 KB            | nothing           |
| `@nakshora/cli`         | ~40 KB            | Node ≥ 18         |
| `@nakshora/postcss`     | ~30 KB            | `postcss ^8.4`    |
| `@nakshora/vite-plugin` | ~25 KB            | `vite ^5 \|\| ^6` |

## GitHub Packages

```bash
# ~/.npmrc
@nakshora:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=<your GitHub token>

npm install @nakshora/core
```

## CDN (full static build)

```html
<!-- full build (base + responsive; variants require JIT) -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/nakshora/nakshora@main/dist/css/nakshora.min.css"
/>
```

Pinned version:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/nakshora/nakshora@v3.0.0/dist/css/nakshora.min.css"
/>
```

> v1 CDN file (legacy, still served):
> `https://cdn.jsdelivr.net/gh/nakshora/nakshora@main/min.main.css`

## Monorepo (framework development)

```bash
git clone https://github.com/nakshora/nakshora.git
cd nakshora
corepack enable                # or: npm i -g pnpm@9
pnpm install --frozen-lockfile
pnpm build                     # builds all 4 packages
pnpm test
```

Workspace layout:

```
nakshora/
├── packages/@nakshora/core          # JIT engine
├── packages/@nakshora/cli           # CLI (bin: nakshora)
├── packages/@nakshora/postcss       # PostCSS plugin
├── packages/@nakshora/vite-plugin   # Vite plugin
├── tools/ts-config                  # shared tsconfig
├── scripts/                         # benchmarks, doc/AI generators
├── docs/                            # this documentation
├── ai/                              # LLM training assets
└── .github/workflows/               # CI: test / release / performance
```

## Requirements

- Node.js ≥ 18 (22 LTS recommended)
- pnpm ≥ 9 (monorepo only)
- TypeScript config files (`nakshora.config.ts`) require Node ≥ 22.18


<!-- ===== docs/UTILITIES.md (#docs-utilities-md) ===== -->

# Nakshora Utilities Reference

**3,091 utilities** organized into 13 categories. Every table below is
**generated from the framework source** — if you see a class here, the
compiler can emit it.

> 🔑 **Syntax cheat-sheet**
>
> - Color: `<utility>-<palette>-<shade>` → `text-blue-500`, `bg-slate-900`, `from-rose-400`
> - Spacing: `<utility>-<key>` → `p-4`, `mt-2`, `gap-x-6` (keys: `0 px 0.5 1 1.5 2 2.5 3 3.5 4 5 6 7 8 9 10 11 12 14 16 20 24 28 32 36 40 44 48 56 64 72 80 96`)
> - Responsive: `sm:md:lg:xl:2xl:` prefix → `md:grid-cols-2`
> - Variants (JIT): `hover: focus: active: disabled: dark: group-hover: peer-focus:` → `hover:bg-blue-600`
> - Combine (JIT): one responsive + one state → `md:hover:bg-blue-600`

## 📑 Categories

| #   | Category                                                                                     | Utilities |
| --- | -------------------------------------------------------------------------------------------- | --------- |
| 1   | [Layout (display, position, inset, z-index, overflow, visibility)](./utilities/01-layout.md) | ~500      |
| 2   | [Spacing (margin, padding, gap)](./utilities/02-spacing.md)                                  | 561       |
| 3   | [Sizing (width, height, min/max)](./utilities/03-sizing.md)                                  | ~230      |
| 4   | [Flexbox & Grid](./utilities/04-flexbox-grid.md)                                             | ~95       |
| 5   | [Typography & Text Decoration](./utilities/05-typography.md)                                 | ~70       |
| 6   | [Colors (text, background, border, gradient stops)](./utilities/06-colors.md)                | 1,452     |
| 7   | [Backgrounds (position, repeat, size, gradients)](./utilities/07-backgrounds.md)             | ~26       |
| 8   | [Borders & Radius](./utilities/08-borders.md)                                                | ~130      |
| 9   | [Effects (shadows, opacity, filters)](./utilities/09-effects.md)                             | ~55       |
| 10  | [Transforms (scale, rotate, translate)](./utilities/10-transforms.md)                        | ~140      |
| 11  | [Transitions & Animations](./utilities/11-transitions-animations.md)                         | ~35       |
| 12  | [Cursors, Whitespace & Misc](./utilities/12-misc.md)                                         | ~40       |
| 13  | [Design Components (glass, neon, brutalist, skeletons)](./utilities/13-components.md)        | built-in  |

## Quick lookup

**I want to…**

| …do this                        | Use                                             |
| ------------------------------- | ----------------------------------------------- |
| Center content horizontally     | `flex justify-center` or `text-center`          |
| Center content vertically       | `flex items-center` (min-height on parent)      |
| Make a card                     | `bg-white rounded-xl shadow-md p-6`             |
| Add hover effect                | `hover:bg-blue-600 transition`                  |
| 2-col mobile → 4-col desktop    | `grid grid-cols-2 md:grid-cols-4 gap-4`         |
| Full-height layout              | `min-h-screen flex flex-col`                    |
| Glassmorphism                   | `glass` component (+ utilities)                 |
| Dark mode                       | `dark` class on `<html>` + `dark:` variants     |
| Hide on mobile, show on desktop | `hidden md:block`                               |
| Truncate long text              | `truncate`                                      |
| Loading skeleton                | `skeleton-text` / `skeleton-circle`             |
| Sticky header                   | `sticky top-0 z-50`                             |
| Gradient text                   | `gradient-text`                                 |
| Gradient background             | `bg-gradient-to-br from-blue-500 to-purple-600` |


<!-- ===== docs/utilities/README.md (#docs-utilities-readme-md) ===== -->

# Utilities Reference — Index

Every utility the Nakshora compiler can generate, organized by category. Tables are generated from the source registry.

| Reference                                                              | Utilities |
| ---------------------------------------------------------------------- | --------- |
| 1. [Layout Utilities](./01-layout.md)                                  | 272       |
| 2. [Spacing Utilities](./02-spacing.md)                                | 561       |
| 3. [Sizing Utilities](./03-sizing.md)                                  | 228       |
| 4. [Flexbox & Grid Utilities](./04-flexbox-grid.md)                    | 103       |
| 5. [Typography Utilities](./05-typography.md)                          | 65        |
| 6. [Color Utilities](./06-colors.md)                                   | 1452      |
| 7. [Background Utilities](./07-backgrounds.md)                         | 25        |
| 8. [Border Utilities](./08-borders.md)                                 | 106       |
| 9. [Effect Utilities](./09-effects.md)                                 | 56        |
| 10. [Transform Utilities](./10-transforms.md)                          | 158       |
| 11. [Transition & Animation Utilities](./11-transitions-animations.md) | 31        |
| 12. [Cursor, Whitespace & Misc Utilities](./12-misc.md)                | 34        |
| 13. [Design Components](./13-components.md)                            | built-in  |

Total generated utilities: **3091** (+ responsive & state variants in JIT mode).


<!-- ===== docs/utilities/01-layout.md (#docs-utilities-01-layout-md) ===== -->

---
title: Layout Utilities
---

# Layout Utilities

> Part of the [Nakshora Utilities Reference](../UTILITIES.md). These tables are **generated from the framework source** — what you see here is exactly what the compiler emits.

Control how elements are displayed, positioned and stacked in the document flow.

## Display

**9 utilities**

| Class          | CSS                     | Description                                 |
| -------------- | ----------------------- | ------------------------------------------- |
| `block`        | `display: block`        | Block-level element                         |
| `inline-block` | `display: inline-block` | Inline block-level element                  |
| `inline`       | `display: inline`       | Inline element                              |
| `flex`         | `display: flex`         | Flex container                              |
| `inline-flex`  | `display: inline-flex`  | Inline flex container                       |
| `grid`         | `display: grid`         | Grid container                              |
| `inline-grid`  | `display: inline-grid`  | Inline grid container                       |
| `contents`     | `display: contents`     | Element becomes transparent to its children |
| `hidden`       | `display: none`         | Visually hidden (display: none)             |

## Position

**5 utilities**

| Class      | CSS                  | Description        |
| ---------- | -------------------- | ------------------ |
| `static`   | `position: static`   | position: static   |
| `relative` | `position: relative` | position: relative |
| `absolute` | `position: absolute` | position: absolute |
| `fixed`    | `position: fixed`    | position: fixed    |
| `sticky`   | `position: sticky`   | position: sticky   |

## Inset (Offset)

**231 utilities**

| Class         | CSS                      | Description                  |
| ------------- | ------------------------ | ---------------------------- |
| `inset-0`     | `inset: 0`               | inset on all sides           |
| `inset-x-0`   | `inset-inline: 0`        | inset on the horizontal axis |
| `inset-y-0`   | `inset-block: 0`         | inset on the vertical axis   |
| `top-0`       | `top: 0`                 | top offset                   |
| `right-0`     | `right: 0`               | right offset                 |
| `bottom-0`    | `bottom: 0`              | bottom offset                |
| `left-0`      | `left: 0`                | left offset                  |
| `inset-1`     | `inset: 0.25rem`         | inset on all sides           |
| `inset-x-1`   | `inset-inline: 0.25rem`  | inset on the horizontal axis |
| `inset-y-1`   | `inset-block: 0.25rem`   | inset on the vertical axis   |
| `top-1`       | `top: 0.25rem`           | top offset                   |
| `right-1`     | `right: 0.25rem`         | right offset                 |
| `bottom-1`    | `bottom: 0.25rem`        | bottom offset                |
| `left-1`      | `left: 0.25rem`          | left offset                  |
| `inset-2`     | `inset: 0.5rem`          | inset on all sides           |
| `inset-x-2`   | `inset-inline: 0.5rem`   | inset on the horizontal axis |
| `inset-y-2`   | `inset-block: 0.5rem`    | inset on the vertical axis   |
| `top-2`       | `top: 0.5rem`            | top offset                   |
| `right-2`     | `right: 0.5rem`          | right offset                 |
| `bottom-2`    | `bottom: 0.5rem`         | bottom offset                |
| `left-2`      | `left: 0.5rem`           | left offset                  |
| `inset-3`     | `inset: 0.75rem`         | inset on all sides           |
| `inset-x-3`   | `inset-inline: 0.75rem`  | inset on the horizontal axis |
| `inset-y-3`   | `inset-block: 0.75rem`   | inset on the vertical axis   |
| `top-3`       | `top: 0.75rem`           | top offset                   |
| `right-3`     | `right: 0.75rem`         | right offset                 |
| `bottom-3`    | `bottom: 0.75rem`        | bottom offset                |
| `left-3`      | `left: 0.75rem`          | left offset                  |
| `inset-4`     | `inset: 1rem`            | inset on all sides           |
| `inset-x-4`   | `inset-inline: 1rem`     | inset on the horizontal axis |
| `inset-y-4`   | `inset-block: 1rem`      | inset on the vertical axis   |
| `top-4`       | `top: 1rem`              | top offset                   |
| `right-4`     | `right: 1rem`            | right offset                 |
| `bottom-4`    | `bottom: 1rem`           | bottom offset                |
| `left-4`      | `left: 1rem`             | left offset                  |
| `inset-5`     | `inset: 1.25rem`         | inset on all sides           |
| `inset-x-5`   | `inset-inline: 1.25rem`  | inset on the horizontal axis |
| `inset-y-5`   | `inset-block: 1.25rem`   | inset on the vertical axis   |
| `top-5`       | `top: 1.25rem`           | top offset                   |
| `right-5`     | `right: 1.25rem`         | right offset                 |
| `bottom-5`    | `bottom: 1.25rem`        | bottom offset                |
| `left-5`      | `left: 1.25rem`          | left offset                  |
| `inset-6`     | `inset: 1.5rem`          | inset on all sides           |
| `inset-x-6`   | `inset-inline: 1.5rem`   | inset on the horizontal axis |
| `inset-y-6`   | `inset-block: 1.5rem`    | inset on the vertical axis   |
| `top-6`       | `top: 1.5rem`            | top offset                   |
| `right-6`     | `right: 1.5rem`          | right offset                 |
| `bottom-6`    | `bottom: 1.5rem`         | bottom offset                |
| `left-6`      | `left: 1.5rem`           | left offset                  |
| `inset-7`     | `inset: 1.75rem`         | inset on all sides           |
| `inset-x-7`   | `inset-inline: 1.75rem`  | inset on the horizontal axis |
| `inset-y-7`   | `inset-block: 1.75rem`   | inset on the vertical axis   |
| `top-7`       | `top: 1.75rem`           | top offset                   |
| `right-7`     | `right: 1.75rem`         | right offset                 |
| `bottom-7`    | `bottom: 1.75rem`        | bottom offset                |
| `left-7`      | `left: 1.75rem`          | left offset                  |
| `inset-8`     | `inset: 2rem`            | inset on all sides           |
| `inset-x-8`   | `inset-inline: 2rem`     | inset on the horizontal axis |
| `inset-y-8`   | `inset-block: 2rem`      | inset on the vertical axis   |
| `top-8`       | `top: 2rem`              | top offset                   |
| `right-8`     | `right: 2rem`            | right offset                 |
| `bottom-8`    | `bottom: 2rem`           | bottom offset                |
| `left-8`      | `left: 2rem`             | left offset                  |
| `inset-9`     | `inset: 2.25rem`         | inset on all sides           |
| `inset-x-9`   | `inset-inline: 2.25rem`  | inset on the horizontal axis |
| `inset-y-9`   | `inset-block: 2.25rem`   | inset on the vertical axis   |
| `top-9`       | `top: 2.25rem`           | top offset                   |
| `right-9`     | `right: 2.25rem`         | right offset                 |
| `bottom-9`    | `bottom: 2.25rem`        | bottom offset                |
| `left-9`      | `left: 2.25rem`          | left offset                  |
| `inset-10`    | `inset: 2.5rem`          | inset on all sides           |
| `inset-x-10`  | `inset-inline: 2.5rem`   | inset on the horizontal axis |
| `inset-y-10`  | `inset-block: 2.5rem`    | inset on the vertical axis   |
| `top-10`      | `top: 2.5rem`            | top offset                   |
| `right-10`    | `right: 2.5rem`          | right offset                 |
| `bottom-10`   | `bottom: 2.5rem`         | bottom offset                |
| `left-10`     | `left: 2.5rem`           | left offset                  |
| `inset-11`    | `inset: 2.75rem`         | inset on all sides           |
| `inset-x-11`  | `inset-inline: 2.75rem`  | inset on the horizontal axis |
| `inset-y-11`  | `inset-block: 2.75rem`   | inset on the vertical axis   |
| `top-11`      | `top: 2.75rem`           | top offset                   |
| `right-11`    | `right: 2.75rem`         | right offset                 |
| `bottom-11`   | `bottom: 2.75rem`        | bottom offset                |
| `left-11`     | `left: 2.75rem`          | left offset                  |
| `inset-12`    | `inset: 3rem`            | inset on all sides           |
| `inset-x-12`  | `inset-inline: 3rem`     | inset on the horizontal axis |
| `inset-y-12`  | `inset-block: 3rem`      | inset on the vertical axis   |
| `top-12`      | `top: 3rem`              | top offset                   |
| `right-12`    | `right: 3rem`            | right offset                 |
| `bottom-12`   | `bottom: 3rem`           | bottom offset                |
| `left-12`     | `left: 3rem`             | left offset                  |
| `inset-14`    | `inset: 3.5rem`          | inset on all sides           |
| `inset-x-14`  | `inset-inline: 3.5rem`   | inset on the horizontal axis |
| `inset-y-14`  | `inset-block: 3.5rem`    | inset on the vertical axis   |
| `top-14`      | `top: 3.5rem`            | top offset                   |
| `right-14`    | `right: 3.5rem`          | right offset                 |
| `bottom-14`   | `bottom: 3.5rem`         | bottom offset                |
| `left-14`     | `left: 3.5rem`           | left offset                  |
| `inset-16`    | `inset: 4rem`            | inset on all sides           |
| `inset-x-16`  | `inset-inline: 4rem`     | inset on the horizontal axis |
| `inset-y-16`  | `inset-block: 4rem`      | inset on the vertical axis   |
| `top-16`      | `top: 4rem`              | top offset                   |
| `right-16`    | `right: 4rem`            | right offset                 |
| `bottom-16`   | `bottom: 4rem`           | bottom offset                |
| `left-16`     | `left: 4rem`             | left offset                  |
| `inset-20`    | `inset: 5rem`            | inset on all sides           |
| `inset-x-20`  | `inset-inline: 5rem`     | inset on the horizontal axis |
| `inset-y-20`  | `inset-block: 5rem`      | inset on the vertical axis   |
| `top-20`      | `top: 5rem`              | top offset                   |
| `right-20`    | `right: 5rem`            | right offset                 |
| `bottom-20`   | `bottom: 5rem`           | bottom offset                |
| `left-20`     | `left: 5rem`             | left offset                  |
| `inset-24`    | `inset: 6rem`            | inset on all sides           |
| `inset-x-24`  | `inset-inline: 6rem`     | inset on the horizontal axis |
| `inset-y-24`  | `inset-block: 6rem`      | inset on the vertical axis   |
| `top-24`      | `top: 6rem`              | top offset                   |
| `right-24`    | `right: 6rem`            | right offset                 |
| `bottom-24`   | `bottom: 6rem`           | bottom offset                |
| `left-24`     | `left: 6rem`             | left offset                  |
| `inset-28`    | `inset: 7rem`            | inset on all sides           |
| `inset-x-28`  | `inset-inline: 7rem`     | inset on the horizontal axis |
| `inset-y-28`  | `inset-block: 7rem`      | inset on the vertical axis   |
| `top-28`      | `top: 7rem`              | top offset                   |
| `right-28`    | `right: 7rem`            | right offset                 |
| `bottom-28`   | `bottom: 7rem`           | bottom offset                |
| `left-28`     | `left: 7rem`             | left offset                  |
| `inset-32`    | `inset: 8rem`            | inset on all sides           |
| `inset-x-32`  | `inset-inline: 8rem`     | inset on the horizontal axis |
| `inset-y-32`  | `inset-block: 8rem`      | inset on the vertical axis   |
| `top-32`      | `top: 8rem`              | top offset                   |
| `right-32`    | `right: 8rem`            | right offset                 |
| `bottom-32`   | `bottom: 8rem`           | bottom offset                |
| `left-32`     | `left: 8rem`             | left offset                  |
| `inset-36`    | `inset: 9rem`            | inset on all sides           |
| `inset-x-36`  | `inset-inline: 9rem`     | inset on the horizontal axis |
| `inset-y-36`  | `inset-block: 9rem`      | inset on the vertical axis   |
| `top-36`      | `top: 9rem`              | top offset                   |
| `right-36`    | `right: 9rem`            | right offset                 |
| `bottom-36`   | `bottom: 9rem`           | bottom offset                |
| `left-36`     | `left: 9rem`             | left offset                  |
| `inset-40`    | `inset: 10rem`           | inset on all sides           |
| `inset-x-40`  | `inset-inline: 10rem`    | inset on the horizontal axis |
| `inset-y-40`  | `inset-block: 10rem`     | inset on the vertical axis   |
| `top-40`      | `top: 10rem`             | top offset                   |
| `right-40`    | `right: 10rem`           | right offset                 |
| `bottom-40`   | `bottom: 10rem`          | bottom offset                |
| `left-40`     | `left: 10rem`            | left offset                  |
| `inset-44`    | `inset: 11rem`           | inset on all sides           |
| `inset-x-44`  | `inset-inline: 11rem`    | inset on the horizontal axis |
| `inset-y-44`  | `inset-block: 11rem`     | inset on the vertical axis   |
| `top-44`      | `top: 11rem`             | top offset                   |
| `right-44`    | `right: 11rem`           | right offset                 |
| `bottom-44`   | `bottom: 11rem`          | bottom offset                |
| `left-44`     | `left: 11rem`            | left offset                  |
| `inset-48`    | `inset: 12rem`           | inset on all sides           |
| `inset-x-48`  | `inset-inline: 12rem`    | inset on the horizontal axis |
| `inset-y-48`  | `inset-block: 12rem`     | inset on the vertical axis   |
| `top-48`      | `top: 12rem`             | top offset                   |
| `right-48`    | `right: 12rem`           | right offset                 |
| `bottom-48`   | `bottom: 12rem`          | bottom offset                |
| `left-48`     | `left: 12rem`            | left offset                  |
| `inset-56`    | `inset: 14rem`           | inset on all sides           |
| `inset-x-56`  | `inset-inline: 14rem`    | inset on the horizontal axis |
| `inset-y-56`  | `inset-block: 14rem`     | inset on the vertical axis   |
| `top-56`      | `top: 14rem`             | top offset                   |
| `right-56`    | `right: 14rem`           | right offset                 |
| `bottom-56`   | `bottom: 14rem`          | bottom offset                |
| `left-56`     | `left: 14rem`            | left offset                  |
| `inset-64`    | `inset: 16rem`           | inset on all sides           |
| `inset-x-64`  | `inset-inline: 16rem`    | inset on the horizontal axis |
| `inset-y-64`  | `inset-block: 16rem`     | inset on the vertical axis   |
| `top-64`      | `top: 16rem`             | top offset                   |
| `right-64`    | `right: 16rem`           | right offset                 |
| `bottom-64`   | `bottom: 16rem`          | bottom offset                |
| `left-64`     | `left: 16rem`            | left offset                  |
| `inset-72`    | `inset: 18rem`           | inset on all sides           |
| `inset-x-72`  | `inset-inline: 18rem`    | inset on the horizontal axis |
| `inset-y-72`  | `inset-block: 18rem`     | inset on the vertical axis   |
| `top-72`      | `top: 18rem`             | top offset                   |
| `right-72`    | `right: 18rem`           | right offset                 |
| `bottom-72`   | `bottom: 18rem`          | bottom offset                |
| `left-72`     | `left: 18rem`            | left offset                  |
| `inset-80`    | `inset: 20rem`           | inset on all sides           |
| `inset-x-80`  | `inset-inline: 20rem`    | inset on the horizontal axis |
| `inset-y-80`  | `inset-block: 20rem`     | inset on the vertical axis   |
| `top-80`      | `top: 20rem`             | top offset                   |
| `right-80`    | `right: 20rem`           | right offset                 |
| `bottom-80`   | `bottom: 20rem`          | bottom offset                |
| `left-80`     | `left: 20rem`            | left offset                  |
| `inset-96`    | `inset: 24rem`           | inset on all sides           |
| `inset-x-96`  | `inset-inline: 24rem`    | inset on the horizontal axis |
| `inset-y-96`  | `inset-block: 24rem`     | inset on the vertical axis   |
| `top-96`      | `top: 24rem`             | top offset                   |
| `right-96`    | `right: 24rem`           | right offset                 |
| `bottom-96`   | `bottom: 24rem`          | bottom offset                |
| `left-96`     | `left: 24rem`            | left offset                  |
| `inset-px`    | `inset: 1px`             | inset on all sides           |
| `inset-x-px`  | `inset-inline: 1px`      | inset on the horizontal axis |
| `inset-y-px`  | `inset-block: 1px`       | inset on the vertical axis   |
| `top-px`      | `top: 1px`               | top offset                   |
| `right-px`    | `right: 1px`             | right offset                 |
| `bottom-px`   | `bottom: 1px`            | bottom offset                |
| `left-px`     | `left: 1px`              | left offset                  |
| `inset-0.5`   | `inset: 0.125rem`        | inset on all sides           |
| `inset-x-0.5` | `inset-inline: 0.125rem` | inset on the horizontal axis |
| `inset-y-0.5` | `inset-block: 0.125rem`  | inset on the vertical axis   |
| `top-0.5`     | `top: 0.125rem`          | top offset                   |
| `right-0.5`   | `right: 0.125rem`        | right offset                 |
| `bottom-0.5`  | `bottom: 0.125rem`       | bottom offset                |
| `left-0.5`    | `left: 0.125rem`         | left offset                  |
| `inset-1.5`   | `inset: 0.375rem`        | inset on all sides           |
| `inset-x-1.5` | `inset-inline: 0.375rem` | inset on the horizontal axis |
| `inset-y-1.5` | `inset-block: 0.375rem`  | inset on the vertical axis   |
| `top-1.5`     | `top: 0.375rem`          | top offset                   |
| `right-1.5`   | `right: 0.375rem`        | right offset                 |
| `bottom-1.5`  | `bottom: 0.375rem`       | bottom offset                |
| `left-1.5`    | `left: 0.375rem`         | left offset                  |
| `inset-2.5`   | `inset: 0.625rem`        | inset on all sides           |
| `inset-x-2.5` | `inset-inline: 0.625rem` | inset on the horizontal axis |
| `inset-y-2.5` | `inset-block: 0.625rem`  | inset on the vertical axis   |
| `top-2.5`     | `top: 0.625rem`          | top offset                   |
| `right-2.5`   | `right: 0.625rem`        | right offset                 |
| `bottom-2.5`  | `bottom: 0.625rem`       | bottom offset                |
| `left-2.5`    | `left: 0.625rem`         | left offset                  |
| `inset-3.5`   | `inset: 0.875rem`        | inset on all sides           |
| `inset-x-3.5` | `inset-inline: 0.875rem` | inset on the horizontal axis |
| `inset-y-3.5` | `inset-block: 0.875rem`  | inset on the vertical axis   |
| `top-3.5`     | `top: 0.875rem`          | top offset                   |
| `right-3.5`   | `right: 0.875rem`        | right offset                 |
| `bottom-3.5`  | `bottom: 0.875rem`       | bottom offset                |
| `left-3.5`    | `left: 0.875rem`         | left offset                  |

## Stacking (Z-Index)

**8 utilities**

| Class    | CSS             | Description   |
| -------- | --------------- | ------------- |
| `z-0`    | `z-index: 0`    | z-index: 0    |
| `z-10`   | `z-index: 10`   | z-index: 10   |
| `z-20`   | `z-index: 20`   | z-index: 20   |
| `z-30`   | `z-index: 30`   | z-index: 30   |
| `z-40`   | `z-index: 40`   | z-index: 40   |
| `z-50`   | `z-index: 50`   | z-index: 50   |
| `z-auto` | `z-index: auto` | z-index: auto |
| `z-hide` | `z-index: -1`   | z-index: -1   |

## Overflow

**15 utilities**

| Class                | CSS                   | Description         |
| -------------------- | --------------------- | ------------------- |
| `overflow-auto`      | `overflow: auto`      | overflow: auto      |
| `overflow-x-auto`    | `overflow-x: auto`    | overflow-x: auto    |
| `overflow-y-auto`    | `overflow-y: auto`    | overflow-y: auto    |
| `overflow-scroll`    | `overflow: scroll`    | overflow: scroll    |
| `overflow-x-scroll`  | `overflow-x: scroll`  | overflow-x: scroll  |
| `overflow-y-scroll`  | `overflow-y: scroll`  | overflow-y: scroll  |
| `overflow-hidden`    | `overflow: hidden`    | overflow: hidden    |
| `overflow-x-hidden`  | `overflow-x: hidden`  | overflow-x: hidden  |
| `overflow-y-hidden`  | `overflow-y: hidden`  | overflow-y: hidden  |
| `overflow-visible`   | `overflow: visible`   | overflow: visible   |
| `overflow-x-visible` | `overflow-x: visible` | overflow-x: visible |
| `overflow-y-visible` | `overflow-y: visible` | overflow-y: visible |
| `overflow-clip`      | `overflow: clip`      | overflow: clip      |
| `overflow-x-clip`    | `overflow-x: clip`    | overflow-x: clip    |
| `overflow-y-clip`    | `overflow-y: clip`    | overflow-y: clip    |

## Visibility

**4 utilities**

| Class         | CSS                                                                                                                                              | Description                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| `visible`     | `visibility: visible`                                                                                                                            | visible                                          |
| `invisible`   | `visibility: hidden`                                                                                                                             | invisible                                        |
| `sr-only`     | `position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); whiteSpace: nowrap; border: 0` | Visually hidden but accessible to screen readers |
| `not-sr-only` | `position: static; width: auto; height: auto; padding: 0; margin: 0; overflow: visible; clip: auto; whiteSpace: normal`                          | Restore an sr-only element                       |

---

## Responsive & state variants

Every utility above accepts a responsive prefix (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) and — in JIT mode — a state variant (`hover:`, `focus:`, `active:`, `disabled:`, `dark:`, `group-hover:`, `peer-focus:`, …). See [Variants](../VARIANTS.md) and [Responsive](../RESPONSIVE.md).


<!-- ===== docs/utilities/02-spacing.md (#docs-utilities-02-spacing-md) ===== -->

---
title: Spacing Utilities
---

# Spacing Utilities

> Part of the [Nakshora Utilities Reference](../UTILITIES.md). These tables are **generated from the framework source** — what you see here is exactly what the compiler emits.

All spacing utilities use the spacing scale (see [Configuration](../CONFIGURATION.md#spacing)).

**Scale keys:** `0` `px` `0.5` `1` `1.5` `2` `2.5` `3` `3.5` `4` `5` `6` `7` `8` `9` `10` `11` `12` `14` `16` `20` `24` `28` `32` `36` `40` `44` `48` `56` `64` `72` `80` `96`

## Margin

**231 utilities**

| Class    | CSS                                             | Description         |
| -------- | ----------------------------------------------- | ------------------- |
| `m-0`    | `margin: 0`                                     | margin on all sides |
| `mx-0`   | `margin-left: 0; margin-right: 0`               | horizontal margin   |
| `my-0`   | `margin-top: 0; margin-bottom: 0`               | vertical margin     |
| `mt-0`   | `margin-top: 0`                                 | top margin          |
| `mb-0`   | `margin-bottom: 0`                              | bottom margin       |
| `ml-0`   | `margin-left: 0`                                | left margin         |
| `mr-0`   | `margin-right: 0`                               | right margin        |
| `m-1`    | `margin: 0.25rem`                               | margin on all sides |
| `mx-1`   | `margin-left: 0.25rem; margin-right: 0.25rem`   | horizontal margin   |
| `my-1`   | `margin-top: 0.25rem; margin-bottom: 0.25rem`   | vertical margin     |
| `mt-1`   | `margin-top: 0.25rem`                           | top margin          |
| `mb-1`   | `margin-bottom: 0.25rem`                        | bottom margin       |
| `ml-1`   | `margin-left: 0.25rem`                          | left margin         |
| `mr-1`   | `margin-right: 0.25rem`                         | right margin        |
| `m-2`    | `margin: 0.5rem`                                | margin on all sides |
| `mx-2`   | `margin-left: 0.5rem; margin-right: 0.5rem`     | horizontal margin   |
| `my-2`   | `margin-top: 0.5rem; margin-bottom: 0.5rem`     | vertical margin     |
| `mt-2`   | `margin-top: 0.5rem`                            | top margin          |
| `mb-2`   | `margin-bottom: 0.5rem`                         | bottom margin       |
| `ml-2`   | `margin-left: 0.5rem`                           | left margin         |
| `mr-2`   | `margin-right: 0.5rem`                          | right margin        |
| `m-3`    | `margin: 0.75rem`                               | margin on all sides |
| `mx-3`   | `margin-left: 0.75rem; margin-right: 0.75rem`   | horizontal margin   |
| `my-3`   | `margin-top: 0.75rem; margin-bottom: 0.75rem`   | vertical margin     |
| `mt-3`   | `margin-top: 0.75rem`                           | top margin          |
| `mb-3`   | `margin-bottom: 0.75rem`                        | bottom margin       |
| `ml-3`   | `margin-left: 0.75rem`                          | left margin         |
| `mr-3`   | `margin-right: 0.75rem`                         | right margin        |
| `m-4`    | `margin: 1rem`                                  | margin on all sides |
| `mx-4`   | `margin-left: 1rem; margin-right: 1rem`         | horizontal margin   |
| `my-4`   | `margin-top: 1rem; margin-bottom: 1rem`         | vertical margin     |
| `mt-4`   | `margin-top: 1rem`                              | top margin          |
| `mb-4`   | `margin-bottom: 1rem`                           | bottom margin       |
| `ml-4`   | `margin-left: 1rem`                             | left margin         |
| `mr-4`   | `margin-right: 1rem`                            | right margin        |
| `m-5`    | `margin: 1.25rem`                               | margin on all sides |
| `mx-5`   | `margin-left: 1.25rem; margin-right: 1.25rem`   | horizontal margin   |
| `my-5`   | `margin-top: 1.25rem; margin-bottom: 1.25rem`   | vertical margin     |
| `mt-5`   | `margin-top: 1.25rem`                           | top margin          |
| `mb-5`   | `margin-bottom: 1.25rem`                        | bottom margin       |
| `ml-5`   | `margin-left: 1.25rem`                          | left margin         |
| `mr-5`   | `margin-right: 1.25rem`                         | right margin        |
| `m-6`    | `margin: 1.5rem`                                | margin on all sides |
| `mx-6`   | `margin-left: 1.5rem; margin-right: 1.5rem`     | horizontal margin   |
| `my-6`   | `margin-top: 1.5rem; margin-bottom: 1.5rem`     | vertical margin     |
| `mt-6`   | `margin-top: 1.5rem`                            | top margin          |
| `mb-6`   | `margin-bottom: 1.5rem`                         | bottom margin       |
| `ml-6`   | `margin-left: 1.5rem`                           | left margin         |
| `mr-6`   | `margin-right: 1.5rem`                          | right margin        |
| `m-7`    | `margin: 1.75rem`                               | margin on all sides |
| `mx-7`   | `margin-left: 1.75rem; margin-right: 1.75rem`   | horizontal margin   |
| `my-7`   | `margin-top: 1.75rem; margin-bottom: 1.75rem`   | vertical margin     |
| `mt-7`   | `margin-top: 1.75rem`                           | top margin          |
| `mb-7`   | `margin-bottom: 1.75rem`                        | bottom margin       |
| `ml-7`   | `margin-left: 1.75rem`                          | left margin         |
| `mr-7`   | `margin-right: 1.75rem`                         | right margin        |
| `m-8`    | `margin: 2rem`                                  | margin on all sides |
| `mx-8`   | `margin-left: 2rem; margin-right: 2rem`         | horizontal margin   |
| `my-8`   | `margin-top: 2rem; margin-bottom: 2rem`         | vertical margin     |
| `mt-8`   | `margin-top: 2rem`                              | top margin          |
| `mb-8`   | `margin-bottom: 2rem`                           | bottom margin       |
| `ml-8`   | `margin-left: 2rem`                             | left margin         |
| `mr-8`   | `margin-right: 2rem`                            | right margin        |
| `m-9`    | `margin: 2.25rem`                               | margin on all sides |
| `mx-9`   | `margin-left: 2.25rem; margin-right: 2.25rem`   | horizontal margin   |
| `my-9`   | `margin-top: 2.25rem; margin-bottom: 2.25rem`   | vertical margin     |
| `mt-9`   | `margin-top: 2.25rem`                           | top margin          |
| `mb-9`   | `margin-bottom: 2.25rem`                        | bottom margin       |
| `ml-9`   | `margin-left: 2.25rem`                          | left margin         |
| `mr-9`   | `margin-right: 2.25rem`                         | right margin        |
| `m-10`   | `margin: 2.5rem`                                | margin on all sides |
| `mx-10`  | `margin-left: 2.5rem; margin-right: 2.5rem`     | horizontal margin   |
| `my-10`  | `margin-top: 2.5rem; margin-bottom: 2.5rem`     | vertical margin     |
| `mt-10`  | `margin-top: 2.5rem`                            | top margin          |
| `mb-10`  | `margin-bottom: 2.5rem`                         | bottom margin       |
| `ml-10`  | `margin-left: 2.5rem`                           | left margin         |
| `mr-10`  | `margin-right: 2.5rem`                          | right margin        |
| `m-11`   | `margin: 2.75rem`                               | margin on all sides |
| `mx-11`  | `margin-left: 2.75rem; margin-right: 2.75rem`   | horizontal margin   |
| `my-11`  | `margin-top: 2.75rem; margin-bottom: 2.75rem`   | vertical margin     |
| `mt-11`  | `margin-top: 2.75rem`                           | top margin          |
| `mb-11`  | `margin-bottom: 2.75rem`                        | bottom margin       |
| `ml-11`  | `margin-left: 2.75rem`                          | left margin         |
| `mr-11`  | `margin-right: 2.75rem`                         | right margin        |
| `m-12`   | `margin: 3rem`                                  | margin on all sides |
| `mx-12`  | `margin-left: 3rem; margin-right: 3rem`         | horizontal margin   |
| `my-12`  | `margin-top: 3rem; margin-bottom: 3rem`         | vertical margin     |
| `mt-12`  | `margin-top: 3rem`                              | top margin          |
| `mb-12`  | `margin-bottom: 3rem`                           | bottom margin       |
| `ml-12`  | `margin-left: 3rem`                             | left margin         |
| `mr-12`  | `margin-right: 3rem`                            | right margin        |
| `m-14`   | `margin: 3.5rem`                                | margin on all sides |
| `mx-14`  | `margin-left: 3.5rem; margin-right: 3.5rem`     | horizontal margin   |
| `my-14`  | `margin-top: 3.5rem; margin-bottom: 3.5rem`     | vertical margin     |
| `mt-14`  | `margin-top: 3.5rem`                            | top margin          |
| `mb-14`  | `margin-bottom: 3.5rem`                         | bottom margin       |
| `ml-14`  | `margin-left: 3.5rem`                           | left margin         |
| `mr-14`  | `margin-right: 3.5rem`                          | right margin        |
| `m-16`   | `margin: 4rem`                                  | margin on all sides |
| `mx-16`  | `margin-left: 4rem; margin-right: 4rem`         | horizontal margin   |
| `my-16`  | `margin-top: 4rem; margin-bottom: 4rem`         | vertical margin     |
| `mt-16`  | `margin-top: 4rem`                              | top margin          |
| `mb-16`  | `margin-bottom: 4rem`                           | bottom margin       |
| `ml-16`  | `margin-left: 4rem`                             | left margin         |
| `mr-16`  | `margin-right: 4rem`                            | right margin        |
| `m-20`   | `margin: 5rem`                                  | margin on all sides |
| `mx-20`  | `margin-left: 5rem; margin-right: 5rem`         | horizontal margin   |
| `my-20`  | `margin-top: 5rem; margin-bottom: 5rem`         | vertical margin     |
| `mt-20`  | `margin-top: 5rem`                              | top margin          |
| `mb-20`  | `margin-bottom: 5rem`                           | bottom margin       |
| `ml-20`  | `margin-left: 5rem`                             | left margin         |
| `mr-20`  | `margin-right: 5rem`                            | right margin        |
| `m-24`   | `margin: 6rem`                                  | margin on all sides |
| `mx-24`  | `margin-left: 6rem; margin-right: 6rem`         | horizontal margin   |
| `my-24`  | `margin-top: 6rem; margin-bottom: 6rem`         | vertical margin     |
| `mt-24`  | `margin-top: 6rem`                              | top margin          |
| `mb-24`  | `margin-bottom: 6rem`                           | bottom margin       |
| `ml-24`  | `margin-left: 6rem`                             | left margin         |
| `mr-24`  | `margin-right: 6rem`                            | right margin        |
| `m-28`   | `margin: 7rem`                                  | margin on all sides |
| `mx-28`  | `margin-left: 7rem; margin-right: 7rem`         | horizontal margin   |
| `my-28`  | `margin-top: 7rem; margin-bottom: 7rem`         | vertical margin     |
| `mt-28`  | `margin-top: 7rem`                              | top margin          |
| `mb-28`  | `margin-bottom: 7rem`                           | bottom margin       |
| `ml-28`  | `margin-left: 7rem`                             | left margin         |
| `mr-28`  | `margin-right: 7rem`                            | right margin        |
| `m-32`   | `margin: 8rem`                                  | margin on all sides |
| `mx-32`  | `margin-left: 8rem; margin-right: 8rem`         | horizontal margin   |
| `my-32`  | `margin-top: 8rem; margin-bottom: 8rem`         | vertical margin     |
| `mt-32`  | `margin-top: 8rem`                              | top margin          |
| `mb-32`  | `margin-bottom: 8rem`                           | bottom margin       |
| `ml-32`  | `margin-left: 8rem`                             | left margin         |
| `mr-32`  | `margin-right: 8rem`                            | right margin        |
| `m-36`   | `margin: 9rem`                                  | margin on all sides |
| `mx-36`  | `margin-left: 9rem; margin-right: 9rem`         | horizontal margin   |
| `my-36`  | `margin-top: 9rem; margin-bottom: 9rem`         | vertical margin     |
| `mt-36`  | `margin-top: 9rem`                              | top margin          |
| `mb-36`  | `margin-bottom: 9rem`                           | bottom margin       |
| `ml-36`  | `margin-left: 9rem`                             | left margin         |
| `mr-36`  | `margin-right: 9rem`                            | right margin        |
| `m-40`   | `margin: 10rem`                                 | margin on all sides |
| `mx-40`  | `margin-left: 10rem; margin-right: 10rem`       | horizontal margin   |
| `my-40`  | `margin-top: 10rem; margin-bottom: 10rem`       | vertical margin     |
| `mt-40`  | `margin-top: 10rem`                             | top margin          |
| `mb-40`  | `margin-bottom: 10rem`                          | bottom margin       |
| `ml-40`  | `margin-left: 10rem`                            | left margin         |
| `mr-40`  | `margin-right: 10rem`                           | right margin        |
| `m-44`   | `margin: 11rem`                                 | margin on all sides |
| `mx-44`  | `margin-left: 11rem; margin-right: 11rem`       | horizontal margin   |
| `my-44`  | `margin-top: 11rem; margin-bottom: 11rem`       | vertical margin     |
| `mt-44`  | `margin-top: 11rem`                             | top margin          |
| `mb-44`  | `margin-bottom: 11rem`                          | bottom margin       |
| `ml-44`  | `margin-left: 11rem`                            | left margin         |
| `mr-44`  | `margin-right: 11rem`                           | right margin        |
| `m-48`   | `margin: 12rem`                                 | margin on all sides |
| `mx-48`  | `margin-left: 12rem; margin-right: 12rem`       | horizontal margin   |
| `my-48`  | `margin-top: 12rem; margin-bottom: 12rem`       | vertical margin     |
| `mt-48`  | `margin-top: 12rem`                             | top margin          |
| `mb-48`  | `margin-bottom: 12rem`                          | bottom margin       |
| `ml-48`  | `margin-left: 12rem`                            | left margin         |
| `mr-48`  | `margin-right: 12rem`                           | right margin        |
| `m-56`   | `margin: 14rem`                                 | margin on all sides |
| `mx-56`  | `margin-left: 14rem; margin-right: 14rem`       | horizontal margin   |
| `my-56`  | `margin-top: 14rem; margin-bottom: 14rem`       | vertical margin     |
| `mt-56`  | `margin-top: 14rem`                             | top margin          |
| `mb-56`  | `margin-bottom: 14rem`                          | bottom margin       |
| `ml-56`  | `margin-left: 14rem`                            | left margin         |
| `mr-56`  | `margin-right: 14rem`                           | right margin        |
| `m-64`   | `margin: 16rem`                                 | margin on all sides |
| `mx-64`  | `margin-left: 16rem; margin-right: 16rem`       | horizontal margin   |
| `my-64`  | `margin-top: 16rem; margin-bottom: 16rem`       | vertical margin     |
| `mt-64`  | `margin-top: 16rem`                             | top margin          |
| `mb-64`  | `margin-bottom: 16rem`                          | bottom margin       |
| `ml-64`  | `margin-left: 16rem`                            | left margin         |
| `mr-64`  | `margin-right: 16rem`                           | right margin        |
| `m-72`   | `margin: 18rem`                                 | margin on all sides |
| `mx-72`  | `margin-left: 18rem; margin-right: 18rem`       | horizontal margin   |
| `my-72`  | `margin-top: 18rem; margin-bottom: 18rem`       | vertical margin     |
| `mt-72`  | `margin-top: 18rem`                             | top margin          |
| `mb-72`  | `margin-bottom: 18rem`                          | bottom margin       |
| `ml-72`  | `margin-left: 18rem`                            | left margin         |
| `mr-72`  | `margin-right: 18rem`                           | right margin        |
| `m-80`   | `margin: 20rem`                                 | margin on all sides |
| `mx-80`  | `margin-left: 20rem; margin-right: 20rem`       | horizontal margin   |
| `my-80`  | `margin-top: 20rem; margin-bottom: 20rem`       | vertical margin     |
| `mt-80`  | `margin-top: 20rem`                             | top margin          |
| `mb-80`  | `margin-bottom: 20rem`                          | bottom margin       |
| `ml-80`  | `margin-left: 20rem`                            | left margin         |
| `mr-80`  | `margin-right: 20rem`                           | right margin        |
| `m-96`   | `margin: 24rem`                                 | margin on all sides |
| `mx-96`  | `margin-left: 24rem; margin-right: 24rem`       | horizontal margin   |
| `my-96`  | `margin-top: 24rem; margin-bottom: 24rem`       | vertical margin     |
| `mt-96`  | `margin-top: 24rem`                             | top margin          |
| `mb-96`  | `margin-bottom: 24rem`                          | bottom margin       |
| `ml-96`  | `margin-left: 24rem`                            | left margin         |
| `mr-96`  | `margin-right: 24rem`                           | right margin        |
| `m-px`   | `margin: 1px`                                   | margin on all sides |
| `mx-px`  | `margin-left: 1px; margin-right: 1px`           | horizontal margin   |
| `my-px`  | `margin-top: 1px; margin-bottom: 1px`           | vertical margin     |
| `mt-px`  | `margin-top: 1px`                               | top margin          |
| `mb-px`  | `margin-bottom: 1px`                            | bottom margin       |
| `ml-px`  | `margin-left: 1px`                              | left margin         |
| `mr-px`  | `margin-right: 1px`                             | right margin        |
| `m-0.5`  | `margin: 0.125rem`                              | margin on all sides |
| `mx-0.5` | `margin-left: 0.125rem; margin-right: 0.125rem` | horizontal margin   |
| `my-0.5` | `margin-top: 0.125rem; margin-bottom: 0.125rem` | vertical margin     |
| `mt-0.5` | `margin-top: 0.125rem`                          | top margin          |
| `mb-0.5` | `margin-bottom: 0.125rem`                       | bottom margin       |
| `ml-0.5` | `margin-left: 0.125rem`                         | left margin         |
| `mr-0.5` | `margin-right: 0.125rem`                        | right margin        |
| `m-1.5`  | `margin: 0.375rem`                              | margin on all sides |
| `mx-1.5` | `margin-left: 0.375rem; margin-right: 0.375rem` | horizontal margin   |
| `my-1.5` | `margin-top: 0.375rem; margin-bottom: 0.375rem` | vertical margin     |
| `mt-1.5` | `margin-top: 0.375rem`                          | top margin          |
| `mb-1.5` | `margin-bottom: 0.375rem`                       | bottom margin       |
| `ml-1.5` | `margin-left: 0.375rem`                         | left margin         |
| `mr-1.5` | `margin-right: 0.375rem`                        | right margin        |
| `m-2.5`  | `margin: 0.625rem`                              | margin on all sides |
| `mx-2.5` | `margin-left: 0.625rem; margin-right: 0.625rem` | horizontal margin   |
| `my-2.5` | `margin-top: 0.625rem; margin-bottom: 0.625rem` | vertical margin     |
| `mt-2.5` | `margin-top: 0.625rem`                          | top margin          |
| `mb-2.5` | `margin-bottom: 0.625rem`                       | bottom margin       |
| `ml-2.5` | `margin-left: 0.625rem`                         | left margin         |
| `mr-2.5` | `margin-right: 0.625rem`                        | right margin        |
| `m-3.5`  | `margin: 0.875rem`                              | margin on all sides |
| `mx-3.5` | `margin-left: 0.875rem; margin-right: 0.875rem` | horizontal margin   |
| `my-3.5` | `margin-top: 0.875rem; margin-bottom: 0.875rem` | vertical margin     |
| `mt-3.5` | `margin-top: 0.875rem`                          | top margin          |
| `mb-3.5` | `margin-bottom: 0.875rem`                       | bottom margin       |
| `ml-3.5` | `margin-left: 0.875rem`                         | left margin         |
| `mr-3.5` | `margin-right: 0.875rem`                        | right margin        |

## Padding

**231 utilities**

| Class    | CSS                                               | Description          |
| -------- | ------------------------------------------------- | -------------------- |
| `p-0`    | `padding: 0`                                      | padding on all sides |
| `px-0`   | `padding-left: 0; padding-right: 0`               | horizontal padding   |
| `py-0`   | `padding-top: 0; padding-bottom: 0`               | vertical padding     |
| `pt-0`   | `padding-top: 0`                                  | top padding          |
| `pb-0`   | `padding-bottom: 0`                               | bottom padding       |
| `pl-0`   | `padding-left: 0`                                 | left padding         |
| `pr-0`   | `padding-right: 0`                                | right padding        |
| `p-1`    | `padding: 0.25rem`                                | padding on all sides |
| `px-1`   | `padding-left: 0.25rem; padding-right: 0.25rem`   | horizontal padding   |
| `py-1`   | `padding-top: 0.25rem; padding-bottom: 0.25rem`   | vertical padding     |
| `pt-1`   | `padding-top: 0.25rem`                            | top padding          |
| `pb-1`   | `padding-bottom: 0.25rem`                         | bottom padding       |
| `pl-1`   | `padding-left: 0.25rem`                           | left padding         |
| `pr-1`   | `padding-right: 0.25rem`                          | right padding        |
| `p-2`    | `padding: 0.5rem`                                 | padding on all sides |
| `px-2`   | `padding-left: 0.5rem; padding-right: 0.5rem`     | horizontal padding   |
| `py-2`   | `padding-top: 0.5rem; padding-bottom: 0.5rem`     | vertical padding     |
| `pt-2`   | `padding-top: 0.5rem`                             | top padding          |
| `pb-2`   | `padding-bottom: 0.5rem`                          | bottom padding       |
| `pl-2`   | `padding-left: 0.5rem`                            | left padding         |
| `pr-2`   | `padding-right: 0.5rem`                           | right padding        |
| `p-3`    | `padding: 0.75rem`                                | padding on all sides |
| `px-3`   | `padding-left: 0.75rem; padding-right: 0.75rem`   | horizontal padding   |
| `py-3`   | `padding-top: 0.75rem; padding-bottom: 0.75rem`   | vertical padding     |
| `pt-3`   | `padding-top: 0.75rem`                            | top padding          |
| `pb-3`   | `padding-bottom: 0.75rem`                         | bottom padding       |
| `pl-3`   | `padding-left: 0.75rem`                           | left padding         |
| `pr-3`   | `padding-right: 0.75rem`                          | right padding        |
| `p-4`    | `padding: 1rem`                                   | padding on all sides |
| `px-4`   | `padding-left: 1rem; padding-right: 1rem`         | horizontal padding   |
| `py-4`   | `padding-top: 1rem; padding-bottom: 1rem`         | vertical padding     |
| `pt-4`   | `padding-top: 1rem`                               | top padding          |
| `pb-4`   | `padding-bottom: 1rem`                            | bottom padding       |
| `pl-4`   | `padding-left: 1rem`                              | left padding         |
| `pr-4`   | `padding-right: 1rem`                             | right padding        |
| `p-5`    | `padding: 1.25rem`                                | padding on all sides |
| `px-5`   | `padding-left: 1.25rem; padding-right: 1.25rem`   | horizontal padding   |
| `py-5`   | `padding-top: 1.25rem; padding-bottom: 1.25rem`   | vertical padding     |
| `pt-5`   | `padding-top: 1.25rem`                            | top padding          |
| `pb-5`   | `padding-bottom: 1.25rem`                         | bottom padding       |
| `pl-5`   | `padding-left: 1.25rem`                           | left padding         |
| `pr-5`   | `padding-right: 1.25rem`                          | right padding        |
| `p-6`    | `padding: 1.5rem`                                 | padding on all sides |
| `px-6`   | `padding-left: 1.5rem; padding-right: 1.5rem`     | horizontal padding   |
| `py-6`   | `padding-top: 1.5rem; padding-bottom: 1.5rem`     | vertical padding     |
| `pt-6`   | `padding-top: 1.5rem`                             | top padding          |
| `pb-6`   | `padding-bottom: 1.5rem`                          | bottom padding       |
| `pl-6`   | `padding-left: 1.5rem`                            | left padding         |
| `pr-6`   | `padding-right: 1.5rem`                           | right padding        |
| `p-7`    | `padding: 1.75rem`                                | padding on all sides |
| `px-7`   | `padding-left: 1.75rem; padding-right: 1.75rem`   | horizontal padding   |
| `py-7`   | `padding-top: 1.75rem; padding-bottom: 1.75rem`   | vertical padding     |
| `pt-7`   | `padding-top: 1.75rem`                            | top padding          |
| `pb-7`   | `padding-bottom: 1.75rem`                         | bottom padding       |
| `pl-7`   | `padding-left: 1.75rem`                           | left padding         |
| `pr-7`   | `padding-right: 1.75rem`                          | right padding        |
| `p-8`    | `padding: 2rem`                                   | padding on all sides |
| `px-8`   | `padding-left: 2rem; padding-right: 2rem`         | horizontal padding   |
| `py-8`   | `padding-top: 2rem; padding-bottom: 2rem`         | vertical padding     |
| `pt-8`   | `padding-top: 2rem`                               | top padding          |
| `pb-8`   | `padding-bottom: 2rem`                            | bottom padding       |
| `pl-8`   | `padding-left: 2rem`                              | left padding         |
| `pr-8`   | `padding-right: 2rem`                             | right padding        |
| `p-9`    | `padding: 2.25rem`                                | padding on all sides |
| `px-9`   | `padding-left: 2.25rem; padding-right: 2.25rem`   | horizontal padding   |
| `py-9`   | `padding-top: 2.25rem; padding-bottom: 2.25rem`   | vertical padding     |
| `pt-9`   | `padding-top: 2.25rem`                            | top padding          |
| `pb-9`   | `padding-bottom: 2.25rem`                         | bottom padding       |
| `pl-9`   | `padding-left: 2.25rem`                           | left padding         |
| `pr-9`   | `padding-right: 2.25rem`                          | right padding        |
| `p-10`   | `padding: 2.5rem`                                 | padding on all sides |
| `px-10`  | `padding-left: 2.5rem; padding-right: 2.5rem`     | horizontal padding   |
| `py-10`  | `padding-top: 2.5rem; padding-bottom: 2.5rem`     | vertical padding     |
| `pt-10`  | `padding-top: 2.5rem`                             | top padding          |
| `pb-10`  | `padding-bottom: 2.5rem`                          | bottom padding       |
| `pl-10`  | `padding-left: 2.5rem`                            | left padding         |
| `pr-10`  | `padding-right: 2.5rem`                           | right padding        |
| `p-11`   | `padding: 2.75rem`                                | padding on all sides |
| `px-11`  | `padding-left: 2.75rem; padding-right: 2.75rem`   | horizontal padding   |
| `py-11`  | `padding-top: 2.75rem; padding-bottom: 2.75rem`   | vertical padding     |
| `pt-11`  | `padding-top: 2.75rem`                            | top padding          |
| `pb-11`  | `padding-bottom: 2.75rem`                         | bottom padding       |
| `pl-11`  | `padding-left: 2.75rem`                           | left padding         |
| `pr-11`  | `padding-right: 2.75rem`                          | right padding        |
| `p-12`   | `padding: 3rem`                                   | padding on all sides |
| `px-12`  | `padding-left: 3rem; padding-right: 3rem`         | horizontal padding   |
| `py-12`  | `padding-top: 3rem; padding-bottom: 3rem`         | vertical padding     |
| `pt-12`  | `padding-top: 3rem`                               | top padding          |
| `pb-12`  | `padding-bottom: 3rem`                            | bottom padding       |
| `pl-12`  | `padding-left: 3rem`                              | left padding         |
| `pr-12`  | `padding-right: 3rem`                             | right padding        |
| `p-14`   | `padding: 3.5rem`                                 | padding on all sides |
| `px-14`  | `padding-left: 3.5rem; padding-right: 3.5rem`     | horizontal padding   |
| `py-14`  | `padding-top: 3.5rem; padding-bottom: 3.5rem`     | vertical padding     |
| `pt-14`  | `padding-top: 3.5rem`                             | top padding          |
| `pb-14`  | `padding-bottom: 3.5rem`                          | bottom padding       |
| `pl-14`  | `padding-left: 3.5rem`                            | left padding         |
| `pr-14`  | `padding-right: 3.5rem`                           | right padding        |
| `p-16`   | `padding: 4rem`                                   | padding on all sides |
| `px-16`  | `padding-left: 4rem; padding-right: 4rem`         | horizontal padding   |
| `py-16`  | `padding-top: 4rem; padding-bottom: 4rem`         | vertical padding     |
| `pt-16`  | `padding-top: 4rem`                               | top padding          |
| `pb-16`  | `padding-bottom: 4rem`                            | bottom padding       |
| `pl-16`  | `padding-left: 4rem`                              | left padding         |
| `pr-16`  | `padding-right: 4rem`                             | right padding        |
| `p-20`   | `padding: 5rem`                                   | padding on all sides |
| `px-20`  | `padding-left: 5rem; padding-right: 5rem`         | horizontal padding   |
| `py-20`  | `padding-top: 5rem; padding-bottom: 5rem`         | vertical padding     |
| `pt-20`  | `padding-top: 5rem`                               | top padding          |
| `pb-20`  | `padding-bottom: 5rem`                            | bottom padding       |
| `pl-20`  | `padding-left: 5rem`                              | left padding         |
| `pr-20`  | `padding-right: 5rem`                             | right padding        |
| `p-24`   | `padding: 6rem`                                   | padding on all sides |
| `px-24`  | `padding-left: 6rem; padding-right: 6rem`         | horizontal padding   |
| `py-24`  | `padding-top: 6rem; padding-bottom: 6rem`         | vertical padding     |
| `pt-24`  | `padding-top: 6rem`                               | top padding          |
| `pb-24`  | `padding-bottom: 6rem`                            | bottom padding       |
| `pl-24`  | `padding-left: 6rem`                              | left padding         |
| `pr-24`  | `padding-right: 6rem`                             | right padding        |
| `p-28`   | `padding: 7rem`                                   | padding on all sides |
| `px-28`  | `padding-left: 7rem; padding-right: 7rem`         | horizontal padding   |
| `py-28`  | `padding-top: 7rem; padding-bottom: 7rem`         | vertical padding     |
| `pt-28`  | `padding-top: 7rem`                               | top padding          |
| `pb-28`  | `padding-bottom: 7rem`                            | bottom padding       |
| `pl-28`  | `padding-left: 7rem`                              | left padding         |
| `pr-28`  | `padding-right: 7rem`                             | right padding        |
| `p-32`   | `padding: 8rem`                                   | padding on all sides |
| `px-32`  | `padding-left: 8rem; padding-right: 8rem`         | horizontal padding   |
| `py-32`  | `padding-top: 8rem; padding-bottom: 8rem`         | vertical padding     |
| `pt-32`  | `padding-top: 8rem`                               | top padding          |
| `pb-32`  | `padding-bottom: 8rem`                            | bottom padding       |
| `pl-32`  | `padding-left: 8rem`                              | left padding         |
| `pr-32`  | `padding-right: 8rem`                             | right padding        |
| `p-36`   | `padding: 9rem`                                   | padding on all sides |
| `px-36`  | `padding-left: 9rem; padding-right: 9rem`         | horizontal padding   |
| `py-36`  | `padding-top: 9rem; padding-bottom: 9rem`         | vertical padding     |
| `pt-36`  | `padding-top: 9rem`                               | top padding          |
| `pb-36`  | `padding-bottom: 9rem`                            | bottom padding       |
| `pl-36`  | `padding-left: 9rem`                              | left padding         |
| `pr-36`  | `padding-right: 9rem`                             | right padding        |
| `p-40`   | `padding: 10rem`                                  | padding on all sides |
| `px-40`  | `padding-left: 10rem; padding-right: 10rem`       | horizontal padding   |
| `py-40`  | `padding-top: 10rem; padding-bottom: 10rem`       | vertical padding     |
| `pt-40`  | `padding-top: 10rem`                              | top padding          |
| `pb-40`  | `padding-bottom: 10rem`                           | bottom padding       |
| `pl-40`  | `padding-left: 10rem`                             | left padding         |
| `pr-40`  | `padding-right: 10rem`                            | right padding        |
| `p-44`   | `padding: 11rem`                                  | padding on all sides |
| `px-44`  | `padding-left: 11rem; padding-right: 11rem`       | horizontal padding   |
| `py-44`  | `padding-top: 11rem; padding-bottom: 11rem`       | vertical padding     |
| `pt-44`  | `padding-top: 11rem`                              | top padding          |
| `pb-44`  | `padding-bottom: 11rem`                           | bottom padding       |
| `pl-44`  | `padding-left: 11rem`                             | left padding         |
| `pr-44`  | `padding-right: 11rem`                            | right padding        |
| `p-48`   | `padding: 12rem`                                  | padding on all sides |
| `px-48`  | `padding-left: 12rem; padding-right: 12rem`       | horizontal padding   |
| `py-48`  | `padding-top: 12rem; padding-bottom: 12rem`       | vertical padding     |
| `pt-48`  | `padding-top: 12rem`                              | top padding          |
| `pb-48`  | `padding-bottom: 12rem`                           | bottom padding       |
| `pl-48`  | `padding-left: 12rem`                             | left padding         |
| `pr-48`  | `padding-right: 12rem`                            | right padding        |
| `p-56`   | `padding: 14rem`                                  | padding on all sides |
| `px-56`  | `padding-left: 14rem; padding-right: 14rem`       | horizontal padding   |
| `py-56`  | `padding-top: 14rem; padding-bottom: 14rem`       | vertical padding     |
| `pt-56`  | `padding-top: 14rem`                              | top padding          |
| `pb-56`  | `padding-bottom: 14rem`                           | bottom padding       |
| `pl-56`  | `padding-left: 14rem`                             | left padding         |
| `pr-56`  | `padding-right: 14rem`                            | right padding        |
| `p-64`   | `padding: 16rem`                                  | padding on all sides |
| `px-64`  | `padding-left: 16rem; padding-right: 16rem`       | horizontal padding   |
| `py-64`  | `padding-top: 16rem; padding-bottom: 16rem`       | vertical padding     |
| `pt-64`  | `padding-top: 16rem`                              | top padding          |
| `pb-64`  | `padding-bottom: 16rem`                           | bottom padding       |
| `pl-64`  | `padding-left: 16rem`                             | left padding         |
| `pr-64`  | `padding-right: 16rem`                            | right padding        |
| `p-72`   | `padding: 18rem`                                  | padding on all sides |
| `px-72`  | `padding-left: 18rem; padding-right: 18rem`       | horizontal padding   |
| `py-72`  | `padding-top: 18rem; padding-bottom: 18rem`       | vertical padding     |
| `pt-72`  | `padding-top: 18rem`                              | top padding          |
| `pb-72`  | `padding-bottom: 18rem`                           | bottom padding       |
| `pl-72`  | `padding-left: 18rem`                             | left padding         |
| `pr-72`  | `padding-right: 18rem`                            | right padding        |
| `p-80`   | `padding: 20rem`                                  | padding on all sides |
| `px-80`  | `padding-left: 20rem; padding-right: 20rem`       | horizontal padding   |
| `py-80`  | `padding-top: 20rem; padding-bottom: 20rem`       | vertical padding     |
| `pt-80`  | `padding-top: 20rem`                              | top padding          |
| `pb-80`  | `padding-bottom: 20rem`                           | bottom padding       |
| `pl-80`  | `padding-left: 20rem`                             | left padding         |
| `pr-80`  | `padding-right: 20rem`                            | right padding        |
| `p-96`   | `padding: 24rem`                                  | padding on all sides |
| `px-96`  | `padding-left: 24rem; padding-right: 24rem`       | horizontal padding   |
| `py-96`  | `padding-top: 24rem; padding-bottom: 24rem`       | vertical padding     |
| `pt-96`  | `padding-top: 24rem`                              | top padding          |
| `pb-96`  | `padding-bottom: 24rem`                           | bottom padding       |
| `pl-96`  | `padding-left: 24rem`                             | left padding         |
| `pr-96`  | `padding-right: 24rem`                            | right padding        |
| `p-px`   | `padding: 1px`                                    | padding on all sides |
| `px-px`  | `padding-left: 1px; padding-right: 1px`           | horizontal padding   |
| `py-px`  | `padding-top: 1px; padding-bottom: 1px`           | vertical padding     |
| `pt-px`  | `padding-top: 1px`                                | top padding          |
| `pb-px`  | `padding-bottom: 1px`                             | bottom padding       |
| `pl-px`  | `padding-left: 1px`                               | left padding         |
| `pr-px`  | `padding-right: 1px`                              | right padding        |
| `p-0.5`  | `padding: 0.125rem`                               | padding on all sides |
| `px-0.5` | `padding-left: 0.125rem; padding-right: 0.125rem` | horizontal padding   |
| `py-0.5` | `padding-top: 0.125rem; padding-bottom: 0.125rem` | vertical padding     |
| `pt-0.5` | `padding-top: 0.125rem`                           | top padding          |
| `pb-0.5` | `padding-bottom: 0.125rem`                        | bottom padding       |
| `pl-0.5` | `padding-left: 0.125rem`                          | left padding         |
| `pr-0.5` | `padding-right: 0.125rem`                         | right padding        |
| `p-1.5`  | `padding: 0.375rem`                               | padding on all sides |
| `px-1.5` | `padding-left: 0.375rem; padding-right: 0.375rem` | horizontal padding   |
| `py-1.5` | `padding-top: 0.375rem; padding-bottom: 0.375rem` | vertical padding     |
| `pt-1.5` | `padding-top: 0.375rem`                           | top padding          |
| `pb-1.5` | `padding-bottom: 0.375rem`                        | bottom padding       |
| `pl-1.5` | `padding-left: 0.375rem`                          | left padding         |
| `pr-1.5` | `padding-right: 0.375rem`                         | right padding        |
| `p-2.5`  | `padding: 0.625rem`                               | padding on all sides |
| `px-2.5` | `padding-left: 0.625rem; padding-right: 0.625rem` | horizontal padding   |
| `py-2.5` | `padding-top: 0.625rem; padding-bottom: 0.625rem` | vertical padding     |
| `pt-2.5` | `padding-top: 0.625rem`                           | top padding          |
| `pb-2.5` | `padding-bottom: 0.625rem`                        | bottom padding       |
| `pl-2.5` | `padding-left: 0.625rem`                          | left padding         |
| `pr-2.5` | `padding-right: 0.625rem`                         | right padding        |
| `p-3.5`  | `padding: 0.875rem`                               | padding on all sides |
| `px-3.5` | `padding-left: 0.875rem; padding-right: 0.875rem` | horizontal padding   |
| `py-3.5` | `padding-top: 0.875rem; padding-bottom: 0.875rem` | vertical padding     |
| `pt-3.5` | `padding-top: 0.875rem`                           | top padding          |
| `pb-3.5` | `padding-bottom: 0.875rem`                        | bottom padding       |
| `pl-3.5` | `padding-left: 0.875rem`                          | left padding         |
| `pr-3.5` | `padding-right: 0.875rem`                         | right padding        |

## Gap

**99 utilities**

| Class       | CSS                    | Description     |
| ----------- | ---------------------- | --------------- |
| `gap-0`     | `gap: 0`               | gap on all axes |
| `gap-x-0`   | `column-gap: 0`        | column gap      |
| `gap-y-0`   | `row-gap: 0`           | row gap         |
| `gap-1`     | `gap: 0.25rem`         | gap on all axes |
| `gap-x-1`   | `column-gap: 0.25rem`  | column gap      |
| `gap-y-1`   | `row-gap: 0.25rem`     | row gap         |
| `gap-2`     | `gap: 0.5rem`          | gap on all axes |
| `gap-x-2`   | `column-gap: 0.5rem`   | column gap      |
| `gap-y-2`   | `row-gap: 0.5rem`      | row gap         |
| `gap-3`     | `gap: 0.75rem`         | gap on all axes |
| `gap-x-3`   | `column-gap: 0.75rem`  | column gap      |
| `gap-y-3`   | `row-gap: 0.75rem`     | row gap         |
| `gap-4`     | `gap: 1rem`            | gap on all axes |
| `gap-x-4`   | `column-gap: 1rem`     | column gap      |
| `gap-y-4`   | `row-gap: 1rem`        | row gap         |
| `gap-5`     | `gap: 1.25rem`         | gap on all axes |
| `gap-x-5`   | `column-gap: 1.25rem`  | column gap      |
| `gap-y-5`   | `row-gap: 1.25rem`     | row gap         |
| `gap-6`     | `gap: 1.5rem`          | gap on all axes |
| `gap-x-6`   | `column-gap: 1.5rem`   | column gap      |
| `gap-y-6`   | `row-gap: 1.5rem`      | row gap         |
| `gap-7`     | `gap: 1.75rem`         | gap on all axes |
| `gap-x-7`   | `column-gap: 1.75rem`  | column gap      |
| `gap-y-7`   | `row-gap: 1.75rem`     | row gap         |
| `gap-8`     | `gap: 2rem`            | gap on all axes |
| `gap-x-8`   | `column-gap: 2rem`     | column gap      |
| `gap-y-8`   | `row-gap: 2rem`        | row gap         |
| `gap-9`     | `gap: 2.25rem`         | gap on all axes |
| `gap-x-9`   | `column-gap: 2.25rem`  | column gap      |
| `gap-y-9`   | `row-gap: 2.25rem`     | row gap         |
| `gap-10`    | `gap: 2.5rem`          | gap on all axes |
| `gap-x-10`  | `column-gap: 2.5rem`   | column gap      |
| `gap-y-10`  | `row-gap: 2.5rem`      | row gap         |
| `gap-11`    | `gap: 2.75rem`         | gap on all axes |
| `gap-x-11`  | `column-gap: 2.75rem`  | column gap      |
| `gap-y-11`  | `row-gap: 2.75rem`     | row gap         |
| `gap-12`    | `gap: 3rem`            | gap on all axes |
| `gap-x-12`  | `column-gap: 3rem`     | column gap      |
| `gap-y-12`  | `row-gap: 3rem`        | row gap         |
| `gap-14`    | `gap: 3.5rem`          | gap on all axes |
| `gap-x-14`  | `column-gap: 3.5rem`   | column gap      |
| `gap-y-14`  | `row-gap: 3.5rem`      | row gap         |
| `gap-16`    | `gap: 4rem`            | gap on all axes |
| `gap-x-16`  | `column-gap: 4rem`     | column gap      |
| `gap-y-16`  | `row-gap: 4rem`        | row gap         |
| `gap-20`    | `gap: 5rem`            | gap on all axes |
| `gap-x-20`  | `column-gap: 5rem`     | column gap      |
| `gap-y-20`  | `row-gap: 5rem`        | row gap         |
| `gap-24`    | `gap: 6rem`            | gap on all axes |
| `gap-x-24`  | `column-gap: 6rem`     | column gap      |
| `gap-y-24`  | `row-gap: 6rem`        | row gap         |
| `gap-28`    | `gap: 7rem`            | gap on all axes |
| `gap-x-28`  | `column-gap: 7rem`     | column gap      |
| `gap-y-28`  | `row-gap: 7rem`        | row gap         |
| `gap-32`    | `gap: 8rem`            | gap on all axes |
| `gap-x-32`  | `column-gap: 8rem`     | column gap      |
| `gap-y-32`  | `row-gap: 8rem`        | row gap         |
| `gap-36`    | `gap: 9rem`            | gap on all axes |
| `gap-x-36`  | `column-gap: 9rem`     | column gap      |
| `gap-y-36`  | `row-gap: 9rem`        | row gap         |
| `gap-40`    | `gap: 10rem`           | gap on all axes |
| `gap-x-40`  | `column-gap: 10rem`    | column gap      |
| `gap-y-40`  | `row-gap: 10rem`       | row gap         |
| `gap-44`    | `gap: 11rem`           | gap on all axes |
| `gap-x-44`  | `column-gap: 11rem`    | column gap      |
| `gap-y-44`  | `row-gap: 11rem`       | row gap         |
| `gap-48`    | `gap: 12rem`           | gap on all axes |
| `gap-x-48`  | `column-gap: 12rem`    | column gap      |
| `gap-y-48`  | `row-gap: 12rem`       | row gap         |
| `gap-56`    | `gap: 14rem`           | gap on all axes |
| `gap-x-56`  | `column-gap: 14rem`    | column gap      |
| `gap-y-56`  | `row-gap: 14rem`       | row gap         |
| `gap-64`    | `gap: 16rem`           | gap on all axes |
| `gap-x-64`  | `column-gap: 16rem`    | column gap      |
| `gap-y-64`  | `row-gap: 16rem`       | row gap         |
| `gap-72`    | `gap: 18rem`           | gap on all axes |
| `gap-x-72`  | `column-gap: 18rem`    | column gap      |
| `gap-y-72`  | `row-gap: 18rem`       | row gap         |
| `gap-80`    | `gap: 20rem`           | gap on all axes |
| `gap-x-80`  | `column-gap: 20rem`    | column gap      |
| `gap-y-80`  | `row-gap: 20rem`       | row gap         |
| `gap-96`    | `gap: 24rem`           | gap on all axes |
| `gap-x-96`  | `column-gap: 24rem`    | column gap      |
| `gap-y-96`  | `row-gap: 24rem`       | row gap         |
| `gap-px`    | `gap: 1px`             | gap on all axes |
| `gap-x-px`  | `column-gap: 1px`      | column gap      |
| `gap-y-px`  | `row-gap: 1px`         | row gap         |
| `gap-0.5`   | `gap: 0.125rem`        | gap on all axes |
| `gap-x-0.5` | `column-gap: 0.125rem` | column gap      |
| `gap-y-0.5` | `row-gap: 0.125rem`    | row gap         |
| `gap-1.5`   | `gap: 0.375rem`        | gap on all axes |
| `gap-x-1.5` | `column-gap: 0.375rem` | column gap      |
| `gap-y-1.5` | `row-gap: 0.375rem`    | row gap         |
| `gap-2.5`   | `gap: 0.625rem`        | gap on all axes |
| `gap-x-2.5` | `column-gap: 0.625rem` | column gap      |
| `gap-y-2.5` | `row-gap: 0.625rem`    | row gap         |
| `gap-3.5`   | `gap: 0.875rem`        | gap on all axes |
| `gap-x-3.5` | `column-gap: 0.875rem` | column gap      |
| `gap-y-3.5` | `row-gap: 0.875rem`    | row gap         |

---

## Responsive & state variants

Every utility above accepts a responsive prefix (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) and — in JIT mode — a state variant (`hover:`, `focus:`, `active:`, `disabled:`, `dark:`, `group-hover:`, `peer-focus:`, …). See [Variants](../VARIANTS.md) and [Responsive](../RESPONSIVE.md).


<!-- ===== docs/utilities/03-sizing.md (#docs-utilities-03-sizing-md) ===== -->

---
title: Sizing Utilities
---

# Sizing Utilities

> Part of the [Nakshora Utilities Reference](../UTILITIES.md). These tables are **generated from the framework source** — what you see here is exactly what the compiler emits.

Width, height and min/max constraints. Sizing utilities use the spacing scale plus named max-width steps.

## Sizing

**228 utilities**

| Class          | CSS                    | Description                       |
| -------------- | ---------------------- | --------------------------------- |
| `w-0`          | `width: 0`             | width                             |
| `h-0`          | `height: 0`            | height                            |
| `min-w-0`      | `min-width: 0`         | min-width                         |
| `min-h-0`      | `min-height: 0`        | min-height                        |
| `max-w-0`      | `max-width: 0`         | max-width                         |
| `max-h-0`      | `max-height: 0`        | max-height                        |
| `w-1`          | `width: 0.25rem`       | width                             |
| `h-1`          | `height: 0.25rem`      | height                            |
| `min-w-1`      | `min-width: 0.25rem`   | min-width                         |
| `min-h-1`      | `min-height: 0.25rem`  | min-height                        |
| `max-w-1`      | `max-width: 0.25rem`   | max-width                         |
| `max-h-1`      | `max-height: 0.25rem`  | max-height                        |
| `w-2`          | `width: 0.5rem`        | width                             |
| `h-2`          | `height: 0.5rem`       | height                            |
| `min-w-2`      | `min-width: 0.5rem`    | min-width                         |
| `min-h-2`      | `min-height: 0.5rem`   | min-height                        |
| `max-w-2`      | `max-width: 0.5rem`    | max-width                         |
| `max-h-2`      | `max-height: 0.5rem`   | max-height                        |
| `w-3`          | `width: 0.75rem`       | width                             |
| `h-3`          | `height: 0.75rem`      | height                            |
| `min-w-3`      | `min-width: 0.75rem`   | min-width                         |
| `min-h-3`      | `min-height: 0.75rem`  | min-height                        |
| `max-w-3`      | `max-width: 0.75rem`   | max-width                         |
| `max-h-3`      | `max-height: 0.75rem`  | max-height                        |
| `w-4`          | `width: 1rem`          | width                             |
| `h-4`          | `height: 1rem`         | height                            |
| `min-w-4`      | `min-width: 1rem`      | min-width                         |
| `min-h-4`      | `min-height: 1rem`     | min-height                        |
| `max-w-4`      | `max-width: 1rem`      | max-width                         |
| `max-h-4`      | `max-height: 1rem`     | max-height                        |
| `w-5`          | `width: 1.25rem`       | width                             |
| `h-5`          | `height: 1.25rem`      | height                            |
| `min-w-5`      | `min-width: 1.25rem`   | min-width                         |
| `min-h-5`      | `min-height: 1.25rem`  | min-height                        |
| `max-w-5`      | `max-width: 1.25rem`   | max-width                         |
| `max-h-5`      | `max-height: 1.25rem`  | max-height                        |
| `w-6`          | `width: 1.5rem`        | width                             |
| `h-6`          | `height: 1.5rem`       | height                            |
| `min-w-6`      | `min-width: 1.5rem`    | min-width                         |
| `min-h-6`      | `min-height: 1.5rem`   | min-height                        |
| `max-w-6`      | `max-width: 1.5rem`    | max-width                         |
| `max-h-6`      | `max-height: 1.5rem`   | max-height                        |
| `w-7`          | `width: 1.75rem`       | width                             |
| `h-7`          | `height: 1.75rem`      | height                            |
| `min-w-7`      | `min-width: 1.75rem`   | min-width                         |
| `min-h-7`      | `min-height: 1.75rem`  | min-height                        |
| `max-w-7`      | `max-width: 1.75rem`   | max-width                         |
| `max-h-7`      | `max-height: 1.75rem`  | max-height                        |
| `w-8`          | `width: 2rem`          | width                             |
| `h-8`          | `height: 2rem`         | height                            |
| `min-w-8`      | `min-width: 2rem`      | min-width                         |
| `min-h-8`      | `min-height: 2rem`     | min-height                        |
| `max-w-8`      | `max-width: 2rem`      | max-width                         |
| `max-h-8`      | `max-height: 2rem`     | max-height                        |
| `w-9`          | `width: 2.25rem`       | width                             |
| `h-9`          | `height: 2.25rem`      | height                            |
| `min-w-9`      | `min-width: 2.25rem`   | min-width                         |
| `min-h-9`      | `min-height: 2.25rem`  | min-height                        |
| `max-w-9`      | `max-width: 2.25rem`   | max-width                         |
| `max-h-9`      | `max-height: 2.25rem`  | max-height                        |
| `w-10`         | `width: 2.5rem`        | width                             |
| `h-10`         | `height: 2.5rem`       | height                            |
| `min-w-10`     | `min-width: 2.5rem`    | min-width                         |
| `min-h-10`     | `min-height: 2.5rem`   | min-height                        |
| `max-w-10`     | `max-width: 2.5rem`    | max-width                         |
| `max-h-10`     | `max-height: 2.5rem`   | max-height                        |
| `w-11`         | `width: 2.75rem`       | width                             |
| `h-11`         | `height: 2.75rem`      | height                            |
| `min-w-11`     | `min-width: 2.75rem`   | min-width                         |
| `min-h-11`     | `min-height: 2.75rem`  | min-height                        |
| `max-w-11`     | `max-width: 2.75rem`   | max-width                         |
| `max-h-11`     | `max-height: 2.75rem`  | max-height                        |
| `w-12`         | `width: 3rem`          | width                             |
| `h-12`         | `height: 3rem`         | height                            |
| `min-w-12`     | `min-width: 3rem`      | min-width                         |
| `min-h-12`     | `min-height: 3rem`     | min-height                        |
| `max-w-12`     | `max-width: 3rem`      | max-width                         |
| `max-h-12`     | `max-height: 3rem`     | max-height                        |
| `w-14`         | `width: 3.5rem`        | width                             |
| `h-14`         | `height: 3.5rem`       | height                            |
| `min-w-14`     | `min-width: 3.5rem`    | min-width                         |
| `min-h-14`     | `min-height: 3.5rem`   | min-height                        |
| `max-w-14`     | `max-width: 3.5rem`    | max-width                         |
| `max-h-14`     | `max-height: 3.5rem`   | max-height                        |
| `w-16`         | `width: 4rem`          | width                             |
| `h-16`         | `height: 4rem`         | height                            |
| `min-w-16`     | `min-width: 4rem`      | min-width                         |
| `min-h-16`     | `min-height: 4rem`     | min-height                        |
| `max-w-16`     | `max-width: 4rem`      | max-width                         |
| `max-h-16`     | `max-height: 4rem`     | max-height                        |
| `w-20`         | `width: 5rem`          | width                             |
| `h-20`         | `height: 5rem`         | height                            |
| `min-w-20`     | `min-width: 5rem`      | min-width                         |
| `min-h-20`     | `min-height: 5rem`     | min-height                        |
| `max-w-20`     | `max-width: 5rem`      | max-width                         |
| `max-h-20`     | `max-height: 5rem`     | max-height                        |
| `w-24`         | `width: 6rem`          | width                             |
| `h-24`         | `height: 6rem`         | height                            |
| `min-w-24`     | `min-width: 6rem`      | min-width                         |
| `min-h-24`     | `min-height: 6rem`     | min-height                        |
| `max-w-24`     | `max-width: 6rem`      | max-width                         |
| `max-h-24`     | `max-height: 6rem`     | max-height                        |
| `w-28`         | `width: 7rem`          | width                             |
| `h-28`         | `height: 7rem`         | height                            |
| `min-w-28`     | `min-width: 7rem`      | min-width                         |
| `min-h-28`     | `min-height: 7rem`     | min-height                        |
| `max-w-28`     | `max-width: 7rem`      | max-width                         |
| `max-h-28`     | `max-height: 7rem`     | max-height                        |
| `w-32`         | `width: 8rem`          | width                             |
| `h-32`         | `height: 8rem`         | height                            |
| `min-w-32`     | `min-width: 8rem`      | min-width                         |
| `min-h-32`     | `min-height: 8rem`     | min-height                        |
| `max-w-32`     | `max-width: 8rem`      | max-width                         |
| `max-h-32`     | `max-height: 8rem`     | max-height                        |
| `w-36`         | `width: 9rem`          | width                             |
| `h-36`         | `height: 9rem`         | height                            |
| `min-w-36`     | `min-width: 9rem`      | min-width                         |
| `min-h-36`     | `min-height: 9rem`     | min-height                        |
| `max-w-36`     | `max-width: 9rem`      | max-width                         |
| `max-h-36`     | `max-height: 9rem`     | max-height                        |
| `w-40`         | `width: 10rem`         | width                             |
| `h-40`         | `height: 10rem`        | height                            |
| `min-w-40`     | `min-width: 10rem`     | min-width                         |
| `min-h-40`     | `min-height: 10rem`    | min-height                        |
| `max-w-40`     | `max-width: 10rem`     | max-width                         |
| `max-h-40`     | `max-height: 10rem`    | max-height                        |
| `w-44`         | `width: 11rem`         | width                             |
| `h-44`         | `height: 11rem`        | height                            |
| `min-w-44`     | `min-width: 11rem`     | min-width                         |
| `min-h-44`     | `min-height: 11rem`    | min-height                        |
| `max-w-44`     | `max-width: 11rem`     | max-width                         |
| `max-h-44`     | `max-height: 11rem`    | max-height                        |
| `w-48`         | `width: 12rem`         | width                             |
| `h-48`         | `height: 12rem`        | height                            |
| `min-w-48`     | `min-width: 12rem`     | min-width                         |
| `min-h-48`     | `min-height: 12rem`    | min-height                        |
| `max-w-48`     | `max-width: 12rem`     | max-width                         |
| `max-h-48`     | `max-height: 12rem`    | max-height                        |
| `w-56`         | `width: 14rem`         | width                             |
| `h-56`         | `height: 14rem`        | height                            |
| `min-w-56`     | `min-width: 14rem`     | min-width                         |
| `min-h-56`     | `min-height: 14rem`    | min-height                        |
| `max-w-56`     | `max-width: 14rem`     | max-width                         |
| `max-h-56`     | `max-height: 14rem`    | max-height                        |
| `w-64`         | `width: 16rem`         | width                             |
| `h-64`         | `height: 16rem`        | height                            |
| `min-w-64`     | `min-width: 16rem`     | min-width                         |
| `min-h-64`     | `min-height: 16rem`    | min-height                        |
| `max-w-64`     | `max-width: 16rem`     | max-width                         |
| `max-h-64`     | `max-height: 16rem`    | max-height                        |
| `w-72`         | `width: 18rem`         | width                             |
| `h-72`         | `height: 18rem`        | height                            |
| `min-w-72`     | `min-width: 18rem`     | min-width                         |
| `min-h-72`     | `min-height: 18rem`    | min-height                        |
| `max-w-72`     | `max-width: 18rem`     | max-width                         |
| `max-h-72`     | `max-height: 18rem`    | max-height                        |
| `w-80`         | `width: 20rem`         | width                             |
| `h-80`         | `height: 20rem`        | height                            |
| `min-w-80`     | `min-width: 20rem`     | min-width                         |
| `min-h-80`     | `min-height: 20rem`    | min-height                        |
| `max-w-80`     | `max-width: 20rem`     | max-width                         |
| `max-h-80`     | `max-height: 20rem`    | max-height                        |
| `w-96`         | `width: 24rem`         | width                             |
| `h-96`         | `height: 24rem`        | height                            |
| `min-w-96`     | `min-width: 24rem`     | min-width                         |
| `min-h-96`     | `min-height: 24rem`    | min-height                        |
| `max-w-96`     | `max-width: 24rem`     | max-width                         |
| `max-h-96`     | `max-height: 24rem`    | max-height                        |
| `w-px`         | `width: 1px`           | width                             |
| `h-px`         | `height: 1px`          | height                            |
| `min-w-px`     | `min-width: 1px`       | min-width                         |
| `min-h-px`     | `min-height: 1px`      | min-height                        |
| `max-w-px`     | `max-width: 1px`       | max-width                         |
| `max-h-px`     | `max-height: 1px`      | max-height                        |
| `w-0.5`        | `width: 0.125rem`      | width                             |
| `h-0.5`        | `height: 0.125rem`     | height                            |
| `min-w-0.5`    | `min-width: 0.125rem`  | min-width                         |
| `min-h-0.5`    | `min-height: 0.125rem` | min-height                        |
| `max-w-0.5`    | `max-width: 0.125rem`  | max-width                         |
| `max-h-0.5`    | `max-height: 0.125rem` | max-height                        |
| `w-1.5`        | `width: 0.375rem`      | width                             |
| `h-1.5`        | `height: 0.375rem`     | height                            |
| `min-w-1.5`    | `min-width: 0.375rem`  | min-width                         |
| `min-h-1.5`    | `min-height: 0.375rem` | min-height                        |
| `max-w-1.5`    | `max-width: 0.375rem`  | max-width                         |
| `max-h-1.5`    | `max-height: 0.375rem` | max-height                        |
| `w-2.5`        | `width: 0.625rem`      | width                             |
| `h-2.5`        | `height: 0.625rem`     | height                            |
| `min-w-2.5`    | `min-width: 0.625rem`  | min-width                         |
| `min-h-2.5`    | `min-height: 0.625rem` | min-height                        |
| `max-w-2.5`    | `max-width: 0.625rem`  | max-width                         |
| `max-h-2.5`    | `max-height: 0.625rem` | max-height                        |
| `w-3.5`        | `width: 0.875rem`      | width                             |
| `h-3.5`        | `height: 0.875rem`     | height                            |
| `min-w-3.5`    | `min-width: 0.875rem`  | min-width                         |
| `min-h-3.5`    | `min-height: 0.875rem` | min-height                        |
| `max-w-3.5`    | `max-width: 0.875rem`  | max-width                         |
| `max-h-3.5`    | `max-height: 0.875rem` | max-height                        |
| `w-auto`       | `width: auto`          | width: auto                       |
| `h-auto`       | `height: auto`         | height: auto                      |
| `w-full`       | `width: 100%`          | width: 100%                       |
| `h-full`       | `height: 100%`         | height: 100%                      |
| `w-screen`     | `width: 100vw`         | width: viewport width             |
| `h-screen`     | `height: 100vh`        | height: viewport height           |
| `w-fit`        | `width: fit-content`   | width: fit-content                |
| `h-fit`        | `height: fit-content`  | height: fit-content               |
| `min-w-0`      | `min-width: 0`         | min-width: 0                      |
| `min-h-0`      | `min-height: 0`        | min-height: 0                     |
| `min-w-full`   | `min-width: 100%`      | min-width: 100%                   |
| `min-h-full`   | `min-height: 100%`     | min-height: 100%                  |
| `min-h-screen` | `min-height: 100vh`    | min-height: viewport height       |
| `min-h-svh`    | `min-height: 100svh`   | min-height: small viewport height |
| `max-w-full`   | `max-width: 100%`      | max-width: 100%                   |
| `max-w-none`   | `max-width: none`      | max-width: none                   |
| `max-h-full`   | `max-height: 100%`     | max-height: 100%                  |
| `max-h-screen` | `max-height: 100vh`    | max-height: viewport height       |
| `max-w-xs`     | `max-width: 20rem`     | max-width: 20rem                  |
| `max-w-sm`     | `max-width: 24rem`     | max-width: 24rem                  |
| `max-w-md`     | `max-width: 28rem`     | max-width: 28rem                  |
| `max-w-lg`     | `max-width: 32rem`     | max-width: 32rem                  |
| `max-w-xl`     | `max-width: 36rem`     | max-width: 36rem                  |
| `max-w-2xl`    | `max-width: 42rem`     | max-width: 42rem                  |
| `max-w-3xl`    | `max-width: 48rem`     | max-width: 48rem                  |
| `max-w-4xl`    | `max-width: 56rem`     | max-width: 56rem                  |
| `max-w-5xl`    | `max-width: 64rem`     | max-width: 64rem                  |
| `max-w-6xl`    | `max-width: 72rem`     | max-width: 72rem                  |
| `max-w-7xl`    | `max-width: 80rem`     | max-width: 80rem                  |
| `max-w-full`   | `max-width: 100%`      | max-width: 100%                   |

---

## Responsive & state variants

Every utility above accepts a responsive prefix (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) and — in JIT mode — a state variant (`hover:`, `focus:`, `active:`, `disabled:`, `dark:`, `group-hover:`, `peer-focus:`, …). See [Variants](../VARIANTS.md) and [Responsive](../RESPONSIVE.md).


<!-- ===== docs/utilities/04-flexbox-grid.md (#docs-utilities-04-flexbox-grid-md) ===== -->

---
title: Flexbox & Grid Utilities
---

# Flexbox & Grid Utilities

> Part of the [Nakshora Utilities Reference](../UTILITIES.md). These tables are **generated from the framework source** — what you see here is exactly what the compiler emits.

Everything you need for one-dimensional (Flexbox) and two-dimensional (CSS Grid) layouts.

## Flexbox

**50 utilities**

| Class               | CSS                              | Description                    |
| ------------------- | -------------------------------- | ------------------------------ |
| `flex-row`          | `flex-direction: row`            | flex-direction: row            |
| `flex-row-reverse`  | `flex-direction: row-reverse`    | flex-direction: row-reverse    |
| `flex-col`          | `flex-direction: col`            | flex-direction: col            |
| `flex-col-reverse`  | `flex-direction: col-reverse`    | flex-direction: col-reverse    |
| `flex-wrap`         | `flex-wrap: wrap`                | flex-wrap: wrap                |
| `flex-nowrap`       | `flex-wrap: nowrap`              | flex-wrap: nowrap              |
| `flex-wrap-reverse` | `flex-wrap: wrap-reverse`        | flex-wrap: wrap-reverse        |
| `justify-start`     | `justify-content: flex-start`    | justify-content: flex-start    |
| `justify-center`    | `justify-content: space-center`  | justify-content: space-center  |
| `justify-end`       | `justify-content: flex-end`      | justify-content: flex-end      |
| `justify-between`   | `justify-content: space-between` | justify-content: space-between |
| `justify-around`    | `justify-content: space-around`  | justify-content: space-around  |
| `justify-evenly`    | `justify-content: space-evenly`  | justify-content: space-evenly  |
| `items-start`       | `align-items: flex-start`        | align-items                    |
| `items-center`      | `align-items: center`            | align-items                    |
| `items-end`         | `align-items: flex-end`          | align-items                    |
| `items-stretch`     | `align-items: stretch`           | align-items                    |
| `items-baseline`    | `align-items: baseline`          | align-items                    |
| `content-start`     | `align-content: flex-start`      | align-content                  |
| `content-center`    | `align-content: center`          | align-content                  |
| `content-end`       | `align-content: flex-end`        | align-content                  |
| `content-between`   | `align-content: space-between`   | align-content                  |
| `content-around`    | `align-content: space-around`    | align-content                  |
| `content-stretch`   | `align-content: stretch`         | align-content                  |
| `self-auto`         | `align-self: auto`               | align-self                     |
| `self-start`        | `align-self: flex-start`         | align-self                     |
| `self-center`       | `align-self: center`             | align-self                     |
| `self-end`          | `align-self: flex-end`           | align-self                     |
| `self-stretch`      | `align-self: stretch`            | align-self                     |
| `flex-1`            | `flex: 1 1 0%`                   | flex: 1 1 0%                   |
| `flex-auto`         | `flex: 1 1 auto`                 | flex: 1 1 auto                 |
| `flex-initial`      | `flex: 0 1 auto`                 | flex: 0 1 auto                 |
| `flex-none`         | `flex: none`                     | flex: none                     |
| `grow`              | `flex-grow: 1`                   | flex-grow: 1                   |
| `grow-0`            | `flex-grow: 0`                   | flex-grow: 0                   |
| `shrink`            | `flex-shrink: 1`                 | flex-shrink: 1                 |
| `shrink-0`          | `flex-shrink: 0`                 | flex-shrink: 0                 |
| `order--6`          | `order: -6`                      | order: -6                      |
| `order--5`          | `order: -5`                      | order: -5                      |
| `order--4`          | `order: -4`                      | order: -4                      |
| `order--3`          | `order: -3`                      | order: -3                      |
| `order--2`          | `order: -2`                      | order: -2                      |
| `order--1`          | `order: -1`                      | order: -1                      |
| `order-0`           | `order: 0`                       | order: 0                       |
| `order-1`           | `order: 1`                       | order: 1                       |
| `order-2`           | `order: 2`                       | order: 2                       |
| `order-3`           | `order: 3`                       | order: 3                       |
| `order-4`           | `order: 4`                       | order: 4                       |
| `order-5`           | `order: 5`                       | order: 5                       |
| `order-6`           | `order: 6`                       | order: 6                       |

## Grid

**53 utilities**

| Class                 | CSS                                                 | Description               |
| --------------------- | --------------------------------------------------- | ------------------------- |
| `grid-cols-1`         | `grid-template-columns: repeat(1, minmax(0, 1fr))`  | 1 equal columns           |
| `col-span-1`          | `grid-column: span 1 / span 1`                      | span 1 columns            |
| `grid-cols-2`         | `grid-template-columns: repeat(2, minmax(0, 1fr))`  | 2 equal columns           |
| `col-span-2`          | `grid-column: span 2 / span 2`                      | span 2 columns            |
| `grid-cols-3`         | `grid-template-columns: repeat(3, minmax(0, 1fr))`  | 3 equal columns           |
| `col-span-3`          | `grid-column: span 3 / span 3`                      | span 3 columns            |
| `grid-cols-4`         | `grid-template-columns: repeat(4, minmax(0, 1fr))`  | 4 equal columns           |
| `col-span-4`          | `grid-column: span 4 / span 4`                      | span 4 columns            |
| `grid-cols-5`         | `grid-template-columns: repeat(5, minmax(0, 1fr))`  | 5 equal columns           |
| `col-span-5`          | `grid-column: span 5 / span 5`                      | span 5 columns            |
| `grid-cols-6`         | `grid-template-columns: repeat(6, minmax(0, 1fr))`  | 6 equal columns           |
| `col-span-6`          | `grid-column: span 6 / span 6`                      | span 6 columns            |
| `grid-cols-7`         | `grid-template-columns: repeat(7, minmax(0, 1fr))`  | 7 equal columns           |
| `col-span-7`          | `grid-column: span 7 / span 7`                      | span 7 columns            |
| `grid-cols-8`         | `grid-template-columns: repeat(8, minmax(0, 1fr))`  | 8 equal columns           |
| `col-span-8`          | `grid-column: span 8 / span 8`                      | span 8 columns            |
| `grid-cols-9`         | `grid-template-columns: repeat(9, minmax(0, 1fr))`  | 9 equal columns           |
| `col-span-9`          | `grid-column: span 9 / span 9`                      | span 9 columns            |
| `grid-cols-10`        | `grid-template-columns: repeat(10, minmax(0, 1fr))` | 10 equal columns          |
| `col-span-10`         | `grid-column: span 10 / span 10`                    | span 10 columns           |
| `grid-cols-11`        | `grid-template-columns: repeat(11, minmax(0, 1fr))` | 11 equal columns          |
| `col-span-11`         | `grid-column: span 11 / span 11`                    | span 11 columns           |
| `grid-cols-12`        | `grid-template-columns: repeat(12, minmax(0, 1fr))` | 12 equal columns          |
| `col-span-12`         | `grid-column: span 12 / span 12`                    | span 12 columns           |
| `col-span-full`       | `grid-column: 1 / -1`                               | span all columns          |
| `grid-rows-1`         | `grid-template-rows: repeat(1, minmax(0, 1fr))`     | 1 equal rows              |
| `row-span-1`          | `grid-row: span 1 / span 1`                         | span 1 rows               |
| `grid-rows-2`         | `grid-template-rows: repeat(2, minmax(0, 1fr))`     | 2 equal rows              |
| `row-span-2`          | `grid-row: span 2 / span 2`                         | span 2 rows               |
| `grid-rows-3`         | `grid-template-rows: repeat(3, minmax(0, 1fr))`     | 3 equal rows              |
| `row-span-3`          | `grid-row: span 3 / span 3`                         | span 3 rows               |
| `grid-rows-4`         | `grid-template-rows: repeat(4, minmax(0, 1fr))`     | 4 equal rows              |
| `row-span-4`          | `grid-row: span 4 / span 4`                         | span 4 rows               |
| `grid-rows-5`         | `grid-template-rows: repeat(5, minmax(0, 1fr))`     | 5 equal rows              |
| `row-span-5`          | `grid-row: span 5 / span 5`                         | span 5 rows               |
| `grid-rows-6`         | `grid-template-rows: repeat(6, minmax(0, 1fr))`     | 6 equal rows              |
| `row-span-6`          | `grid-row: span 6 / span 6`                         | span 6 rows               |
| `row-span-full`       | `grid-row: 1 / -1`                                  | span all rows             |
| `col-start-1`         | `grid-column-start: 1`                              | column start 1            |
| `col-end-1`           | `grid-column-end: 1`                                | column end 1              |
| `grid-flow-row`       | `grid-auto-flow: row`                               | grid-auto-flow: row       |
| `grid-flow-col`       | `grid-auto-flow: col`                               | grid-auto-flow: col       |
| `grid-flow-row-dense` | `grid-auto-flow: row-dense`                         | grid-auto-flow: row-dense |
| `grid-flow-col-dense` | `grid-auto-flow: col-dense`                         | grid-auto-flow: col-dense |
| `grid-flow-dense`     | `grid-auto-flow: dense`                             | grid-auto-flow: dense     |
| `auto-cols-auto`      | `grid-auto-columns: auto`                           | grid-auto-columns: auto   |
| `auto-rows-auto`      | `grid-auto-rows: auto`                              | grid-auto-rows: auto      |
| `auto-cols-min`       | `grid-auto-columns: min`                            | grid-auto-columns: min    |
| `auto-rows-min`       | `grid-auto-rows: min`                               | grid-auto-rows: min       |
| `auto-cols-max`       | `grid-auto-columns: max`                            | grid-auto-columns: max    |
| `auto-rows-max`       | `grid-auto-rows: max`                               | grid-auto-rows: max       |
| `auto-cols-fr`        | `grid-auto-columns: fr`                             | grid-auto-columns: fr     |
| `auto-rows-fr`        | `grid-auto-rows: fr`                                | grid-auto-rows: fr        |

---

## Responsive & state variants

Every utility above accepts a responsive prefix (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) and — in JIT mode — a state variant (`hover:`, `focus:`, `active:`, `disabled:`, `dark:`, `group-hover:`, `peer-focus:`, …). See [Variants](../VARIANTS.md) and [Responsive](../RESPONSIVE.md).


<!-- ===== docs/utilities/05-typography.md (#docs-utilities-05-typography-md) ===== -->

---
title: Typography Utilities
---

# Typography Utilities

> Part of the [Nakshora Utilities Reference](../UTILITIES.md). These tables are **generated from the framework source** — what you see here is exactly what the compiler emits.

Font size, weight, family, spacing, alignment, transforms and decorations.

## Typography

**52 utilities**

| Class              | CSS                                                                                                               | Description                |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `text-xs`          | `font-size: 0.75rem; line-height: 1rem`                                                                           | font-size: 0.75rem         |
| `text-sm`          | `font-size: 0.875rem; line-height: 1.25rem`                                                                       | font-size: 0.875rem        |
| `text-base`        | `font-size: 1rem; line-height: 1.5rem`                                                                            | font-size: 1rem            |
| `text-lg`          | `font-size: 1.125rem; line-height: 1.75rem`                                                                       | font-size: 1.125rem        |
| `text-xl`          | `font-size: 1.25rem; line-height: 1.75rem`                                                                        | font-size: 1.25rem         |
| `text-2xl`         | `font-size: 1.5rem; line-height: 2rem`                                                                            | font-size: 1.5rem          |
| `text-3xl`         | `font-size: 1.875rem; line-height: 2.25rem`                                                                       | font-size: 1.875rem        |
| `text-4xl`         | `font-size: 2.25rem; line-height: 2.5rem`                                                                         | font-size: 2.25rem         |
| `text-5xl`         | `font-size: 3rem; line-height: 1`                                                                                 | font-size: 3rem            |
| `text-6xl`         | `font-size: 3.75rem; line-height: 1`                                                                              | font-size: 3.75rem         |
| `text-7xl`         | `font-size: 4.5rem; line-height: 1`                                                                               | font-size: 4.5rem          |
| `text-8xl`         | `font-size: 6rem; line-height: 1`                                                                                 | font-size: 6rem            |
| `text-9xl`         | `font-size: 8rem; line-height: 1`                                                                                 | font-size: 8rem            |
| `font-thin`        | `font-weight: 100`                                                                                                | font-weight: 100           |
| `font-extralight`  | `font-weight: 200`                                                                                                | font-weight: 200           |
| `font-light`       | `font-weight: 300`                                                                                                | font-weight: 300           |
| `font-normal`      | `font-weight: 400`                                                                                                | font-weight: 400           |
| `font-medium`      | `font-weight: 500`                                                                                                | font-weight: 500           |
| `font-semibold`    | `font-weight: 600`                                                                                                | font-weight: 600           |
| `font-bold`        | `font-weight: 700`                                                                                                | font-weight: 700           |
| `font-extrabold`   | `font-weight: 800`                                                                                                | font-weight: 800           |
| `font-black`       | `font-weight: 900`                                                                                                | font-weight: 900           |
| `font-sans`        | `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`         | font-family: sans          |
| `font-mono`        | `font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace` | font-family: mono          |
| `leading-none`     | `line-height: 1`                                                                                                  | line-height: 1             |
| `leading-tight`    | `line-height: 1.25`                                                                                               | line-height: 1.25          |
| `leading-snug`     | `line-height: 1.375`                                                                                              | line-height: 1.375         |
| `leading-base`     | `line-height: 1.5`                                                                                                | line-height: 1.5           |
| `leading-relaxed`  | `line-height: 1.625`                                                                                              | line-height: 1.625         |
| `leading-loose`    | `line-height: 2`                                                                                                  | line-height: 2             |
| `tracking-tighter` | `letter-spacing: -0.05em`                                                                                         | letter-spacing: -0.05em    |
| `tracking-tight`   | `letter-spacing: -0.025em`                                                                                        | letter-spacing: -0.025em   |
| `tracking-normal`  | `letter-spacing: 0em`                                                                                             | letter-spacing: 0em        |
| `tracking-wide`    | `letter-spacing: 0.025em`                                                                                         | letter-spacing: 0.025em    |
| `tracking-wider`   | `letter-spacing: 0.05em`                                                                                          | letter-spacing: 0.05em     |
| `tracking-widest`  | `letter-spacing: 0.1em`                                                                                           | letter-spacing: 0.1em      |
| `text-left`        | `text-align: left`                                                                                                | text-align: left           |
| `text-center`      | `text-align: center`                                                                                              | text-align: center         |
| `text-right`       | `text-align: right`                                                                                               | text-align: right          |
| `text-justify`     | `text-align: justify`                                                                                             | text-align: justify        |
| `text-start`       | `text-align: start`                                                                                               | text-align: start          |
| `text-end`         | `text-align: end`                                                                                                 | text-align: end            |
| `uppercase`        | `text-transform: uppercase`                                                                                       | text-transform: uppercase  |
| `lowercase`        | `text-transform: lowercase`                                                                                       | text-transform: lowercase  |
| `capitalize`       | `text-transform: capitalize`                                                                                      | text-transform: capitalize |
| `normal-case`      | `text-transform: none`                                                                                            | text-transform: none       |
| `italic`           | `fontStyle: italic`                                                                                               | italic                     |
| `not-italic`       | `fontStyle: normal`                                                                                               | not-italic                 |
| `truncate`         | `overflow: hidden; text-overflow: ellipsis; whiteSpace: nowrap`                                                   | single-line ellipsis       |
| `text-ellipsis`    | `text-overflow: ellipsis`                                                                                         | text-overflow: ellipsis    |
| `text-clip`        | `text-overflow: clip`                                                                                             | text-overflow: clip        |
| `antialiased`      | `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale`                                         | font smoothing             |

## Text Decoration

**13 utilities**

| Class                | CSS                                  | Description                        |
| -------------------- | ------------------------------------ | ---------------------------------- |
| `underline`          | `text-decoration-line: underline`    | text-decoration-line: underline    |
| `overline`           | `text-decoration-line: overline`     | text-decoration-line: overline     |
| `line-through`       | `text-decoration-line: line-through` | text-decoration-line: line-through |
| `no-underline`       | `text-decoration-line: none`         | text-decoration-line: none         |
| `decoration-thin`    | `text-decoration-thickness: 1px`     | decoration thickness               |
| `decoration-2`       | `text-decoration-thickness: 2px`     | decoration thickness               |
| `decoration-4`       | `text-decoration-thickness: 4px`     | decoration thickness               |
| `decoration-8`       | `text-decoration-thickness: 8px`     | decoration thickness               |
| `underline-offset-0` | `text-underline-offset: 0px`         | underline offset                   |
| `underline-offset-1` | `text-underline-offset: 1px`         | underline offset                   |
| `underline-offset-2` | `text-underline-offset: 2px`         | underline offset                   |
| `underline-offset-4` | `text-underline-offset: 4px`         | underline offset                   |
| `underline-offset-8` | `text-underline-offset: 8px`         | underline offset                   |

---

## Responsive & state variants

Every utility above accepts a responsive prefix (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) and — in JIT mode — a state variant (`hover:`, `focus:`, `active:`, `disabled:`, `dark:`, `group-hover:`, `peer-focus:`, …). See [Variants](../VARIANTS.md) and [Responsive](../RESPONSIVE.md).


<!-- ===== docs/utilities/06-colors.md (#docs-utilities-06-colors-md) ===== -->

---
title: Color Utilities
---

# Color Utilities

> Part of the [Nakshora Utilities Reference](../UTILITIES.md). These tables are **generated from the framework source** — what you see here is exactly what the compiler emits.

22 color palettes × 11 shades (50–950). Syntax: `<utility>-<palette>-<shade>` — e.g. `text-blue-500`, `bg-slate-900`, `border-rose-200`, `from-indigo-400`.

**Palettes:** `slate` `gray` `zinc` `neutral` `stone` `red` `orange` `amber` `yellow` `lime` `emerald` `green` `teal` `cyan` `sky` `blue` `indigo` `violet` `purple` `fuchsia` `pink` `rose`

The full table is generated per palette below. Gradient direction utilities live in [Backgrounds](./07-backgrounds.md).

## Text Colors

**242 utilities**

| Class              | CSS              | Description    |
| ------------------ | ---------------- | -------------- |
| `text-slate-50`    | `color: #f8fafc` | color: #f8fafc |
| `text-slate-100`   | `color: #f1f5f9` | color: #f1f5f9 |
| `text-slate-200`   | `color: #e2e8f0` | color: #e2e8f0 |
| `text-slate-300`   | `color: #cbd5e1` | color: #cbd5e1 |
| `text-slate-400`   | `color: #94a3b8` | color: #94a3b8 |
| `text-slate-500`   | `color: #64748b` | color: #64748b |
| `text-slate-600`   | `color: #475569` | color: #475569 |
| `text-slate-700`   | `color: #334155` | color: #334155 |
| `text-slate-800`   | `color: #1e293b` | color: #1e293b |
| `text-slate-900`   | `color: #0f172a` | color: #0f172a |
| `text-slate-950`   | `color: #020617` | color: #020617 |
| `text-gray-50`     | `color: #f9fafb` | color: #f9fafb |
| `text-gray-100`    | `color: #f3f4f6` | color: #f3f4f6 |
| `text-gray-200`    | `color: #e5e7eb` | color: #e5e7eb |
| `text-gray-300`    | `color: #d1d5db` | color: #d1d5db |
| `text-gray-400`    | `color: #9ca3af` | color: #9ca3af |
| `text-gray-500`    | `color: #6b7280` | color: #6b7280 |
| `text-gray-600`    | `color: #4b5563` | color: #4b5563 |
| `text-gray-700`    | `color: #374151` | color: #374151 |
| `text-gray-800`    | `color: #1f2937` | color: #1f2937 |
| `text-gray-900`    | `color: #111827` | color: #111827 |
| `text-gray-950`    | `color: #030712` | color: #030712 |
| `text-zinc-50`     | `color: #fafafa` | color: #fafafa |
| `text-zinc-100`    | `color: #f4f4f5` | color: #f4f4f5 |
| `text-zinc-200`    | `color: #e4e4e7` | color: #e4e4e7 |
| `text-zinc-300`    | `color: #d4d4d8` | color: #d4d4d8 |
| `text-zinc-400`    | `color: #a1a1aa` | color: #a1a1aa |
| `text-zinc-500`    | `color: #71717a` | color: #71717a |
| `text-zinc-600`    | `color: #52525b` | color: #52525b |
| `text-zinc-700`    | `color: #3f3f46` | color: #3f3f46 |
| `text-zinc-800`    | `color: #27272a` | color: #27272a |
| `text-zinc-900`    | `color: #18181b` | color: #18181b |
| `text-zinc-950`    | `color: #09090b` | color: #09090b |
| `text-neutral-50`  | `color: #fafafa` | color: #fafafa |
| `text-neutral-100` | `color: #f5f5f5` | color: #f5f5f5 |
| `text-neutral-200` | `color: #e5e5e5` | color: #e5e5e5 |
| `text-neutral-300` | `color: #d4d4d4` | color: #d4d4d4 |
| `text-neutral-400` | `color: #a3a3a3` | color: #a3a3a3 |
| `text-neutral-500` | `color: #737373` | color: #737373 |
| `text-neutral-600` | `color: #525252` | color: #525252 |
| `text-neutral-700` | `color: #404040` | color: #404040 |
| `text-neutral-800` | `color: #262626` | color: #262626 |
| `text-neutral-900` | `color: #171717` | color: #171717 |
| `text-neutral-950` | `color: #0a0a0a` | color: #0a0a0a |
| `text-stone-50`    | `color: #fafaf9` | color: #fafaf9 |
| `text-stone-100`   | `color: #f5f5f4` | color: #f5f5f4 |
| `text-stone-200`   | `color: #e7e5e4` | color: #e7e5e4 |
| `text-stone-300`   | `color: #d6d3d1` | color: #d6d3d1 |
| `text-stone-400`   | `color: #a8a29e` | color: #a8a29e |
| `text-stone-500`   | `color: #78716c` | color: #78716c |
| `text-stone-600`   | `color: #57534e` | color: #57534e |
| `text-stone-700`   | `color: #44403c` | color: #44403c |
| `text-stone-800`   | `color: #292524` | color: #292524 |
| `text-stone-900`   | `color: #1c1917` | color: #1c1917 |
| `text-stone-950`   | `color: #0c0a09` | color: #0c0a09 |
| `text-red-50`      | `color: #fef2f2` | color: #fef2f2 |
| `text-red-100`     | `color: #fee2e2` | color: #fee2e2 |
| `text-red-200`     | `color: #fecaca` | color: #fecaca |
| `text-red-300`     | `color: #fca5a5` | color: #fca5a5 |
| `text-red-400`     | `color: #f87171` | color: #f87171 |
| `text-red-500`     | `color: #ef4444` | color: #ef4444 |
| `text-red-600`     | `color: #dc2626` | color: #dc2626 |
| `text-red-700`     | `color: #b91c1c` | color: #b91c1c |
| `text-red-800`     | `color: #991b1b` | color: #991b1b |
| `text-red-900`     | `color: #7f1d1d` | color: #7f1d1d |
| `text-red-950`     | `color: #450a0a` | color: #450a0a |
| `text-orange-50`   | `color: #fff7ed` | color: #fff7ed |
| `text-orange-100`  | `color: #ffedd5` | color: #ffedd5 |
| `text-orange-200`  | `color: #fed7aa` | color: #fed7aa |
| `text-orange-300`  | `color: #fdba74` | color: #fdba74 |
| `text-orange-400`  | `color: #fb923c` | color: #fb923c |
| `text-orange-500`  | `color: #f97316` | color: #f97316 |
| `text-orange-600`  | `color: #ea580c` | color: #ea580c |
| `text-orange-700`  | `color: #c2410c` | color: #c2410c |
| `text-orange-800`  | `color: #9a3412` | color: #9a3412 |
| `text-orange-900`  | `color: #7c2d12` | color: #7c2d12 |
| `text-orange-950`  | `color: #431407` | color: #431407 |
| `text-amber-50`    | `color: #fffbeb` | color: #fffbeb |
| `text-amber-100`   | `color: #fef3c7` | color: #fef3c7 |
| `text-amber-200`   | `color: #fde68a` | color: #fde68a |
| `text-amber-300`   | `color: #fcd34d` | color: #fcd34d |
| `text-amber-400`   | `color: #fbbf24` | color: #fbbf24 |
| `text-amber-500`   | `color: #f59e0b` | color: #f59e0b |
| `text-amber-600`   | `color: #d97706` | color: #d97706 |
| `text-amber-700`   | `color: #b45309` | color: #b45309 |
| `text-amber-800`   | `color: #92400e` | color: #92400e |
| `text-amber-900`   | `color: #78350f` | color: #78350f |
| `text-amber-950`   | `color: #451a03` | color: #451a03 |
| `text-yellow-50`   | `color: #fefce8` | color: #fefce8 |
| `text-yellow-100`  | `color: #fef9c3` | color: #fef9c3 |
| `text-yellow-200`  | `color: #fef08a` | color: #fef08a |
| `text-yellow-300`  | `color: #fde047` | color: #fde047 |
| `text-yellow-400`  | `color: #facc15` | color: #facc15 |
| `text-yellow-500`  | `color: #eab308` | color: #eab308 |
| `text-yellow-600`  | `color: #ca8a04` | color: #ca8a04 |
| `text-yellow-700`  | `color: #a16207` | color: #a16207 |
| `text-yellow-800`  | `color: #854d0e` | color: #854d0e |
| `text-yellow-900`  | `color: #713f12` | color: #713f12 |
| `text-yellow-950`  | `color: #422006` | color: #422006 |
| `text-lime-50`     | `color: #f7fee7` | color: #f7fee7 |
| `text-lime-100`    | `color: #ecfccb` | color: #ecfccb |
| `text-lime-200`    | `color: #d9f99d` | color: #d9f99d |
| `text-lime-300`    | `color: #bef264` | color: #bef264 |
| `text-lime-400`    | `color: #a3e635` | color: #a3e635 |
| `text-lime-500`    | `color: #84cc16` | color: #84cc16 |
| `text-lime-600`    | `color: #65a30d` | color: #65a30d |
| `text-lime-700`    | `color: #4d7c0f` | color: #4d7c0f |
| `text-lime-800`    | `color: #3f6212` | color: #3f6212 |
| `text-lime-900`    | `color: #365314` | color: #365314 |
| `text-lime-950`    | `color: #1a2e05` | color: #1a2e05 |
| `text-emerald-50`  | `color: #ecfdf5` | color: #ecfdf5 |
| `text-emerald-100` | `color: #d1fae5` | color: #d1fae5 |
| `text-emerald-200` | `color: #a7f3d0` | color: #a7f3d0 |
| `text-emerald-300` | `color: #6ee7b7` | color: #6ee7b7 |
| `text-emerald-400` | `color: #34d399` | color: #34d399 |
| `text-emerald-500` | `color: #10b981` | color: #10b981 |
| `text-emerald-600` | `color: #059669` | color: #059669 |
| `text-emerald-700` | `color: #047857` | color: #047857 |
| `text-emerald-800` | `color: #065f46` | color: #065f46 |
| `text-emerald-900` | `color: #064e3b` | color: #064e3b |
| `text-emerald-950` | `color: #022c22` | color: #022c22 |
| `text-green-50`    | `color: #f0fdf4` | color: #f0fdf4 |
| `text-green-100`   | `color: #dcfce7` | color: #dcfce7 |
| `text-green-200`   | `color: #bbf7d0` | color: #bbf7d0 |
| `text-green-300`   | `color: #86efac` | color: #86efac |
| `text-green-400`   | `color: #4ade80` | color: #4ade80 |
| `text-green-500`   | `color: #22c55e` | color: #22c55e |
| `text-green-600`   | `color: #16a34a` | color: #16a34a |
| `text-green-700`   | `color: #15803d` | color: #15803d |
| `text-green-800`   | `color: #166534` | color: #166534 |
| `text-green-900`   | `color: #14532d` | color: #14532d |
| `text-green-950`   | `color: #052e16` | color: #052e16 |
| `text-teal-50`     | `color: #f0fdfa` | color: #f0fdfa |
| `text-teal-100`    | `color: #ccfbf1` | color: #ccfbf1 |
| `text-teal-200`    | `color: #99f6e4` | color: #99f6e4 |
| `text-teal-300`    | `color: #5eead4` | color: #5eead4 |
| `text-teal-400`    | `color: #2dd4bf` | color: #2dd4bf |
| `text-teal-500`    | `color: #14b8a6` | color: #14b8a6 |
| `text-teal-600`    | `color: #0d9488` | color: #0d9488 |
| `text-teal-700`    | `color: #0f766e` | color: #0f766e |
| `text-teal-800`    | `color: #115e59` | color: #115e59 |
| `text-teal-900`    | `color: #134e4a` | color: #134e4a |
| `text-teal-950`    | `color: #042f2e` | color: #042f2e |
| `text-cyan-50`     | `color: #ecfeff` | color: #ecfeff |
| `text-cyan-100`    | `color: #cffafe` | color: #cffafe |
| `text-cyan-200`    | `color: #a5f3fc` | color: #a5f3fc |
| `text-cyan-300`    | `color: #67e8f9` | color: #67e8f9 |
| `text-cyan-400`    | `color: #22d3ee` | color: #22d3ee |
| `text-cyan-500`    | `color: #06b6d4` | color: #06b6d4 |
| `text-cyan-600`    | `color: #0891b2` | color: #0891b2 |
| `text-cyan-700`    | `color: #0e7490` | color: #0e7490 |
| `text-cyan-800`    | `color: #155e75` | color: #155e75 |
| `text-cyan-900`    | `color: #164e63` | color: #164e63 |
| `text-cyan-950`    | `color: #083344` | color: #083344 |
| `text-sky-50`      | `color: #f0f9ff` | color: #f0f9ff |
| `text-sky-100`     | `color: #e0f2fe` | color: #e0f2fe |
| `text-sky-200`     | `color: #bae6fd` | color: #bae6fd |
| `text-sky-300`     | `color: #7dd3fc` | color: #7dd3fc |
| `text-sky-400`     | `color: #38bdf8` | color: #38bdf8 |
| `text-sky-500`     | `color: #0ea5e9` | color: #0ea5e9 |
| `text-sky-600`     | `color: #0284c7` | color: #0284c7 |
| `text-sky-700`     | `color: #0369a1` | color: #0369a1 |
| `text-sky-800`     | `color: #075985` | color: #075985 |
| `text-sky-900`     | `color: #0c4a6e` | color: #0c4a6e |
| `text-sky-950`     | `color: #082f49` | color: #082f49 |
| `text-blue-50`     | `color: #eff6ff` | color: #eff6ff |
| `text-blue-100`    | `color: #dbeafe` | color: #dbeafe |
| `text-blue-200`    | `color: #bfdbfe` | color: #bfdbfe |
| `text-blue-300`    | `color: #93c5fd` | color: #93c5fd |
| `text-blue-400`    | `color: #60a5fa` | color: #60a5fa |
| `text-blue-500`    | `color: #3b82f6` | color: #3b82f6 |
| `text-blue-600`    | `color: #2563eb` | color: #2563eb |
| `text-blue-700`    | `color: #1d4ed8` | color: #1d4ed8 |
| `text-blue-800`    | `color: #1e40af` | color: #1e40af |
| `text-blue-900`    | `color: #1e3a8a` | color: #1e3a8a |
| `text-blue-950`    | `color: #172554` | color: #172554 |
| `text-indigo-50`   | `color: #eef2ff` | color: #eef2ff |
| `text-indigo-100`  | `color: #e0e7ff` | color: #e0e7ff |
| `text-indigo-200`  | `color: #c7d2fe` | color: #c7d2fe |
| `text-indigo-300`  | `color: #a5b4fc` | color: #a5b4fc |
| `text-indigo-400`  | `color: #818cf8` | color: #818cf8 |
| `text-indigo-500`  | `color: #6366f1` | color: #6366f1 |
| `text-indigo-600`  | `color: #4f46e5` | color: #4f46e5 |
| `text-indigo-700`  | `color: #4338ca` | color: #4338ca |
| `text-indigo-800`  | `color: #3730a3` | color: #3730a3 |
| `text-indigo-900`  | `color: #312e81` | color: #312e81 |
| `text-indigo-950`  | `color: #1e1b4b` | color: #1e1b4b |
| `text-violet-50`   | `color: #f5f3ff` | color: #f5f3ff |
| `text-violet-100`  | `color: #ede9fe` | color: #ede9fe |
| `text-violet-200`  | `color: #ddd6fe` | color: #ddd6fe |
| `text-violet-300`  | `color: #c4b5fd` | color: #c4b5fd |
| `text-violet-400`  | `color: #a78bfa` | color: #a78bfa |
| `text-violet-500`  | `color: #8b5cf6` | color: #8b5cf6 |
| `text-violet-600`  | `color: #7c3aed` | color: #7c3aed |
| `text-violet-700`  | `color: #6d28d9` | color: #6d28d9 |
| `text-violet-800`  | `color: #5b21b6` | color: #5b21b6 |
| `text-violet-900`  | `color: #4c1d95` | color: #4c1d95 |
| `text-violet-950`  | `color: #2e1065` | color: #2e1065 |
| `text-purple-50`   | `color: #faf5ff` | color: #faf5ff |
| `text-purple-100`  | `color: #f3e8ff` | color: #f3e8ff |
| `text-purple-200`  | `color: #e9d5ff` | color: #e9d5ff |
| `text-purple-300`  | `color: #d8b4fe` | color: #d8b4fe |
| `text-purple-400`  | `color: #c084fc` | color: #c084fc |
| `text-purple-500`  | `color: #a855f7` | color: #a855f7 |
| `text-purple-600`  | `color: #9333ea` | color: #9333ea |
| `text-purple-700`  | `color: #7e22ce` | color: #7e22ce |
| `text-purple-800`  | `color: #6b21a8` | color: #6b21a8 |
| `text-purple-900`  | `color: #581c87` | color: #581c87 |
| `text-purple-950`  | `color: #3b0764` | color: #3b0764 |
| `text-fuchsia-50`  | `color: #fdf4ff` | color: #fdf4ff |
| `text-fuchsia-100` | `color: #fae8ff` | color: #fae8ff |
| `text-fuchsia-200` | `color: #f5d0fe` | color: #f5d0fe |
| `text-fuchsia-300` | `color: #f0abfc` | color: #f0abfc |
| `text-fuchsia-400` | `color: #e879f9` | color: #e879f9 |
| `text-fuchsia-500` | `color: #d946ef` | color: #d946ef |
| `text-fuchsia-600` | `color: #c026d3` | color: #c026d3 |
| `text-fuchsia-700` | `color: #a21caf` | color: #a21caf |
| `text-fuchsia-800` | `color: #86198f` | color: #86198f |
| `text-fuchsia-900` | `color: #701a75` | color: #701a75 |
| `text-fuchsia-950` | `color: #4a044e` | color: #4a044e |
| `text-pink-50`     | `color: #fdf2f8` | color: #fdf2f8 |
| `text-pink-100`    | `color: #fce7f3` | color: #fce7f3 |
| `text-pink-200`    | `color: #fbcfe8` | color: #fbcfe8 |
| `text-pink-300`    | `color: #f9a8d4` | color: #f9a8d4 |
| `text-pink-400`    | `color: #f472b6` | color: #f472b6 |
| `text-pink-500`    | `color: #ec4899` | color: #ec4899 |
| `text-pink-600`    | `color: #db2777` | color: #db2777 |
| `text-pink-700`    | `color: #be185d` | color: #be185d |
| `text-pink-800`    | `color: #9d174d` | color: #9d174d |
| `text-pink-900`    | `color: #831843` | color: #831843 |
| `text-pink-950`    | `color: #500724` | color: #500724 |
| `text-rose-50`     | `color: #fff1f2` | color: #fff1f2 |
| `text-rose-100`    | `color: #ffe4e6` | color: #ffe4e6 |
| `text-rose-200`    | `color: #fecdd3` | color: #fecdd3 |
| `text-rose-300`    | `color: #fda4af` | color: #fda4af |
| `text-rose-400`    | `color: #fb7185` | color: #fb7185 |
| `text-rose-500`    | `color: #f43f5e` | color: #f43f5e |
| `text-rose-600`    | `color: #e11d48` | color: #e11d48 |
| `text-rose-700`    | `color: #be123c` | color: #be123c |
| `text-rose-800`    | `color: #881337` | color: #881337 |
| `text-rose-900`    | `color: #4c0519` | color: #4c0519 |
| `text-rose-950`    | `color: #1c020c` | color: #1c020c |

## Background Colors

**242 utilities**

| Class            | CSS                         | Description               |
| ---------------- | --------------------------- | ------------------------- |
| `bg-slate-50`    | `background-color: #f8fafc` | background-color: #f8fafc |
| `bg-slate-100`   | `background-color: #f1f5f9` | background-color: #f1f5f9 |
| `bg-slate-200`   | `background-color: #e2e8f0` | background-color: #e2e8f0 |
| `bg-slate-300`   | `background-color: #cbd5e1` | background-color: #cbd5e1 |
| `bg-slate-400`   | `background-color: #94a3b8` | background-color: #94a3b8 |
| `bg-slate-500`   | `background-color: #64748b` | background-color: #64748b |
| `bg-slate-600`   | `background-color: #475569` | background-color: #475569 |
| `bg-slate-700`   | `background-color: #334155` | background-color: #334155 |
| `bg-slate-800`   | `background-color: #1e293b` | background-color: #1e293b |
| `bg-slate-900`   | `background-color: #0f172a` | background-color: #0f172a |
| `bg-slate-950`   | `background-color: #020617` | background-color: #020617 |
| `bg-gray-50`     | `background-color: #f9fafb` | background-color: #f9fafb |
| `bg-gray-100`    | `background-color: #f3f4f6` | background-color: #f3f4f6 |
| `bg-gray-200`    | `background-color: #e5e7eb` | background-color: #e5e7eb |
| `bg-gray-300`    | `background-color: #d1d5db` | background-color: #d1d5db |
| `bg-gray-400`    | `background-color: #9ca3af` | background-color: #9ca3af |
| `bg-gray-500`    | `background-color: #6b7280` | background-color: #6b7280 |
| `bg-gray-600`    | `background-color: #4b5563` | background-color: #4b5563 |
| `bg-gray-700`    | `background-color: #374151` | background-color: #374151 |
| `bg-gray-800`    | `background-color: #1f2937` | background-color: #1f2937 |
| `bg-gray-900`    | `background-color: #111827` | background-color: #111827 |
| `bg-gray-950`    | `background-color: #030712` | background-color: #030712 |
| `bg-zinc-50`     | `background-color: #fafafa` | background-color: #fafafa |
| `bg-zinc-100`    | `background-color: #f4f4f5` | background-color: #f4f4f5 |
| `bg-zinc-200`    | `background-color: #e4e4e7` | background-color: #e4e4e7 |
| `bg-zinc-300`    | `background-color: #d4d4d8` | background-color: #d4d4d8 |
| `bg-zinc-400`    | `background-color: #a1a1aa` | background-color: #a1a1aa |
| `bg-zinc-500`    | `background-color: #71717a` | background-color: #71717a |
| `bg-zinc-600`    | `background-color: #52525b` | background-color: #52525b |
| `bg-zinc-700`    | `background-color: #3f3f46` | background-color: #3f3f46 |
| `bg-zinc-800`    | `background-color: #27272a` | background-color: #27272a |
| `bg-zinc-900`    | `background-color: #18181b` | background-color: #18181b |
| `bg-zinc-950`    | `background-color: #09090b` | background-color: #09090b |
| `bg-neutral-50`  | `background-color: #fafafa` | background-color: #fafafa |
| `bg-neutral-100` | `background-color: #f5f5f5` | background-color: #f5f5f5 |
| `bg-neutral-200` | `background-color: #e5e5e5` | background-color: #e5e5e5 |
| `bg-neutral-300` | `background-color: #d4d4d4` | background-color: #d4d4d4 |
| `bg-neutral-400` | `background-color: #a3a3a3` | background-color: #a3a3a3 |
| `bg-neutral-500` | `background-color: #737373` | background-color: #737373 |
| `bg-neutral-600` | `background-color: #525252` | background-color: #525252 |
| `bg-neutral-700` | `background-color: #404040` | background-color: #404040 |
| `bg-neutral-800` | `background-color: #262626` | background-color: #262626 |
| `bg-neutral-900` | `background-color: #171717` | background-color: #171717 |
| `bg-neutral-950` | `background-color: #0a0a0a` | background-color: #0a0a0a |
| `bg-stone-50`    | `background-color: #fafaf9` | background-color: #fafaf9 |
| `bg-stone-100`   | `background-color: #f5f5f4` | background-color: #f5f5f4 |
| `bg-stone-200`   | `background-color: #e7e5e4` | background-color: #e7e5e4 |
| `bg-stone-300`   | `background-color: #d6d3d1` | background-color: #d6d3d1 |
| `bg-stone-400`   | `background-color: #a8a29e` | background-color: #a8a29e |
| `bg-stone-500`   | `background-color: #78716c` | background-color: #78716c |
| `bg-stone-600`   | `background-color: #57534e` | background-color: #57534e |
| `bg-stone-700`   | `background-color: #44403c` | background-color: #44403c |
| `bg-stone-800`   | `background-color: #292524` | background-color: #292524 |
| `bg-stone-900`   | `background-color: #1c1917` | background-color: #1c1917 |
| `bg-stone-950`   | `background-color: #0c0a09` | background-color: #0c0a09 |
| `bg-red-50`      | `background-color: #fef2f2` | background-color: #fef2f2 |
| `bg-red-100`     | `background-color: #fee2e2` | background-color: #fee2e2 |
| `bg-red-200`     | `background-color: #fecaca` | background-color: #fecaca |
| `bg-red-300`     | `background-color: #fca5a5` | background-color: #fca5a5 |
| `bg-red-400`     | `background-color: #f87171` | background-color: #f87171 |
| `bg-red-500`     | `background-color: #ef4444` | background-color: #ef4444 |
| `bg-red-600`     | `background-color: #dc2626` | background-color: #dc2626 |
| `bg-red-700`     | `background-color: #b91c1c` | background-color: #b91c1c |
| `bg-red-800`     | `background-color: #991b1b` | background-color: #991b1b |
| `bg-red-900`     | `background-color: #7f1d1d` | background-color: #7f1d1d |
| `bg-red-950`     | `background-color: #450a0a` | background-color: #450a0a |
| `bg-orange-50`   | `background-color: #fff7ed` | background-color: #fff7ed |
| `bg-orange-100`  | `background-color: #ffedd5` | background-color: #ffedd5 |
| `bg-orange-200`  | `background-color: #fed7aa` | background-color: #fed7aa |
| `bg-orange-300`  | `background-color: #fdba74` | background-color: #fdba74 |
| `bg-orange-400`  | `background-color: #fb923c` | background-color: #fb923c |
| `bg-orange-500`  | `background-color: #f97316` | background-color: #f97316 |
| `bg-orange-600`  | `background-color: #ea580c` | background-color: #ea580c |
| `bg-orange-700`  | `background-color: #c2410c` | background-color: #c2410c |
| `bg-orange-800`  | `background-color: #9a3412` | background-color: #9a3412 |
| `bg-orange-900`  | `background-color: #7c2d12` | background-color: #7c2d12 |
| `bg-orange-950`  | `background-color: #431407` | background-color: #431407 |
| `bg-amber-50`    | `background-color: #fffbeb` | background-color: #fffbeb |
| `bg-amber-100`   | `background-color: #fef3c7` | background-color: #fef3c7 |
| `bg-amber-200`   | `background-color: #fde68a` | background-color: #fde68a |
| `bg-amber-300`   | `background-color: #fcd34d` | background-color: #fcd34d |
| `bg-amber-400`   | `background-color: #fbbf24` | background-color: #fbbf24 |
| `bg-amber-500`   | `background-color: #f59e0b` | background-color: #f59e0b |
| `bg-amber-600`   | `background-color: #d97706` | background-color: #d97706 |
| `bg-amber-700`   | `background-color: #b45309` | background-color: #b45309 |
| `bg-amber-800`   | `background-color: #92400e` | background-color: #92400e |
| `bg-amber-900`   | `background-color: #78350f` | background-color: #78350f |
| `bg-amber-950`   | `background-color: #451a03` | background-color: #451a03 |
| `bg-yellow-50`   | `background-color: #fefce8` | background-color: #fefce8 |
| `bg-yellow-100`  | `background-color: #fef9c3` | background-color: #fef9c3 |
| `bg-yellow-200`  | `background-color: #fef08a` | background-color: #fef08a |
| `bg-yellow-300`  | `background-color: #fde047` | background-color: #fde047 |
| `bg-yellow-400`  | `background-color: #facc15` | background-color: #facc15 |
| `bg-yellow-500`  | `background-color: #eab308` | background-color: #eab308 |
| `bg-yellow-600`  | `background-color: #ca8a04` | background-color: #ca8a04 |
| `bg-yellow-700`  | `background-color: #a16207` | background-color: #a16207 |
| `bg-yellow-800`  | `background-color: #854d0e` | background-color: #854d0e |
| `bg-yellow-900`  | `background-color: #713f12` | background-color: #713f12 |
| `bg-yellow-950`  | `background-color: #422006` | background-color: #422006 |
| `bg-lime-50`     | `background-color: #f7fee7` | background-color: #f7fee7 |
| `bg-lime-100`    | `background-color: #ecfccb` | background-color: #ecfccb |
| `bg-lime-200`    | `background-color: #d9f99d` | background-color: #d9f99d |
| `bg-lime-300`    | `background-color: #bef264` | background-color: #bef264 |
| `bg-lime-400`    | `background-color: #a3e635` | background-color: #a3e635 |
| `bg-lime-500`    | `background-color: #84cc16` | background-color: #84cc16 |
| `bg-lime-600`    | `background-color: #65a30d` | background-color: #65a30d |
| `bg-lime-700`    | `background-color: #4d7c0f` | background-color: #4d7c0f |
| `bg-lime-800`    | `background-color: #3f6212` | background-color: #3f6212 |
| `bg-lime-900`    | `background-color: #365314` | background-color: #365314 |
| `bg-lime-950`    | `background-color: #1a2e05` | background-color: #1a2e05 |
| `bg-emerald-50`  | `background-color: #ecfdf5` | background-color: #ecfdf5 |
| `bg-emerald-100` | `background-color: #d1fae5` | background-color: #d1fae5 |
| `bg-emerald-200` | `background-color: #a7f3d0` | background-color: #a7f3d0 |
| `bg-emerald-300` | `background-color: #6ee7b7` | background-color: #6ee7b7 |
| `bg-emerald-400` | `background-color: #34d399` | background-color: #34d399 |
| `bg-emerald-500` | `background-color: #10b981` | background-color: #10b981 |
| `bg-emerald-600` | `background-color: #059669` | background-color: #059669 |
| `bg-emerald-700` | `background-color: #047857` | background-color: #047857 |
| `bg-emerald-800` | `background-color: #065f46` | background-color: #065f46 |
| `bg-emerald-900` | `background-color: #064e3b` | background-color: #064e3b |
| `bg-emerald-950` | `background-color: #022c22` | background-color: #022c22 |
| `bg-green-50`    | `background-color: #f0fdf4` | background-color: #f0fdf4 |
| `bg-green-100`   | `background-color: #dcfce7` | background-color: #dcfce7 |
| `bg-green-200`   | `background-color: #bbf7d0` | background-color: #bbf7d0 |
| `bg-green-300`   | `background-color: #86efac` | background-color: #86efac |
| `bg-green-400`   | `background-color: #4ade80` | background-color: #4ade80 |
| `bg-green-500`   | `background-color: #22c55e` | background-color: #22c55e |
| `bg-green-600`   | `background-color: #16a34a` | background-color: #16a34a |
| `bg-green-700`   | `background-color: #15803d` | background-color: #15803d |
| `bg-green-800`   | `background-color: #166534` | background-color: #166534 |
| `bg-green-900`   | `background-color: #14532d` | background-color: #14532d |
| `bg-green-950`   | `background-color: #052e16` | background-color: #052e16 |
| `bg-teal-50`     | `background-color: #f0fdfa` | background-color: #f0fdfa |
| `bg-teal-100`    | `background-color: #ccfbf1` | background-color: #ccfbf1 |
| `bg-teal-200`    | `background-color: #99f6e4` | background-color: #99f6e4 |
| `bg-teal-300`    | `background-color: #5eead4` | background-color: #5eead4 |
| `bg-teal-400`    | `background-color: #2dd4bf` | background-color: #2dd4bf |
| `bg-teal-500`    | `background-color: #14b8a6` | background-color: #14b8a6 |
| `bg-teal-600`    | `background-color: #0d9488` | background-color: #0d9488 |
| `bg-teal-700`    | `background-color: #0f766e` | background-color: #0f766e |
| `bg-teal-800`    | `background-color: #115e59` | background-color: #115e59 |
| `bg-teal-900`    | `background-color: #134e4a` | background-color: #134e4a |
| `bg-teal-950`    | `background-color: #042f2e` | background-color: #042f2e |
| `bg-cyan-50`     | `background-color: #ecfeff` | background-color: #ecfeff |
| `bg-cyan-100`    | `background-color: #cffafe` | background-color: #cffafe |
| `bg-cyan-200`    | `background-color: #a5f3fc` | background-color: #a5f3fc |
| `bg-cyan-300`    | `background-color: #67e8f9` | background-color: #67e8f9 |
| `bg-cyan-400`    | `background-color: #22d3ee` | background-color: #22d3ee |
| `bg-cyan-500`    | `background-color: #06b6d4` | background-color: #06b6d4 |
| `bg-cyan-600`    | `background-color: #0891b2` | background-color: #0891b2 |
| `bg-cyan-700`    | `background-color: #0e7490` | background-color: #0e7490 |
| `bg-cyan-800`    | `background-color: #155e75` | background-color: #155e75 |
| `bg-cyan-900`    | `background-color: #164e63` | background-color: #164e63 |
| `bg-cyan-950`    | `background-color: #083344` | background-color: #083344 |
| `bg-sky-50`      | `background-color: #f0f9ff` | background-color: #f0f9ff |
| `bg-sky-100`     | `background-color: #e0f2fe` | background-color: #e0f2fe |
| `bg-sky-200`     | `background-color: #bae6fd` | background-color: #bae6fd |
| `bg-sky-300`     | `background-color: #7dd3fc` | background-color: #7dd3fc |
| `bg-sky-400`     | `background-color: #38bdf8` | background-color: #38bdf8 |
| `bg-sky-500`     | `background-color: #0ea5e9` | background-color: #0ea5e9 |
| `bg-sky-600`     | `background-color: #0284c7` | background-color: #0284c7 |
| `bg-sky-700`     | `background-color: #0369a1` | background-color: #0369a1 |
| `bg-sky-800`     | `background-color: #075985` | background-color: #075985 |
| `bg-sky-900`     | `background-color: #0c4a6e` | background-color: #0c4a6e |
| `bg-sky-950`     | `background-color: #082f49` | background-color: #082f49 |
| `bg-blue-50`     | `background-color: #eff6ff` | background-color: #eff6ff |
| `bg-blue-100`    | `background-color: #dbeafe` | background-color: #dbeafe |
| `bg-blue-200`    | `background-color: #bfdbfe` | background-color: #bfdbfe |
| `bg-blue-300`    | `background-color: #93c5fd` | background-color: #93c5fd |
| `bg-blue-400`    | `background-color: #60a5fa` | background-color: #60a5fa |
| `bg-blue-500`    | `background-color: #3b82f6` | background-color: #3b82f6 |
| `bg-blue-600`    | `background-color: #2563eb` | background-color: #2563eb |
| `bg-blue-700`    | `background-color: #1d4ed8` | background-color: #1d4ed8 |
| `bg-blue-800`    | `background-color: #1e40af` | background-color: #1e40af |
| `bg-blue-900`    | `background-color: #1e3a8a` | background-color: #1e3a8a |
| `bg-blue-950`    | `background-color: #172554` | background-color: #172554 |
| `bg-indigo-50`   | `background-color: #eef2ff` | background-color: #eef2ff |
| `bg-indigo-100`  | `background-color: #e0e7ff` | background-color: #e0e7ff |
| `bg-indigo-200`  | `background-color: #c7d2fe` | background-color: #c7d2fe |
| `bg-indigo-300`  | `background-color: #a5b4fc` | background-color: #a5b4fc |
| `bg-indigo-400`  | `background-color: #818cf8` | background-color: #818cf8 |
| `bg-indigo-500`  | `background-color: #6366f1` | background-color: #6366f1 |
| `bg-indigo-600`  | `background-color: #4f46e5` | background-color: #4f46e5 |
| `bg-indigo-700`  | `background-color: #4338ca` | background-color: #4338ca |
| `bg-indigo-800`  | `background-color: #3730a3` | background-color: #3730a3 |
| `bg-indigo-900`  | `background-color: #312e81` | background-color: #312e81 |
| `bg-indigo-950`  | `background-color: #1e1b4b` | background-color: #1e1b4b |
| `bg-violet-50`   | `background-color: #f5f3ff` | background-color: #f5f3ff |
| `bg-violet-100`  | `background-color: #ede9fe` | background-color: #ede9fe |
| `bg-violet-200`  | `background-color: #ddd6fe` | background-color: #ddd6fe |
| `bg-violet-300`  | `background-color: #c4b5fd` | background-color: #c4b5fd |
| `bg-violet-400`  | `background-color: #a78bfa` | background-color: #a78bfa |
| `bg-violet-500`  | `background-color: #8b5cf6` | background-color: #8b5cf6 |
| `bg-violet-600`  | `background-color: #7c3aed` | background-color: #7c3aed |
| `bg-violet-700`  | `background-color: #6d28d9` | background-color: #6d28d9 |
| `bg-violet-800`  | `background-color: #5b21b6` | background-color: #5b21b6 |
| `bg-violet-900`  | `background-color: #4c1d95` | background-color: #4c1d95 |
| `bg-violet-950`  | `background-color: #2e1065` | background-color: #2e1065 |
| `bg-purple-50`   | `background-color: #faf5ff` | background-color: #faf5ff |
| `bg-purple-100`  | `background-color: #f3e8ff` | background-color: #f3e8ff |
| `bg-purple-200`  | `background-color: #e9d5ff` | background-color: #e9d5ff |
| `bg-purple-300`  | `background-color: #d8b4fe` | background-color: #d8b4fe |
| `bg-purple-400`  | `background-color: #c084fc` | background-color: #c084fc |
| `bg-purple-500`  | `background-color: #a855f7` | background-color: #a855f7 |
| `bg-purple-600`  | `background-color: #9333ea` | background-color: #9333ea |
| `bg-purple-700`  | `background-color: #7e22ce` | background-color: #7e22ce |
| `bg-purple-800`  | `background-color: #6b21a8` | background-color: #6b21a8 |
| `bg-purple-900`  | `background-color: #581c87` | background-color: #581c87 |
| `bg-purple-950`  | `background-color: #3b0764` | background-color: #3b0764 |
| `bg-fuchsia-50`  | `background-color: #fdf4ff` | background-color: #fdf4ff |
| `bg-fuchsia-100` | `background-color: #fae8ff` | background-color: #fae8ff |
| `bg-fuchsia-200` | `background-color: #f5d0fe` | background-color: #f5d0fe |
| `bg-fuchsia-300` | `background-color: #f0abfc` | background-color: #f0abfc |
| `bg-fuchsia-400` | `background-color: #e879f9` | background-color: #e879f9 |
| `bg-fuchsia-500` | `background-color: #d946ef` | background-color: #d946ef |
| `bg-fuchsia-600` | `background-color: #c026d3` | background-color: #c026d3 |
| `bg-fuchsia-700` | `background-color: #a21caf` | background-color: #a21caf |
| `bg-fuchsia-800` | `background-color: #86198f` | background-color: #86198f |
| `bg-fuchsia-900` | `background-color: #701a75` | background-color: #701a75 |
| `bg-fuchsia-950` | `background-color: #4a044e` | background-color: #4a044e |
| `bg-pink-50`     | `background-color: #fdf2f8` | background-color: #fdf2f8 |
| `bg-pink-100`    | `background-color: #fce7f3` | background-color: #fce7f3 |
| `bg-pink-200`    | `background-color: #fbcfe8` | background-color: #fbcfe8 |
| `bg-pink-300`    | `background-color: #f9a8d4` | background-color: #f9a8d4 |
| `bg-pink-400`    | `background-color: #f472b6` | background-color: #f472b6 |
| `bg-pink-500`    | `background-color: #ec4899` | background-color: #ec4899 |
| `bg-pink-600`    | `background-color: #db2777` | background-color: #db2777 |
| `bg-pink-700`    | `background-color: #be185d` | background-color: #be185d |
| `bg-pink-800`    | `background-color: #9d174d` | background-color: #9d174d |
| `bg-pink-900`    | `background-color: #831843` | background-color: #831843 |
| `bg-pink-950`    | `background-color: #500724` | background-color: #500724 |
| `bg-rose-50`     | `background-color: #fff1f2` | background-color: #fff1f2 |
| `bg-rose-100`    | `background-color: #ffe4e6` | background-color: #ffe4e6 |
| `bg-rose-200`    | `background-color: #fecdd3` | background-color: #fecdd3 |
| `bg-rose-300`    | `background-color: #fda4af` | background-color: #fda4af |
| `bg-rose-400`    | `background-color: #fb7185` | background-color: #fb7185 |
| `bg-rose-500`    | `background-color: #f43f5e` | background-color: #f43f5e |
| `bg-rose-600`    | `background-color: #e11d48` | background-color: #e11d48 |
| `bg-rose-700`    | `background-color: #be123c` | background-color: #be123c |
| `bg-rose-800`    | `background-color: #881337` | background-color: #881337 |
| `bg-rose-900`    | `background-color: #4c0519` | background-color: #4c0519 |
| `bg-rose-950`    | `background-color: #1c020c` | background-color: #1c020c |

## Border Colors

**242 utilities**

| Class                | CSS                     | Description           |
| -------------------- | ----------------------- | --------------------- |
| `border-slate-50`    | `border-color: #f8fafc` | border-color: #f8fafc |
| `border-slate-100`   | `border-color: #f1f5f9` | border-color: #f1f5f9 |
| `border-slate-200`   | `border-color: #e2e8f0` | border-color: #e2e8f0 |
| `border-slate-300`   | `border-color: #cbd5e1` | border-color: #cbd5e1 |
| `border-slate-400`   | `border-color: #94a3b8` | border-color: #94a3b8 |
| `border-slate-500`   | `border-color: #64748b` | border-color: #64748b |
| `border-slate-600`   | `border-color: #475569` | border-color: #475569 |
| `border-slate-700`   | `border-color: #334155` | border-color: #334155 |
| `border-slate-800`   | `border-color: #1e293b` | border-color: #1e293b |
| `border-slate-900`   | `border-color: #0f172a` | border-color: #0f172a |
| `border-slate-950`   | `border-color: #020617` | border-color: #020617 |
| `border-gray-50`     | `border-color: #f9fafb` | border-color: #f9fafb |
| `border-gray-100`    | `border-color: #f3f4f6` | border-color: #f3f4f6 |
| `border-gray-200`    | `border-color: #e5e7eb` | border-color: #e5e7eb |
| `border-gray-300`    | `border-color: #d1d5db` | border-color: #d1d5db |
| `border-gray-400`    | `border-color: #9ca3af` | border-color: #9ca3af |
| `border-gray-500`    | `border-color: #6b7280` | border-color: #6b7280 |
| `border-gray-600`    | `border-color: #4b5563` | border-color: #4b5563 |
| `border-gray-700`    | `border-color: #374151` | border-color: #374151 |
| `border-gray-800`    | `border-color: #1f2937` | border-color: #1f2937 |
| `border-gray-900`    | `border-color: #111827` | border-color: #111827 |
| `border-gray-950`    | `border-color: #030712` | border-color: #030712 |
| `border-zinc-50`     | `border-color: #fafafa` | border-color: #fafafa |
| `border-zinc-100`    | `border-color: #f4f4f5` | border-color: #f4f4f5 |
| `border-zinc-200`    | `border-color: #e4e4e7` | border-color: #e4e4e7 |
| `border-zinc-300`    | `border-color: #d4d4d8` | border-color: #d4d4d8 |
| `border-zinc-400`    | `border-color: #a1a1aa` | border-color: #a1a1aa |
| `border-zinc-500`    | `border-color: #71717a` | border-color: #71717a |
| `border-zinc-600`    | `border-color: #52525b` | border-color: #52525b |
| `border-zinc-700`    | `border-color: #3f3f46` | border-color: #3f3f46 |
| `border-zinc-800`    | `border-color: #27272a` | border-color: #27272a |
| `border-zinc-900`    | `border-color: #18181b` | border-color: #18181b |
| `border-zinc-950`    | `border-color: #09090b` | border-color: #09090b |
| `border-neutral-50`  | `border-color: #fafafa` | border-color: #fafafa |
| `border-neutral-100` | `border-color: #f5f5f5` | border-color: #f5f5f5 |
| `border-neutral-200` | `border-color: #e5e5e5` | border-color: #e5e5e5 |
| `border-neutral-300` | `border-color: #d4d4d4` | border-color: #d4d4d4 |
| `border-neutral-400` | `border-color: #a3a3a3` | border-color: #a3a3a3 |
| `border-neutral-500` | `border-color: #737373` | border-color: #737373 |
| `border-neutral-600` | `border-color: #525252` | border-color: #525252 |
| `border-neutral-700` | `border-color: #404040` | border-color: #404040 |
| `border-neutral-800` | `border-color: #262626` | border-color: #262626 |
| `border-neutral-900` | `border-color: #171717` | border-color: #171717 |
| `border-neutral-950` | `border-color: #0a0a0a` | border-color: #0a0a0a |
| `border-stone-50`    | `border-color: #fafaf9` | border-color: #fafaf9 |
| `border-stone-100`   | `border-color: #f5f5f4` | border-color: #f5f5f4 |
| `border-stone-200`   | `border-color: #e7e5e4` | border-color: #e7e5e4 |
| `border-stone-300`   | `border-color: #d6d3d1` | border-color: #d6d3d1 |
| `border-stone-400`   | `border-color: #a8a29e` | border-color: #a8a29e |
| `border-stone-500`   | `border-color: #78716c` | border-color: #78716c |
| `border-stone-600`   | `border-color: #57534e` | border-color: #57534e |
| `border-stone-700`   | `border-color: #44403c` | border-color: #44403c |
| `border-stone-800`   | `border-color: #292524` | border-color: #292524 |
| `border-stone-900`   | `border-color: #1c1917` | border-color: #1c1917 |
| `border-stone-950`   | `border-color: #0c0a09` | border-color: #0c0a09 |
| `border-red-50`      | `border-color: #fef2f2` | border-color: #fef2f2 |
| `border-red-100`     | `border-color: #fee2e2` | border-color: #fee2e2 |
| `border-red-200`     | `border-color: #fecaca` | border-color: #fecaca |
| `border-red-300`     | `border-color: #fca5a5` | border-color: #fca5a5 |
| `border-red-400`     | `border-color: #f87171` | border-color: #f87171 |
| `border-red-500`     | `border-color: #ef4444` | border-color: #ef4444 |
| `border-red-600`     | `border-color: #dc2626` | border-color: #dc2626 |
| `border-red-700`     | `border-color: #b91c1c` | border-color: #b91c1c |
| `border-red-800`     | `border-color: #991b1b` | border-color: #991b1b |
| `border-red-900`     | `border-color: #7f1d1d` | border-color: #7f1d1d |
| `border-red-950`     | `border-color: #450a0a` | border-color: #450a0a |
| `border-orange-50`   | `border-color: #fff7ed` | border-color: #fff7ed |
| `border-orange-100`  | `border-color: #ffedd5` | border-color: #ffedd5 |
| `border-orange-200`  | `border-color: #fed7aa` | border-color: #fed7aa |
| `border-orange-300`  | `border-color: #fdba74` | border-color: #fdba74 |
| `border-orange-400`  | `border-color: #fb923c` | border-color: #fb923c |
| `border-orange-500`  | `border-color: #f97316` | border-color: #f97316 |
| `border-orange-600`  | `border-color: #ea580c` | border-color: #ea580c |
| `border-orange-700`  | `border-color: #c2410c` | border-color: #c2410c |
| `border-orange-800`  | `border-color: #9a3412` | border-color: #9a3412 |
| `border-orange-900`  | `border-color: #7c2d12` | border-color: #7c2d12 |
| `border-orange-950`  | `border-color: #431407` | border-color: #431407 |
| `border-amber-50`    | `border-color: #fffbeb` | border-color: #fffbeb |
| `border-amber-100`   | `border-color: #fef3c7` | border-color: #fef3c7 |
| `border-amber-200`   | `border-color: #fde68a` | border-color: #fde68a |
| `border-amber-300`   | `border-color: #fcd34d` | border-color: #fcd34d |
| `border-amber-400`   | `border-color: #fbbf24` | border-color: #fbbf24 |
| `border-amber-500`   | `border-color: #f59e0b` | border-color: #f59e0b |
| `border-amber-600`   | `border-color: #d97706` | border-color: #d97706 |
| `border-amber-700`   | `border-color: #b45309` | border-color: #b45309 |
| `border-amber-800`   | `border-color: #92400e` | border-color: #92400e |
| `border-amber-900`   | `border-color: #78350f` | border-color: #78350f |
| `border-amber-950`   | `border-color: #451a03` | border-color: #451a03 |
| `border-yellow-50`   | `border-color: #fefce8` | border-color: #fefce8 |
| `border-yellow-100`  | `border-color: #fef9c3` | border-color: #fef9c3 |
| `border-yellow-200`  | `border-color: #fef08a` | border-color: #fef08a |
| `border-yellow-300`  | `border-color: #fde047` | border-color: #fde047 |
| `border-yellow-400`  | `border-color: #facc15` | border-color: #facc15 |
| `border-yellow-500`  | `border-color: #eab308` | border-color: #eab308 |
| `border-yellow-600`  | `border-color: #ca8a04` | border-color: #ca8a04 |
| `border-yellow-700`  | `border-color: #a16207` | border-color: #a16207 |
| `border-yellow-800`  | `border-color: #854d0e` | border-color: #854d0e |
| `border-yellow-900`  | `border-color: #713f12` | border-color: #713f12 |
| `border-yellow-950`  | `border-color: #422006` | border-color: #422006 |
| `border-lime-50`     | `border-color: #f7fee7` | border-color: #f7fee7 |
| `border-lime-100`    | `border-color: #ecfccb` | border-color: #ecfccb |
| `border-lime-200`    | `border-color: #d9f99d` | border-color: #d9f99d |
| `border-lime-300`    | `border-color: #bef264` | border-color: #bef264 |
| `border-lime-400`    | `border-color: #a3e635` | border-color: #a3e635 |
| `border-lime-500`    | `border-color: #84cc16` | border-color: #84cc16 |
| `border-lime-600`    | `border-color: #65a30d` | border-color: #65a30d |
| `border-lime-700`    | `border-color: #4d7c0f` | border-color: #4d7c0f |
| `border-lime-800`    | `border-color: #3f6212` | border-color: #3f6212 |
| `border-lime-900`    | `border-color: #365314` | border-color: #365314 |
| `border-lime-950`    | `border-color: #1a2e05` | border-color: #1a2e05 |
| `border-emerald-50`  | `border-color: #ecfdf5` | border-color: #ecfdf5 |
| `border-emerald-100` | `border-color: #d1fae5` | border-color: #d1fae5 |
| `border-emerald-200` | `border-color: #a7f3d0` | border-color: #a7f3d0 |
| `border-emerald-300` | `border-color: #6ee7b7` | border-color: #6ee7b7 |
| `border-emerald-400` | `border-color: #34d399` | border-color: #34d399 |
| `border-emerald-500` | `border-color: #10b981` | border-color: #10b981 |
| `border-emerald-600` | `border-color: #059669` | border-color: #059669 |
| `border-emerald-700` | `border-color: #047857` | border-color: #047857 |
| `border-emerald-800` | `border-color: #065f46` | border-color: #065f46 |
| `border-emerald-900` | `border-color: #064e3b` | border-color: #064e3b |
| `border-emerald-950` | `border-color: #022c22` | border-color: #022c22 |
| `border-green-50`    | `border-color: #f0fdf4` | border-color: #f0fdf4 |
| `border-green-100`   | `border-color: #dcfce7` | border-color: #dcfce7 |
| `border-green-200`   | `border-color: #bbf7d0` | border-color: #bbf7d0 |
| `border-green-300`   | `border-color: #86efac` | border-color: #86efac |
| `border-green-400`   | `border-color: #4ade80` | border-color: #4ade80 |
| `border-green-500`   | `border-color: #22c55e` | border-color: #22c55e |
| `border-green-600`   | `border-color: #16a34a` | border-color: #16a34a |
| `border-green-700`   | `border-color: #15803d` | border-color: #15803d |
| `border-green-800`   | `border-color: #166534` | border-color: #166534 |
| `border-green-900`   | `border-color: #14532d` | border-color: #14532d |
| `border-green-950`   | `border-color: #052e16` | border-color: #052e16 |
| `border-teal-50`     | `border-color: #f0fdfa` | border-color: #f0fdfa |
| `border-teal-100`    | `border-color: #ccfbf1` | border-color: #ccfbf1 |
| `border-teal-200`    | `border-color: #99f6e4` | border-color: #99f6e4 |
| `border-teal-300`    | `border-color: #5eead4` | border-color: #5eead4 |
| `border-teal-400`    | `border-color: #2dd4bf` | border-color: #2dd4bf |
| `border-teal-500`    | `border-color: #14b8a6` | border-color: #14b8a6 |
| `border-teal-600`    | `border-color: #0d9488` | border-color: #0d9488 |
| `border-teal-700`    | `border-color: #0f766e` | border-color: #0f766e |
| `border-teal-800`    | `border-color: #115e59` | border-color: #115e59 |
| `border-teal-900`    | `border-color: #134e4a` | border-color: #134e4a |
| `border-teal-950`    | `border-color: #042f2e` | border-color: #042f2e |
| `border-cyan-50`     | `border-color: #ecfeff` | border-color: #ecfeff |
| `border-cyan-100`    | `border-color: #cffafe` | border-color: #cffafe |
| `border-cyan-200`    | `border-color: #a5f3fc` | border-color: #a5f3fc |
| `border-cyan-300`    | `border-color: #67e8f9` | border-color: #67e8f9 |
| `border-cyan-400`    | `border-color: #22d3ee` | border-color: #22d3ee |
| `border-cyan-500`    | `border-color: #06b6d4` | border-color: #06b6d4 |
| `border-cyan-600`    | `border-color: #0891b2` | border-color: #0891b2 |
| `border-cyan-700`    | `border-color: #0e7490` | border-color: #0e7490 |
| `border-cyan-800`    | `border-color: #155e75` | border-color: #155e75 |
| `border-cyan-900`    | `border-color: #164e63` | border-color: #164e63 |
| `border-cyan-950`    | `border-color: #083344` | border-color: #083344 |
| `border-sky-50`      | `border-color: #f0f9ff` | border-color: #f0f9ff |
| `border-sky-100`     | `border-color: #e0f2fe` | border-color: #e0f2fe |
| `border-sky-200`     | `border-color: #bae6fd` | border-color: #bae6fd |
| `border-sky-300`     | `border-color: #7dd3fc` | border-color: #7dd3fc |
| `border-sky-400`     | `border-color: #38bdf8` | border-color: #38bdf8 |
| `border-sky-500`     | `border-color: #0ea5e9` | border-color: #0ea5e9 |
| `border-sky-600`     | `border-color: #0284c7` | border-color: #0284c7 |
| `border-sky-700`     | `border-color: #0369a1` | border-color: #0369a1 |
| `border-sky-800`     | `border-color: #075985` | border-color: #075985 |
| `border-sky-900`     | `border-color: #0c4a6e` | border-color: #0c4a6e |
| `border-sky-950`     | `border-color: #082f49` | border-color: #082f49 |
| `border-blue-50`     | `border-color: #eff6ff` | border-color: #eff6ff |
| `border-blue-100`    | `border-color: #dbeafe` | border-color: #dbeafe |
| `border-blue-200`    | `border-color: #bfdbfe` | border-color: #bfdbfe |
| `border-blue-300`    | `border-color: #93c5fd` | border-color: #93c5fd |
| `border-blue-400`    | `border-color: #60a5fa` | border-color: #60a5fa |
| `border-blue-500`    | `border-color: #3b82f6` | border-color: #3b82f6 |
| `border-blue-600`    | `border-color: #2563eb` | border-color: #2563eb |
| `border-blue-700`    | `border-color: #1d4ed8` | border-color: #1d4ed8 |
| `border-blue-800`    | `border-color: #1e40af` | border-color: #1e40af |
| `border-blue-900`    | `border-color: #1e3a8a` | border-color: #1e3a8a |
| `border-blue-950`    | `border-color: #172554` | border-color: #172554 |
| `border-indigo-50`   | `border-color: #eef2ff` | border-color: #eef2ff |
| `border-indigo-100`  | `border-color: #e0e7ff` | border-color: #e0e7ff |
| `border-indigo-200`  | `border-color: #c7d2fe` | border-color: #c7d2fe |
| `border-indigo-300`  | `border-color: #a5b4fc` | border-color: #a5b4fc |
| `border-indigo-400`  | `border-color: #818cf8` | border-color: #818cf8 |
| `border-indigo-500`  | `border-color: #6366f1` | border-color: #6366f1 |
| `border-indigo-600`  | `border-color: #4f46e5` | border-color: #4f46e5 |
| `border-indigo-700`  | `border-color: #4338ca` | border-color: #4338ca |
| `border-indigo-800`  | `border-color: #3730a3` | border-color: #3730a3 |
| `border-indigo-900`  | `border-color: #312e81` | border-color: #312e81 |
| `border-indigo-950`  | `border-color: #1e1b4b` | border-color: #1e1b4b |
| `border-violet-50`   | `border-color: #f5f3ff` | border-color: #f5f3ff |
| `border-violet-100`  | `border-color: #ede9fe` | border-color: #ede9fe |
| `border-violet-200`  | `border-color: #ddd6fe` | border-color: #ddd6fe |
| `border-violet-300`  | `border-color: #c4b5fd` | border-color: #c4b5fd |
| `border-violet-400`  | `border-color: #a78bfa` | border-color: #a78bfa |
| `border-violet-500`  | `border-color: #8b5cf6` | border-color: #8b5cf6 |
| `border-violet-600`  | `border-color: #7c3aed` | border-color: #7c3aed |
| `border-violet-700`  | `border-color: #6d28d9` | border-color: #6d28d9 |
| `border-violet-800`  | `border-color: #5b21b6` | border-color: #5b21b6 |
| `border-violet-900`  | `border-color: #4c1d95` | border-color: #4c1d95 |
| `border-violet-950`  | `border-color: #2e1065` | border-color: #2e1065 |
| `border-purple-50`   | `border-color: #faf5ff` | border-color: #faf5ff |
| `border-purple-100`  | `border-color: #f3e8ff` | border-color: #f3e8ff |
| `border-purple-200`  | `border-color: #e9d5ff` | border-color: #e9d5ff |
| `border-purple-300`  | `border-color: #d8b4fe` | border-color: #d8b4fe |
| `border-purple-400`  | `border-color: #c084fc` | border-color: #c084fc |
| `border-purple-500`  | `border-color: #a855f7` | border-color: #a855f7 |
| `border-purple-600`  | `border-color: #9333ea` | border-color: #9333ea |
| `border-purple-700`  | `border-color: #7e22ce` | border-color: #7e22ce |
| `border-purple-800`  | `border-color: #6b21a8` | border-color: #6b21a8 |
| `border-purple-900`  | `border-color: #581c87` | border-color: #581c87 |
| `border-purple-950`  | `border-color: #3b0764` | border-color: #3b0764 |
| `border-fuchsia-50`  | `border-color: #fdf4ff` | border-color: #fdf4ff |
| `border-fuchsia-100` | `border-color: #fae8ff` | border-color: #fae8ff |
| `border-fuchsia-200` | `border-color: #f5d0fe` | border-color: #f5d0fe |
| `border-fuchsia-300` | `border-color: #f0abfc` | border-color: #f0abfc |
| `border-fuchsia-400` | `border-color: #e879f9` | border-color: #e879f9 |
| `border-fuchsia-500` | `border-color: #d946ef` | border-color: #d946ef |
| `border-fuchsia-600` | `border-color: #c026d3` | border-color: #c026d3 |
| `border-fuchsia-700` | `border-color: #a21caf` | border-color: #a21caf |
| `border-fuchsia-800` | `border-color: #86198f` | border-color: #86198f |
| `border-fuchsia-900` | `border-color: #701a75` | border-color: #701a75 |
| `border-fuchsia-950` | `border-color: #4a044e` | border-color: #4a044e |
| `border-pink-50`     | `border-color: #fdf2f8` | border-color: #fdf2f8 |
| `border-pink-100`    | `border-color: #fce7f3` | border-color: #fce7f3 |
| `border-pink-200`    | `border-color: #fbcfe8` | border-color: #fbcfe8 |
| `border-pink-300`    | `border-color: #f9a8d4` | border-color: #f9a8d4 |
| `border-pink-400`    | `border-color: #f472b6` | border-color: #f472b6 |
| `border-pink-500`    | `border-color: #ec4899` | border-color: #ec4899 |
| `border-pink-600`    | `border-color: #db2777` | border-color: #db2777 |
| `border-pink-700`    | `border-color: #be185d` | border-color: #be185d |
| `border-pink-800`    | `border-color: #9d174d` | border-color: #9d174d |
| `border-pink-900`    | `border-color: #831843` | border-color: #831843 |
| `border-pink-950`    | `border-color: #500724` | border-color: #500724 |
| `border-rose-50`     | `border-color: #fff1f2` | border-color: #fff1f2 |
| `border-rose-100`    | `border-color: #ffe4e6` | border-color: #ffe4e6 |
| `border-rose-200`    | `border-color: #fecdd3` | border-color: #fecdd3 |
| `border-rose-300`    | `border-color: #fda4af` | border-color: #fda4af |
| `border-rose-400`    | `border-color: #fb7185` | border-color: #fb7185 |
| `border-rose-500`    | `border-color: #f43f5e` | border-color: #f43f5e |
| `border-rose-600`    | `border-color: #e11d48` | border-color: #e11d48 |
| `border-rose-700`    | `border-color: #be123c` | border-color: #be123c |
| `border-rose-800`    | `border-color: #881337` | border-color: #881337 |
| `border-rose-900`    | `border-color: #4c0519` | border-color: #4c0519 |
| `border-rose-950`    | `border-color: #1c020c` | border-color: #1c020c |

## Gradient Stops

**726 utilities**

| Class              | CSS                           | Description            |
| ------------------ | ----------------------------- | ---------------------- |
| `from-slate-50`    | `--tw-gradient-from: #f8fafc` | gradient from: #f8fafc |
| `via-slate-50`     | `--tw-gradient-via: #f8fafc`  | gradient via: #f8fafc  |
| `to-slate-50`      | `--tw-gradient-to: #f8fafc`   | gradient to: #f8fafc   |
| `from-slate-100`   | `--tw-gradient-from: #f1f5f9` | gradient from: #f1f5f9 |
| `via-slate-100`    | `--tw-gradient-via: #f1f5f9`  | gradient via: #f1f5f9  |
| `to-slate-100`     | `--tw-gradient-to: #f1f5f9`   | gradient to: #f1f5f9   |
| `from-slate-200`   | `--tw-gradient-from: #e2e8f0` | gradient from: #e2e8f0 |
| `via-slate-200`    | `--tw-gradient-via: #e2e8f0`  | gradient via: #e2e8f0  |
| `to-slate-200`     | `--tw-gradient-to: #e2e8f0`   | gradient to: #e2e8f0   |
| `from-slate-300`   | `--tw-gradient-from: #cbd5e1` | gradient from: #cbd5e1 |
| `via-slate-300`    | `--tw-gradient-via: #cbd5e1`  | gradient via: #cbd5e1  |
| `to-slate-300`     | `--tw-gradient-to: #cbd5e1`   | gradient to: #cbd5e1   |
| `from-slate-400`   | `--tw-gradient-from: #94a3b8` | gradient from: #94a3b8 |
| `via-slate-400`    | `--tw-gradient-via: #94a3b8`  | gradient via: #94a3b8  |
| `to-slate-400`     | `--tw-gradient-to: #94a3b8`   | gradient to: #94a3b8   |
| `from-slate-500`   | `--tw-gradient-from: #64748b` | gradient from: #64748b |
| `via-slate-500`    | `--tw-gradient-via: #64748b`  | gradient via: #64748b  |
| `to-slate-500`     | `--tw-gradient-to: #64748b`   | gradient to: #64748b   |
| `from-slate-600`   | `--tw-gradient-from: #475569` | gradient from: #475569 |
| `via-slate-600`    | `--tw-gradient-via: #475569`  | gradient via: #475569  |
| `to-slate-600`     | `--tw-gradient-to: #475569`   | gradient to: #475569   |
| `from-slate-700`   | `--tw-gradient-from: #334155` | gradient from: #334155 |
| `via-slate-700`    | `--tw-gradient-via: #334155`  | gradient via: #334155  |
| `to-slate-700`     | `--tw-gradient-to: #334155`   | gradient to: #334155   |
| `from-slate-800`   | `--tw-gradient-from: #1e293b` | gradient from: #1e293b |
| `via-slate-800`    | `--tw-gradient-via: #1e293b`  | gradient via: #1e293b  |
| `to-slate-800`     | `--tw-gradient-to: #1e293b`   | gradient to: #1e293b   |
| `from-slate-900`   | `--tw-gradient-from: #0f172a` | gradient from: #0f172a |
| `via-slate-900`    | `--tw-gradient-via: #0f172a`  | gradient via: #0f172a  |
| `to-slate-900`     | `--tw-gradient-to: #0f172a`   | gradient to: #0f172a   |
| `from-slate-950`   | `--tw-gradient-from: #020617` | gradient from: #020617 |
| `via-slate-950`    | `--tw-gradient-via: #020617`  | gradient via: #020617  |
| `to-slate-950`     | `--tw-gradient-to: #020617`   | gradient to: #020617   |
| `from-gray-50`     | `--tw-gradient-from: #f9fafb` | gradient from: #f9fafb |
| `via-gray-50`      | `--tw-gradient-via: #f9fafb`  | gradient via: #f9fafb  |
| `to-gray-50`       | `--tw-gradient-to: #f9fafb`   | gradient to: #f9fafb   |
| `from-gray-100`    | `--tw-gradient-from: #f3f4f6` | gradient from: #f3f4f6 |
| `via-gray-100`     | `--tw-gradient-via: #f3f4f6`  | gradient via: #f3f4f6  |
| `to-gray-100`      | `--tw-gradient-to: #f3f4f6`   | gradient to: #f3f4f6   |
| `from-gray-200`    | `--tw-gradient-from: #e5e7eb` | gradient from: #e5e7eb |
| `via-gray-200`     | `--tw-gradient-via: #e5e7eb`  | gradient via: #e5e7eb  |
| `to-gray-200`      | `--tw-gradient-to: #e5e7eb`   | gradient to: #e5e7eb   |
| `from-gray-300`    | `--tw-gradient-from: #d1d5db` | gradient from: #d1d5db |
| `via-gray-300`     | `--tw-gradient-via: #d1d5db`  | gradient via: #d1d5db  |
| `to-gray-300`      | `--tw-gradient-to: #d1d5db`   | gradient to: #d1d5db   |
| `from-gray-400`    | `--tw-gradient-from: #9ca3af` | gradient from: #9ca3af |
| `via-gray-400`     | `--tw-gradient-via: #9ca3af`  | gradient via: #9ca3af  |
| `to-gray-400`      | `--tw-gradient-to: #9ca3af`   | gradient to: #9ca3af   |
| `from-gray-500`    | `--tw-gradient-from: #6b7280` | gradient from: #6b7280 |
| `via-gray-500`     | `--tw-gradient-via: #6b7280`  | gradient via: #6b7280  |
| `to-gray-500`      | `--tw-gradient-to: #6b7280`   | gradient to: #6b7280   |
| `from-gray-600`    | `--tw-gradient-from: #4b5563` | gradient from: #4b5563 |
| `via-gray-600`     | `--tw-gradient-via: #4b5563`  | gradient via: #4b5563  |
| `to-gray-600`      | `--tw-gradient-to: #4b5563`   | gradient to: #4b5563   |
| `from-gray-700`    | `--tw-gradient-from: #374151` | gradient from: #374151 |
| `via-gray-700`     | `--tw-gradient-via: #374151`  | gradient via: #374151  |
| `to-gray-700`      | `--tw-gradient-to: #374151`   | gradient to: #374151   |
| `from-gray-800`    | `--tw-gradient-from: #1f2937` | gradient from: #1f2937 |
| `via-gray-800`     | `--tw-gradient-via: #1f2937`  | gradient via: #1f2937  |
| `to-gray-800`      | `--tw-gradient-to: #1f2937`   | gradient to: #1f2937   |
| `from-gray-900`    | `--tw-gradient-from: #111827` | gradient from: #111827 |
| `via-gray-900`     | `--tw-gradient-via: #111827`  | gradient via: #111827  |
| `to-gray-900`      | `--tw-gradient-to: #111827`   | gradient to: #111827   |
| `from-gray-950`    | `--tw-gradient-from: #030712` | gradient from: #030712 |
| `via-gray-950`     | `--tw-gradient-via: #030712`  | gradient via: #030712  |
| `to-gray-950`      | `--tw-gradient-to: #030712`   | gradient to: #030712   |
| `from-zinc-50`     | `--tw-gradient-from: #fafafa` | gradient from: #fafafa |
| `via-zinc-50`      | `--tw-gradient-via: #fafafa`  | gradient via: #fafafa  |
| `to-zinc-50`       | `--tw-gradient-to: #fafafa`   | gradient to: #fafafa   |
| `from-zinc-100`    | `--tw-gradient-from: #f4f4f5` | gradient from: #f4f4f5 |
| `via-zinc-100`     | `--tw-gradient-via: #f4f4f5`  | gradient via: #f4f4f5  |
| `to-zinc-100`      | `--tw-gradient-to: #f4f4f5`   | gradient to: #f4f4f5   |
| `from-zinc-200`    | `--tw-gradient-from: #e4e4e7` | gradient from: #e4e4e7 |
| `via-zinc-200`     | `--tw-gradient-via: #e4e4e7`  | gradient via: #e4e4e7  |
| `to-zinc-200`      | `--tw-gradient-to: #e4e4e7`   | gradient to: #e4e4e7   |
| `from-zinc-300`    | `--tw-gradient-from: #d4d4d8` | gradient from: #d4d4d8 |
| `via-zinc-300`     | `--tw-gradient-via: #d4d4d8`  | gradient via: #d4d4d8  |
| `to-zinc-300`      | `--tw-gradient-to: #d4d4d8`   | gradient to: #d4d4d8   |
| `from-zinc-400`    | `--tw-gradient-from: #a1a1aa` | gradient from: #a1a1aa |
| `via-zinc-400`     | `--tw-gradient-via: #a1a1aa`  | gradient via: #a1a1aa  |
| `to-zinc-400`      | `--tw-gradient-to: #a1a1aa`   | gradient to: #a1a1aa   |
| `from-zinc-500`    | `--tw-gradient-from: #71717a` | gradient from: #71717a |
| `via-zinc-500`     | `--tw-gradient-via: #71717a`  | gradient via: #71717a  |
| `to-zinc-500`      | `--tw-gradient-to: #71717a`   | gradient to: #71717a   |
| `from-zinc-600`    | `--tw-gradient-from: #52525b` | gradient from: #52525b |
| `via-zinc-600`     | `--tw-gradient-via: #52525b`  | gradient via: #52525b  |
| `to-zinc-600`      | `--tw-gradient-to: #52525b`   | gradient to: #52525b   |
| `from-zinc-700`    | `--tw-gradient-from: #3f3f46` | gradient from: #3f3f46 |
| `via-zinc-700`     | `--tw-gradient-via: #3f3f46`  | gradient via: #3f3f46  |
| `to-zinc-700`      | `--tw-gradient-to: #3f3f46`   | gradient to: #3f3f46   |
| `from-zinc-800`    | `--tw-gradient-from: #27272a` | gradient from: #27272a |
| `via-zinc-800`     | `--tw-gradient-via: #27272a`  | gradient via: #27272a  |
| `to-zinc-800`      | `--tw-gradient-to: #27272a`   | gradient to: #27272a   |
| `from-zinc-900`    | `--tw-gradient-from: #18181b` | gradient from: #18181b |
| `via-zinc-900`     | `--tw-gradient-via: #18181b`  | gradient via: #18181b  |
| `to-zinc-900`      | `--tw-gradient-to: #18181b`   | gradient to: #18181b   |
| `from-zinc-950`    | `--tw-gradient-from: #09090b` | gradient from: #09090b |
| `via-zinc-950`     | `--tw-gradient-via: #09090b`  | gradient via: #09090b  |
| `to-zinc-950`      | `--tw-gradient-to: #09090b`   | gradient to: #09090b   |
| `from-neutral-50`  | `--tw-gradient-from: #fafafa` | gradient from: #fafafa |
| `via-neutral-50`   | `--tw-gradient-via: #fafafa`  | gradient via: #fafafa  |
| `to-neutral-50`    | `--tw-gradient-to: #fafafa`   | gradient to: #fafafa   |
| `from-neutral-100` | `--tw-gradient-from: #f5f5f5` | gradient from: #f5f5f5 |
| `via-neutral-100`  | `--tw-gradient-via: #f5f5f5`  | gradient via: #f5f5f5  |
| `to-neutral-100`   | `--tw-gradient-to: #f5f5f5`   | gradient to: #f5f5f5   |
| `from-neutral-200` | `--tw-gradient-from: #e5e5e5` | gradient from: #e5e5e5 |
| `via-neutral-200`  | `--tw-gradient-via: #e5e5e5`  | gradient via: #e5e5e5  |
| `to-neutral-200`   | `--tw-gradient-to: #e5e5e5`   | gradient to: #e5e5e5   |
| `from-neutral-300` | `--tw-gradient-from: #d4d4d4` | gradient from: #d4d4d4 |
| `via-neutral-300`  | `--tw-gradient-via: #d4d4d4`  | gradient via: #d4d4d4  |
| `to-neutral-300`   | `--tw-gradient-to: #d4d4d4`   | gradient to: #d4d4d4   |
| `from-neutral-400` | `--tw-gradient-from: #a3a3a3` | gradient from: #a3a3a3 |
| `via-neutral-400`  | `--tw-gradient-via: #a3a3a3`  | gradient via: #a3a3a3  |
| `to-neutral-400`   | `--tw-gradient-to: #a3a3a3`   | gradient to: #a3a3a3   |
| `from-neutral-500` | `--tw-gradient-from: #737373` | gradient from: #737373 |
| `via-neutral-500`  | `--tw-gradient-via: #737373`  | gradient via: #737373  |
| `to-neutral-500`   | `--tw-gradient-to: #737373`   | gradient to: #737373   |
| `from-neutral-600` | `--tw-gradient-from: #525252` | gradient from: #525252 |
| `via-neutral-600`  | `--tw-gradient-via: #525252`  | gradient via: #525252  |
| `to-neutral-600`   | `--tw-gradient-to: #525252`   | gradient to: #525252   |
| `from-neutral-700` | `--tw-gradient-from: #404040` | gradient from: #404040 |
| `via-neutral-700`  | `--tw-gradient-via: #404040`  | gradient via: #404040  |
| `to-neutral-700`   | `--tw-gradient-to: #404040`   | gradient to: #404040   |
| `from-neutral-800` | `--tw-gradient-from: #262626` | gradient from: #262626 |
| `via-neutral-800`  | `--tw-gradient-via: #262626`  | gradient via: #262626  |
| `to-neutral-800`   | `--tw-gradient-to: #262626`   | gradient to: #262626   |
| `from-neutral-900` | `--tw-gradient-from: #171717` | gradient from: #171717 |
| `via-neutral-900`  | `--tw-gradient-via: #171717`  | gradient via: #171717  |
| `to-neutral-900`   | `--tw-gradient-to: #171717`   | gradient to: #171717   |
| `from-neutral-950` | `--tw-gradient-from: #0a0a0a` | gradient from: #0a0a0a |
| `via-neutral-950`  | `--tw-gradient-via: #0a0a0a`  | gradient via: #0a0a0a  |
| `to-neutral-950`   | `--tw-gradient-to: #0a0a0a`   | gradient to: #0a0a0a   |
| `from-stone-50`    | `--tw-gradient-from: #fafaf9` | gradient from: #fafaf9 |
| `via-stone-50`     | `--tw-gradient-via: #fafaf9`  | gradient via: #fafaf9  |
| `to-stone-50`      | `--tw-gradient-to: #fafaf9`   | gradient to: #fafaf9   |
| `from-stone-100`   | `--tw-gradient-from: #f5f5f4` | gradient from: #f5f5f4 |
| `via-stone-100`    | `--tw-gradient-via: #f5f5f4`  | gradient via: #f5f5f4  |
| `to-stone-100`     | `--tw-gradient-to: #f5f5f4`   | gradient to: #f5f5f4   |
| `from-stone-200`   | `--tw-gradient-from: #e7e5e4` | gradient from: #e7e5e4 |
| `via-stone-200`    | `--tw-gradient-via: #e7e5e4`  | gradient via: #e7e5e4  |
| `to-stone-200`     | `--tw-gradient-to: #e7e5e4`   | gradient to: #e7e5e4   |
| `from-stone-300`   | `--tw-gradient-from: #d6d3d1` | gradient from: #d6d3d1 |
| `via-stone-300`    | `--tw-gradient-via: #d6d3d1`  | gradient via: #d6d3d1  |
| `to-stone-300`     | `--tw-gradient-to: #d6d3d1`   | gradient to: #d6d3d1   |
| `from-stone-400`   | `--tw-gradient-from: #a8a29e` | gradient from: #a8a29e |
| `via-stone-400`    | `--tw-gradient-via: #a8a29e`  | gradient via: #a8a29e  |
| `to-stone-400`     | `--tw-gradient-to: #a8a29e`   | gradient to: #a8a29e   |
| `from-stone-500`   | `--tw-gradient-from: #78716c` | gradient from: #78716c |
| `via-stone-500`    | `--tw-gradient-via: #78716c`  | gradient via: #78716c  |
| `to-stone-500`     | `--tw-gradient-to: #78716c`   | gradient to: #78716c   |
| `from-stone-600`   | `--tw-gradient-from: #57534e` | gradient from: #57534e |
| `via-stone-600`    | `--tw-gradient-via: #57534e`  | gradient via: #57534e  |
| `to-stone-600`     | `--tw-gradient-to: #57534e`   | gradient to: #57534e   |
| `from-stone-700`   | `--tw-gradient-from: #44403c` | gradient from: #44403c |
| `via-stone-700`    | `--tw-gradient-via: #44403c`  | gradient via: #44403c  |
| `to-stone-700`     | `--tw-gradient-to: #44403c`   | gradient to: #44403c   |
| `from-stone-800`   | `--tw-gradient-from: #292524` | gradient from: #292524 |
| `via-stone-800`    | `--tw-gradient-via: #292524`  | gradient via: #292524  |
| `to-stone-800`     | `--tw-gradient-to: #292524`   | gradient to: #292524   |
| `from-stone-900`   | `--tw-gradient-from: #1c1917` | gradient from: #1c1917 |
| `via-stone-900`    | `--tw-gradient-via: #1c1917`  | gradient via: #1c1917  |
| `to-stone-900`     | `--tw-gradient-to: #1c1917`   | gradient to: #1c1917   |
| `from-stone-950`   | `--tw-gradient-from: #0c0a09` | gradient from: #0c0a09 |
| `via-stone-950`    | `--tw-gradient-via: #0c0a09`  | gradient via: #0c0a09  |
| `to-stone-950`     | `--tw-gradient-to: #0c0a09`   | gradient to: #0c0a09   |
| `from-red-50`      | `--tw-gradient-from: #fef2f2` | gradient from: #fef2f2 |
| `via-red-50`       | `--tw-gradient-via: #fef2f2`  | gradient via: #fef2f2  |
| `to-red-50`        | `--tw-gradient-to: #fef2f2`   | gradient to: #fef2f2   |
| `from-red-100`     | `--tw-gradient-from: #fee2e2` | gradient from: #fee2e2 |
| `via-red-100`      | `--tw-gradient-via: #fee2e2`  | gradient via: #fee2e2  |
| `to-red-100`       | `--tw-gradient-to: #fee2e2`   | gradient to: #fee2e2   |
| `from-red-200`     | `--tw-gradient-from: #fecaca` | gradient from: #fecaca |
| `via-red-200`      | `--tw-gradient-via: #fecaca`  | gradient via: #fecaca  |
| `to-red-200`       | `--tw-gradient-to: #fecaca`   | gradient to: #fecaca   |
| `from-red-300`     | `--tw-gradient-from: #fca5a5` | gradient from: #fca5a5 |
| `via-red-300`      | `--tw-gradient-via: #fca5a5`  | gradient via: #fca5a5  |
| `to-red-300`       | `--tw-gradient-to: #fca5a5`   | gradient to: #fca5a5   |
| `from-red-400`     | `--tw-gradient-from: #f87171` | gradient from: #f87171 |
| `via-red-400`      | `--tw-gradient-via: #f87171`  | gradient via: #f87171  |
| `to-red-400`       | `--tw-gradient-to: #f87171`   | gradient to: #f87171   |
| `from-red-500`     | `--tw-gradient-from: #ef4444` | gradient from: #ef4444 |
| `via-red-500`      | `--tw-gradient-via: #ef4444`  | gradient via: #ef4444  |
| `to-red-500`       | `--tw-gradient-to: #ef4444`   | gradient to: #ef4444   |
| `from-red-600`     | `--tw-gradient-from: #dc2626` | gradient from: #dc2626 |
| `via-red-600`      | `--tw-gradient-via: #dc2626`  | gradient via: #dc2626  |
| `to-red-600`       | `--tw-gradient-to: #dc2626`   | gradient to: #dc2626   |
| `from-red-700`     | `--tw-gradient-from: #b91c1c` | gradient from: #b91c1c |
| `via-red-700`      | `--tw-gradient-via: #b91c1c`  | gradient via: #b91c1c  |
| `to-red-700`       | `--tw-gradient-to: #b91c1c`   | gradient to: #b91c1c   |
| `from-red-800`     | `--tw-gradient-from: #991b1b` | gradient from: #991b1b |
| `via-red-800`      | `--tw-gradient-via: #991b1b`  | gradient via: #991b1b  |
| `to-red-800`       | `--tw-gradient-to: #991b1b`   | gradient to: #991b1b   |
| `from-red-900`     | `--tw-gradient-from: #7f1d1d` | gradient from: #7f1d1d |
| `via-red-900`      | `--tw-gradient-via: #7f1d1d`  | gradient via: #7f1d1d  |
| `to-red-900`       | `--tw-gradient-to: #7f1d1d`   | gradient to: #7f1d1d   |
| `from-red-950`     | `--tw-gradient-from: #450a0a` | gradient from: #450a0a |
| `via-red-950`      | `--tw-gradient-via: #450a0a`  | gradient via: #450a0a  |
| `to-red-950`       | `--tw-gradient-to: #450a0a`   | gradient to: #450a0a   |
| `from-orange-50`   | `--tw-gradient-from: #fff7ed` | gradient from: #fff7ed |
| `via-orange-50`    | `--tw-gradient-via: #fff7ed`  | gradient via: #fff7ed  |
| `to-orange-50`     | `--tw-gradient-to: #fff7ed`   | gradient to: #fff7ed   |
| `from-orange-100`  | `--tw-gradient-from: #ffedd5` | gradient from: #ffedd5 |
| `via-orange-100`   | `--tw-gradient-via: #ffedd5`  | gradient via: #ffedd5  |
| `to-orange-100`    | `--tw-gradient-to: #ffedd5`   | gradient to: #ffedd5   |
| `from-orange-200`  | `--tw-gradient-from: #fed7aa` | gradient from: #fed7aa |
| `via-orange-200`   | `--tw-gradient-via: #fed7aa`  | gradient via: #fed7aa  |
| `to-orange-200`    | `--tw-gradient-to: #fed7aa`   | gradient to: #fed7aa   |
| `from-orange-300`  | `--tw-gradient-from: #fdba74` | gradient from: #fdba74 |
| `via-orange-300`   | `--tw-gradient-via: #fdba74`  | gradient via: #fdba74  |
| `to-orange-300`    | `--tw-gradient-to: #fdba74`   | gradient to: #fdba74   |
| `from-orange-400`  | `--tw-gradient-from: #fb923c` | gradient from: #fb923c |
| `via-orange-400`   | `--tw-gradient-via: #fb923c`  | gradient via: #fb923c  |
| `to-orange-400`    | `--tw-gradient-to: #fb923c`   | gradient to: #fb923c   |
| `from-orange-500`  | `--tw-gradient-from: #f97316` | gradient from: #f97316 |
| `via-orange-500`   | `--tw-gradient-via: #f97316`  | gradient via: #f97316  |
| `to-orange-500`    | `--tw-gradient-to: #f97316`   | gradient to: #f97316   |
| `from-orange-600`  | `--tw-gradient-from: #ea580c` | gradient from: #ea580c |
| `via-orange-600`   | `--tw-gradient-via: #ea580c`  | gradient via: #ea580c  |
| `to-orange-600`    | `--tw-gradient-to: #ea580c`   | gradient to: #ea580c   |
| `from-orange-700`  | `--tw-gradient-from: #c2410c` | gradient from: #c2410c |
| `via-orange-700`   | `--tw-gradient-via: #c2410c`  | gradient via: #c2410c  |
| `to-orange-700`    | `--tw-gradient-to: #c2410c`   | gradient to: #c2410c   |
| `from-orange-800`  | `--tw-gradient-from: #9a3412` | gradient from: #9a3412 |
| `via-orange-800`   | `--tw-gradient-via: #9a3412`  | gradient via: #9a3412  |
| `to-orange-800`    | `--tw-gradient-to: #9a3412`   | gradient to: #9a3412   |
| `from-orange-900`  | `--tw-gradient-from: #7c2d12` | gradient from: #7c2d12 |
| `via-orange-900`   | `--tw-gradient-via: #7c2d12`  | gradient via: #7c2d12  |
| `to-orange-900`    | `--tw-gradient-to: #7c2d12`   | gradient to: #7c2d12   |
| `from-orange-950`  | `--tw-gradient-from: #431407` | gradient from: #431407 |
| `via-orange-950`   | `--tw-gradient-via: #431407`  | gradient via: #431407  |
| `to-orange-950`    | `--tw-gradient-to: #431407`   | gradient to: #431407   |
| `from-amber-50`    | `--tw-gradient-from: #fffbeb` | gradient from: #fffbeb |
| `via-amber-50`     | `--tw-gradient-via: #fffbeb`  | gradient via: #fffbeb  |
| `to-amber-50`      | `--tw-gradient-to: #fffbeb`   | gradient to: #fffbeb   |
| `from-amber-100`   | `--tw-gradient-from: #fef3c7` | gradient from: #fef3c7 |
| `via-amber-100`    | `--tw-gradient-via: #fef3c7`  | gradient via: #fef3c7  |
| `to-amber-100`     | `--tw-gradient-to: #fef3c7`   | gradient to: #fef3c7   |
| `from-amber-200`   | `--tw-gradient-from: #fde68a` | gradient from: #fde68a |
| `via-amber-200`    | `--tw-gradient-via: #fde68a`  | gradient via: #fde68a  |
| `to-amber-200`     | `--tw-gradient-to: #fde68a`   | gradient to: #fde68a   |
| `from-amber-300`   | `--tw-gradient-from: #fcd34d` | gradient from: #fcd34d |
| `via-amber-300`    | `--tw-gradient-via: #fcd34d`  | gradient via: #fcd34d  |
| `to-amber-300`     | `--tw-gradient-to: #fcd34d`   | gradient to: #fcd34d   |
| `from-amber-400`   | `--tw-gradient-from: #fbbf24` | gradient from: #fbbf24 |
| `via-amber-400`    | `--tw-gradient-via: #fbbf24`  | gradient via: #fbbf24  |
| `to-amber-400`     | `--tw-gradient-to: #fbbf24`   | gradient to: #fbbf24   |
| `from-amber-500`   | `--tw-gradient-from: #f59e0b` | gradient from: #f59e0b |
| `via-amber-500`    | `--tw-gradient-via: #f59e0b`  | gradient via: #f59e0b  |
| `to-amber-500`     | `--tw-gradient-to: #f59e0b`   | gradient to: #f59e0b   |
| `from-amber-600`   | `--tw-gradient-from: #d97706` | gradient from: #d97706 |
| `via-amber-600`    | `--tw-gradient-via: #d97706`  | gradient via: #d97706  |
| `to-amber-600`     | `--tw-gradient-to: #d97706`   | gradient to: #d97706   |
| `from-amber-700`   | `--tw-gradient-from: #b45309` | gradient from: #b45309 |
| `via-amber-700`    | `--tw-gradient-via: #b45309`  | gradient via: #b45309  |
| `to-amber-700`     | `--tw-gradient-to: #b45309`   | gradient to: #b45309   |
| `from-amber-800`   | `--tw-gradient-from: #92400e` | gradient from: #92400e |
| `via-amber-800`    | `--tw-gradient-via: #92400e`  | gradient via: #92400e  |
| `to-amber-800`     | `--tw-gradient-to: #92400e`   | gradient to: #92400e   |
| `from-amber-900`   | `--tw-gradient-from: #78350f` | gradient from: #78350f |
| `via-amber-900`    | `--tw-gradient-via: #78350f`  | gradient via: #78350f  |
| `to-amber-900`     | `--tw-gradient-to: #78350f`   | gradient to: #78350f   |
| `from-amber-950`   | `--tw-gradient-from: #451a03` | gradient from: #451a03 |
| `via-amber-950`    | `--tw-gradient-via: #451a03`  | gradient via: #451a03  |
| `to-amber-950`     | `--tw-gradient-to: #451a03`   | gradient to: #451a03   |
| `from-yellow-50`   | `--tw-gradient-from: #fefce8` | gradient from: #fefce8 |
| `via-yellow-50`    | `--tw-gradient-via: #fefce8`  | gradient via: #fefce8  |
| `to-yellow-50`     | `--tw-gradient-to: #fefce8`   | gradient to: #fefce8   |
| `from-yellow-100`  | `--tw-gradient-from: #fef9c3` | gradient from: #fef9c3 |
| `via-yellow-100`   | `--tw-gradient-via: #fef9c3`  | gradient via: #fef9c3  |
| `to-yellow-100`    | `--tw-gradient-to: #fef9c3`   | gradient to: #fef9c3   |
| `from-yellow-200`  | `--tw-gradient-from: #fef08a` | gradient from: #fef08a |
| `via-yellow-200`   | `--tw-gradient-via: #fef08a`  | gradient via: #fef08a  |
| `to-yellow-200`    | `--tw-gradient-to: #fef08a`   | gradient to: #fef08a   |
| `from-yellow-300`  | `--tw-gradient-from: #fde047` | gradient from: #fde047 |
| `via-yellow-300`   | `--tw-gradient-via: #fde047`  | gradient via: #fde047  |
| `to-yellow-300`    | `--tw-gradient-to: #fde047`   | gradient to: #fde047   |
| `from-yellow-400`  | `--tw-gradient-from: #facc15` | gradient from: #facc15 |
| `via-yellow-400`   | `--tw-gradient-via: #facc15`  | gradient via: #facc15  |
| `to-yellow-400`    | `--tw-gradient-to: #facc15`   | gradient to: #facc15   |
| `from-yellow-500`  | `--tw-gradient-from: #eab308` | gradient from: #eab308 |
| `via-yellow-500`   | `--tw-gradient-via: #eab308`  | gradient via: #eab308  |
| `to-yellow-500`    | `--tw-gradient-to: #eab308`   | gradient to: #eab308   |
| `from-yellow-600`  | `--tw-gradient-from: #ca8a04` | gradient from: #ca8a04 |
| `via-yellow-600`   | `--tw-gradient-via: #ca8a04`  | gradient via: #ca8a04  |
| `to-yellow-600`    | `--tw-gradient-to: #ca8a04`   | gradient to: #ca8a04   |
| `from-yellow-700`  | `--tw-gradient-from: #a16207` | gradient from: #a16207 |
| `via-yellow-700`   | `--tw-gradient-via: #a16207`  | gradient via: #a16207  |
| `to-yellow-700`    | `--tw-gradient-to: #a16207`   | gradient to: #a16207   |
| `from-yellow-800`  | `--tw-gradient-from: #854d0e` | gradient from: #854d0e |
| `via-yellow-800`   | `--tw-gradient-via: #854d0e`  | gradient via: #854d0e  |
| `to-yellow-800`    | `--tw-gradient-to: #854d0e`   | gradient to: #854d0e   |
| `from-yellow-900`  | `--tw-gradient-from: #713f12` | gradient from: #713f12 |
| `via-yellow-900`   | `--tw-gradient-via: #713f12`  | gradient via: #713f12  |
| `to-yellow-900`    | `--tw-gradient-to: #713f12`   | gradient to: #713f12   |
| `from-yellow-950`  | `--tw-gradient-from: #422006` | gradient from: #422006 |
| `via-yellow-950`   | `--tw-gradient-via: #422006`  | gradient via: #422006  |
| `to-yellow-950`    | `--tw-gradient-to: #422006`   | gradient to: #422006   |
| `from-lime-50`     | `--tw-gradient-from: #f7fee7` | gradient from: #f7fee7 |
| `via-lime-50`      | `--tw-gradient-via: #f7fee7`  | gradient via: #f7fee7  |
| `to-lime-50`       | `--tw-gradient-to: #f7fee7`   | gradient to: #f7fee7   |
| `from-lime-100`    | `--tw-gradient-from: #ecfccb` | gradient from: #ecfccb |
| `via-lime-100`     | `--tw-gradient-via: #ecfccb`  | gradient via: #ecfccb  |
| `to-lime-100`      | `--tw-gradient-to: #ecfccb`   | gradient to: #ecfccb   |
| `from-lime-200`    | `--tw-gradient-from: #d9f99d` | gradient from: #d9f99d |
| `via-lime-200`     | `--tw-gradient-via: #d9f99d`  | gradient via: #d9f99d  |
| `to-lime-200`      | `--tw-gradient-to: #d9f99d`   | gradient to: #d9f99d   |
| `from-lime-300`    | `--tw-gradient-from: #bef264` | gradient from: #bef264 |
| `via-lime-300`     | `--tw-gradient-via: #bef264`  | gradient via: #bef264  |
| `to-lime-300`      | `--tw-gradient-to: #bef264`   | gradient to: #bef264   |
| `from-lime-400`    | `--tw-gradient-from: #a3e635` | gradient from: #a3e635 |
| `via-lime-400`     | `--tw-gradient-via: #a3e635`  | gradient via: #a3e635  |
| `to-lime-400`      | `--tw-gradient-to: #a3e635`   | gradient to: #a3e635   |
| `from-lime-500`    | `--tw-gradient-from: #84cc16` | gradient from: #84cc16 |
| `via-lime-500`     | `--tw-gradient-via: #84cc16`  | gradient via: #84cc16  |
| `to-lime-500`      | `--tw-gradient-to: #84cc16`   | gradient to: #84cc16   |
| `from-lime-600`    | `--tw-gradient-from: #65a30d` | gradient from: #65a30d |
| `via-lime-600`     | `--tw-gradient-via: #65a30d`  | gradient via: #65a30d  |
| `to-lime-600`      | `--tw-gradient-to: #65a30d`   | gradient to: #65a30d   |
| `from-lime-700`    | `--tw-gradient-from: #4d7c0f` | gradient from: #4d7c0f |
| `via-lime-700`     | `--tw-gradient-via: #4d7c0f`  | gradient via: #4d7c0f  |
| `to-lime-700`      | `--tw-gradient-to: #4d7c0f`   | gradient to: #4d7c0f   |
| `from-lime-800`    | `--tw-gradient-from: #3f6212` | gradient from: #3f6212 |
| `via-lime-800`     | `--tw-gradient-via: #3f6212`  | gradient via: #3f6212  |
| `to-lime-800`      | `--tw-gradient-to: #3f6212`   | gradient to: #3f6212   |
| `from-lime-900`    | `--tw-gradient-from: #365314` | gradient from: #365314 |
| `via-lime-900`     | `--tw-gradient-via: #365314`  | gradient via: #365314  |
| `to-lime-900`      | `--tw-gradient-to: #365314`   | gradient to: #365314   |
| `from-lime-950`    | `--tw-gradient-from: #1a2e05` | gradient from: #1a2e05 |
| `via-lime-950`     | `--tw-gradient-via: #1a2e05`  | gradient via: #1a2e05  |
| `to-lime-950`      | `--tw-gradient-to: #1a2e05`   | gradient to: #1a2e05   |
| `from-emerald-50`  | `--tw-gradient-from: #ecfdf5` | gradient from: #ecfdf5 |
| `via-emerald-50`   | `--tw-gradient-via: #ecfdf5`  | gradient via: #ecfdf5  |
| `to-emerald-50`    | `--tw-gradient-to: #ecfdf5`   | gradient to: #ecfdf5   |
| `from-emerald-100` | `--tw-gradient-from: #d1fae5` | gradient from: #d1fae5 |
| `via-emerald-100`  | `--tw-gradient-via: #d1fae5`  | gradient via: #d1fae5  |
| `to-emerald-100`   | `--tw-gradient-to: #d1fae5`   | gradient to: #d1fae5   |
| `from-emerald-200` | `--tw-gradient-from: #a7f3d0` | gradient from: #a7f3d0 |
| `via-emerald-200`  | `--tw-gradient-via: #a7f3d0`  | gradient via: #a7f3d0  |
| `to-emerald-200`   | `--tw-gradient-to: #a7f3d0`   | gradient to: #a7f3d0   |
| `from-emerald-300` | `--tw-gradient-from: #6ee7b7` | gradient from: #6ee7b7 |
| `via-emerald-300`  | `--tw-gradient-via: #6ee7b7`  | gradient via: #6ee7b7  |
| `to-emerald-300`   | `--tw-gradient-to: #6ee7b7`   | gradient to: #6ee7b7   |
| `from-emerald-400` | `--tw-gradient-from: #34d399` | gradient from: #34d399 |
| `via-emerald-400`  | `--tw-gradient-via: #34d399`  | gradient via: #34d399  |
| `to-emerald-400`   | `--tw-gradient-to: #34d399`   | gradient to: #34d399   |
| `from-emerald-500` | `--tw-gradient-from: #10b981` | gradient from: #10b981 |
| `via-emerald-500`  | `--tw-gradient-via: #10b981`  | gradient via: #10b981  |
| `to-emerald-500`   | `--tw-gradient-to: #10b981`   | gradient to: #10b981   |
| `from-emerald-600` | `--tw-gradient-from: #059669` | gradient from: #059669 |
| `via-emerald-600`  | `--tw-gradient-via: #059669`  | gradient via: #059669  |
| `to-emerald-600`   | `--tw-gradient-to: #059669`   | gradient to: #059669   |
| `from-emerald-700` | `--tw-gradient-from: #047857` | gradient from: #047857 |
| `via-emerald-700`  | `--tw-gradient-via: #047857`  | gradient via: #047857  |
| `to-emerald-700`   | `--tw-gradient-to: #047857`   | gradient to: #047857   |
| `from-emerald-800` | `--tw-gradient-from: #065f46` | gradient from: #065f46 |
| `via-emerald-800`  | `--tw-gradient-via: #065f46`  | gradient via: #065f46  |
| `to-emerald-800`   | `--tw-gradient-to: #065f46`   | gradient to: #065f46   |
| `from-emerald-900` | `--tw-gradient-from: #064e3b` | gradient from: #064e3b |
| `via-emerald-900`  | `--tw-gradient-via: #064e3b`  | gradient via: #064e3b  |
| `to-emerald-900`   | `--tw-gradient-to: #064e3b`   | gradient to: #064e3b   |
| `from-emerald-950` | `--tw-gradient-from: #022c22` | gradient from: #022c22 |
| `via-emerald-950`  | `--tw-gradient-via: #022c22`  | gradient via: #022c22  |
| `to-emerald-950`   | `--tw-gradient-to: #022c22`   | gradient to: #022c22   |
| `from-green-50`    | `--tw-gradient-from: #f0fdf4` | gradient from: #f0fdf4 |
| `via-green-50`     | `--tw-gradient-via: #f0fdf4`  | gradient via: #f0fdf4  |
| `to-green-50`      | `--tw-gradient-to: #f0fdf4`   | gradient to: #f0fdf4   |
| `from-green-100`   | `--tw-gradient-from: #dcfce7` | gradient from: #dcfce7 |
| `via-green-100`    | `--tw-gradient-via: #dcfce7`  | gradient via: #dcfce7  |
| `to-green-100`     | `--tw-gradient-to: #dcfce7`   | gradient to: #dcfce7   |
| `from-green-200`   | `--tw-gradient-from: #bbf7d0` | gradient from: #bbf7d0 |
| `via-green-200`    | `--tw-gradient-via: #bbf7d0`  | gradient via: #bbf7d0  |
| `to-green-200`     | `--tw-gradient-to: #bbf7d0`   | gradient to: #bbf7d0   |
| `from-green-300`   | `--tw-gradient-from: #86efac` | gradient from: #86efac |
| `via-green-300`    | `--tw-gradient-via: #86efac`  | gradient via: #86efac  |
| `to-green-300`     | `--tw-gradient-to: #86efac`   | gradient to: #86efac   |
| `from-green-400`   | `--tw-gradient-from: #4ade80` | gradient from: #4ade80 |
| `via-green-400`    | `--tw-gradient-via: #4ade80`  | gradient via: #4ade80  |
| `to-green-400`     | `--tw-gradient-to: #4ade80`   | gradient to: #4ade80   |
| `from-green-500`   | `--tw-gradient-from: #22c55e` | gradient from: #22c55e |
| `via-green-500`    | `--tw-gradient-via: #22c55e`  | gradient via: #22c55e  |
| `to-green-500`     | `--tw-gradient-to: #22c55e`   | gradient to: #22c55e   |
| `from-green-600`   | `--tw-gradient-from: #16a34a` | gradient from: #16a34a |
| `via-green-600`    | `--tw-gradient-via: #16a34a`  | gradient via: #16a34a  |
| `to-green-600`     | `--tw-gradient-to: #16a34a`   | gradient to: #16a34a   |
| `from-green-700`   | `--tw-gradient-from: #15803d` | gradient from: #15803d |
| `via-green-700`    | `--tw-gradient-via: #15803d`  | gradient via: #15803d  |
| `to-green-700`     | `--tw-gradient-to: #15803d`   | gradient to: #15803d   |
| `from-green-800`   | `--tw-gradient-from: #166534` | gradient from: #166534 |
| `via-green-800`    | `--tw-gradient-via: #166534`  | gradient via: #166534  |
| `to-green-800`     | `--tw-gradient-to: #166534`   | gradient to: #166534   |
| `from-green-900`   | `--tw-gradient-from: #14532d` | gradient from: #14532d |
| `via-green-900`    | `--tw-gradient-via: #14532d`  | gradient via: #14532d  |
| `to-green-900`     | `--tw-gradient-to: #14532d`   | gradient to: #14532d   |
| `from-green-950`   | `--tw-gradient-from: #052e16` | gradient from: #052e16 |
| `via-green-950`    | `--tw-gradient-via: #052e16`  | gradient via: #052e16  |
| `to-green-950`     | `--tw-gradient-to: #052e16`   | gradient to: #052e16   |
| `from-teal-50`     | `--tw-gradient-from: #f0fdfa` | gradient from: #f0fdfa |
| `via-teal-50`      | `--tw-gradient-via: #f0fdfa`  | gradient via: #f0fdfa  |
| `to-teal-50`       | `--tw-gradient-to: #f0fdfa`   | gradient to: #f0fdfa   |
| `from-teal-100`    | `--tw-gradient-from: #ccfbf1` | gradient from: #ccfbf1 |
| `via-teal-100`     | `--tw-gradient-via: #ccfbf1`  | gradient via: #ccfbf1  |
| `to-teal-100`      | `--tw-gradient-to: #ccfbf1`   | gradient to: #ccfbf1   |
| `from-teal-200`    | `--tw-gradient-from: #99f6e4` | gradient from: #99f6e4 |
| `via-teal-200`     | `--tw-gradient-via: #99f6e4`  | gradient via: #99f6e4  |
| `to-teal-200`      | `--tw-gradient-to: #99f6e4`   | gradient to: #99f6e4   |
| `from-teal-300`    | `--tw-gradient-from: #5eead4` | gradient from: #5eead4 |
| `via-teal-300`     | `--tw-gradient-via: #5eead4`  | gradient via: #5eead4  |
| `to-teal-300`      | `--tw-gradient-to: #5eead4`   | gradient to: #5eead4   |
| `from-teal-400`    | `--tw-gradient-from: #2dd4bf` | gradient from: #2dd4bf |
| `via-teal-400`     | `--tw-gradient-via: #2dd4bf`  | gradient via: #2dd4bf  |
| `to-teal-400`      | `--tw-gradient-to: #2dd4bf`   | gradient to: #2dd4bf   |
| `from-teal-500`    | `--tw-gradient-from: #14b8a6` | gradient from: #14b8a6 |
| `via-teal-500`     | `--tw-gradient-via: #14b8a6`  | gradient via: #14b8a6  |
| `to-teal-500`      | `--tw-gradient-to: #14b8a6`   | gradient to: #14b8a6   |
| `from-teal-600`    | `--tw-gradient-from: #0d9488` | gradient from: #0d9488 |
| `via-teal-600`     | `--tw-gradient-via: #0d9488`  | gradient via: #0d9488  |
| `to-teal-600`      | `--tw-gradient-to: #0d9488`   | gradient to: #0d9488   |
| `from-teal-700`    | `--tw-gradient-from: #0f766e` | gradient from: #0f766e |
| `via-teal-700`     | `--tw-gradient-via: #0f766e`  | gradient via: #0f766e  |
| `to-teal-700`      | `--tw-gradient-to: #0f766e`   | gradient to: #0f766e   |
| `from-teal-800`    | `--tw-gradient-from: #115e59` | gradient from: #115e59 |
| `via-teal-800`     | `--tw-gradient-via: #115e59`  | gradient via: #115e59  |
| `to-teal-800`      | `--tw-gradient-to: #115e59`   | gradient to: #115e59   |
| `from-teal-900`    | `--tw-gradient-from: #134e4a` | gradient from: #134e4a |
| `via-teal-900`     | `--tw-gradient-via: #134e4a`  | gradient via: #134e4a  |
| `to-teal-900`      | `--tw-gradient-to: #134e4a`   | gradient to: #134e4a   |
| `from-teal-950`    | `--tw-gradient-from: #042f2e` | gradient from: #042f2e |
| `via-teal-950`     | `--tw-gradient-via: #042f2e`  | gradient via: #042f2e  |
| `to-teal-950`      | `--tw-gradient-to: #042f2e`   | gradient to: #042f2e   |
| `from-cyan-50`     | `--tw-gradient-from: #ecfeff` | gradient from: #ecfeff |
| `via-cyan-50`      | `--tw-gradient-via: #ecfeff`  | gradient via: #ecfeff  |
| `to-cyan-50`       | `--tw-gradient-to: #ecfeff`   | gradient to: #ecfeff   |
| `from-cyan-100`    | `--tw-gradient-from: #cffafe` | gradient from: #cffafe |
| `via-cyan-100`     | `--tw-gradient-via: #cffafe`  | gradient via: #cffafe  |
| `to-cyan-100`      | `--tw-gradient-to: #cffafe`   | gradient to: #cffafe   |
| `from-cyan-200`    | `--tw-gradient-from: #a5f3fc` | gradient from: #a5f3fc |
| `via-cyan-200`     | `--tw-gradient-via: #a5f3fc`  | gradient via: #a5f3fc  |
| `to-cyan-200`      | `--tw-gradient-to: #a5f3fc`   | gradient to: #a5f3fc   |
| `from-cyan-300`    | `--tw-gradient-from: #67e8f9` | gradient from: #67e8f9 |
| `via-cyan-300`     | `--tw-gradient-via: #67e8f9`  | gradient via: #67e8f9  |
| `to-cyan-300`      | `--tw-gradient-to: #67e8f9`   | gradient to: #67e8f9   |
| `from-cyan-400`    | `--tw-gradient-from: #22d3ee` | gradient from: #22d3ee |
| `via-cyan-400`     | `--tw-gradient-via: #22d3ee`  | gradient via: #22d3ee  |
| `to-cyan-400`      | `--tw-gradient-to: #22d3ee`   | gradient to: #22d3ee   |
| `from-cyan-500`    | `--tw-gradient-from: #06b6d4` | gradient from: #06b6d4 |
| `via-cyan-500`     | `--tw-gradient-via: #06b6d4`  | gradient via: #06b6d4  |
| `to-cyan-500`      | `--tw-gradient-to: #06b6d4`   | gradient to: #06b6d4   |
| `from-cyan-600`    | `--tw-gradient-from: #0891b2` | gradient from: #0891b2 |
| `via-cyan-600`     | `--tw-gradient-via: #0891b2`  | gradient via: #0891b2  |
| `to-cyan-600`      | `--tw-gradient-to: #0891b2`   | gradient to: #0891b2   |
| `from-cyan-700`    | `--tw-gradient-from: #0e7490` | gradient from: #0e7490 |
| `via-cyan-700`     | `--tw-gradient-via: #0e7490`  | gradient via: #0e7490  |
| `to-cyan-700`      | `--tw-gradient-to: #0e7490`   | gradient to: #0e7490   |
| `from-cyan-800`    | `--tw-gradient-from: #155e75` | gradient from: #155e75 |
| `via-cyan-800`     | `--tw-gradient-via: #155e75`  | gradient via: #155e75  |
| `to-cyan-800`      | `--tw-gradient-to: #155e75`   | gradient to: #155e75   |
| `from-cyan-900`    | `--tw-gradient-from: #164e63` | gradient from: #164e63 |
| `via-cyan-900`     | `--tw-gradient-via: #164e63`  | gradient via: #164e63  |
| `to-cyan-900`      | `--tw-gradient-to: #164e63`   | gradient to: #164e63   |
| `from-cyan-950`    | `--tw-gradient-from: #083344` | gradient from: #083344 |
| `via-cyan-950`     | `--tw-gradient-via: #083344`  | gradient via: #083344  |
| `to-cyan-950`      | `--tw-gradient-to: #083344`   | gradient to: #083344   |
| `from-sky-50`      | `--tw-gradient-from: #f0f9ff` | gradient from: #f0f9ff |
| `via-sky-50`       | `--tw-gradient-via: #f0f9ff`  | gradient via: #f0f9ff  |
| `to-sky-50`        | `--tw-gradient-to: #f0f9ff`   | gradient to: #f0f9ff   |
| `from-sky-100`     | `--tw-gradient-from: #e0f2fe` | gradient from: #e0f2fe |
| `via-sky-100`      | `--tw-gradient-via: #e0f2fe`  | gradient via: #e0f2fe  |
| `to-sky-100`       | `--tw-gradient-to: #e0f2fe`   | gradient to: #e0f2fe   |
| `from-sky-200`     | `--tw-gradient-from: #bae6fd` | gradient from: #bae6fd |
| `via-sky-200`      | `--tw-gradient-via: #bae6fd`  | gradient via: #bae6fd  |
| `to-sky-200`       | `--tw-gradient-to: #bae6fd`   | gradient to: #bae6fd   |
| `from-sky-300`     | `--tw-gradient-from: #7dd3fc` | gradient from: #7dd3fc |
| `via-sky-300`      | `--tw-gradient-via: #7dd3fc`  | gradient via: #7dd3fc  |
| `to-sky-300`       | `--tw-gradient-to: #7dd3fc`   | gradient to: #7dd3fc   |
| `from-sky-400`     | `--tw-gradient-from: #38bdf8` | gradient from: #38bdf8 |
| `via-sky-400`      | `--tw-gradient-via: #38bdf8`  | gradient via: #38bdf8  |
| `to-sky-400`       | `--tw-gradient-to: #38bdf8`   | gradient to: #38bdf8   |
| `from-sky-500`     | `--tw-gradient-from: #0ea5e9` | gradient from: #0ea5e9 |
| `via-sky-500`      | `--tw-gradient-via: #0ea5e9`  | gradient via: #0ea5e9  |
| `to-sky-500`       | `--tw-gradient-to: #0ea5e9`   | gradient to: #0ea5e9   |
| `from-sky-600`     | `--tw-gradient-from: #0284c7` | gradient from: #0284c7 |
| `via-sky-600`      | `--tw-gradient-via: #0284c7`  | gradient via: #0284c7  |
| `to-sky-600`       | `--tw-gradient-to: #0284c7`   | gradient to: #0284c7   |
| `from-sky-700`     | `--tw-gradient-from: #0369a1` | gradient from: #0369a1 |
| `via-sky-700`      | `--tw-gradient-via: #0369a1`  | gradient via: #0369a1  |
| `to-sky-700`       | `--tw-gradient-to: #0369a1`   | gradient to: #0369a1   |
| `from-sky-800`     | `--tw-gradient-from: #075985` | gradient from: #075985 |
| `via-sky-800`      | `--tw-gradient-via: #075985`  | gradient via: #075985  |
| `to-sky-800`       | `--tw-gradient-to: #075985`   | gradient to: #075985   |
| `from-sky-900`     | `--tw-gradient-from: #0c4a6e` | gradient from: #0c4a6e |
| `via-sky-900`      | `--tw-gradient-via: #0c4a6e`  | gradient via: #0c4a6e  |
| `to-sky-900`       | `--tw-gradient-to: #0c4a6e`   | gradient to: #0c4a6e   |
| `from-sky-950`     | `--tw-gradient-from: #082f49` | gradient from: #082f49 |
| `via-sky-950`      | `--tw-gradient-via: #082f49`  | gradient via: #082f49  |
| `to-sky-950`       | `--tw-gradient-to: #082f49`   | gradient to: #082f49   |
| `from-blue-50`     | `--tw-gradient-from: #eff6ff` | gradient from: #eff6ff |
| `via-blue-50`      | `--tw-gradient-via: #eff6ff`  | gradient via: #eff6ff  |
| `to-blue-50`       | `--tw-gradient-to: #eff6ff`   | gradient to: #eff6ff   |
| `from-blue-100`    | `--tw-gradient-from: #dbeafe` | gradient from: #dbeafe |
| `via-blue-100`     | `--tw-gradient-via: #dbeafe`  | gradient via: #dbeafe  |
| `to-blue-100`      | `--tw-gradient-to: #dbeafe`   | gradient to: #dbeafe   |
| `from-blue-200`    | `--tw-gradient-from: #bfdbfe` | gradient from: #bfdbfe |
| `via-blue-200`     | `--tw-gradient-via: #bfdbfe`  | gradient via: #bfdbfe  |
| `to-blue-200`      | `--tw-gradient-to: #bfdbfe`   | gradient to: #bfdbfe   |
| `from-blue-300`    | `--tw-gradient-from: #93c5fd` | gradient from: #93c5fd |
| `via-blue-300`     | `--tw-gradient-via: #93c5fd`  | gradient via: #93c5fd  |
| `to-blue-300`      | `--tw-gradient-to: #93c5fd`   | gradient to: #93c5fd   |
| `from-blue-400`    | `--tw-gradient-from: #60a5fa` | gradient from: #60a5fa |
| `via-blue-400`     | `--tw-gradient-via: #60a5fa`  | gradient via: #60a5fa  |
| `to-blue-400`      | `--tw-gradient-to: #60a5fa`   | gradient to: #60a5fa   |
| `from-blue-500`    | `--tw-gradient-from: #3b82f6` | gradient from: #3b82f6 |
| `via-blue-500`     | `--tw-gradient-via: #3b82f6`  | gradient via: #3b82f6  |
| `to-blue-500`      | `--tw-gradient-to: #3b82f6`   | gradient to: #3b82f6   |
| `from-blue-600`    | `--tw-gradient-from: #2563eb` | gradient from: #2563eb |
| `via-blue-600`     | `--tw-gradient-via: #2563eb`  | gradient via: #2563eb  |
| `to-blue-600`      | `--tw-gradient-to: #2563eb`   | gradient to: #2563eb   |
| `from-blue-700`    | `--tw-gradient-from: #1d4ed8` | gradient from: #1d4ed8 |
| `via-blue-700`     | `--tw-gradient-via: #1d4ed8`  | gradient via: #1d4ed8  |
| `to-blue-700`      | `--tw-gradient-to: #1d4ed8`   | gradient to: #1d4ed8   |
| `from-blue-800`    | `--tw-gradient-from: #1e40af` | gradient from: #1e40af |
| `via-blue-800`     | `--tw-gradient-via: #1e40af`  | gradient via: #1e40af  |
| `to-blue-800`      | `--tw-gradient-to: #1e40af`   | gradient to: #1e40af   |
| `from-blue-900`    | `--tw-gradient-from: #1e3a8a` | gradient from: #1e3a8a |
| `via-blue-900`     | `--tw-gradient-via: #1e3a8a`  | gradient via: #1e3a8a  |
| `to-blue-900`      | `--tw-gradient-to: #1e3a8a`   | gradient to: #1e3a8a   |
| `from-blue-950`    | `--tw-gradient-from: #172554` | gradient from: #172554 |
| `via-blue-950`     | `--tw-gradient-via: #172554`  | gradient via: #172554  |
| `to-blue-950`      | `--tw-gradient-to: #172554`   | gradient to: #172554   |
| `from-indigo-50`   | `--tw-gradient-from: #eef2ff` | gradient from: #eef2ff |
| `via-indigo-50`    | `--tw-gradient-via: #eef2ff`  | gradient via: #eef2ff  |
| `to-indigo-50`     | `--tw-gradient-to: #eef2ff`   | gradient to: #eef2ff   |
| `from-indigo-100`  | `--tw-gradient-from: #e0e7ff` | gradient from: #e0e7ff |
| `via-indigo-100`   | `--tw-gradient-via: #e0e7ff`  | gradient via: #e0e7ff  |
| `to-indigo-100`    | `--tw-gradient-to: #e0e7ff`   | gradient to: #e0e7ff   |
| `from-indigo-200`  | `--tw-gradient-from: #c7d2fe` | gradient from: #c7d2fe |
| `via-indigo-200`   | `--tw-gradient-via: #c7d2fe`  | gradient via: #c7d2fe  |
| `to-indigo-200`    | `--tw-gradient-to: #c7d2fe`   | gradient to: #c7d2fe   |
| `from-indigo-300`  | `--tw-gradient-from: #a5b4fc` | gradient from: #a5b4fc |
| `via-indigo-300`   | `--tw-gradient-via: #a5b4fc`  | gradient via: #a5b4fc  |
| `to-indigo-300`    | `--tw-gradient-to: #a5b4fc`   | gradient to: #a5b4fc   |
| `from-indigo-400`  | `--tw-gradient-from: #818cf8` | gradient from: #818cf8 |
| `via-indigo-400`   | `--tw-gradient-via: #818cf8`  | gradient via: #818cf8  |
| `to-indigo-400`    | `--tw-gradient-to: #818cf8`   | gradient to: #818cf8   |
| `from-indigo-500`  | `--tw-gradient-from: #6366f1` | gradient from: #6366f1 |
| `via-indigo-500`   | `--tw-gradient-via: #6366f1`  | gradient via: #6366f1  |
| `to-indigo-500`    | `--tw-gradient-to: #6366f1`   | gradient to: #6366f1   |
| `from-indigo-600`  | `--tw-gradient-from: #4f46e5` | gradient from: #4f46e5 |
| `via-indigo-600`   | `--tw-gradient-via: #4f46e5`  | gradient via: #4f46e5  |
| `to-indigo-600`    | `--tw-gradient-to: #4f46e5`   | gradient to: #4f46e5   |
| `from-indigo-700`  | `--tw-gradient-from: #4338ca` | gradient from: #4338ca |
| `via-indigo-700`   | `--tw-gradient-via: #4338ca`  | gradient via: #4338ca  |
| `to-indigo-700`    | `--tw-gradient-to: #4338ca`   | gradient to: #4338ca   |
| `from-indigo-800`  | `--tw-gradient-from: #3730a3` | gradient from: #3730a3 |
| `via-indigo-800`   | `--tw-gradient-via: #3730a3`  | gradient via: #3730a3  |
| `to-indigo-800`    | `--tw-gradient-to: #3730a3`   | gradient to: #3730a3   |
| `from-indigo-900`  | `--tw-gradient-from: #312e81` | gradient from: #312e81 |
| `via-indigo-900`   | `--tw-gradient-via: #312e81`  | gradient via: #312e81  |
| `to-indigo-900`    | `--tw-gradient-to: #312e81`   | gradient to: #312e81   |
| `from-indigo-950`  | `--tw-gradient-from: #1e1b4b` | gradient from: #1e1b4b |
| `via-indigo-950`   | `--tw-gradient-via: #1e1b4b`  | gradient via: #1e1b4b  |
| `to-indigo-950`    | `--tw-gradient-to: #1e1b4b`   | gradient to: #1e1b4b   |
| `from-violet-50`   | `--tw-gradient-from: #f5f3ff` | gradient from: #f5f3ff |
| `via-violet-50`    | `--tw-gradient-via: #f5f3ff`  | gradient via: #f5f3ff  |
| `to-violet-50`     | `--tw-gradient-to: #f5f3ff`   | gradient to: #f5f3ff   |
| `from-violet-100`  | `--tw-gradient-from: #ede9fe` | gradient from: #ede9fe |
| `via-violet-100`   | `--tw-gradient-via: #ede9fe`  | gradient via: #ede9fe  |
| `to-violet-100`    | `--tw-gradient-to: #ede9fe`   | gradient to: #ede9fe   |
| `from-violet-200`  | `--tw-gradient-from: #ddd6fe` | gradient from: #ddd6fe |
| `via-violet-200`   | `--tw-gradient-via: #ddd6fe`  | gradient via: #ddd6fe  |
| `to-violet-200`    | `--tw-gradient-to: #ddd6fe`   | gradient to: #ddd6fe   |
| `from-violet-300`  | `--tw-gradient-from: #c4b5fd` | gradient from: #c4b5fd |
| `via-violet-300`   | `--tw-gradient-via: #c4b5fd`  | gradient via: #c4b5fd  |
| `to-violet-300`    | `--tw-gradient-to: #c4b5fd`   | gradient to: #c4b5fd   |
| `from-violet-400`  | `--tw-gradient-from: #a78bfa` | gradient from: #a78bfa |
| `via-violet-400`   | `--tw-gradient-via: #a78bfa`  | gradient via: #a78bfa  |
| `to-violet-400`    | `--tw-gradient-to: #a78bfa`   | gradient to: #a78bfa   |
| `from-violet-500`  | `--tw-gradient-from: #8b5cf6` | gradient from: #8b5cf6 |
| `via-violet-500`   | `--tw-gradient-via: #8b5cf6`  | gradient via: #8b5cf6  |
| `to-violet-500`    | `--tw-gradient-to: #8b5cf6`   | gradient to: #8b5cf6   |
| `from-violet-600`  | `--tw-gradient-from: #7c3aed` | gradient from: #7c3aed |
| `via-violet-600`   | `--tw-gradient-via: #7c3aed`  | gradient via: #7c3aed  |
| `to-violet-600`    | `--tw-gradient-to: #7c3aed`   | gradient to: #7c3aed   |
| `from-violet-700`  | `--tw-gradient-from: #6d28d9` | gradient from: #6d28d9 |
| `via-violet-700`   | `--tw-gradient-via: #6d28d9`  | gradient via: #6d28d9  |
| `to-violet-700`    | `--tw-gradient-to: #6d28d9`   | gradient to: #6d28d9   |
| `from-violet-800`  | `--tw-gradient-from: #5b21b6` | gradient from: #5b21b6 |
| `via-violet-800`   | `--tw-gradient-via: #5b21b6`  | gradient via: #5b21b6  |
| `to-violet-800`    | `--tw-gradient-to: #5b21b6`   | gradient to: #5b21b6   |
| `from-violet-900`  | `--tw-gradient-from: #4c1d95` | gradient from: #4c1d95 |
| `via-violet-900`   | `--tw-gradient-via: #4c1d95`  | gradient via: #4c1d95  |
| `to-violet-900`    | `--tw-gradient-to: #4c1d95`   | gradient to: #4c1d95   |
| `from-violet-950`  | `--tw-gradient-from: #2e1065` | gradient from: #2e1065 |
| `via-violet-950`   | `--tw-gradient-via: #2e1065`  | gradient via: #2e1065  |
| `to-violet-950`    | `--tw-gradient-to: #2e1065`   | gradient to: #2e1065   |
| `from-purple-50`   | `--tw-gradient-from: #faf5ff` | gradient from: #faf5ff |
| `via-purple-50`    | `--tw-gradient-via: #faf5ff`  | gradient via: #faf5ff  |
| `to-purple-50`     | `--tw-gradient-to: #faf5ff`   | gradient to: #faf5ff   |
| `from-purple-100`  | `--tw-gradient-from: #f3e8ff` | gradient from: #f3e8ff |
| `via-purple-100`   | `--tw-gradient-via: #f3e8ff`  | gradient via: #f3e8ff  |
| `to-purple-100`    | `--tw-gradient-to: #f3e8ff`   | gradient to: #f3e8ff   |
| `from-purple-200`  | `--tw-gradient-from: #e9d5ff` | gradient from: #e9d5ff |
| `via-purple-200`   | `--tw-gradient-via: #e9d5ff`  | gradient via: #e9d5ff  |
| `to-purple-200`    | `--tw-gradient-to: #e9d5ff`   | gradient to: #e9d5ff   |
| `from-purple-300`  | `--tw-gradient-from: #d8b4fe` | gradient from: #d8b4fe |
| `via-purple-300`   | `--tw-gradient-via: #d8b4fe`  | gradient via: #d8b4fe  |
| `to-purple-300`    | `--tw-gradient-to: #d8b4fe`   | gradient to: #d8b4fe   |
| `from-purple-400`  | `--tw-gradient-from: #c084fc` | gradient from: #c084fc |
| `via-purple-400`   | `--tw-gradient-via: #c084fc`  | gradient via: #c084fc  |
| `to-purple-400`    | `--tw-gradient-to: #c084fc`   | gradient to: #c084fc   |
| `from-purple-500`  | `--tw-gradient-from: #a855f7` | gradient from: #a855f7 |
| `via-purple-500`   | `--tw-gradient-via: #a855f7`  | gradient via: #a855f7  |
| `to-purple-500`    | `--tw-gradient-to: #a855f7`   | gradient to: #a855f7   |
| `from-purple-600`  | `--tw-gradient-from: #9333ea` | gradient from: #9333ea |
| `via-purple-600`   | `--tw-gradient-via: #9333ea`  | gradient via: #9333ea  |
| `to-purple-600`    | `--tw-gradient-to: #9333ea`   | gradient to: #9333ea   |
| `from-purple-700`  | `--tw-gradient-from: #7e22ce` | gradient from: #7e22ce |
| `via-purple-700`   | `--tw-gradient-via: #7e22ce`  | gradient via: #7e22ce  |
| `to-purple-700`    | `--tw-gradient-to: #7e22ce`   | gradient to: #7e22ce   |
| `from-purple-800`  | `--tw-gradient-from: #6b21a8` | gradient from: #6b21a8 |
| `via-purple-800`   | `--tw-gradient-via: #6b21a8`  | gradient via: #6b21a8  |
| `to-purple-800`    | `--tw-gradient-to: #6b21a8`   | gradient to: #6b21a8   |
| `from-purple-900`  | `--tw-gradient-from: #581c87` | gradient from: #581c87 |
| `via-purple-900`   | `--tw-gradient-via: #581c87`  | gradient via: #581c87  |
| `to-purple-900`    | `--tw-gradient-to: #581c87`   | gradient to: #581c87   |
| `from-purple-950`  | `--tw-gradient-from: #3b0764` | gradient from: #3b0764 |
| `via-purple-950`   | `--tw-gradient-via: #3b0764`  | gradient via: #3b0764  |
| `to-purple-950`    | `--tw-gradient-to: #3b0764`   | gradient to: #3b0764   |
| `from-fuchsia-50`  | `--tw-gradient-from: #fdf4ff` | gradient from: #fdf4ff |
| `via-fuchsia-50`   | `--tw-gradient-via: #fdf4ff`  | gradient via: #fdf4ff  |
| `to-fuchsia-50`    | `--tw-gradient-to: #fdf4ff`   | gradient to: #fdf4ff   |
| `from-fuchsia-100` | `--tw-gradient-from: #fae8ff` | gradient from: #fae8ff |
| `via-fuchsia-100`  | `--tw-gradient-via: #fae8ff`  | gradient via: #fae8ff  |
| `to-fuchsia-100`   | `--tw-gradient-to: #fae8ff`   | gradient to: #fae8ff   |
| `from-fuchsia-200` | `--tw-gradient-from: #f5d0fe` | gradient from: #f5d0fe |
| `via-fuchsia-200`  | `--tw-gradient-via: #f5d0fe`  | gradient via: #f5d0fe  |
| `to-fuchsia-200`   | `--tw-gradient-to: #f5d0fe`   | gradient to: #f5d0fe   |
| `from-fuchsia-300` | `--tw-gradient-from: #f0abfc` | gradient from: #f0abfc |
| `via-fuchsia-300`  | `--tw-gradient-via: #f0abfc`  | gradient via: #f0abfc  |
| `to-fuchsia-300`   | `--tw-gradient-to: #f0abfc`   | gradient to: #f0abfc   |
| `from-fuchsia-400` | `--tw-gradient-from: #e879f9` | gradient from: #e879f9 |
| `via-fuchsia-400`  | `--tw-gradient-via: #e879f9`  | gradient via: #e879f9  |
| `to-fuchsia-400`   | `--tw-gradient-to: #e879f9`   | gradient to: #e879f9   |
| `from-fuchsia-500` | `--tw-gradient-from: #d946ef` | gradient from: #d946ef |
| `via-fuchsia-500`  | `--tw-gradient-via: #d946ef`  | gradient via: #d946ef  |
| `to-fuchsia-500`   | `--tw-gradient-to: #d946ef`   | gradient to: #d946ef   |
| `from-fuchsia-600` | `--tw-gradient-from: #c026d3` | gradient from: #c026d3 |
| `via-fuchsia-600`  | `--tw-gradient-via: #c026d3`  | gradient via: #c026d3  |
| `to-fuchsia-600`   | `--tw-gradient-to: #c026d3`   | gradient to: #c026d3   |
| `from-fuchsia-700` | `--tw-gradient-from: #a21caf` | gradient from: #a21caf |
| `via-fuchsia-700`  | `--tw-gradient-via: #a21caf`  | gradient via: #a21caf  |
| `to-fuchsia-700`   | `--tw-gradient-to: #a21caf`   | gradient to: #a21caf   |
| `from-fuchsia-800` | `--tw-gradient-from: #86198f` | gradient from: #86198f |
| `via-fuchsia-800`  | `--tw-gradient-via: #86198f`  | gradient via: #86198f  |
| `to-fuchsia-800`   | `--tw-gradient-to: #86198f`   | gradient to: #86198f   |
| `from-fuchsia-900` | `--tw-gradient-from: #701a75` | gradient from: #701a75 |
| `via-fuchsia-900`  | `--tw-gradient-via: #701a75`  | gradient via: #701a75  |
| `to-fuchsia-900`   | `--tw-gradient-to: #701a75`   | gradient to: #701a75   |
| `from-fuchsia-950` | `--tw-gradient-from: #4a044e` | gradient from: #4a044e |
| `via-fuchsia-950`  | `--tw-gradient-via: #4a044e`  | gradient via: #4a044e  |
| `to-fuchsia-950`   | `--tw-gradient-to: #4a044e`   | gradient to: #4a044e   |
| `from-pink-50`     | `--tw-gradient-from: #fdf2f8` | gradient from: #fdf2f8 |
| `via-pink-50`      | `--tw-gradient-via: #fdf2f8`  | gradient via: #fdf2f8  |
| `to-pink-50`       | `--tw-gradient-to: #fdf2f8`   | gradient to: #fdf2f8   |
| `from-pink-100`    | `--tw-gradient-from: #fce7f3` | gradient from: #fce7f3 |
| `via-pink-100`     | `--tw-gradient-via: #fce7f3`  | gradient via: #fce7f3  |
| `to-pink-100`      | `--tw-gradient-to: #fce7f3`   | gradient to: #fce7f3   |
| `from-pink-200`    | `--tw-gradient-from: #fbcfe8` | gradient from: #fbcfe8 |
| `via-pink-200`     | `--tw-gradient-via: #fbcfe8`  | gradient via: #fbcfe8  |
| `to-pink-200`      | `--tw-gradient-to: #fbcfe8`   | gradient to: #fbcfe8   |
| `from-pink-300`    | `--tw-gradient-from: #f9a8d4` | gradient from: #f9a8d4 |
| `via-pink-300`     | `--tw-gradient-via: #f9a8d4`  | gradient via: #f9a8d4  |
| `to-pink-300`      | `--tw-gradient-to: #f9a8d4`   | gradient to: #f9a8d4   |
| `from-pink-400`    | `--tw-gradient-from: #f472b6` | gradient from: #f472b6 |
| `via-pink-400`     | `--tw-gradient-via: #f472b6`  | gradient via: #f472b6  |
| `to-pink-400`      | `--tw-gradient-to: #f472b6`   | gradient to: #f472b6   |
| `from-pink-500`    | `--tw-gradient-from: #ec4899` | gradient from: #ec4899 |
| `via-pink-500`     | `--tw-gradient-via: #ec4899`  | gradient via: #ec4899  |
| `to-pink-500`      | `--tw-gradient-to: #ec4899`   | gradient to: #ec4899   |
| `from-pink-600`    | `--tw-gradient-from: #db2777` | gradient from: #db2777 |
| `via-pink-600`     | `--tw-gradient-via: #db2777`  | gradient via: #db2777  |
| `to-pink-600`      | `--tw-gradient-to: #db2777`   | gradient to: #db2777   |
| `from-pink-700`    | `--tw-gradient-from: #be185d` | gradient from: #be185d |
| `via-pink-700`     | `--tw-gradient-via: #be185d`  | gradient via: #be185d  |
| `to-pink-700`      | `--tw-gradient-to: #be185d`   | gradient to: #be185d   |
| `from-pink-800`    | `--tw-gradient-from: #9d174d` | gradient from: #9d174d |
| `via-pink-800`     | `--tw-gradient-via: #9d174d`  | gradient via: #9d174d  |
| `to-pink-800`      | `--tw-gradient-to: #9d174d`   | gradient to: #9d174d   |
| `from-pink-900`    | `--tw-gradient-from: #831843` | gradient from: #831843 |
| `via-pink-900`     | `--tw-gradient-via: #831843`  | gradient via: #831843  |
| `to-pink-900`      | `--tw-gradient-to: #831843`   | gradient to: #831843   |
| `from-pink-950`    | `--tw-gradient-from: #500724` | gradient from: #500724 |
| `via-pink-950`     | `--tw-gradient-via: #500724`  | gradient via: #500724  |
| `to-pink-950`      | `--tw-gradient-to: #500724`   | gradient to: #500724   |
| `from-rose-50`     | `--tw-gradient-from: #fff1f2` | gradient from: #fff1f2 |
| `via-rose-50`      | `--tw-gradient-via: #fff1f2`  | gradient via: #fff1f2  |
| `to-rose-50`       | `--tw-gradient-to: #fff1f2`   | gradient to: #fff1f2   |
| `from-rose-100`    | `--tw-gradient-from: #ffe4e6` | gradient from: #ffe4e6 |
| `via-rose-100`     | `--tw-gradient-via: #ffe4e6`  | gradient via: #ffe4e6  |
| `to-rose-100`      | `--tw-gradient-to: #ffe4e6`   | gradient to: #ffe4e6   |
| `from-rose-200`    | `--tw-gradient-from: #fecdd3` | gradient from: #fecdd3 |
| `via-rose-200`     | `--tw-gradient-via: #fecdd3`  | gradient via: #fecdd3  |
| `to-rose-200`      | `--tw-gradient-to: #fecdd3`   | gradient to: #fecdd3   |
| `from-rose-300`    | `--tw-gradient-from: #fda4af` | gradient from: #fda4af |
| `via-rose-300`     | `--tw-gradient-via: #fda4af`  | gradient via: #fda4af  |
| `to-rose-300`      | `--tw-gradient-to: #fda4af`   | gradient to: #fda4af   |
| `from-rose-400`    | `--tw-gradient-from: #fb7185` | gradient from: #fb7185 |
| `via-rose-400`     | `--tw-gradient-via: #fb7185`  | gradient via: #fb7185  |
| `to-rose-400`      | `--tw-gradient-to: #fb7185`   | gradient to: #fb7185   |
| `from-rose-500`    | `--tw-gradient-from: #f43f5e` | gradient from: #f43f5e |
| `via-rose-500`     | `--tw-gradient-via: #f43f5e`  | gradient via: #f43f5e  |
| `to-rose-500`      | `--tw-gradient-to: #f43f5e`   | gradient to: #f43f5e   |
| `from-rose-600`    | `--tw-gradient-from: #e11d48` | gradient from: #e11d48 |
| `via-rose-600`     | `--tw-gradient-via: #e11d48`  | gradient via: #e11d48  |
| `to-rose-600`      | `--tw-gradient-to: #e11d48`   | gradient to: #e11d48   |
| `from-rose-700`    | `--tw-gradient-from: #be123c` | gradient from: #be123c |
| `via-rose-700`     | `--tw-gradient-via: #be123c`  | gradient via: #be123c  |
| `to-rose-700`      | `--tw-gradient-to: #be123c`   | gradient to: #be123c   |
| `from-rose-800`    | `--tw-gradient-from: #881337` | gradient from: #881337 |
| `via-rose-800`     | `--tw-gradient-via: #881337`  | gradient via: #881337  |
| `to-rose-800`      | `--tw-gradient-to: #881337`   | gradient to: #881337   |
| `from-rose-900`    | `--tw-gradient-from: #4c0519` | gradient from: #4c0519 |
| `via-rose-900`     | `--tw-gradient-via: #4c0519`  | gradient via: #4c0519  |
| `to-rose-900`      | `--tw-gradient-to: #4c0519`   | gradient to: #4c0519   |
| `from-rose-950`    | `--tw-gradient-from: #1c020c` | gradient from: #1c020c |
| `via-rose-950`     | `--tw-gradient-via: #1c020c`  | gradient via: #1c020c  |
| `to-rose-950`      | `--tw-gradient-to: #1c020c`   | gradient to: #1c020c   |

---

## Responsive & state variants

Every utility above accepts a responsive prefix (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) and — in JIT mode — a state variant (`hover:`, `focus:`, `active:`, `disabled:`, `dark:`, `group-hover:`, `peer-focus:`, …). See [Variants](../VARIANTS.md) and [Responsive](../RESPONSIVE.md).


<!-- ===== docs/utilities/07-backgrounds.md (#docs-utilities-07-backgrounds-md) ===== -->

---
title: Background Utilities
---

# Background Utilities

> Part of the [Nakshora Utilities Reference](../UTILITIES.md). These tables are **generated from the framework source** — what you see here is exactly what the compiler emits.

Background position, repeat, size, attachment and linear gradients (`bg-gradient-to-*` + `from-*` / `via-*` / `to-*` stops).

## Backgrounds

**25 utilities**

| Class               | CSS                                                                                                                                      | Description                   |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `bg-top`            | `background-position: top`                                                                                                               | background-position: top      |
| `bg-left`           | `background-position: left`                                                                                                              | background-position: left     |
| `bg-center`         | `background-position: center`                                                                                                            | background-position: center   |
| `bg-right`          | `background-position: right`                                                                                                             | background-position: right    |
| `bg-bottom`         | `background-position: bottom`                                                                                                            | background-position: bottom   |
| `bg-no-repeat`      | `background-repeat: no-repeat`                                                                                                           | background-repeat: no-repeat  |
| `bg-repeat`         | `background-repeat: repeat`                                                                                                              | background-repeat: repeat     |
| `bg-repeat-x`       | `background-repeat: repeat-x`                                                                                                            | background-repeat: repeat-x   |
| `bg-repeat-y`       | `background-repeat: repeat-y`                                                                                                            | background-repeat: repeat-y   |
| `bg-repeat-round`   | `background-repeat: round`                                                                                                               | background-repeat: round      |
| `bg-repeat-space`   | `background-repeat: space`                                                                                                               | background-repeat: space      |
| `bg-auto`           | `background-size: auto`                                                                                                                  | background-size: auto         |
| `bg-cover`          | `background-size: cover`                                                                                                                 | background-size: cover        |
| `bg-contain`        | `background-size: contain`                                                                                                               | background-size: contain      |
| `bg-fixed`          | `background-attachment: fixed`                                                                                                           | background-attachment: fixed  |
| `bg-local`          | `background-attachment: local`                                                                                                           | background-attachment: local  |
| `bg-scroll`         | `background-attachment: scroll`                                                                                                          | background-attachment: scroll |
| `bg-gradient-to-t`  | `backgroundImage: linear-gradient(to top, var(--tw-gradient-from), var(--tw-gradient-via, transparent), var(--tw-gradient-to))`          | linear gradient to t          |
| `bg-gradient-to-tr` | `backgroundImage: linear-gradient(to top right, var(--tw-gradient-from), var(--tw-gradient-via, transparent), var(--tw-gradient-to))`    | linear gradient to tr         |
| `bg-gradient-to-r`  | `backgroundImage: linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-via, transparent), var(--tw-gradient-to))`        | linear gradient to r          |
| `bg-gradient-to-br` | `backgroundImage: linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-via, transparent), var(--tw-gradient-to))` | linear gradient to br         |
| `bg-gradient-to-b`  | `backgroundImage: linear-gradient(to bottom, var(--tw-gradient-from), var(--tw-gradient-via, transparent), var(--tw-gradient-to))`       | linear gradient to b          |
| `bg-gradient-to-bl` | `backgroundImage: linear-gradient(to bottom left, var(--tw-gradient-from), var(--tw-gradient-via, transparent), var(--tw-gradient-to))`  | linear gradient to bl         |
| `bg-gradient-to-l`  | `backgroundImage: linear-gradient(to left, var(--tw-gradient-from), var(--tw-gradient-via, transparent), var(--tw-gradient-to))`         | linear gradient to l          |
| `bg-gradient-to-tl` | `backgroundImage: linear-gradient(to top left, var(--tw-gradient-from), var(--tw-gradient-via, transparent), var(--tw-gradient-to))`     | linear gradient to tl         |

---

## Responsive & state variants

Every utility above accepts a responsive prefix (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) and — in JIT mode — a state variant (`hover:`, `focus:`, `active:`, `disabled:`, `dark:`, `group-hover:`, `peer-focus:`, …). See [Variants](../VARIANTS.md) and [Responsive](../RESPONSIVE.md).


<!-- ===== docs/utilities/08-borders.md (#docs-utilities-08-borders-md) ===== -->

---
title: Border Utilities
---

# Border Utilities

> Part of the [Nakshora Utilities Reference](../UTILITIES.md). These tables are **generated from the framework source** — what you see here is exactly what the compiler emits.

Border width, style and radius (including per-corner radius).

## Borders

**16 utilities**

| Class           | CSS                                               | Description                  |
| --------------- | ------------------------------------------------- | ---------------------------- |
| `border`        | `border: 1px solid`                               | 1px solid border (all sides) |
| `border-0`      | `border: 0 solid`                                 | no border                    |
| `border-2`      | `border: 2px solid`                               | 2px solid border             |
| `border-4`      | `border: 4px solid`                               | 4px solid border             |
| `border-8`      | `border: 8px solid`                               | 8px solid border             |
| `border-t`      | `border-t-width: 1px; border-t-style: solid`      | t border                     |
| `border-r`      | `border-r-width: 1px; border-r-style: solid`      | r border                     |
| `border-b`      | `border-b-width: 1px; border-b-style: solid`      | b border                     |
| `border-l`      | `border-l-width: 1px; border-l-style: solid`      | l border                     |
| `border-x`      | `border-left: 1px solid; border-right: 1px solid` | left+right border            |
| `border-y`      | `border-top: 1px solid; border-bottom: 1px solid` | top+bottom border            |
| `border-solid`  | `border-style: solid`                             | border-style: solid          |
| `border-dashed` | `border-style: dashed`                            | border-style: dashed         |
| `border-dotted` | `border-style: dotted`                            | border-style: dotted         |
| `border-double` | `border-style: double`                            | border-style: double         |
| `border-none`   | `border-style: none`                              | border-style: none           |

## Border Radius

**90 utilities**

| Class             | CSS                                    | Description                |
| ----------------- | -------------------------------------- | -------------------------- |
| `rounded`         | `border-radius: 0.25rem`               | border-radius: 0.25rem     |
| `rounded-none`    | `border-radius: 0`                     | border-radius: 0           |
| `rounded-xs`      | `border-radius: 0.125rem`              | border-radius: 0.125rem    |
| `rounded-sm`      | `border-radius: 0.25rem`               | border-radius: 0.25rem     |
| `rounded-md`      | `border-radius: 0.375rem`              | border-radius: 0.375rem    |
| `rounded-lg`      | `border-radius: 0.5rem`                | border-radius: 0.5rem      |
| `rounded-xl`      | `border-radius: 0.75rem`               | border-radius: 0.75rem     |
| `rounded-2xl`     | `border-radius: 1rem`                  | border-radius: 1rem        |
| `rounded-3xl`     | `border-radius: 1.5rem`                | border-radius: 1.5rem      |
| `rounded-full`    | `border-radius: 9999px`                | border-radius: 9999px      |
| `rounded-t`       | `border-top-left-radius: 0.25rem`      | t corner radius            |
| `rounded-t-none`  | `border-top-left-radius: 0`            | t corner radius: 0         |
| `rounded-t-xs`    | `border-top-left-radius: 0.125rem`     | t corner radius: 0.125rem  |
| `rounded-t-sm`    | `border-top-left-radius: 0.25rem`      | t corner radius: 0.25rem   |
| `rounded-t-md`    | `border-top-left-radius: 0.375rem`     | t corner radius: 0.375rem  |
| `rounded-t-lg`    | `border-top-left-radius: 0.5rem`       | t corner radius: 0.5rem    |
| `rounded-t-xl`    | `border-top-left-radius: 0.75rem`      | t corner radius: 0.75rem   |
| `rounded-t-2xl`   | `border-top-left-radius: 1rem`         | t corner radius: 1rem      |
| `rounded-t-3xl`   | `border-top-left-radius: 1.5rem`       | t corner radius: 1.5rem    |
| `rounded-t-full`  | `border-top-left-radius: 9999px`       | t corner radius: 9999px    |
| `rounded-r`       | `border-top-right-radius: 0.25rem`     | r corner radius            |
| `rounded-r-none`  | `border-top-right-radius: 0`           | r corner radius: 0         |
| `rounded-r-xs`    | `border-top-right-radius: 0.125rem`    | r corner radius: 0.125rem  |
| `rounded-r-sm`    | `border-top-right-radius: 0.25rem`     | r corner radius: 0.25rem   |
| `rounded-r-md`    | `border-top-right-radius: 0.375rem`    | r corner radius: 0.375rem  |
| `rounded-r-lg`    | `border-top-right-radius: 0.5rem`      | r corner radius: 0.5rem    |
| `rounded-r-xl`    | `border-top-right-radius: 0.75rem`     | r corner radius: 0.75rem   |
| `rounded-r-2xl`   | `border-top-right-radius: 1rem`        | r corner radius: 1rem      |
| `rounded-r-3xl`   | `border-top-right-radius: 1.5rem`      | r corner radius: 1.5rem    |
| `rounded-r-full`  | `border-top-right-radius: 9999px`      | r corner radius: 9999px    |
| `rounded-b`       | `border-bottom-right-radius: 0.25rem`  | b corner radius            |
| `rounded-b-none`  | `border-bottom-right-radius: 0`        | b corner radius: 0         |
| `rounded-b-xs`    | `border-bottom-right-radius: 0.125rem` | b corner radius: 0.125rem  |
| `rounded-b-sm`    | `border-bottom-right-radius: 0.25rem`  | b corner radius: 0.25rem   |
| `rounded-b-md`    | `border-bottom-right-radius: 0.375rem` | b corner radius: 0.375rem  |
| `rounded-b-lg`    | `border-bottom-right-radius: 0.5rem`   | b corner radius: 0.5rem    |
| `rounded-b-xl`    | `border-bottom-right-radius: 0.75rem`  | b corner radius: 0.75rem   |
| `rounded-b-2xl`   | `border-bottom-right-radius: 1rem`     | b corner radius: 1rem      |
| `rounded-b-3xl`   | `border-bottom-right-radius: 1.5rem`   | b corner radius: 1.5rem    |
| `rounded-b-full`  | `border-bottom-right-radius: 9999px`   | b corner radius: 9999px    |
| `rounded-l`       | `border-bottom-left-radius: 0.25rem`   | l corner radius            |
| `rounded-l-none`  | `border-bottom-left-radius: 0`         | l corner radius: 0         |
| `rounded-l-xs`    | `border-bottom-left-radius: 0.125rem`  | l corner radius: 0.125rem  |
| `rounded-l-sm`    | `border-bottom-left-radius: 0.25rem`   | l corner radius: 0.25rem   |
| `rounded-l-md`    | `border-bottom-left-radius: 0.375rem`  | l corner radius: 0.375rem  |
| `rounded-l-lg`    | `border-bottom-left-radius: 0.5rem`    | l corner radius: 0.5rem    |
| `rounded-l-xl`    | `border-bottom-left-radius: 0.75rem`   | l corner radius: 0.75rem   |
| `rounded-l-2xl`   | `border-bottom-left-radius: 1rem`      | l corner radius: 1rem      |
| `rounded-l-3xl`   | `border-bottom-left-radius: 1.5rem`    | l corner radius: 1.5rem    |
| `rounded-l-full`  | `border-bottom-left-radius: 9999px`    | l corner radius: 9999px    |
| `rounded-tl`      | `border-top-left-radius: 0.25rem`      | tl corner radius           |
| `rounded-tl-none` | `border-top-left-radius: 0`            | tl corner radius: 0        |
| `rounded-tl-xs`   | `border-top-left-radius: 0.125rem`     | tl corner radius: 0.125rem |
| `rounded-tl-sm`   | `border-top-left-radius: 0.25rem`      | tl corner radius: 0.25rem  |
| `rounded-tl-md`   | `border-top-left-radius: 0.375rem`     | tl corner radius: 0.375rem |
| `rounded-tl-lg`   | `border-top-left-radius: 0.5rem`       | tl corner radius: 0.5rem   |
| `rounded-tl-xl`   | `border-top-left-radius: 0.75rem`      | tl corner radius: 0.75rem  |
| `rounded-tl-2xl`  | `border-top-left-radius: 1rem`         | tl corner radius: 1rem     |
| `rounded-tl-3xl`  | `border-top-left-radius: 1.5rem`       | tl corner radius: 1.5rem   |
| `rounded-tl-full` | `border-top-left-radius: 9999px`       | tl corner radius: 9999px   |
| `rounded-tr`      | `border-top-right-radius: 0.25rem`     | tr corner radius           |
| `rounded-tr-none` | `border-top-right-radius: 0`           | tr corner radius: 0        |
| `rounded-tr-xs`   | `border-top-right-radius: 0.125rem`    | tr corner radius: 0.125rem |
| `rounded-tr-sm`   | `border-top-right-radius: 0.25rem`     | tr corner radius: 0.25rem  |
| `rounded-tr-md`   | `border-top-right-radius: 0.375rem`    | tr corner radius: 0.375rem |
| `rounded-tr-lg`   | `border-top-right-radius: 0.5rem`      | tr corner radius: 0.5rem   |
| `rounded-tr-xl`   | `border-top-right-radius: 0.75rem`     | tr corner radius: 0.75rem  |
| `rounded-tr-2xl`  | `border-top-right-radius: 1rem`        | tr corner radius: 1rem     |
| `rounded-tr-3xl`  | `border-top-right-radius: 1.5rem`      | tr corner radius: 1.5rem   |
| `rounded-tr-full` | `border-top-right-radius: 9999px`      | tr corner radius: 9999px   |
| `rounded-bl`      | `border-bottom-left-radius: 0.25rem`   | bl corner radius           |
| `rounded-bl-none` | `border-bottom-left-radius: 0`         | bl corner radius: 0        |
| `rounded-bl-xs`   | `border-bottom-left-radius: 0.125rem`  | bl corner radius: 0.125rem |
| `rounded-bl-sm`   | `border-bottom-left-radius: 0.25rem`   | bl corner radius: 0.25rem  |
| `rounded-bl-md`   | `border-bottom-left-radius: 0.375rem`  | bl corner radius: 0.375rem |
| `rounded-bl-lg`   | `border-bottom-left-radius: 0.5rem`    | bl corner radius: 0.5rem   |
| `rounded-bl-xl`   | `border-bottom-left-radius: 0.75rem`   | bl corner radius: 0.75rem  |
| `rounded-bl-2xl`  | `border-bottom-left-radius: 1rem`      | bl corner radius: 1rem     |
| `rounded-bl-3xl`  | `border-bottom-left-radius: 1.5rem`    | bl corner radius: 1.5rem   |
| `rounded-bl-full` | `border-bottom-left-radius: 9999px`    | bl corner radius: 9999px   |
| `rounded-br`      | `border-bottom-right-radius: 0.25rem`  | br corner radius           |
| `rounded-br-none` | `border-bottom-right-radius: 0`        | br corner radius: 0        |
| `rounded-br-xs`   | `border-bottom-right-radius: 0.125rem` | br corner radius: 0.125rem |
| `rounded-br-sm`   | `border-bottom-right-radius: 0.25rem`  | br corner radius: 0.25rem  |
| `rounded-br-md`   | `border-bottom-right-radius: 0.375rem` | br corner radius: 0.375rem |
| `rounded-br-lg`   | `border-bottom-right-radius: 0.5rem`   | br corner radius: 0.5rem   |
| `rounded-br-xl`   | `border-bottom-right-radius: 0.75rem`  | br corner radius: 0.75rem  |
| `rounded-br-2xl`  | `border-bottom-right-radius: 1rem`     | br corner radius: 1rem     |
| `rounded-br-3xl`  | `border-bottom-right-radius: 1.5rem`   | br corner radius: 1.5rem   |
| `rounded-br-full` | `border-bottom-right-radius: 9999px`   | br corner radius: 9999px   |

---

## Responsive & state variants

Every utility above accepts a responsive prefix (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) and — in JIT mode — a state variant (`hover:`, `focus:`, `active:`, `disabled:`, `dark:`, `group-hover:`, `peer-focus:`, …). See [Variants](../VARIANTS.md) and [Responsive](../RESPONSIVE.md).


<!-- ===== docs/utilities/09-effects.md (#docs-utilities-09-effects-md) ===== -->

---
title: Effect Utilities
---

# Effect Utilities

> Part of the [Nakshora Utilities Reference](../UTILITIES.md). These tables are **generated from the framework source** — what you see here is exactly what the compiler emits.

Shadows, opacity and CSS filters (blur, brightness, grayscale, invert, saturate, drop-shadow, backdrop-*).

## Shadows

**9 utilities**

| Class          | CSS                                                                                     | Description                                                                           |
| -------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `shadow-none`  | `box-shadow: none`                                                                      | box-shadow: none                                                                      |
| `shadow-sm`    | `box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)`                                           | box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)                                           |
| `shadow`       | `box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`           | box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)           |
| `shadow-md`    | `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`     | box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)     |
| `shadow-lg`    | `box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`   | box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)   |
| `shadow-xl`    | `box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)` | box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) |
| `shadow-2xl`   | `box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25)`                                     | box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25)                                     |
| `shadow-inner` | `box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)`                                     | box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)                                     |
| `shadow-glow`  | `box-shadow: 0 0 20px 0 rgba(59, 130, 246, 0.5)`                                        | box-shadow: 0 0 20px 0 rgba(59, 130, 246, 0.5)                                        |

## Opacity

**15 utilities**

| Class         | CSS             | Description   |
| ------------- | --------------- | ------------- |
| `opacity-0`   | `opacity: 0`    | opacity: 0    |
| `opacity-5`   | `opacity: 0.05` | opacity: 0.05 |
| `opacity-10`  | `opacity: 0.1`  | opacity: 0.1  |
| `opacity-20`  | `opacity: 0.2`  | opacity: 0.2  |
| `opacity-25`  | `opacity: 0.25` | opacity: 0.25 |
| `opacity-30`  | `opacity: 0.3`  | opacity: 0.3  |
| `opacity-40`  | `opacity: 0.4`  | opacity: 0.4  |
| `opacity-50`  | `opacity: 0.5`  | opacity: 0.5  |
| `opacity-60`  | `opacity: 0.6`  | opacity: 0.6  |
| `opacity-70`  | `opacity: 0.7`  | opacity: 0.7  |
| `opacity-75`  | `opacity: 0.75` | opacity: 0.75 |
| `opacity-80`  | `opacity: 0.8`  | opacity: 0.8  |
| `opacity-90`  | `opacity: 0.9`  | opacity: 0.9  |
| `opacity-95`  | `opacity: 0.95` | opacity: 0.95 |
| `opacity-100` | `opacity: 1`    | opacity: 1    |

## Filters

**32 utilities**

| Class                | CSS                                                | Description         |
| -------------------- | -------------------------------------------------- | ------------------- |
| `blur-0`             | `filter: none; backdrop-filter: none`              | no blur             |
| `blur-sm`            | `backdropFilter: blur(4px); filter: blur(4px)`     | backdrop-blur(4px)  |
| `blur`               | `backdropFilter: blur(8px); filter: blur(8px)`     | backdrop-blur(8px)  |
| `blur-md`            | `backdropFilter: blur(12px); filter: blur(12px)`   | backdrop-blur(12px) |
| `blur-lg`            | `backdropFilter: blur(16px); filter: blur(16px)`   | backdrop-blur(16px) |
| `blur-xl`            | `backdropFilter: blur(24px); filter: blur(24px)`   | backdrop-blur(24px) |
| `blur-2xl`           | `backdropFilter: blur(40px); filter: blur(40px)`   | backdrop-blur(40px) |
| `brightness-0`       | `filter: brightness(0)`                            | brightness 0        |
| `brightness-50`      | `filter: brightness(50%)`                          | brightness 50%      |
| `brightness-75`      | `filter: brightness(75%)`                          | brightness 75%      |
| `brightness-90`      | `filter: brightness(90%)`                          | brightness 90%      |
| `brightness-95`      | `filter: brightness(95%)`                          | brightness 95%      |
| `brightness-100`     | `filter: brightness(100%)`                         | brightness 100%     |
| `brightness-105`     | `filter: brightness(105%)`                         | brightness 105%     |
| `brightness-110`     | `filter: brightness(110%)`                         | brightness 110%     |
| `brightness-125`     | `filter: brightness(125%)`                         | brightness 125%     |
| `brightness-150`     | `filter: brightness(150%)`                         | brightness 150%     |
| `brightness-200`     | `filter: brightness(200%)`                         | brightness 200%     |
| `grayscale`          | `filter: grayscale(100%)`                          | grayscale           |
| `invert`             | `filter: invert(100%)`                             | invert colors       |
| `saturate-0`         | `filter: saturate(0)`                              | saturate 0          |
| `saturate-50`        | `filter: saturate(50%)`                            | saturate 50%        |
| `saturate-100`       | `filter: saturate(100%)`                           | saturate 100%       |
| `saturate-150`       | `filter: saturate(150%)`                           | saturate 150%       |
| `saturate-200`       | `filter: saturate(200%)`                           | saturate 200%       |
| `contrast-more`      | `filter: contrast(1.2)`                            | contrast +20%       |
| `contrast-less`      | `filter: contrast(0.8)`                            | contrast -20%       |
| `drop-shadow`        | `filter: drop-shadow(0 1px 2px rgba(0,0,0,0.25))`  | drop shadow         |
| `drop-shadow-lg`     | `filter: drop-shadow(0 10px 15px rgba(0,0,0,0.2))` | large drop shadow   |
| `backdrop-blur`      | `backdrop-filter: blur(8px)`                       | backdrop blur       |
| `backdrop-grayscale` | `backdrop-filter: grayscale(100%)`                 | backdrop grayscale  |
| `backdrop-invert`    | `backdrop-filter: invert(100%)`                    | backdrop invert     |

---

## Responsive & state variants

Every utility above accepts a responsive prefix (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) and — in JIT mode — a state variant (`hover:`, `focus:`, `active:`, `disabled:`, `dark:`, `group-hover:`, `peer-focus:`, …). See [Variants](../VARIANTS.md) and [Responsive](../RESPONSIVE.md).


<!-- ===== docs/utilities/10-transforms.md (#docs-utilities-10-transforms-md) ===== -->

---
title: Transform Utilities
---

# Transform Utilities

> Part of the [Nakshora Utilities Reference](../UTILITIES.md). These tables are **generated from the framework source** — what you see here is exactly what the compiler emits.

Scale, rotate and translate. Negative values via the `-` prefix, e.g. `-rotate-45`, `-translate-x-4`. Note: combining transforms (scale + rotate) overrides the previous transform utility — chain with `transform` + CSS variables if you need more.

## Transforms

**158 utilities**

| Class              | CSS                                                                                           | Description      |
| ------------------ | --------------------------------------------------------------------------------------------- | ---------------- |
| `scale-50`         | `transform: scale(0.5)`                                                                       | scale 50%        |
| `scale-75`         | `transform: scale(0.75)`                                                                      | scale 75%        |
| `scale-90`         | `transform: scale(0.9)`                                                                       | scale 90%        |
| `scale-95`         | `transform: scale(0.95)`                                                                      | scale 95%        |
| `scale-100`        | `transform: scale(1)`                                                                         | scale 100%       |
| `scale-105`        | `transform: scale(1.05)`                                                                      | scale 105%       |
| `scale-110`        | `transform: scale(1.1)`                                                                       | scale 110%       |
| `scale-125`        | `transform: scale(1.25)`                                                                      | scale 125%       |
| `scale-150`        | `transform: scale(1.5)`                                                                       | scale 150%       |
| `scale-175`        | `transform: scale(1.75)`                                                                      | scale 175%       |
| `scale-200`        | `transform: scale(2)`                                                                         | scale 200%       |
| `rotate-0`         | `transform: rotate(0deg)`                                                                     | rotate 0deg      |
| `rotate-45`        | `transform: rotate(45deg)`                                                                    | rotate 45deg     |
| `rotate-90`        | `transform: rotate(90deg)`                                                                    | rotate 90deg     |
| `rotate-135`       | `transform: rotate(135deg)`                                                                   | rotate 135deg    |
| `rotate-180`       | `transform: rotate(180deg)`                                                                   | rotate 180deg    |
| `rotate-225`       | `transform: rotate(225deg)`                                                                   | rotate 225deg    |
| `rotate-270`       | `transform: rotate(270deg)`                                                                   | rotate 270deg    |
| `rotate-315`       | `transform: rotate(315deg)`                                                                   | rotate 315deg    |
| `rotate-360`       | `transform: rotate(360deg)`                                                                   | rotate 360deg    |
| `-rotate-45`       | `transform: rotate(-45deg)`                                                                   | rotate -45deg    |
| `-rotate-90`       | `transform: rotate(-90deg)`                                                                   | rotate -90deg    |
| `-rotate-180`      | `transform: rotate(-180deg)`                                                                  | rotate -180deg   |
| `translate-x-0`    | `transform: translateX(0)`                                                                    | translateX       |
| `translate-y-0`    | `transform: translateY(0)`                                                                    | translateY       |
| `-translate-x-0`   | `transform: translateX(calc(-1 * 0))`                                                         | -translateX      |
| `-translate-y-0`   | `transform: translateY(calc(-1 * 0))`                                                         | -translateY      |
| `translate-x-1`    | `transform: translateX(0.25rem)`                                                              | translateX       |
| `translate-y-1`    | `transform: translateY(0.25rem)`                                                              | translateY       |
| `-translate-x-1`   | `transform: translateX(calc(-1 * 0.25rem))`                                                   | -translateX      |
| `-translate-y-1`   | `transform: translateY(calc(-1 * 0.25rem))`                                                   | -translateY      |
| `translate-x-2`    | `transform: translateX(0.5rem)`                                                               | translateX       |
| `translate-y-2`    | `transform: translateY(0.5rem)`                                                               | translateY       |
| `-translate-x-2`   | `transform: translateX(calc(-1 * 0.5rem))`                                                    | -translateX      |
| `-translate-y-2`   | `transform: translateY(calc(-1 * 0.5rem))`                                                    | -translateY      |
| `translate-x-3`    | `transform: translateX(0.75rem)`                                                              | translateX       |
| `translate-y-3`    | `transform: translateY(0.75rem)`                                                              | translateY       |
| `-translate-x-3`   | `transform: translateX(calc(-1 * 0.75rem))`                                                   | -translateX      |
| `-translate-y-3`   | `transform: translateY(calc(-1 * 0.75rem))`                                                   | -translateY      |
| `translate-x-4`    | `transform: translateX(1rem)`                                                                 | translateX       |
| `translate-y-4`    | `transform: translateY(1rem)`                                                                 | translateY       |
| `-translate-x-4`   | `transform: translateX(calc(-1 * 1rem))`                                                      | -translateX      |
| `-translate-y-4`   | `transform: translateY(calc(-1 * 1rem))`                                                      | -translateY      |
| `translate-x-5`    | `transform: translateX(1.25rem)`                                                              | translateX       |
| `translate-y-5`    | `transform: translateY(1.25rem)`                                                              | translateY       |
| `-translate-x-5`   | `transform: translateX(calc(-1 * 1.25rem))`                                                   | -translateX      |
| `-translate-y-5`   | `transform: translateY(calc(-1 * 1.25rem))`                                                   | -translateY      |
| `translate-x-6`    | `transform: translateX(1.5rem)`                                                               | translateX       |
| `translate-y-6`    | `transform: translateY(1.5rem)`                                                               | translateY       |
| `-translate-x-6`   | `transform: translateX(calc(-1 * 1.5rem))`                                                    | -translateX      |
| `-translate-y-6`   | `transform: translateY(calc(-1 * 1.5rem))`                                                    | -translateY      |
| `translate-x-7`    | `transform: translateX(1.75rem)`                                                              | translateX       |
| `translate-y-7`    | `transform: translateY(1.75rem)`                                                              | translateY       |
| `-translate-x-7`   | `transform: translateX(calc(-1 * 1.75rem))`                                                   | -translateX      |
| `-translate-y-7`   | `transform: translateY(calc(-1 * 1.75rem))`                                                   | -translateY      |
| `translate-x-8`    | `transform: translateX(2rem)`                                                                 | translateX       |
| `translate-y-8`    | `transform: translateY(2rem)`                                                                 | translateY       |
| `-translate-x-8`   | `transform: translateX(calc(-1 * 2rem))`                                                      | -translateX      |
| `-translate-y-8`   | `transform: translateY(calc(-1 * 2rem))`                                                      | -translateY      |
| `translate-x-9`    | `transform: translateX(2.25rem)`                                                              | translateX       |
| `translate-y-9`    | `transform: translateY(2.25rem)`                                                              | translateY       |
| `-translate-x-9`   | `transform: translateX(calc(-1 * 2.25rem))`                                                   | -translateX      |
| `-translate-y-9`   | `transform: translateY(calc(-1 * 2.25rem))`                                                   | -translateY      |
| `translate-x-10`   | `transform: translateX(2.5rem)`                                                               | translateX       |
| `translate-y-10`   | `transform: translateY(2.5rem)`                                                               | translateY       |
| `-translate-x-10`  | `transform: translateX(calc(-1 * 2.5rem))`                                                    | -translateX      |
| `-translate-y-10`  | `transform: translateY(calc(-1 * 2.5rem))`                                                    | -translateY      |
| `translate-x-11`   | `transform: translateX(2.75rem)`                                                              | translateX       |
| `translate-y-11`   | `transform: translateY(2.75rem)`                                                              | translateY       |
| `-translate-x-11`  | `transform: translateX(calc(-1 * 2.75rem))`                                                   | -translateX      |
| `-translate-y-11`  | `transform: translateY(calc(-1 * 2.75rem))`                                                   | -translateY      |
| `translate-x-12`   | `transform: translateX(3rem)`                                                                 | translateX       |
| `translate-y-12`   | `transform: translateY(3rem)`                                                                 | translateY       |
| `-translate-x-12`  | `transform: translateX(calc(-1 * 3rem))`                                                      | -translateX      |
| `-translate-y-12`  | `transform: translateY(calc(-1 * 3rem))`                                                      | -translateY      |
| `translate-x-14`   | `transform: translateX(3.5rem)`                                                               | translateX       |
| `translate-y-14`   | `transform: translateY(3.5rem)`                                                               | translateY       |
| `-translate-x-14`  | `transform: translateX(calc(-1 * 3.5rem))`                                                    | -translateX      |
| `-translate-y-14`  | `transform: translateY(calc(-1 * 3.5rem))`                                                    | -translateY      |
| `translate-x-16`   | `transform: translateX(4rem)`                                                                 | translateX       |
| `translate-y-16`   | `transform: translateY(4rem)`                                                                 | translateY       |
| `-translate-x-16`  | `transform: translateX(calc(-1 * 4rem))`                                                      | -translateX      |
| `-translate-y-16`  | `transform: translateY(calc(-1 * 4rem))`                                                      | -translateY      |
| `translate-x-20`   | `transform: translateX(5rem)`                                                                 | translateX       |
| `translate-y-20`   | `transform: translateY(5rem)`                                                                 | translateY       |
| `-translate-x-20`  | `transform: translateX(calc(-1 * 5rem))`                                                      | -translateX      |
| `-translate-y-20`  | `transform: translateY(calc(-1 * 5rem))`                                                      | -translateY      |
| `translate-x-24`   | `transform: translateX(6rem)`                                                                 | translateX       |
| `translate-y-24`   | `transform: translateY(6rem)`                                                                 | translateY       |
| `-translate-x-24`  | `transform: translateX(calc(-1 * 6rem))`                                                      | -translateX      |
| `-translate-y-24`  | `transform: translateY(calc(-1 * 6rem))`                                                      | -translateY      |
| `translate-x-28`   | `transform: translateX(7rem)`                                                                 | translateX       |
| `translate-y-28`   | `transform: translateY(7rem)`                                                                 | translateY       |
| `-translate-x-28`  | `transform: translateX(calc(-1 * 7rem))`                                                      | -translateX      |
| `-translate-y-28`  | `transform: translateY(calc(-1 * 7rem))`                                                      | -translateY      |
| `translate-x-32`   | `transform: translateX(8rem)`                                                                 | translateX       |
| `translate-y-32`   | `transform: translateY(8rem)`                                                                 | translateY       |
| `-translate-x-32`  | `transform: translateX(calc(-1 * 8rem))`                                                      | -translateX      |
| `-translate-y-32`  | `transform: translateY(calc(-1 * 8rem))`                                                      | -translateY      |
| `translate-x-36`   | `transform: translateX(9rem)`                                                                 | translateX       |
| `translate-y-36`   | `transform: translateY(9rem)`                                                                 | translateY       |
| `-translate-x-36`  | `transform: translateX(calc(-1 * 9rem))`                                                      | -translateX      |
| `-translate-y-36`  | `transform: translateY(calc(-1 * 9rem))`                                                      | -translateY      |
| `translate-x-40`   | `transform: translateX(10rem)`                                                                | translateX       |
| `translate-y-40`   | `transform: translateY(10rem)`                                                                | translateY       |
| `-translate-x-40`  | `transform: translateX(calc(-1 * 10rem))`                                                     | -translateX      |
| `-translate-y-40`  | `transform: translateY(calc(-1 * 10rem))`                                                     | -translateY      |
| `translate-x-44`   | `transform: translateX(11rem)`                                                                | translateX       |
| `translate-y-44`   | `transform: translateY(11rem)`                                                                | translateY       |
| `-translate-x-44`  | `transform: translateX(calc(-1 * 11rem))`                                                     | -translateX      |
| `-translate-y-44`  | `transform: translateY(calc(-1 * 11rem))`                                                     | -translateY      |
| `translate-x-48`   | `transform: translateX(12rem)`                                                                | translateX       |
| `translate-y-48`   | `transform: translateY(12rem)`                                                                | translateY       |
| `-translate-x-48`  | `transform: translateX(calc(-1 * 12rem))`                                                     | -translateX      |
| `-translate-y-48`  | `transform: translateY(calc(-1 * 12rem))`                                                     | -translateY      |
| `translate-x-56`   | `transform: translateX(14rem)`                                                                | translateX       |
| `translate-y-56`   | `transform: translateY(14rem)`                                                                | translateY       |
| `-translate-x-56`  | `transform: translateX(calc(-1 * 14rem))`                                                     | -translateX      |
| `-translate-y-56`  | `transform: translateY(calc(-1 * 14rem))`                                                     | -translateY      |
| `translate-x-64`   | `transform: translateX(16rem)`                                                                | translateX       |
| `translate-y-64`   | `transform: translateY(16rem)`                                                                | translateY       |
| `-translate-x-64`  | `transform: translateX(calc(-1 * 16rem))`                                                     | -translateX      |
| `-translate-y-64`  | `transform: translateY(calc(-1 * 16rem))`                                                     | -translateY      |
| `translate-x-72`   | `transform: translateX(18rem)`                                                                | translateX       |
| `translate-y-72`   | `transform: translateY(18rem)`                                                                | translateY       |
| `-translate-x-72`  | `transform: translateX(calc(-1 * 18rem))`                                                     | -translateX      |
| `-translate-y-72`  | `transform: translateY(calc(-1 * 18rem))`                                                     | -translateY      |
| `translate-x-80`   | `transform: translateX(20rem)`                                                                | translateX       |
| `translate-y-80`   | `transform: translateY(20rem)`                                                                | translateY       |
| `-translate-x-80`  | `transform: translateX(calc(-1 * 20rem))`                                                     | -translateX      |
| `-translate-y-80`  | `transform: translateY(calc(-1 * 20rem))`                                                     | -translateY      |
| `translate-x-96`   | `transform: translateX(24rem)`                                                                | translateX       |
| `translate-y-96`   | `transform: translateY(24rem)`                                                                | translateY       |
| `-translate-x-96`  | `transform: translateX(calc(-1 * 24rem))`                                                     | -translateX      |
| `-translate-y-96`  | `transform: translateY(calc(-1 * 24rem))`                                                     | -translateY      |
| `translate-x-px`   | `transform: translateX(1px)`                                                                  | translateX       |
| `translate-y-px`   | `transform: translateY(1px)`                                                                  | translateY       |
| `-translate-x-px`  | `transform: translateX(calc(-1 * 1px))`                                                       | -translateX      |
| `-translate-y-px`  | `transform: translateY(calc(-1 * 1px))`                                                       | -translateY      |
| `translate-x-0.5`  | `transform: translateX(0.125rem)`                                                             | translateX       |
| `translate-y-0.5`  | `transform: translateY(0.125rem)`                                                             | translateY       |
| `-translate-x-0.5` | `transform: translateX(calc(-1 * 0.125rem))`                                                  | -translateX      |
| `-translate-y-0.5` | `transform: translateY(calc(-1 * 0.125rem))`                                                  | -translateY      |
| `translate-x-1.5`  | `transform: translateX(0.375rem)`                                                             | translateX       |
| `translate-y-1.5`  | `transform: translateY(0.375rem)`                                                             | translateY       |
| `-translate-x-1.5` | `transform: translateX(calc(-1 * 0.375rem))`                                                  | -translateX      |
| `-translate-y-1.5` | `transform: translateY(calc(-1 * 0.375rem))`                                                  | -translateY      |
| `translate-x-2.5`  | `transform: translateX(0.625rem)`                                                             | translateX       |
| `translate-y-2.5`  | `transform: translateY(0.625rem)`                                                             | translateY       |
| `-translate-x-2.5` | `transform: translateX(calc(-1 * 0.625rem))`                                                  | -translateX      |
| `-translate-y-2.5` | `transform: translateY(calc(-1 * 0.625rem))`                                                  | -translateY      |
| `translate-x-3.5`  | `transform: translateX(0.875rem)`                                                             | translateX       |
| `translate-y-3.5`  | `transform: translateY(0.875rem)`                                                             | translateY       |
| `-translate-x-3.5` | `transform: translateX(calc(-1 * 0.875rem))`                                                  | -translateX      |
| `-translate-y-3.5` | `transform: translateY(calc(-1 * 0.875rem))`                                                  | -translateY      |
| `transform`        | `transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))` | enable transform |
| `transform-gpu`    | `transform: translate3d(var(--tw-translate-x), var(--tw-translate-y), 0)`                     | GPU transform    |
| `transform-none`   | `transform: none`                                                                             | no transform     |

---

## Responsive & state variants

Every utility above accepts a responsive prefix (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) and — in JIT mode — a state variant (`hover:`, `focus:`, `active:`, `disabled:`, `dark:`, `group-hover:`, `peer-focus:`, …). See [Variants](../VARIANTS.md) and [Responsive](../RESPONSIVE.md).


<!-- ===== docs/utilities/11-transitions-animations.md (#docs-utilities-11-transitions-animations-md) ===== -->

---
title: Transition & Animation Utilities
---

# Transition & Animation Utilities

> Part of the [Nakshora Utilities Reference](../UTILITIES.md). These tables are **generated from the framework source** — what you see here is exactly what the compiler emits.

Transition properties, durations, easings and built-in keyframe animations. All built-in keyframes: `spin` `ping` `pulse` `bounce` `fade` `slide` `shimmer`. In JIT mode, keyframes are emitted only for animations actually used.

## Transitions

**21 utilities**

| Class                  | CSS                                                                                                                                                                                                                                          | Description                                                        |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `transition`           | `transitionProperty: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; transitionTimingFunction: cubic-bezier(0.4, 0, 0.2, 1); transitionDuration: 150ms` | standard transition set                                            |
| `transition-all`       | `transitionProperty: all; transitionTimingFunction: cubic-bezier(0.4, 0, 0.2, 1); transitionDuration: 150ms`                                                                                                                                 | transition: all                                                    |
| `transition-none`      | `transitionProperty: none`                                                                                                                                                                                                                   | no transition                                                      |
| `transition-colors`    | `transitionProperty: color, background-color, border-color, text-decoration-color, fill, stroke; transitionTimingFunction: cubic-bezier(0.4, 0, 0.2, 1); transitionDuration: 150ms`                                                          | color transitions                                                  |
| `transition-opacity`   | `transitionProperty: opacity; transitionTimingFunction: cubic-bezier(0.4, 0, 0.2, 1); transitionDuration: 150ms`                                                                                                                             | opacity transitions                                                |
| `transition-shadow`    | `transitionProperty: box-shadow; transitionTimingFunction: cubic-bezier(0.4, 0, 0.2, 1); transitionDuration: 150ms`                                                                                                                          | box-shadow transitions                                             |
| `transition-transform` | `transitionProperty: transform; transitionTimingFunction: cubic-bezier(0.4, 0, 0.2, 1); transitionDuration: 150ms`                                                                                                                           | transform transitions                                              |
| `duration-0`           | `transitionDuration: 0ms`                                                                                                                                                                                                                    | transition-duration: 0ms                                           |
| `duration-75`          | `transitionDuration: 75ms`                                                                                                                                                                                                                   | transition-duration: 75ms                                          |
| `duration-100`         | `transitionDuration: 100ms`                                                                                                                                                                                                                  | transition-duration: 100ms                                         |
| `duration-150`         | `transitionDuration: 150ms`                                                                                                                                                                                                                  | transition-duration: 150ms                                         |
| `duration-200`         | `transitionDuration: 200ms`                                                                                                                                                                                                                  | transition-duration: 200ms                                         |
| `duration-300`         | `transitionDuration: 300ms`                                                                                                                                                                                                                  | transition-duration: 300ms                                         |
| `duration-500`         | `transitionDuration: 500ms`                                                                                                                                                                                                                  | transition-duration: 500ms                                         |
| `duration-700`         | `transitionDuration: 700ms`                                                                                                                                                                                                                  | transition-duration: 700ms                                         |
| `duration-1000`        | `transitionDuration: 1000ms`                                                                                                                                                                                                                 | transition-duration: 1000ms                                        |
| `ease-linear`          | `transition-timing-function: linear`                                                                                                                                                                                                         | transition-timing-function: linear                                 |
| `ease-in`              | `transition-timing-function: cubic-bezier(0.4, 0, 1, 1)`                                                                                                                                                                                     | transition-timing-function: cubic-bezier(0.4, 0, 1, 1)             |
| `ease-out`             | `transition-timing-function: cubic-bezier(0, 0, 0.2, 1)`                                                                                                                                                                                     | transition-timing-function: cubic-bezier(0, 0, 0.2, 1)             |
| `ease-in-out`          | `transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)`                                                                                                                                                                                   | transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)           |
| `ease-back`            | `transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55)`                                                                                                                                                                         | transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55) |

## Animations

**10 utilities**

| Class               | CSS                                                         | Description                                               |
| ------------------- | ----------------------------------------------------------- | --------------------------------------------------------- |
| `animate-spin`      | `animation: spin 1s linear infinite`                        | animation: spin 1s linear infinite                        |
| `animate-ping`      | `animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite`    | animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite    |
| `animate-pulse`     | `animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite` | animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite |
| `animate-bounce`    | `animation: bounce 1s infinite`                             | animation: bounce 1s infinite                             |
| `animate-fade`      | `animation: fade 300ms ease-out`                            | animation: fade 300ms ease-out                            |
| `animate-slide`     | `animation: slide 300ms ease-out`                           | animation: slide 300ms ease-out                           |
| `animate-shimmer`   | `animation: shimmer 1.5s linear infinite`                   | animation: shimmer 1.5s linear infinite                   |
| `animate-none`      | `animation: none`                                           | no animation                                              |
| `animation-paused`  | `animation-play-state: paused`                              | animation-play-state: paused                              |
| `animation-running` | `animation-play-state: running`                             | animation-play-state: running                             |

---

## Responsive & state variants

Every utility above accepts a responsive prefix (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) and — in JIT mode — a state variant (`hover:`, `focus:`, `active:`, `disabled:`, `dark:`, `group-hover:`, `peer-focus:`, …). See [Variants](../VARIANTS.md) and [Responsive](../RESPONSIVE.md).


<!-- ===== docs/utilities/12-misc.md (#docs-utilities-12-misc-md) ===== -->

---
title: Cursor, Whitespace & Misc Utilities
---

# Cursor, Whitespace & Misc Utilities

> Part of the [Nakshora Utilities Reference](../UTILITIES.md). These tables are **generated from the framework source** — what you see here is exactly what the compiler emits.

Cursors, white-space, floats, clearing, lists, resize and user-select.

## Cursors

**10 utilities**

| Class                | CSS                   | Description         |
| -------------------- | --------------------- | ------------------- |
| `cursor-default`     | `cursor: default`     | cursor: default     |
| `cursor-pointer`     | `cursor: pointer`     | cursor: pointer     |
| `cursor-wait`        | `cursor: wait`        | cursor: wait        |
| `cursor-text`        | `cursor: text`        | cursor: text        |
| `cursor-move`        | `cursor: move`        | cursor: move        |
| `cursor-help`        | `cursor: help`        | cursor: help        |
| `cursor-not-allowed` | `cursor: not-allowed` | cursor: not-allowed |
| `cursor-resize`      | `cursor: resize`      | cursor: resize      |
| `cursor-zoom-in`     | `cursor: zoom-in`     | cursor: zoom-in     |
| `cursor-zoom-out`    | `cursor: zoom-out`    | cursor: zoom-out    |

## Whitespace & Misc

**24 utilities**

| Class                 | CSS                                       | Description               |
| --------------------- | ----------------------------------------- | ------------------------- |
| `whitespace-normal`   | `whiteSpace: normal`                      | white-space: normal       |
| `whitespace-nowrap`   | `whiteSpace: nowrap`                      | white-space: nowrap       |
| `whitespace-pre`      | `whiteSpace: pre`                         | white-space: pre          |
| `whitespace-pre-line` | `whiteSpace: pre-line`                    | white-space: pre-line     |
| `whitespace-pre-wrap` | `whiteSpace: pre-wrap`                    | white-space: pre-wrap     |
| `break-spaces`        | `whiteSpace: break-spaces`                | white-space: break-spaces |
| `float-left`          | `float: left`                             | float: left               |
| `float-right`         | `float: right`                            | float: right              |
| `float-none`          | `float: none`                             | float: none               |
| `clear-left`          | `clear: left`                             | clear: left               |
| `clear-right`         | `clear: right`                            | clear: right              |
| `clear-both`          | `clear: both`                             | clear: both               |
| `list-none`           | `listStyleType: none`                     | list-style: none          |
| `list-disc`           | `listStyleType: disc`                     | list-style: disc          |
| `list-decimal`        | `listStyleType: decimal`                  | list-style: decimal       |
| `list-none`           | `list-style: none; list-style-type: none` | remove list styling       |
| `resize-none`         | `resize: none`                            | resize: none              |
| `resize-visible`      | `resize: visible`                         | resize: visible           |
| `resize-collapse`     | `resize: collapse`                        | resize: collapse          |
| `resize-hidden`       | `resize: hidden`                          | resize: hidden            |
| `resize-scroll`       | `resize: scroll`                          | resize: scroll            |
| `select-none`         | `userSelect: none`                        | user-select: none         |
| `select-text`         | `userSelect: text`                        | user-select: text         |
| `select-all`          | `userSelect: all`                         | user-select: all          |

---

## Responsive & state variants

Every utility above accepts a responsive prefix (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) and — in JIT mode — a state variant (`hover:`, `focus:`, `active:`, `disabled:`, `dark:`, `group-hover:`, `peer-focus:`, …). See [Variants](../VARIANTS.md) and [Responsive](../RESPONSIVE.md).


<!-- ===== docs/utilities/13-components.md (#docs-utilities-13-components-md) ===== -->

---
title: Design Components
---

# Design Components (Paradigms)

Nakshora ships first-class **design-paradigm components**: glassmorphism, neon
cyber, brutalism, minimalism and skeleton loaders. They are always included in
every build (they are small) and work in both full and JIT mode.

## Glassmorphism

Frosted-glass surfaces with backdrop blur.

```html
<div class="glass p-8">
  <!-- standard glass -->
  <h3>Glass card</h3>
</div>

<div class="glass-light p-8">
  <!-- lighter, for light backgrounds -->
  <h3>Light glass</h3>
</div>

<div class="glass-dark p-8">
  <!-- dark tint, for dark backgrounds -->
  <h3>Dark glass</h3>
</div>
```

| Class          | Effect                                                                                  |
| -------------- | --------------------------------------------------------------------------------------- |
| `.glass`       | translucent white, `backdrop-filter: blur(12px) saturate(140%)`, subtle border + shadow |
| `.glass-light` | stronger light tint, best over photography                                              |
| `.glass-dark`  | slate tint, best over dark backgrounds                                                  |

> Combine with utilities freely: `class="glass p-6 rounded-xl"`.

## Neon Cyber

High-saturation, glowing UI for dark backgrounds.

```html
<div class="neon-card p-6 text-center">
  <p class="neon-text text-lg font-bold">SYSTEM ONLINE</p>
  <button class="neon-btn mt-4">Engage</button>
</div>
```

| Class        | Effect                                                     |
| ------------ | ---------------------------------------------------------- |
| `.neon-card` | navy card with cyan glow border; glow intensifies on hover |
| `.neon-btn`  | cyan→pink gradient button with neon glow, lifts on hover   |
| `.neon-glow` | adds a cyan glow shadow to any element                     |
| `.neon-text` | cyan text with layered text-shadow glow                    |

## Brutalism

Raw, high-contrast, zero ornamentation.

```html
<div class="brutalist-card p-6">
  <h3 class="font-black uppercase">No frills</h3>
  <button class="brutalist-btn mt-4">SMASH</button>
</div>
```

| Class             | Effect                                                             |
| ----------------- | ------------------------------------------------------------------ |
| `.brutalist-card` | white card, 3px black border, hard offset shadow; shifts on hover  |
| `.brutalist-btn`  | yellow block button, hard shadow, uppercase; presses down on click |

## Minimalist

Quiet, professional surfaces.

```html
<div class="minimalist-card p-6">
  <h3 class="text-lg font-semibold">Simple</h3>
  <button class="minimalist-btn mt-4">Continue</button>
</div>
```

| Class              | Effect                                           |
| ------------------ | ------------------------------------------------ |
| `.minimalist-card` | white card, hairline border, barely-there shadow |
| `.minimalist-btn`  | dark pill button, inverts on hover               |

## Skeletons (loading states)

Shimmer placeholders while content loads.

```html
<div class="flex items-center gap-4 p-4">
  <div class="skeleton-circle w-12 h-12 shrink-0"></div>
  <div class="flex-1 space-y-2">
    <div class="skeleton-text w-3/4"></div>
    <div class="skeleton-text w-1/2"></div>
  </div>
</div>
```

| Class              | Effect                                                     |
| ------------------ | ---------------------------------------------------------- |
| `.skeleton-rect`   | rounded rectangle shimmer (set `w-*`/`h-*` on the element) |
| `.skeleton-circle` | circular shimmer (avatars)                                 |
| `.skeleton-text`   | text-line shimmer (`height: 1em`)                          |

## Helpers

| Class                 | Effect                                                   |
| --------------------- | -------------------------------------------------------- |
| `.hover-lift`         | lifts the element 4px with a shadow on hover             |
| `.gradient-text`      | blue→purple→pink gradient text (`background-clip: text`) |
| `.gradient-neon`      | dark navy diagonal gradient background                   |
| `.gradient-pastel`    | soft pink→blue→green gradient background                 |
| `.gradient-nature`    | deep forest gradient background                          |
| `.gradient-brutalist` | yellow→red gradient background                           |

## Extending with plugins

Add your own components through the plugin API — they are emitted right after
the built-in set:

```js
// nakshora.config.js
export default {
  plugins: [
    {
      name: 'my-components',
      handler(api) {
        api.addComponents({
          '.price-tag': {
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            background: '#fef3c7',
            color: '#92400e',
            borderRadius: '9999px',
            fontWeight: '600',
          },
        });
      },
    },
  ],
};
```

See [API — Plugins](../API.md#plugins).


<!-- ===== docs/VARIANTS.md (#docs-variants-md) ===== -->

# Variants

Variants apply utilities in specific states or contexts.
**State variants are emitted by the JIT compiler** — configure `content`
(see [JIT](./JIT.md)) so the compiler can see your class names.

## State variants

| Prefix           | CSS generated                     | When it applies                   |
| ---------------- | --------------------------------- | --------------------------------- |
| `hover:`         | `.hover\:x:hover`                 | pointer is over the element       |
| `focus:`         | `.focus\:x:focus`                 | element has focus                 |
| `focus-visible:` | `.focus-visible\:x:focus-visible` | keyboard focus                    |
| `focus-within:`  | `.focus-within\:x:focus-within`   | element or a descendant has focus |
| `active:`        | `.active\:x:active`               | element is pressed/active         |
| `visited:`       | `.visited\:x:visited`             | link was visited                  |
| `disabled:`      | `.disabled\:x:disabled`           | element is disabled               |
| `first:`         | `.first\:x:first-child`           | first child                       |
| `last:`          | `.last\:x:last-child`             | last child                        |

## Group variants (parent → child)

Add `group` to the parent, then target children:

```html
<a class="group flex items-center gap-2">
  <span class="text-slate-700">Docs</span>
  <span class="opacity-0 group-hover:opacity-100 transition">→</span>
</a>
```

| Prefix         | CSS generated                  |
| -------------- | ------------------------------ |
| `group-hover:` | `.group:hover .group-hover\:x` |
| `group-focus:` | `.group:focus .group-focus\:x` |

## Peer variants (sibling → sibling)

Add `peer` to the earlier sibling, then target later siblings:

```html
<div class="space-y-2">
  <input type="checkbox" id="t" class="peer" />
  <label for="t" class="peer-checked-visible"> </label>
  <span class="hidden peer-focus:inline">focus ring label</span>
</div>
```

| Prefix        | CSS generated                  |
| ------------- | ------------------------------ |
| `peer-hover:` | `.peer:hover ~ .peer-hover\:x` |
| `peer-focus:` | `.peer:focus ~ .peer-focus\:x` |

## Dark mode

Class-based: add `dark` to any ancestor (convention: `<html class="dark">`).

```html
<div class="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">…</div>
```

CSS generated: `.dark .dark\:bg-slate-900 { background-color: #0f172a; }`

## Responsive + state (JIT)

One responsive prefix + one state prefix can be combined, in either order:

```html
<button class="bg-blue-500 hover:bg-blue-600 md:hover:bg-indigo-600">…</button>
```

```css
@media (min-width: 768px) {
  .md\:hover\:bg-indigo-600:hover {
    background-color: #4f46e5;
  }
}
```

## Escaping in HTML

In plain HTML the colon is written literally — nothing to escape:

```html
<button class="hover:bg-blue-600">…</button>
```

In **JSX/TSX** you escape it:

```tsx
<button className="hover\\:bg-blue-600">…</button>
```

In CSS files (e.g. safelist strings inside CSS) the escaped form
`hover\:bg-blue-600` is also recognized by the JIT extractor.

## Disabling variants

```js
// nakshora.config.js
export default {
  variants: {
    visited: false, // never emit visited:
    focusWithin: false,
    dark: false, // or disable dark mode entirely
  },
};
```


<!-- ===== docs/RESPONSIVE.md (#docs-responsive-md) ===== -->

# Responsive Design

Nakshora is **mobile-first**: base styles apply to all viewports; breakpoint
prefixes override as the viewport grows.

## Default breakpoints

| Prefix   | Min-width | Typical devices                   |
| -------- | --------- | --------------------------------- |
| _(none)_ | 0         | phones (portrait)                 |
| `sm:`    | 640px     | large phones / small tablets      |
| `md:`    | 768px     | tablets                           |
| `lg:`    | 1024px    | landscape tablets / small laptops |
| `xl:`    | 1280px    | laptops                           |
| `2xl:`   | 1536px    | desktops                          |

```html
<div class="text-base sm:text-lg md:text-xl">Grows with the viewport</div>
```

```css
.text-base {
  font-size: 1rem;
}
@media (min-width: 640px) {
  .sm\:text-lg {
    font-size: 1.125rem;
  }
}
@media (min-width: 768px) {
  .md\:text-xl {
    font-size: 1.25rem;
  }
}
```

## Pattern: scale a grid

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">…</div>
```

## Pattern: show/hide per breakpoint

```html
<span class="block sm:hidden">📱 mobile only</span>
<span class="hidden md:inline">🖥️ desktop only</span>
```

## Responsive + state variants (JIT)

```html
<div class="md:hover:scale-105 transition">…</div>
```

```css
@media (min-width: 768px) {
  .md\:hover\:scale-105:hover {
    transform: scale(1.05);
  }
}
```

## Custom breakpoints

```js
// nakshora.config.js
export default {
  theme: {
    breakpoints: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
      '4k': 2160, // ← your own breakpoint → 4k: prefix
    },
  },
};
```

```html
<div class="4k:text-5xl">4K displays get bigger type</div>
```

All breakpoints except `0` participate in responsive generation; they are
sorted ascending and emitted as `@media (min-width: Npx)` blocks.

## Disabling responsive generation

```js
variants: {
  responsive: false;
}
```


<!-- ===== docs/CONFIGURATION.md (#docs-configuration-md) ===== -->

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
  theme: {}, // theme overrides (deep-merged)
  variants: {}, // variant toggles
  corePlugins: {}, // group toggles
  important: false, // true | '#scope'
  plugins: [], // Plugin objects
  extractorPattern: undefined, // custom class-extractor regex
};
```

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

| Section                    | Default keys                                       | Notes                                                                   |
| -------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------- |
| `colors`                   | 22 palettes × shades 50–950                        | `brand: {500: '#hex'}` or `blue: {500: '#hex'}` (single-shade override) |
| `spacing`                  | `0 px 0.5 1 … 96`                                  | key → CSS length                                                        |
| `typography.fontSize`      | `xs sm base lg xl 2xl 3xl 4xl 5xl 6xl 7xl 8xl 9xl` | value or `[size, lineHeight]`                                           |
| `typography.fontWeight`    | `thin … black`                                     | 100–900                                                                 |
| `typography.lineHeight`    | `none tight snug base relaxed loose`               |                                                                         |
| `typography.letterSpacing` | `tighter tight normal wide wider widest`           |                                                                         |
| `fontFamily`               | `sans, mono`                                       |                                                                         |
| `breakpoints`              | `xs:0 sm:640 md:768 lg:1024 xl:1280 2xl:1536`      | px; add your own (`wide: 1800`)                                         |
| `shadows`                  | `none sm base md lg xl 2xl inner glow`             |                                                                         |
| `borderRadius`             | `none xs sm md lg xl 2xl 3xl full`                 |                                                                         |
| `zIndex`                   | `auto hide 0 10 20 30 40 50`                       |                                                                         |
| `opacity`                  | `0 5 10 20 … 100`                                  |                                                                         |
| `duration`                 | `0 75 100 150 200 300 500 700 1000`                | ms                                                                      |
| `easing`                   | `linear in out in-out back`                        |                                                                         |
| `animation`                | `spin ping pulse bounce fade slide shimmer`        | name → shorthand                                                        |
| `keyframes`                | matches the animation names                        | name → keyframe body                                                    |

```js
theme: {
  colors: { brand: { 500: '#6d28d9' } },
  breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536, wide: 1800 },
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
peer, peerHover, peerFocus, dark, responsive
```

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


<!-- ===== docs/JIT.md (#docs-jit-md) ===== -->

# JIT Compiler

Nakshora 3 compiles your CSS on demand. Two build modes:

| Mode     | What's emitted                                                                                                                    | When                                    |
| -------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| **full** | base + variables + keyframes + **all** utilities + responsive variants + components                                               | default when no `content` is configured |
| **jit**  | base + variables + used keyframes + **only the classes found in your content** (incl. state variants & combinations) + components | `content` configured, or `--mode jit`   |

Measured on this machine (22 palettes, 3,091 utilities):

| Build                   | Raw     | Minified | Time   |
| ----------------------- | ------- | -------- | ------ |
| full                    | ~860 KB | ~740 KB  | ~18 ms |
| JIT (200 lines of HTML) | ~17 KB  | ~15 KB   | ~4 ms  |

## How JIT works

1. **Scan** — content sources (glob → file → raw string) are read.
2. **Extract** — every class-like token is pulled with a regex
   (default `[[\w\\:/.-]+`, configurable via `extractorPattern`).
   Escaped colons (`hover\:x` in HTML/CSS) are unescaped.
3. **Match** — each token is split into variant prefixes + base class
   (`md:hover:bg-blue-600` → `[md, hover]` + `bg-blue-600`). Tokens whose base
   class exists in the catalog and whose prefixes are known variants are
   compiled; unknown tokens are silently dropped.
4. **Emit** — base rules first, then `@media` blocks (sorted by min-width),
   then components.

## Content sources

```js
content: [
  './src/**/*.{html,js,ts,jsx,tsx,vue,svelte}', // globs → files read
  'templates/**/*.md', // any file
  '<div class="dynamic-name">x</div>', // raw strings (kept as-is)
];
```

## Safelist

Classes you can't express statically (built at runtime) must be safelisted —
the compiler can't see them:

```js
safelist: ['md:grid-cols-2', 'md:grid-cols-3', 'hover:bg-brand-500'],
```

Tip: if you build class names dynamically, prefer an explicit map:

```js
const cols = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3' };
// safelist: Object.values(cols)
```

## Legacy `purge`

Tailwind-compatible `purge: [...]` works as an alias of `content`
(`content` wins when both are set).

## Minification

- `minify: true` (CLI `--minify`, plugin option) → whitespace/comment
  minifier, applied to the whole result.
- Bundlers (Vite/webpack/Next) minify in production by default.

## Sizes

Full-build size is dominated by the color matrix (22 palettes × 11 shades ×
6 utilities × 6 responsive slots). You can shrink it:

```js
corePlugins: { gradients: false, filters: false, whitespace: false },
variants: { visited: false, focusWithin: false },
```

But for end-user projects **JIT is the recommended mode** — output scales
with your actual markup (typically a few KB).

## What JIT guarantees

- Every emitted rule is 1:1 with a real utility (no dead CSS)
- State variants work with any base utility
- Responsive + state combinations (`md:hover:x`) work
- Keyframes are emitted only for animations you actually use
- Deterministic output (same content → same bytes)


<!-- ===== docs/THEMES.md (#docs-themes-md) ===== -->

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


<!-- ===== docs/CLI.md (#docs-cli-md) ===== -->

# CLI Reference

`@nakshora/cli` provides the `nakshora` binary.

```bash
npm install -D @nakshora/cli
npx nakshora --help
```

## Commands

### `nakshora init`

Scaffold `nakshora.config.js` + `nakshora.css` in the current directory.

```bash
nakshora init            # JavaScript config
nakshora init --json     # JSON config
nakshora init --force    # overwrite existing files
```

### `nakshora build [input]`

Compile CSS.

```bash
nakshora build                          # full build → stdout
nakshora build nakshora.css             # process an input file with @nakshora at-rules
nakshora build nakshora.css -o dist/nakshora.css
nakshora build nakshora.css -o dist/nakshora.min.css --minify
nakshora build --mode full              # force full build
nakshora build --mode jit               # force JIT (requires content)
nakshora build --watch                  # rebuild on change
nakshora build -c path/to/config.js     # explicit config
```

| Flag                  | Description                                                               |
| --------------------- | ------------------------------------------------------------------------- |
| `input`               | Optional CSS file containing `@nakshora source;` / `@nakshora utilities;` |
| `-o, --output <file>` | Write to file (default: stdout)                                           |
| `-m, --minify`        | Minify output                                                             |
| `--mode <full\|jit>`  | Force the build mode (default: JIT when content is configured)            |
| `-c, --config <path>` | Explicit config file                                                      |
| `--watch`             | Rebuild on change                                                         |

**Build mode selection:**

1. `--mode` wins when provided
2. `content` (or legacy `purge`) configured → **JIT** (only used classes,
   including all state variants)
3. otherwise → **full** (all base + responsive utilities + components)

### `nakshora dev [input]`

Alias for `build --watch` — development mode with the same flags (minus
`--watch`).

### `nakshora inspect`

Print the full generated CSS to stdout (handy for debugging what the config
produces).

```bash
nakshora inspect | grep -m1 "flex"
nakshora inspect | wc -c
```

### `nakshora export:ai`

Export the **AI/LLM training corpus** (structured data about every utility).

```bash
nakshora export:ai                              # → ai/corpus.json
nakshora export:ai -f jsonl                     # → ai/corpus.jsonl (SFT dataset)
nakshora export:ai -f jsonl --limit 800 -o ai/sft-train.jsonl
nakshora export:ai -c path/to/config.js         # corpus reflects your theme
```

See [AI Training](./AI_TRAINING.md).

### `nakshora --version` / `nakshora -v`

Print the version.

## Config discovery

Without `-c`, the CLI searches for the nearest config walking up from the
current directory (max 5 levels):

```
nakshora.config.ts → nakshora.config.js → nakshora.config.mjs → nakshora.config.cjs → nakshora.config.json
```

## Library usage

The build pipeline is importable without the CLI:

```js
import { runBuild, resolveConfig, resolveContent, createWatcher } from '@nakshora/cli';

const { config } = await resolveConfig();
const result = await runBuild({ config, output: 'dist/nakshora.css', minify: true });
console.log(result.classes, result.sizeBytes);
```

## Programmatic engine

The engine itself lives in `@nakshora/core`:

```js
import { CSSGenerator } from '@nakshora/core';

const generator = new CSSGenerator({
  content: ['./src/**/*.html'],
  theme: { colors: { brand: { 500: '#6d28d9' } } },
});

console.log(generator.generate({ mode: 'jit', minify: true }));
console.log(generator.generate({ mode: 'full' }));
console.log(generator.getStats());
```

Full API: [API.md](./API.md).


<!-- ===== docs/POSTCSS.md (#docs-postcss-md) ===== -->

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


<!-- ===== docs/VITE.md (#docs-vite-md) ===== -->

# Vite Plugin

`@nakshora/vite-plugin` — the smoothest Nakshora experience: virtual CSS
module, PostCSS `@nakshora` support and HMR.

## Install

```bash
npm install -D @nakshora/vite-plugin
```

(`vite ^5 || ^6` is a peer dependency.)

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


<!-- ===== docs/API.md (#docs-api-md) ===== -->

# JavaScript API Reference

Complete programmatic surface of `@nakshora/core`.

```js
import {
  CSSGenerator,
  createGenerator,
  defaultTheme,
  defaultVariants,
  defaultColors,
  mergeConfig,
  resolveThemeValue,
  applyPreset,
  deepMerge,
  buildUtilityList,
  GROUP_CATEGORIES,
  componentCss,
  componentNames,
  extractClasses,
  minifyCss,
  splitClass,
  escapeClass,
  stringifyDecls,
  classToSelector,
  formatBytes,
  byteLength,
  neonTheme,
  pastelTheme,
  brutalistTheme,
  minimalistTheme,
  natureTheme,
  buildAICorpus,
  corpusToSFT,
  STATE_VARIANTS,
  version,
  metadata,
} from '@nakshora/core';

import nakshoraDefault, { version as v } from '@nakshora/core';
// nakshoraDefault === { CSSGenerator, defaultTheme, neonTheme, version, metadata, … }
```

## `class CSSGenerator`

The JIT CSS compiler.

```js
const generator = new CSSGenerator(config?: Partial<NakshoraConfig>);
```

### `generator.generate(options?) → string`

Generate a stylesheet.

```js
generate(options?: {
  minify?: boolean,        // minify output
  mode?: 'full' | 'jit',   // 'jit' also accepts content
  content?: string | string[],
  sourceMap?: boolean,     // accepted for compat (bundler provides maps)
})
```

Mode resolution: explicit `mode` → JIT when `content` is configured → full.

### `generator.generateFromContent(content, options?) → string`

JIT-compile a raw content string/array.

### `generator.getBase() → string`

### `generator.getVariables() → string`

### `generator.getKeyframes(names?: Set<string>) → string`

### `generator.getUtilitiesFull(includeVariants = true) → string`

### `generator.getComponents() → string`

Individual layers (used by the PostCSS/Vite integrations).

### `generator.getUtilities() → UtilityRule[]`

The complete utility catalog:

```ts
interface UtilityRule {
  class: string; // 'mt-4'
  category: string; // 'spacing'
  group: string; // 'margin' (corePlugins key)
  decls: CSSProperties; // { 'margin-top': '1rem' }
  description?: string;
  variantable?: boolean;
  responsive?: boolean;
}
```

### `generator.getUtility(className) → UtilityRule | undefined`

### `generator.getStats(css?) → GenerationStats`

```ts
interface GenerationStats {
  utilities: number;
  responsiveRules: number;
  variantRules: number;
  totalRules: number;
  sizeBytes: number;
  minifiedSizeBytes: number;
}
```

### `generator.minify(css) → string`

### `generator.config: NakshoraConfig`

The resolved config (read-only).

## `createGenerator(config?) → CSSGenerator`

Convenience constructor.

## Config helpers

### `mergeConfig(base, override) → NakshoraConfig`

Deep-merges two configs (theme sections recursively; safelist/plugins
concatenate; override wins).

### `resolveThemeValue(theme, path) → string | number | null`

```js
resolveThemeValue(defaultTheme, 'colors.blue.500'); // '#3b82f6'
resolveThemeValue(defaultTheme, 'spacing.4'); // '1rem'
```

### `applyPreset(config, preset) → NakshoraConfig`

Apply a theme preset (e.g. `neonTheme`) to a config.

### `deepMerge(base, override) → T`

Recursive plain-object merge (arrays replace).

## Data

| Export                            | Description                                               |
| --------------------------------- | --------------------------------------------------------- |
| `defaultTheme`                    | full default theme (22 palettes, spacing, breakpoints, …) |
| `defaultVariants`                 | all-`true` variant map                                    |
| `defaultColors`                   | the 22 default palettes                                   |
| `buildUtilityList(theme)`         | raw catalog builder (used by the generator)               |
| `GROUP_CATEGORIES`                | group key → category label                                |
| `componentCss` / `componentNames` | the built-in component CSS blocks                         |
| `STATE_VARIANTS`                  | `VariantDef[]` — prefix, suffix, ancestor, description    |
| `version` / `metadata`            | package identity                                          |

## Presets

`neonTheme`, `pastelTheme`, `brutalistTheme`, `minimalistTheme`, `natureTheme`

```ts
interface PresetConfig {
  name: 'neon' | 'pastel' | 'brutalist' | 'minimalist' | 'nature';
  description: string;
  colors: ColorConfig;
  typography: Partial<TypographyConfig>;
  shadows?;
  borderRadius?;
  animation?;
  keyframes?;
}
```

## String utilities

| Function                                      | Purpose                                                 |
| --------------------------------------------- | ------------------------------------------------------- |
| `extractClasses(content: string[], pattern?)` | JIT class extraction (Set)                              |
| `splitClass(token)`                           | `{ prefixes: string[], base: string }`                  |
| `escapeClass(name)`                           | class → CSS-safe selector part (`hover:x` → `hover\:x`) |
| `stringifyDecls(decls, important?)`           | declarations → `a: b; c: d`                             |
| `classToSelector(name, suffix?, ancestor?)`   | full selector builder                                   |
| `minifyCss(css)`                              | whitespace/comment minifier                             |
| `byteLength(str)` / `formatBytes(n)`          | size helpers                                            |

## AI assets

### `buildAICorpus(config?, version?) → AICorpus`

Structured corpus of every utility, variant and breakpoint — for RAG or
fine-tuning.

```ts
interface AICorpus {
  framework: 'nakshora';
  version: string;
  generatedAt: string;
  description: string;
  howToUse: string[]; // system-prompt-ready guidance
  variants: { prefix; description; example }[];
  breakpoints: { name; min; example }[];
  categories: {
    id;
    name;
    utilities: [
      { class; css; description; category; example; responsiveExamples; variantExamples },
    ];
  }[];
  utilityCount: number;
}
```

### `corpusToSFT(corpus, limit = 500) → string`

JSONL for supervised fine-tuning (one `{"messages":[user, assistant]}` per line).

## Plugins

```ts
interface Plugin {
  name: string;
  config?(config: NakshoraConfig): void;
  handler?(api: UtilityGenerator): void;
}

interface UtilityGenerator {
  addUtilities(utilities: Record<string, CSSProperties>, group?: string): void;
  addComponents(components: Record<string, CSSProperties>): void;
  addBase(base: Record<string, CSSProperties>): void;
}
```

```js
const generator = new CSSGenerator({
  plugins: [
    {
      name: 'badges',
      handler(api) {
        api.addComponents({
          '.badge': {
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.125rem 0.5rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '600',
          },
        });
        api.addUtilities(
          {
            'badge-danger': { background: '#fee2e2', color: '#991b1b' },
          },
          'badges',
        );
      },
    },
  ],
});
```


<!-- ===== docs/AI_TRAINING.md (#docs-ai-training-md) ===== -->

# AI Training & LLM Integration

Teach LLMs to write Nakshora. Nakshora ships first-class, always-current
training assets — generated from the same registry the compiler uses, so
the model never learns stale class names.

## What's in the repo

| Asset                                         | Format   | Use for                                                       |
| --------------------------------------------- | -------- | ------------------------------------------------------------- |
| [`llms.txt`](../llms.txt)                     | Markdown | Concise context for chat assistants / browsing agents         |
| [`llms-full.md`](../llms-full.md)             | Markdown | Full documentation in one file (RAG chunking or long-context) |
| [`ai/corpus.json`](../ai/corpus.json)         | JSON     | Structured corpus: every utility + CSS + examples (RAG index) |
| [`ai/sft-train.jsonl`](../ai/sft-train.jsonl) | JSONL    | Supervised fine-tuning (SFT) dataset, `messages` format       |
| `ai/README.md`                                | Markdown | This guide + usage recipes                                    |

## 1. Regenerate the assets

They are derived from the built core — regenerate after theme changes:

```bash
pnpm build:core
pnpm ai:export                          # ai/corpus.json
node packages/@nakshora/cli/dist/cli.js export:ai -f jsonl --limit 800 -o ai/sft-train.jsonl
```

Or from your own project (the corpus reflects your theme):

```bash
nakshora export:ai -c nakshora.config.js -o ai/corpus.json
nakshora export:ai -c nakshora.config.js -f jsonl -o ai/sft.jsonl
```

## 2. RAG (recommended for production assistants)

Chunk `llms-full.md` (or index `ai/corpus.json` directly) in your vector
store. The corpus is pre-structured for retrieval:

```json
{
  "framework": "nakshora",
  "utilityCount": 3091,
  "categories": [
    {
      "id": "margin",
      "name": "Margin",
      "utilities": [
        {
          "class": "mt-4",
          "css": ".mt-4 { margin-top: 1rem; }",
          "description": "top margin",
          "example": "<div class=\"mt-4\">…</div>",
          "responsiveExamples": ["<div class=\"sm:mt-4\">…</div>"],
          "variantExamples": ["<div class=\"hover:mt-4\">…</div>"]
        }
      ]
    }
  ],
  "variants": [{ "prefix": "hover", "description": "applies on hover", "example": "…" }],
  "breakpoints": [{ "name": "md", "min": "768px", "example": "…" }],
  "howToUse": ["…system-prompt-ready guidance…"]
}
```

Suggested embedding granularity: one chunk per utility (topical), one chunk
per category (overview), plus the `howToUse` list as a standing system
prompt.

## 3. Fine-tuning (SFT)

`ai/sft-train.jsonl` is OpenAI/LLaMA-Factory-compatible:

````json
{
  "messages": [
    {
      "role": "user",
      "content": "In Nakshora CSS, how do I add top margin of 1rem to an element?"
    },
    {
      "role": "assistant",
      "content": "Use the `mt-4` class. It generates:\n```css\n.mt-4 { margin-top: 1rem; }\n```\nExample:\n```html\n<div class=\"mt-4\">…</div>\n```"
    }
  ]
}
````

Generate a larger/custom set:

```bash
nakshora export:ai -f jsonl --limit 3000 -o sft/nakshora.jsonl
```

Tips:

- Mix the SFT examples with your own app's components for style alignment.
- The assistant answers always include the generated CSS + an HTML example,
  which anchors factual accuracy during training.

## 4. System prompt (zero-training integration)

Drop the `howToUse` guidance + `llms.txt` into any assistant's system
prompt. Ready-made starter:

```text
You write frontend code using Nakshora, a utility-first CSS framework with a
JIT compiler. Rules:
1. Prefer Nakshora utility classes over custom CSS when a class exists.
2. Mobile-first: base styles for phones, then sm:/md:/lg:/xl:/2xl: prefixes.
3. State variants: hover:, focus:, active:, disabled:, dark:, group-hover:,
   peer-focus: (JIT mode compiles them from your source).
4. Colors: <util>-<palette>-<shade> e.g. text-blue-500, bg-slate-900.
5. Spacing keys: 0 px 0.5 1 1.5 2 2.5 3 3.5 4 5 6 7 8 9 10 11 12 14 16 20 24
   28 32 36 40 44 48 56 64 72 80 96 (rem scale).
6. Design components: .glass .glass-light .glass-dark .neon-card .neon-btn
   .neon-glow .neon-text .brutalist-card .brutalist-btn .minimalist-card
   .minimalist-btn .skeleton-rect .skeleton-circle .skeleton-text .hover-lift
   .gradient-text .gradient-neon .gradient-pastel .gradient-nature
   .gradient-brutalist
7. Dark mode: class="dark" on <html>, use dark: variants.
8. If unsure a class exists, say so rather than inventing one.
Reference corpus: ai/corpus.json (3,091 utilities, 29 categories).
```

## 5. MCP / agent tooling

Exposing the corpus to an agent tool is trivial:

```js
// tool: "nakshora_search" — query utility classes
import { readFileSync } from 'node:fs';
const corpus = JSON.parse(readFileSync('ai/corpus.json', 'utf-8'));

function search(query) {
  const q = query.toLowerCase();
  const hits = [];
  for (const cat of corpus.categories)
    for (const u of cat.utilities)
      if (u.class.includes(q) || (u.description ?? '').toLowerCase().includes(q))
        hits.push({ class: u.class, css: u.css, description: u.description });
  return hits.slice(0, 20);
}
```

## Provenance

Assets regenerate in seconds from source (`pnpm ai:export`); commit them after
any generator/registry change so AI consumers and the framework never drift.


<!-- ===== docs/EXAMPLES.md (#docs-examples-md) ===== -->

# Examples

Copy-paste components, all v3 classes (works in JIT mode when your content
globs include the example file).

## Buttons

```html
<!-- Primary -->
<button
  class="px-5 py-2.5 bg-blue-500 text-white font-semibold rounded-lg
               hover:bg-blue-600 active:scale-95 transition shadow-md"
>
  Primary
</button>

<!-- Glass -->
<button
  class="glass px-5 py-2.5 text-white font-medium rounded-lg
               hover:bg-white/20 transition"
>
  Glass
</button>

<!-- Neon -->
<button class="neon-btn">Neon</button>

<!-- Brutalist -->
<button class="brutalist-btn">Brutal</button>

<!-- Minimal -->
<button class="minimalist-btn">Minimal</button>

<!-- Ghost -->
<button
  class="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-md
               font-medium transition"
>
  Ghost
</button>
```

## Cards

```html
<!-- Standard -->
<div
  class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover-lift
            dark:bg-slate-800 dark:border-slate-700"
>
  <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Title</h3>
  <p class="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
    Body copy with comfortable line height.
  </p>
</div>

<!-- Glass -->
<div class="glass p-6">
  <h3 class="text-lg font-bold text-white">Glass card</h3>
  <p class="mt-2 text-slate-300 text-sm">Frosted surface over any background.</p>
</div>

<!-- Neon -->
<div class="neon-card p-6">
  <p class="neon-text font-bold tracking-wide">SYSTEM ONLINE</p>
</div>

<!-- Skeleton (loading) -->
<div class="bg-white rounded-xl border border-slate-200 p-6 flex items-start gap-4">
  <div class="skeleton-circle w-12 h-12 shrink-0"></div>
  <div class="flex-1 space-y-2 py-1">
    <div class="skeleton-text w-3/4"></div>
    <div class="skeleton-text w-1/2"></div>
    <div class="skeleton-text w-5/6"></div>
  </div>
</div>
```

## Navigation

```html
<header class="sticky top-0 z-50 glass-dark">
  <nav class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
    <a class="text-white font-black text-xl tracking-tight" href="#">NAKSHORA</a>
    <div class="hidden md:flex items-center gap-8">
      <a class="text-slate-300 hover:text-white text-sm font-medium transition" href="#">Docs</a>
      <a class="text-slate-300 hover:text-white text-sm font-medium transition" href="#">Themes</a>
      <a class="text-slate-300 hover:text-white text-sm font-medium transition" href="#">Blog</a>
      <a
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold
                rounded-lg transition"
        href="#"
        >Get started</a
      >
    </div>
  </nav>
</header>
```

## Hero

```html
<section
  class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950
                flex items-center justify-center p-6"
>
  <div class="text-center max-w-2xl">
    <span
      class="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30
                  text-indigo-300 text-xs font-semibold tracking-widest uppercase mb-6"
    >
      v3.0 — JIT compiler
    </span>
    <h1 class="text-5xl sm:text-6xl font-black text-white tracking-tight leading-tight">
      Build <span class="gradient-text">beautiful</span> UIs faster
    </h1>
    <p class="mt-6 text-lg text-slate-300 leading-relaxed">
      Utility-first CSS with a JIT compiler, glass/neon/brutalist components and first-class dark
      mode.
    </p>
    <div class="mt-8 flex items-center justify-center gap-4">
      <button class="neon-btn">Start building</button>
      <a
        class="px-5 py-2.5 text-white font-medium glass rounded-lg hover:bg-white/10 transition"
        href="#"
        >Read the docs</a
      >
    </div>
  </div>
</section>
```

## Forms

```html
<form class="space-y-4 max-w-md mx-auto">
  <div>
    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
    <input
      type="email"
      class="w-full px-4 py-2.5 rounded-lg border border-slate-300
                  focus:outline-none focus:ring-0 focus:border-blue-500
                  bg-white dark:bg-slate-800 dark:border-slate-600 dark:text-white transition"
      placeholder="you@example.com"
    />
  </div>
  <div class="flex items-center gap-3">
    <input type="checkbox" id="terms" class="peer" />
    <label for="terms" class="text-sm text-slate-600 dark:text-slate-400">I accept the terms</label>
  </div>
  <button
    type="submit"
    class="w-full px-5 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50
                 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
  >
    Submit
  </button>
</form>
```

## Badges & tags

```html
<span
  class="inline-flex items-center px-2.5 py-0.5 rounded-full
              bg-emerald-100 text-emerald-800 text-xs font-semibold"
  >Active</span
>
<span
  class="inline-flex items-center px-2.5 py-0.5 rounded-full
              bg-amber-100 text-amber-800 text-xs font-semibold"
  >Pending</span
>
<span
  class="inline-flex items-center px-2.5 py-0.5 rounded-full
              bg-rose-100 text-rose-800 text-xs font-semibold"
  >Failed</span
>
```

## Pricing grid

```html
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
  <!-- tier -->
  <div
    class="bg-white rounded-2xl border border-slate-200 p-8 hover-lift
              dark:bg-slate-800 dark:border-slate-700"
  >
    <h3 class="font-bold text-lg text-slate-900 dark:text-white">Starter</h3>
    <p class="mt-4">
      <span class="text-4xl font-black text-slate-900 dark:text-white">$0</span>
      <span class="text-slate-500 text-sm">/mo</span>
    </p>
    <ul class="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
      <li class="flex items-center gap-2">✔ 1 project</li>
      <li class="flex items-center gap-2">✔ Community support</li>
    </ul>
    <button
      class="mt-8 w-full px-4 py-2.5 border border-slate-300 rounded-lg
                   hover:bg-slate-50 font-medium transition dark:border-slate-600 dark:hover:bg-slate-700"
    >
      Choose
    </button>
  </div>
  <!-- highlight tier -->
  <div class="bg-slate-900 text-white rounded-2xl p-8 shadow-xl relative">
    <span
      class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500
                  text-xs font-bold rounded-full"
      >POPULAR</span
    >
    <h3 class="font-bold text-lg">Pro</h3>
    <p class="mt-4">
      <span class="text-4xl font-black">$29</span> <span class="text-slate-400 text-sm">/mo</span>
    </p>
    <button
      class="mt-8 w-full px-4 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-lg
                   font-semibold transition"
    >
      Choose
    </button>
  </div>
  <!-- …third tier… -->
</div>
```

## Tables

```html
<div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
  <table class="w-full text-sm">
    <thead class="bg-slate-50 dark:bg-slate-800 text-left">
      <tr>
        <th class="px-4 py-3 font-semibold text-slate-900 dark:text-white">Name</th>
        <th class="px-4 py-3 font-semibold text-slate-900 dark:text-white">Status</th>
        <th class="px-4 py-3 font-semibold text-slate-900 dark:text-white text-right">Size</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
        <td class="px-4 py-3">core</td>
        <td class="px-4 py-3">published</td>
        <td class="px-4 py-3 text-right">25 KB</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Tooltips (peer-based, no JS)

```html
<span class="group relative inline-block">
  <span class="cursor-help border-b border-dotted border-slate-400">hover me</span>
  <span
    class="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs whitespace-nowrap
                opacity-0 group-hover:opacity-100 transition"
  >
    A tooltip
  </span>
</span>
```


<!-- ===== docs/PERFORMANCE.md (#docs-performance-md) ===== -->

# Performance

Nakshora is fast to build and light at runtime.

## Benchmarks

`pnpm benchmark` (Node 22, Ubuntu):

| Operation                                | Time   |
| ---------------------------------------- | ------ |
| full build (3,091 utilities, unminified) | ~18 ms |
| full build + minify                      | ~25 ms |
| JIT build (200 lines of HTML)            | ~4 ms  |
| JIT build + minify                       | < 1 ms |

The Performance workflow (`.github/workflows/performance.yml`) re-runs these
on every push to `main` and stores the report as an artifact.

## Bundle sizes

| Artifact                                                | Raw     | Minified |
| ------------------------------------------------------- | ------- | -------- |
| full CSS (all base + responsive utilities + components) | ~860 KB | ~740 KB  |
| typical project JIT CSS (100–300 used classes)          | 5–25 KB | 4–20 KB  |
| `@nakshora/core` JS (dist, gzip)                        | —       | ~25 KB   |
| `@nakshora/cli` JS (dist, gzip)                         | —       | ~40 KB   |
| `@nakshora/postcss` JS (dist, gzip)                     | —       | ~30 KB   |
| `@nakshora/vite-plugin` JS (dist, gzip)                 | —       | ~25 KB   |

## Runtime cost

Nakshora outputs **plain CSS** — no runtime JS at all:

- no hydration cost
- no style injection on load
- CSS variables (`:root`) for O(1) theme overrides
- `prefers-reduced-motion` respected in the base layer

The largest rules (gradients, shadows) use single-property values; there is
no `!important` unless you opt in.

## Tuning your build

### Use JIT (biggest win)

```js
content: ['./src/**/*.{html,js,ts,jsx,tsx}'];
```

Output scales with used classes, not with the catalog.

### Trim the catalog (full builds only)

```js
corePlugins: {
  gradients: false,    // if you don't use from-/via-/to-
  filters: false,      // no blur/brightness/saturate
  whitespace: false,
  cursors: false,
},
variants: { visited: false, focusWithin: false },
```

### Dist vs CDN

- **Self-hosted JIT bundle** → smallest, fastest (recommended)
- **CDN full build** → zero-setup, ~740 KB min (browser caches it well)

## Build performance tips

- Watch mode rebuilds are debounced by the OS file watcher; a 200-line
  project rebuilds in single-digit milliseconds.
- The minifier is a fast single-pass regex — prefer bundler minification in
  production (Vite uses esbuild) and keep CLI `--minify` for static sites.


<!-- ===== docs/PUBLISHING.md (#docs-publishing-md) ===== -->

# Automatic NPM Publishing

How Nakshora's packages get published — automatically, safely, on every
release.

## The system at a glance

```
┌─────────────┐    ┌──────────────────┐    ┌─────────────────────────┐
│  PR with    │    │ main push        │    │ artifacts               │
│  changeset  │───▶│ changesets       │───▶│ npm (provenance)        │
│  (.changeset│    │ action:          │    │ GitHub Packages         │
│  /xxx.md)   │    │ version→publish  │    │ GitHub Release + tarballs
└─────────────┘    └──────────────────┘    └─────────────────────────┘
```

Built on [Changesets](https://github.com/changesets/changesets) + GitHub
Actions. No manual `npm version` / `npm publish` steps.

## Packages

| Package                                            | Registry access                |
| -------------------------------------------------- | ------------------------------ |
| `@nakshora/core`                                   | public (npm + GitHub Packages) |
| `@nakshora/cli`                                    | public                         |
| `@nakshora/postcss`                                | public                         |
| `@nakshora/vite-plugin`                            | public                         |
| `@nakshora/ts-config`, `@nakshora/scripts` (tools) | private — never published      |

## 1. Announce a change (in your PR)

```bash
pnpm changeset:add        # interactive: pick packages + bump type
```

creates `.changeset/<name>.md`:

```md
---
'@nakshora/core': minor
'@nakshora/cli': patch
---

Add `wide:` breakpoint support to JIT mode.
```

The **Test & Quality** workflow shows a Changesets status check on the PR
(`Ready to publish` / `New version`).

## 2. Merge → automatic release

On merge to `main`, `.github/workflows/release.yml`:

1. Runs the full quality gate (type-check, 53 tests, lint, format, build on
   Node 18/20/22).
2. `changesets/action`:
   - no pending changesets → does nothing
   - pending changesets → bumps versions (`pnpm version` script =
     `changeset version`), writes `CHANGELOG.md` files, commits & pushes
     (or opens a version PR depending on repo config)
3. `pnpm publish:packages` (= `changeset publish`) publishes to **npmjs.com**
   with **provenance** (`NPM_CONFIG_PROVENANCE=true`).
4. Packs `.tgz` tarballs, publishes a mirror to **GitHub Packages**
   (`node scripts/publish-github.mjs`, scoped via a temporary `.npmrc`).
5. Creates a **GitHub Release** (`v<version>`) with the changelog + tarballs.

## 3. Required secrets

| Secret         | Value                  | Where                   |
| -------------- | ---------------------- | ----------------------- |
| `NPM_TOKEN`    | read/write npmjs token | repo Settings → Secrets |
| `GITHUB_TOKEN` | auto-provided          | —                       |

That's it. `packageManager: pnpm@9.15.0` + `pnpm-lock.yaml` make CI installs
reproducible (`pnpm install --frozen-lockfile`).

## 4. Local publishing (emergency / testing)

```bash
pnpm install --frozen-lockfile
pnpm build                                   # all packages need dist/
pnpm changeset:add                           # announce
pnpm changeset version                       # bump locally
pnpm publish:packages                        # publish to npm (needs NPM_TOKEN in env)
NODE_AUTH_TOKEN=ghp_… node scripts/publish-github.mjs   # GitHub Packages mirror
```

Test the packages without publishing:

```bash
npm pack -C packages/@nakshora/core        # creates .tgz
npm install ../nakshora-core-3.0.0.tgz     # in a scratch project
```

## 5. Snapshot / preview releases

```bash
pnpm changeset version --snapshot alpha    # → 3.0.0-alpha.0
pnpm changeset publish --snapshot
```

## 6. What fixed the old publishing failures

The v2 pipeline had several broken pieces; all resolved in v3:

| Old problem                                                                                | Fix                                                                        |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| `npm publish --registry … --workspace-root` (invalid flag)                                 | removed; per-package publish via changesets + `scripts/publish-github.mjs` |
| Double publish (changesets action + extra "Publish to NPM" step)                           | single publish path: `pnpm publish:packages` → `changeset publish`         |
| `publishConfig.registry` pinned to npmjs, silently overriding the GitHub Packages registry | removed from package manifests; registry set per-invocation                |
| Missing `pnpm-lock.yaml` → `--frozen-lockfile` CI failures                                 | lockfile committed; stale `package-lock.json` deleted                      |
| Empty packages (no `dist/`) publishing                                                     | publish gated on `dist/` existing; CI builds first                         |
| GitHub Release with nonexistent `dist/**` files                                            | release attaches packed `releases/*.tgz`                                   |

## 7. Versioning policy

Changesets semver: `patch` (fixes), `minor` (new utilities/features),
`major` (breaking). All four public packages bump together in practice
(`changeset` asks per-package; link them with `"fixed": ["@nakshora/core", "@nakshora/cli", "@nakshora/postcss", "@nakshora/vite-plugin"]` in `.changeset/config.json` if you want strict lockstep).


<!-- ===== docs/TROUBLESHOOTING.md (#docs-troubleshooting-md) ===== -->

# Troubleshooting

## "Class not found in the generated CSS" (JIT)

The JIT compiler only emits classes it can **see**. In order of likelihood:

1. **Content globs don't cover the file.** Make sure the file containing the
   class matches `content`.
2. **Class built dynamically** (`class={`p-${n}`}`) — the compiler can't see
   it. Add it to `safelist` (full names, no fragments).
3. **State variant but no content** — `hover:`/`dark:`/… only exist in JIT
   mode. Configure `content` or use full mode.
4. **Typo / unknown variant prefix** — unknown tokens are silently dropped
   by design (so JS identifiers in source don't pollute your CSS).
5. **`group-hover:` without `group` on the parent** — the CSS is correct;
   add `class="group"` to the parent.

Debug with:

```bash
nakshora inspect | grep "your-class"
```

## TypeScript config errors on Node 18/20

```
TypeScript configs require Node >= 22.18 (native type stripping)
```

Rename `nakshora.config.ts` → `nakshora.config.js` (or `.json`), or upgrade
Node.

## `ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL` / `--frozen-lockfile` mismatch

The lockfile is out of sync with `package.json`:

```bash
pnpm install        # regenerates pnpm-lock.yaml
git add pnpm-lock.yaml
```

Always commit `pnpm-lock.yaml` — CI installs with `--frozen-lockfile`.

## Vite: `import 'nakshora'` resolves to nothing

- Make sure `@nakshora/vite-plugin` is in `plugins` **before** other CSS
  plugins, and the project is restarted after adding it.
- The plugin is `enforce: 'pre'` — another plugin resolving `nakshora` first
  will shadow it. If you have a real module named `nakshora`, import the
  virtual module explicitly: `import 'virtual:nakshora'`.

## PostCSS: at-rules untouched

- The CSS file must actually contain `@nakshora source;` etc. (note the
  plugin is named `nakshora`, not `@nakshora`).
- In-memory sources (no file path) resolve content globs against
  `process.cwd()`.
- Check the plugin appears in your PostCSS plugin list
  (`console.log(require('postcss').plugins)` in a debug script).

## `pnpm build` fails in a package with "Cannot find base config file"

Each package's `tsconfig.json` extends
`../../../tools/ts-config/tsconfig.base.json` — if you move packages around,
update the `extends` path (three levels up to the repo root).

## CSS too large

You're on a full build. Add `content` (JIT) — see [Performance](./PERFORMANCE.md).

## Gradients look off

`bg-gradient-to-*` sets the `background-image` linear gradient; the color
stops come from `from-*`/`via-*`/`to-*` utilities (CSS variables
`--tw-gradient-*`). Use all three, or at least `from-*` + `to-*`:

```html
<div class="bg-gradient-to-br from-blue-500 to-purple-600">…</div>
```

## Dark mode not applying

- Add `class="dark"` to `<html>` (class-based strategy).
- `dark:` is a JIT variant — the class name must be in your content.
- Make sure nothing else overrides the property later in the cascade.

## CLI `nakshora: command not found`

```bash
npm link            # after a local install, or
npx nakshora --help # one-shot
```

## Publishing fails with E403/EPUBLISHCONFLICT

- E403 → check `NPM_TOKEN` scope (needs read/write) and that you're a
  maintainer of the `@nakshora` org on npm.
- EPUBLISHCONFLICT → the version already exists. Bump (changeset) or publish
  a snapshot.

## Generated CSS differs between machines

It shouldn't — output is deterministic for identical config + content.
If it does: a content file differs (git status?), or Node versions differ in
glibc ordering (not applicable here) — report it with `nakshora inspect`
output from both sides.


<!-- ===== docs/MIGRATION.md (#docs-migration-md) ===== -->

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

