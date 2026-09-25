# Nakshora CSS Framework Guide (Version 3.1)

> **Course module:** Open-source textbook chapter for students and developers learning utility-first web design.
> **Scope:** Nakshora v3.1 — 11,417 utilities, 35 categories, 22 color palettes, 10 breakpoints, 155 stackable variants, zero runtime JavaScript.
> **Sources:** This guide derives every class name, value, and behavior from the framework source code (`packages/@nakshora/core/src/`), the repository documentation (`docs/`), and the official documentation platform at [docs.nakshora.bsdc.info.bd](https://docs.nakshora.bsdc.info.bd/). Release facts cite the project's public announcements (see References).

---

## Table of Contents

1. [Introduction to Nakshora CSS (v3.1)](#1-introduction-to-nakshora-css-v31)
2. [Installation and Integration](#2-installation-and-integration)
3. [Core Architecture and Configuration](#3-core-architecture-and-configuration)
4. [Detailed Layout and Utility System Guide](#4-detailed-layout-and-utility-system-guide)
5. [Component Library Breakdown](#5-component-library-breakdown)
6. [Interactive Practical Learning Lab (Exercises)](#6-interactive-practical-learning-lab-exercises)
7. [Conclusion and Review Questions](#7-conclusion-and-review-questions)
8. [References](#8-references)

---

## 1. Introduction to Nakshora CSS (v3.1)

### 1.1 What Nakshora Is

Nakshora (নক্ষত্র — "star" in Bangla) is an **open-source, utility-first CSS framework** with a **Just-In-Time (JIT) compiler**, created by **Rizwan Rahim Chowdhury** and developed by **RRC Development**. The project lives at [github.com/nakshora/nakshora](https://github.com/nakshora/nakshora), ships under the **MIT license**, and publishes its documentation at [docs.nakshora.bsdc.info.bd](https://docs.nakshora.bsdc.info.bd/) (2,050 articles for v3.1 alone, released 2026-09-14).

Nakshora follows a **hybrid architecture**:

- **Utility-first at its core.** You style elements by composing small, single-purpose classes in HTML. Each class maps to one CSS declaration or a tight group of declarations. Example: `px-5 py-2.5 bg-blue-500 text-white font-semibold rounded-lg`.
- **Component layer on top.** A small set of ready-made design-paradigm classes (`.glass`, `.neon-card`, `.brutalist-btn`, and others) provides complete visual treatments. You combine them freely with utilities.
- **Compiler-driven output.** A JIT engine scans your source files, finds the class names you actually use, and emits only that CSS. A typical project ships roughly 5–20 KB of CSS instead of hundreds of kilobytes. No JavaScript runs in the browser at all.

### 1.2 Core Design Philosophy

Study these five principles. They explain every design decision in the codebase:

1. **Markup, not ceremony.** You describe the design directly in the `class` attribute. You rarely open a stylesheet.
2. **Mobile-first responsiveness.** Base classes apply to all viewports. Prefixed classes (`sm:`, `md:`, `lg:`) override them from a minimum width upward.
3. **Pay only for what you use.** The catalog holds 11,417 utilities, but the JIT compiler emits only the classes found in your files (plus an explicit `safelist`).
4. **Design tokens drive everything.** Colors, spacing, type sizes, shadows, radii, and breakpoints live in one resolved theme. Change a token once; every utility that references it updates.
5. **Compatibility without lock-in.** Version 3.1 verifies byte-identical output against Tailwind CSS v3.4 for shared classes, accepts Tailwind-style configuration (`theme.screens`, `plugin()`), and supports official Tailwind plugins (`typography`, `forms`, `aspect-ratio`, `container-queries`). You can migrate existing Tailwind knowledge directly.

### 1.3 How v3.1 Differs from Earlier Releases

| Release | Architecture | Key facts |
|---|---|---|
| **1.0** (legacy) | Single static stylesheet | One batteries-included CSS file; frozen copy kept at `minified-version/v1.0.0.css` |
| **2.0** (legacy) | TypeScript rewrite | Programmatic CSS generation, five themes, npm-ready |
| **3.0** | pnpm monorepo + JIT | Four packages (`core`, `cli`, `postcss`, `vite-plugin`); AI-ready docs |
| **3.1** (current) | 3.0 + parity + tooling | Tailwind 3.4 parity oracle, 10 breakpoints, 155 variants, language server (`nakshora lsp`), CSS-first config (`@theme` / `@utility` / `@custom-variant`), dependency-free dev server |

### 1.4 Prerequisites for Learners

Before you start, you need:

- **HTML basics.** Elements, attributes, nesting, and the `class` attribute.
- **The CSS box model.** Content, padding, border, margin — and how `box-sizing: border-box` changes width math. (Nakshora's preflight reset applies `border-box` globally, so trust it.)
- **Basic command-line skills.** Run `node -v` and `npm -v`. Install packages. (Only required for the compiler-based paths; the CDN path needs no tooling.)
- **Helpful but optional:** CSS flexbox and grid concepts, media-query syntax, and basic JavaScript module imports.

### 1.5 What You Will Be Able to Do

After completing this module, you will install Nakshora through any of its five integration paths, read and write its utility grammar fluently, configure the theme, build responsive layouts with the 10-screen system, apply state variants, use the built-in components, and verify your setup with the CLI's doctor and inspect tools.

---

## 2. Installation and Integration

Nakshora v3.1 ships **four packages** and supports **five integration paths**. Pick exactly one path per project.

### 2.1 The Four Packages

| Package | Purpose | Runtime needs | Install |
|---|---|---|---|
| `@nakshora/core` | JIT compiler and engine | None — runs in Node ≥ 18 and in the browser (~71 KB gzip ESM) | `npm i @nakshora/core` |
| `@nakshora/cli` | `nakshora init / build / dev / inspect / export:ai` commands | Node ≥ 18 | `npm i -D @nakshora/cli` |
| `@nakshora/postcss` | PostCSS plugin (`@nakshora source;` at-rules) | `postcss ^8.4`, Node ≥ 18 | `npm i -D @nakshora/postcss` |
| `@nakshora/vite-plugin` | Vite plugin (virtual module + HMR) | `vite ^5 \|\| ^6 \|\| ^7 \|\| ^8` | `npm i -D @nakshora/vite-plugin` |

**Requirements:** Node.js ≥ 18 (22 LTS recommended). TypeScript config files (`nakshora.config.ts`) need Node ≥ 22.18; on older Node runtimes use `.js`, `.mjs`, or `.json` configs.

### 2.2 Package Managers and Registries

Nakshora publishes to **two registries**:

**npm (primary):**

```bash
# npm
npm install @nakshora/core
npm install -D @nakshora/cli @nakshora/postcss @nakshora/vite-plugin

# pnpm (also the monorepo's own manager; pnpm >= 9)
pnpm add @nakshora/core
pnpm add -D @nakshora/cli @nakshora/postcss @nakshora/vite-plugin

# yarn
yarn add @nakshora/core
yarn add -D @nakshora/cli @nakshora/postcss @nakshora/vite-plugin

# bun (npm-compatible registry API)
bun add @nakshora/core
bun add -D @nakshora/cli @nakshora/postcss @nakshora/vite-plugin
```

**GitHub Packages (mirror):**

```bash
# ~/.npmrc
@nakshora:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=<your GitHub token>
```

```bash
npm install @nakshora/core
```

Releases follow an automated pipeline: a version bump merges, then GitHub Actions publishes to npm with provenance, mirrors to GitHub Packages, and cuts a GitHub Release with tarballs.

### 2.3 Path A — Vite (Recommended)

The Vite plugin gives you a virtual CSS module, PostCSS `@nakshora` support, and hot-module replacement (HMR) when your class usage changes.

**Step 1 — Create a Vite project:**

```bash
npm create vite@latest my-app -- --template vanilla
cd my-app
```

**Step 2 — Install Nakshora:**

```bash
npm install -D @nakshora/vite-plugin
```

**Step 3 — Register the plugin:**

```js
// vite.config.js
import { defineConfig } from 'vite';
import { nakshora } from '@nakshora/vite-plugin';

export default defineConfig({
  plugins: [
    nakshora({
      // JIT: scan these files for class names — only used classes compile
      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
      config: {
        theme: {},
        safelist: [],
      },
    }),
  ],
});
```

**Step 4 — Import the stylesheet:**

```js
// src/main.js
import 'nakshora'; // injects the compiled Nakshora CSS
```

Alternatively, create `src/nakshora.css` containing `@nakshora source;` and import that file instead.

**Step 5 — Run and build:**

```bash
npm run dev     # dev server with HMR
npm run build   # production bundle
npm run preview # preview the production build
```

Edit any class in your source files. The browser refreshes automatically.

### 2.4 Path B — PostCSS (Webpack, Next.js, Laravel, Gulp)

Use this path with any tool that runs PostCSS.

**Step 1 — Install:**

```bash
npm install -D @nakshora/postcss postcss
```

**Step 2 — Configure:**

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

**Step 3 — Write the entry CSS:**

```css
/* src/nakshora.css */
@nakshora source; /* base + variables + keyframes + utilities + components */

/* Or control each layer yourself: */
@nakshora base;
@nakshora variables;
@nakshora keyframes;
@nakshora utilities; /* JIT when content is configured */
@nakshora components;
```

**Step 4 — Import the entry CSS in your application.** Your bundler handles the rest.

**Next.js (App Router) variant:**

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

### 2.5 Path C — CLI Only (Plain HTML, No Bundler)

Use this path for static sites or any environment without a bundler.

**Step 1 — Install:**

```bash
npm install -g @nakshora/cli
# or locally: npm install -D @nakshora/cli
```

**Step 2 — Scaffold:**

```bash
mkdir my-site && cd my-site
nakshora init
```

This creates two files:

```text
my-site/
├── nakshora.config.js   # content globs, theme, plugins
└── nakshora.css         # @nakshora source; @nakshora utilities;
```

Useful flags: `nakshora init --json` writes a JSON config; `nakshora init --force` overwrites existing files.

**Step 3 — Write markup:**

```html
<!-- index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Nakshora site</title>
    <link rel="stylesheet" href="dist/nakshora.css" />
  </head>
  <body>
    <div class="min-h-screen flex items-center justify-center bg-slate-900">
      <div class="glass p-8 text-center">
        <h1 class="text-3xl font-bold text-white">Hello, Nakshora</h1>
        <button class="neon-btn mt-6">Wow</button>
      </div>
    </div>
  </body>
</html>
```

**Step 4 — Build:**

```bash
nakshora build nakshora.css -o dist/nakshora.css --minify
```

The compiler replaces the at-rules with only the classes it found in your content globs (JIT). For watch mode, run:

```bash
nakshora dev nakshora.css -o dist/nakshora.css
```

**Full CLI command reference:**

| Command | Purpose |
|---|---|
| `nakshora init` | Scaffold config + entry CSS |
| `nakshora build [input]` | Compile CSS (full build to stdout by default; `--mode full\|jit`, `--watch`, `--minify`, `--content`, `--safelist`, `--source-map`, `--stats`, `--diff`) |
| `nakshora dev [input]` | `build --watch` plus an optional dependency-free dev server |
| `nakshora inspect <class>` | Show the CSS a class (or variant stack) compiles to |
| `nakshora doctor` | Diagnose config, content globs, safelist, and dependency problems |
| `nakshora lsp` | Start the language server (completion, hover, diagnostics, color previews) |
| `nakshora export:ai` | Regenerate `ai/corpus.json` from source so LLM assets never drift |
| `nakshora migrate` | Migrate configs from v1/v2 or Tailwind |

**Build-mode selection logic** (memorize this order):

1. `--mode` wins when provided.
2. `content` (or legacy `purge`) configured → **JIT mode** (only used classes, including all state variants).
3. Otherwise → **full mode** (all base + responsive utilities + components).

### 2.6 Path D — Plain HTML + CDN (No Build at All)

Add one `<link>` tag. No Node.js, no terminal, no build step.

```html
<!-- Full build, latest main branch -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/nakshora/nakshora@main/dist/css/nakshora.min.css"
/>
```

Pin an exact version for production stability:

```html
<!-- Pinned, immutable release -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/nakshora/nakshora@v3.0.0/dist/css/nakshora.min.css"
/>
```

Know the limits of the CDN file:

- It contains **base + responsive utilities** only. **State variants** (`hover:`, `dark:`, `group-hover:`, …) require the JIT compiler.
- The full build uses the classic five screens (`sm`–`2xl`) by default. JIT mode supports all ten.
- jsDelivr negotiates compression automatically: the file is ~5.98 MB on disk but transfers at ~133 KB over Brotli and ~576 KB over gzip.

### 2.7 Path E — Self-Hosting (Local File Hosting)

Download the prebuilt files and serve them yourself:

| File | Bytes | Purpose |
|---|---|---|
| `dist/css/nakshora.min.css` | 5,982,603 | Full minified stylesheet |
| `dist/css/nakshora.min.css.br` | 132,967 | Brotli sidecar (quality 11) |
| `dist/css/nakshora.min.css.gz` | 575,520 | Gzip sidecar (level 9) |

A test in the repository decompresses both sidecars and asserts byte-for-byte equality with the main file. Serve them with static-compression support:

- **nginx:** `brotli_static on; gzip_static on;`
- **Apache:** `mod_brotli` + `MultiViews`
- **Netlify / Cloudflare Pages / Vercel:** automatic sidecar handling
- **S3 + CloudFront:** upload the `.br` file with `Content-Encoding: br`

Rule of thumb: use the full build only for zero-tooling pages. Any project with a build step should use JIT (typically 5–20 KB; the framework's own landing page ships 3,936 B gzipped).

### 2.8 Verifying Your Setup

Run these checks after any installation:

```bash
# 1. Diagnose the whole project (content globs, safelist, missing at-rules, deps)
nakshora doctor

# 2. Inspect what one class compiles to
nakshora inspect "md:hover:bg-blue-600"

# 3. Build with statistics (time, class counts, sizes, unknown candidates)
nakshora build nakshora.css -o dist/nakshora.css --stats
```

Then render this smoke-test page. If the button turns blue on hover and the grid gains columns as you widen the window, your setup works:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Nakshora smoke test</title>
    <link rel="stylesheet" href="dist/nakshora.css" />
  </head>
  <body class="p-6">
    <button
      class="px-5 py-2.5 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
    >
      Hover me
    </button>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      <div class="bg-slate-100 p-4 rounded-lg">One</div>
      <div class="bg-slate-100 p-4 rounded-lg">Two</div>
      <div class="bg-slate-100 p-4 rounded-lg">Three</div>
    </div>
  </body>
</html>
```

---

## 3. Core Architecture and Configuration

### 3.1 The Engine: How the JIT Compiler Works

The heart of Nakshora is `@nakshora/core`, a dependency-free engine written in strict TypeScript. Learn its pipeline in four stages:

1. **Extract.** The extractor scans every file matched by `content` globs (or raw strings you pass directly) with a class-candidate regex. You can override the pattern with `extractorPattern`.
2. **Resolve.** Each candidate parses into *variants + base utility + modifier* (for example, `md:hover:bg-blue-600/80` → screens `md`, state `hover`, color `blue-600`, opacity modifier `80`). The engine validates the base against its registry of 11,417 utilities across 35 categories.
3. **Generate.** Matched utilities compile to CSS rules. Screen variants wrap rules in `@media` queries; state variants append pseudo-classes or ancestor selectors. Stacked media variants collapse into **one** `@media` query (configurable with `combineMedia`).
4. **Emit.** Output assembles in three sections — **base** (preflight reset, CSS variables, keyframes), **components**, **utilities** — optionally wrapped in real cascade layers (`@layer base, components, utilities`) when you set `layers: true`.

Two build modes exist:

| Mode | Trigger | Output |
|---|---|---|
| **JIT** | `content` configured (or `--mode jit`) | Only used classes + `safelist`, **including all state variants** |
| **Full** | No `content` (or `--mode full`) | All base + responsive utilities + components; state variants excluded |

Measured performance (pinned in `perf/baseline.json`; CI fails on regressions over 10%):

| Operation | Median time |
|---|---|
| JIT build (200 lines of HTML, warm) | 18.2 ms |
| JIT rebuild after one file changes (500 files) | 1.3 ms |
| Full build (11,417 utilities, sm–2xl) | 371 ms |
| Full build + minify | 302 ms |

### 3.2 Global Reset (Preflight)

Every build starts with a preflight reset (Tailwind-compatible): margins collapse to zero, `box-sizing` becomes `border-box`, headings inherit font sizes, images become block-level responsive elements, and button backgrounds turn transparent. Disable it per project with top-level `preflight: false` or `corePlugins: { base: false }`.

### 3.3 The Configuration File

Nakshora auto-discovers `nakshora.config.{ts,js,mjs,cjs,json}` by walking up from the working directory. Here is the complete option surface with defaults:

```js
// nakshora.config.js
export default {
  content: './**/*.{html,js,ts,jsx,tsx,vue,astro,svelte,md}', // JIT mode trigger
  purge: [], // legacy alias of content
  safelist: [], // classes always included (variants allowed: 'lg:flex')
  blocklist: [], // classes never emitted in JIT
  theme: {}, // deep-merged overrides (see §3.4)
  presets: [], // configs merged before theme
  variants: {}, // variant toggles (see §3.7)
  corePlugins: {}, // utility-group toggles (see §3.8)
  darkMode: 'class', // 'class' | 'media' | 'selector' | ['selector', sel] | ['variant', sel] | false
  prefix: '', // e.g. 'nk-' turns .flex into .nk-flex
  important: false, // true adds !important; '#app' scopes every rule under #app
  preflight: true, // include the reset in base
  layers: false, // wrap output in real @layer blocks
  combineMedia: true, // print:md:flex → one '@media print and (min-width: 768px)'
  plugins: [], // plugin functions / objects / Tailwind plugins
  extractorPattern: undefined, // custom class-extractor regex
};
```

**CSS-first configuration (v3.1).** You can extend the theme without touching JavaScript:

```css
@theme {
  --color-brand-500: #6d28d9;
}

@utility tab-4 {
  tab-size: 1rem;
}

@custom-variant hocus (&:hover, &:focus);
```

### 3.4 Design Tokens: The Theme System

The resolved theme is Tailwind-3.4-shaped (`theme.colors`, `theme.spacing`, `theme.fontSize`, `theme.screens`, …) so Tailwind configs and plugins work unchanged. Nakshora's historical aliases (`typography.fontSize`, `breakpoints`, `shadows`, `duration`, `easing`) map onto the same keys automatically.

**Token sections and defaults:**

| Section | Default keys | Notes |
|---|---|---|
| `colors` | 22 palettes × shades 50–950 | Override one shade (`blue: {500: '#hex'}`) or add a palette (`brand: {...}`) |
| `spacing` | `0 px 0.5 1 … 96` | Key → CSS length; shared by margin, padding, gap, sizing, inset |
| `typography.fontSize` | `xs sm base lg xl 2xl … 9xl` | Value or `[size, lineHeight]` tuple |
| `typography.fontWeight` | `thin … black` | 100–900 |
| `typography.lineHeight` | `none tight snug base relaxed loose` | `base` (1.5) is a Nakshora addition |
| `typography.letterSpacing` | `tighter tight normal wide wider widest` | |
| `fontFamily` | `sans`, `mono` | System stacks by default |
| `breakpoints` | `xxs:200 xs:400 sm:640 md:768 lg:1024 xl:1280 2xl:1536 3xl:1920 4xl:2560 5xl:5000` | px; merged + re-sorted; `null` removes |
| `shadows` | `none sm base md lg xl 2xl inner glow` | `glow` (blue) is a Nakshora addition |
| `borderRadius` | `none xs sm md lg xl 2xl 3xl full` | `xs` is a Nakshora addition |
| `zIndex` | `auto hide 0 10 20 30 40 50` | `hide` (−1) is a Nakshora addition |
| `opacity` | `0 5 10 20 … 100` | |
| `duration` | `0 75 100 150 200 300 500 700 1000` | milliseconds |
| `easing` | `linear in out in-out back` | `back` (spring overshoot) is a Nakshora addition |
| `animation` | `spin ping pulse bounce fade slide shimmer` | name → shorthand |
| `keyframes` | matches the animation names | name → keyframe body |

**Example — extend the theme:**

```js
// nakshora.config.js
export default {
  theme: {
    colors: {
      brand: {
        50: '#f5f3ff',
        500: '#8b5cf6',
        900: '#4c1d95',
      },
    },
    breakpoints: { tablet: 900, xxs: null }, // add tablet:, drop xxs:
    animation: { wiggle: 'wiggle 1s ease-in-out infinite' },
    keyframes: {
      wiggle: '0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); }',
    },
  },
};
```

Every new color automatically generates `text-*`, `bg-*`, `border-*`, `from-*`, `via-*`, `to-*` utilities plus `--color-*` CSS variables. Every new breakpoint gains a matching `max-*` twin.

**All tokens surface as CSS variables on `:root`:**

```css
:root {
  --color-brand-500: #8b5cf6;
  --spacing-4: 1rem;
  --text-base: 1rem;
}
```

Disable the variable block with `corePlugins: { variables: false }`.

### 3.5 Color Palettes

Nakshora ships **22 palettes × 11 shades (50–950)**:

```text
slate gray zinc neutral stone red orange amber yellow lime
emerald green teal cyan sky blue indigo violet purple fuchsia pink rose
```

Each `palette-shade` pair generates six utility families automatically:

```html
<p class="text-blue-500">Colored text</p>
<div class="bg-slate-900">Colored background</div>
<div class="border border-rose-400">Colored border</div>
<div class="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600">
  Gradient with three stops
</div>
```

Five **theme presets** (`neonTheme`, `pastelTheme`, `brutalistTheme`, `minimalistTheme`, `natureTheme`, imported from `@nakshora/core`) replace the palette and typography for a complete visual direction. Apply one preset like this:

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

### 3.6 Responsive Modifiers: The 10-Breakpoint System

Nakshora is **mobile-first**: unprefixed classes apply everywhere; a screen prefix overrides from that width upward. Version 3.1 defines **10 screens** from wearables to video walls:

| Prefix | Min-width | `max-*` twin (max-width) | Typical devices |
|---|---|---|---|
| *(none)* | 0 | — | everything |
| `xxs:` | 200px | `max-xxs:` → 199.98px | tiny / folded screens, wearables |
| `xs:` | 400px | `max-xs:` → 399.98px | small phones |
| `sm:` | 640px | `max-sm:` → 639.98px | large phones |
| `md:` | 768px | `max-md:` → 767.98px | tablets |
| `lg:` | 1024px | `max-lg:` → 1023.98px | laptops |
| `xl:` | 1280px | `max-xl:` → 1279.98px | desktops |
| `2xl:` | 1536px | `max-2xl:` → 1535.98px | large desktops |
| `3xl:` | 1920px | `max-3xl:` → 1919.98px | Full HD monitors, TVs |
| `4xl:` | 2560px | `max-4xl:` → 2559.98px | QHD / 2K monitors |
| `5xl:` | 5000px | `max-5xl:` → 4999.98px | 4K+, video walls, ultra-wide |

Screens `sm`–`2xl` match Tailwind CSS v3 exactly. The other five are purely additive — no existing class changes meaning.

```html
<div class="text-base sm:text-lg md:text-xl 3xl:text-2xl">Grows with the viewport</div>
<nav class="max-md:hidden">Hidden on tablets and below</nav>
<div class="min-[900px]:flex max-[900px]:hidden">Arbitrary breakpoint widths</div>
```

Learn the combination rules (all pinned by `responsive.test.ts`):

- Screens emit **ascending** (200 → 5000) so the widest matching screen wins the cascade. `max-*` blocks emit **descending** so the narrowest wins.
- A screen plus any other **media** variant collapses into **one** query: `print:md:flex` → `@media print and (min-width: 768px)`. Set `combineMedia: false` for nested queries instead.
- Stacking two screens keeps the **tighter** bound: `lg:xl:flex` → `(min-width: 1280px)`; `md:max-xl:flex` → `(min-width: 768px) and (max-width: 1279.98px)` (a range).
- **Container queries** (element-relative breakpoints) use Tailwind v4 grammar: `@container`, `@md:flex`, `@min-md:flex`, `@max-md:flex`, `@lg/card:flex`, `@[30rem]:flex`.

The `.container` class sets `width: 100%` plus one `max-width` per screen — but only for `sm`…`2xl` by default, since a 200px or 5000px container is never useful. Widen the range with `theme.container.minScreen` / `maxScreen`.

### 3.7 State Variants

Variants apply utilities in specific states or contexts. **State variants emit in JIT mode only** — configure `content` so the compiler can see your class names. Version 3.1 supports 155 stackable variants; these are the core set:

**State variants:**

| Prefix | Generated CSS | When it applies |
|---|---|---|
| `hover:` | `.hover\:x:hover` | pointer is over the element |
| `focus:` | `.focus\:x:focus` | element has focus |
| `focus-visible:` | `.focus-visible\:x:focus-visible` | keyboard focus |
| `focus-within:` | `.focus-within\:x:focus-within` | element or a descendant has focus |
| `active:` | `.active\:x:active` | element is pressed |
| `visited:` | `.visited\:x:visited` | link was visited |
| `disabled:` | `.disabled\:x:disabled` | element is disabled |
| `first:` | `.first\:x:first-child` | first child |
| `last:` | `.last\:x:last-child` | last child |

**Group variants (parent → child):** add `group` to the parent, then target children with `group-hover:` / `group-focus:`.

```html
<a class="group flex items-center gap-2">
  <span class="text-slate-700">Docs</span>
  <span class="opacity-0 group-hover:opacity-100 transition">→</span>
</a>
```

**Peer variants (sibling → sibling):** add `peer` to the earlier sibling, then target later siblings with `peer-hover:` / `peer-focus:`.

```html
<input type="text" class="peer border rounded px-3 py-2" placeholder="Type here" />
<p class="hidden peer-focus:block text-sm text-slate-500">You are typing…</p>
```

**Dark mode:** class-based by default. Add `dark` to any ancestor (convention: `<html class="dark">`), then use `dark:` variants:

```html
<div class="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
  Adapts automatically.
</div>
```

This compiles to `.dark .dark\:bg-slate-900 { background-color: #0f172a; }`. Switch strategies with `darkMode: 'media'` (`prefers-color-scheme`), `'selector'`, `['selector', '[data-theme="dark]']`, or disable it with `false`.

**Stacking:** combine screens and states freely in any order:

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

**Disable any variant** to shrink builds:

```js
export default {
  variants: {
    visited: false,
    dark: false,
    responsive: false, // no screen prefixes at all
    maxResponsive: false, // keep md: but drop max-md:
    containerQueries: false,
  },
};
```

### 3.8 Core Plugin Toggles

Disable whole utility groups to shrink builds:

```js
export default {
  corePlugins: {
    transforms: false,
    whitespace: false,
    components: false, // drops .glass, .neon-btn, .brutalist-card, … (built-ins only)
  },
};
```

Available groups: `base, variables, animations, components, backgrounds, borderColor, borderRadius, borders, cursors, display, effects, filters, flex, gap, grid, inset, margin, opacity, padding, position, sizing, shadows, textColor, textDecoration, transforms, transitions, typography, whitespace, zIndex, overflow, visibility, gradients, plugin`. Note that `components: false` never removes components you register yourself with `addComponents` / `matchComponents`.

### 3.9 Typography Handling

Typography utilities read directly from the `typography` tokens:

```html
<h1 class="text-4xl font-black tracking-tight leading-none">Headline</h1>
<p class="text-base font-normal leading-relaxed tracking-normal text-slate-600">
  Body copy. Each text-* size sets a matching line-height automatically:
  text-base → 1rem / 1.5rem.
</p>
<code class="font-mono text-sm">Monospace for code</code>
<p class="truncate">Long single-line text clips with an ellipsis…</p>
```

Font-size scale (size / line-height): `xs` 0.75/1rem · `sm` 0.875/1.25rem · `base` 1/1.5rem · `lg` 1.125/1.75rem · `xl` 1.25/1.75rem · `2xl` 1.5/2rem · `3xl` 1.875/2.25rem · `4xl` 2.25/2.5rem · `5xl` 3rem/1 · `6xl` 3.75rem/1 · `7xl` 4.5rem/1 · `8xl` 6rem/1 · `9xl` 8rem/1.

Weights map `thin`→100 through `black`→900. Line heights: `leading-none tight snug base relaxed loose`. Letter spacing: `tracking-tighter tight normal wide wider widest`.

### 3.10 The Plugin API

Plugins extend the framework programmatically. A plugin is a function `(api) => void`, an object `{ name, config?, handler }`, or a Tailwind `plugin()` object:

```js
// nakshora.config.js
export default {
  plugins: [
    function (api) {
      // Static utility — takes every variant automatically
      api.addUtilities({ '.content-auto': { 'content-visibility': 'auto' } });
      // Dynamic utility: tab-4 (theme) and tab-[3] (arbitrary)
      api.matchUtilities({ tab: (v) => ({ tabSize: v }) }, { values: api.theme('spacing') });
      // Component with nesting
      api.addComponents({
        '.card': { padding: api.theme('spacing.4'), '&:hover': { opacity: '0.9' } },
      });
      // Base-layer rule
      api.addBase({ h1: { fontSize: api.theme('fontSize.2xl')[0] } });
      // Custom variants: hocus:flex, nth-[3]:flex
      api.addVariant('hocus', ['&:hover', '&:focus']);
      api.matchVariant('nth', (v) => `&:nth-child(${v})`, { values: { 1: '1' } });
    },
  ],
};
```

Numeric values gain `px` automatically unless the property is unitless (`lineHeight`, `zIndex`, `opacity`, …) — Tailwind semantics.

---

## 4. Detailed Layout and Utility System Guide

### 4.1 Reading the Utility Grammar

Every Nakshora class follows predictable patterns. Memorize these five rules and you can guess hundreds of classes correctly:

1. **Color:** `<utility>-<palette>-<shade>` → `text-blue-500`, `bg-slate-900`, `border-rose-400`, `from-cyan-500`.
2. **Spacing:** `<utility>-<key>` → `p-4`, `mt-2`, `gap-x-6`. Keys: `0 px 0.5 1 1.5 2 2.5 3 3.5 4 5 6 7 8 9 10 11 12 14 16 20 24 28 32 36 40 44 48 56 64 72 80 96`.
3. **Responsive:** `<screen>:<utility>` → `md:grid-cols-2`, `max-md:hidden`, `@md:flex` (container query).
4. **State (JIT):** `<variant>:<utility>` → `hover:bg-blue-600`, `dark:text-white`, `group-hover:opacity-100`.
5. **Stacking (JIT):** chain freely → `md:hover:bg-blue-600`, `print:md:flex`, `portrait:max-md:dark:flex`.

### 4.2 Display, Position, Inset, and Stacking

```html
<!-- Display -->
<div class="block">Block</div>
<div class="inline-block">Inline block</div>
<div class="flex">Flex container</div>
<div class="grid">Grid container</div>
<div class="hidden md:block">Hidden on mobile, block on tablets and up</div>

<!-- Position + inset -->
<header class="sticky top-0 z-50">Sticky header, always on top</header>
<div class="relative">
  <span class="absolute top-2 right-2">Badge</span>
</div>
<div class="fixed inset-0">Full-viewport overlay</div>

<!-- z-index scale: auto hide(-1) 0 10 20 30 40 50 -->
<div class="z-10">Above default content</div>

<!-- Overflow and visibility -->
<div class="overflow-hidden">Clips children</div>
<div class="overflow-x-auto">Horizontal scroll when needed</div>
<div class="invisible">Occupies space but hides</div>
```

Inset utilities (`top-* right-* bottom-* left-* inset-* inset-x-* inset-y-*`) accept the full spacing scale plus fractions and `auto`. Logical-property twins (`start-* end-*`) support right-to-left layouts.

### 4.3 Spacing: Margin, Padding, Gap, and Space

All spacing utilities share the spacing scale, where one step equals `0.25rem` (4px at default root size). Key `4` → `1rem`; key `px` → `1px`.

```html
<!-- Margin: m t r b l x y s e + scale key; negatives with a dash prefix -->
<div class="m-4">Margin 1rem on all sides</div>
<div class="mt-2 mb-6 mx-auto max-w-md">Top, bottom, centered</div>
<div class="-mt-4">Negative top margin pulls upward</div>

<!-- Padding: p t r b l x y s e + scale key -->
<div class="p-6 px-8 py-2">Padding variants</div>

<!-- Gap (flex/grid): gap x y + scale key -->
<div class="grid grid-cols-3 gap-4 gap-x-6">Gaps between cells</div>

<!-- Space-between (adds margin to all but the first child) -->
<div class="space-y-2">
  <p>Item one</p>
  <p>Item two</p>
</div>
```

There are 561 spacing utilities in the catalog (margin plus negatives, padding, gap, space).

### 4.4 Sizing

```html
<div class="w-full max-w-md">Full width, capped at 28rem</div>
<div class="w-1/2 md:w-1/3">Half width → one third on tablets</div>
<div class="h-12 min-h-screen">Fixed height; at least full viewport</div>
<main class="min-h-dvh">Full dynamic viewport height (mobile-safe)</main>
<img class="w-24 h-24 object-cover" src="avatar.jpg" alt="Avatar" />
```

Width and height accept the spacing scale, fractions (`1/2 … 11/12`), viewport units (`h-svh lvh dvh`, `w-svw …`), `auto`, `full`, `screen`, `min`, `max`, `fit`, and arbitrary values (`w-[clamp(1rem,5vw,3rem)]`).

### 4.5 Flexbox

```html
<!-- Centering pattern -->
<div class="flex items-center justify-center min-h-screen">
  <p>Perfectly centered</p>
</div>

<!-- Direction, wrap, grow, shrink -->
<div class="flex flex-col md:flex-row flex-wrap gap-4">
  <div class="flex-1">Grows</div>
  <div class="flex-none">Fixed</div>
  <div class="shrink-0">Never shrinks</div>
</div>

<!-- Alignment -->
<div class="flex items-start justify-between">
  <span>Left</span>
  <span>Right</span>
</div>
```

Available: `flex-row col` (+ `row-reverse col-reverse`), `flex-wrap nowrap wrap-reverse`, `items-start center end stretch baseline`, `justify-start center end between around evenly`, `flex-1 auto initial none`, `grow shrink (shrink-0)`, `order-*`, `self-*`, `place-*` shortcuts.

### 4.6 Grid

```html
<!-- Responsive card grid: 1 → 2 → 3 → 4 → 6 columns -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 4xl:grid-cols-6 gap-4">
  <div>Cell</div>
  <div>Cell</div>
  <div>Cell</div>
</div>

<!-- Explicit placement -->
<div class="grid grid-cols-12 gap-4">
  <aside class="col-span-12 md:col-span-3">Sidebar</aside>
  <main class="col-span-12 md:col-span-9">Content</main>
</div>

<!-- Rows and flow -->
<div class="grid grid-rows-2 grid-flow-col gap-2 auto-cols-fr">
  <div>Flows down columns</div>
</div>
```

Grid utilities cover `grid-cols-1…12 none subgrid`, `grid-rows-*`, `col-span-* col-start-* col-end-*`, `row-span-* row-start-* row-end-*`, `auto-cols auto-rows`, `grid-flow-*`, and `place-*` alignment.

### 4.7 Borders, Radius, Shadows, and Effects

```html
<div class="border border-slate-200 rounded-xl shadow-md">Standard card surface</div>
<div class="border-2 border-dashed border-rose-400 rounded-full">Dashed pill</div>
<button class="shadow-glow rounded-lg">Nakshora's blue glow shadow</button>
<img class="rounded-xs opacity-75 blur-sm" src="photo.jpg" alt="Soft photo" />
<div class="backdrop-blur-md bg-white/70">Frosted overlay (UIT: bg opacity slash)</div>
```

Radius scale: `none xs sm md lg xl 2xl 3xl full` (+ per-corner `rounded-tl-*` etc.). Shadow scale: `none sm base md lg xl 2xl inner glow`. Opacity accepts `0–100` in theme steps. Filters include `blur-* brightness-* contrast-* grayscale invert saturate-* sepia* drop-shadow-*` plus `backdrop-*` twins.

### 4.8 Transforms, Transitions, and Animations

```html
<button class="transition hover:scale-105 active:scale-95 duration-200 ease-out">
  Springy button
</button>
<div class="rotate-3 hover:rotate-0 transition-transform">Tilts upright on hover</div>
<div class="animate-spin h-5 w-5 border-2 rounded-full">Spinner</div>
<div class="animate-pulse skeleton-text w-1/2">Loading line</div>
```

Transforms: `scale-* (incl. 175, 200) rotate-* (incl. 135 225 270 315 360) translate-* skew-* origin-*`. Transitions: `transition(-colors, -opacity, -shadow, -transform) duration-* ease-* (incl. back) delay-*`. Animations: `animate-spin ping pulse bounce fade slide shimmer` with matching `@keyframes` emitted in the base layer.

### 4.9 Complete Example: Fully Responsive Page Layout

This runnable example combines flexbox, grid, spacing, positioning, responsive prefixes, and dark mode. It compiles under JIT when your `content` globs include the file:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Nakshora responsive layout</title>
    <link rel="stylesheet" href="dist/nakshora.css" />
  </head>
  <body class="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <!-- Sticky header -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200 dark:bg-slate-900/90 dark:border-slate-800">
      <nav class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" class="font-black text-xl tracking-tight">NAKSHORA</a>
        <div class="hidden md:flex items-center gap-8">
          <a href="#" class="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition">Docs</a>
          <a href="#" class="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition">Themes</a>
          <a href="#" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition">Get started</a>
        </div>
      </nav>
    </header>

    <!-- Content: sidebar + grid -->
    <div class="flex-1 w-full max-w-6xl mx-auto px-6 py-10 grid grid-cols-12 gap-6">
      <aside class="col-span-12 md:col-span-3">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:sticky md:top-24">
          <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Index</p>
          <ul class="mt-2 space-y-1 text-sm font-medium">
            <li><a href="#" class="block px-3 py-2 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">Overview</a></li>
            <li><a href="#" class="block px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition">Utilities</a></li>
            <li><a href="#" class="block px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition">Themes</a></li>
          </ul>
        </div>
      </aside>

      <main class="col-span-12 md:col-span-9">
        <h1 class="text-3xl md:text-4xl font-black tracking-tight">Responsive by default</h1>
        <p class="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed">
          One column on phones, two on large phones, three on laptops, four on desktops.
        </p>
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <article class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover-lift">
            <h2 class="text-lg font-bold">Card one</h2>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Utilities compose into any design.</p>
          </article>
          <article class="glass p-6">
            <h2 class="text-lg font-bold text-white">Glass card</h2>
            <p class="mt-2 text-sm text-slate-300">Backdrop blur, zero config.</p>
          </article>
          <article class="neon-card p-6">
            <p class="neon-text font-bold">NEON CYBER</p>
            <p class="mt-2 text-sm text-slate-300">Glow built in.</p>
          </article>
        </div>

        <!-- Show / hide helpers -->
        <p class="mt-6 text-sm text-slate-500">
          <span class="block sm:hidden">You read this on a phone.</span>
          <span class="hidden sm:block">You read this on a wider screen.</span>
          <span class="hidden lg:inline">You read this on a laptop or larger.</span>
        </p>
      </main>
    </div>

    <!-- Footer -->
    <footer class="border-t border-slate-200 dark:border-slate-800">
      <div class="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
        <p>Built with Nakshora v3.1 — one stylesheet, zero runtime JS.</p>
        <div class="flex items-center gap-4">
          <a href="#" class="hover:text-slate-900 dark:hover:text-white transition">Docs</a>
          <a href="#" class="hover:text-slate-900 dark:hover:text-white transition">GitHub</a>
        </div>
      </div>
    </footer>
  </body>
</html>
```

Study what this page demonstrates: a sticky positioned header, a 12-column content grid that collapses on mobile, a sidebar that becomes sticky only on `md:` screens, a card grid that scales 1 → 2 → 3 columns, show/hide helpers, and full dark-mode coverage through `dark:` variants. Every class above exists in the v3.1 catalog.

---

## 5. Component Library Breakdown

Nakshora v3.1 ships **19 built-in component classes** organized in six groups. Unlike utilities, you use them as single class names that deliver a complete visual treatment. Key facts from `packages/@nakshora/core/src/components.ts`:

- Components emit **as-is** (no variant expansion) in **both full and JIT mode**.
- They are small, so **every build includes them** automatically.
- They **combine freely with utilities**: `class="glass p-6 rounded-xl"` is the intended pattern.
- You can drop the built-ins with `corePlugins: { components: false }`. Components you register yourself via `addComponents` / `matchComponents` always survive.

There are **no** built-in `.btn`, `.navbar`, `.modal`, or `.form` classes in v3. You compose those patterns from utilities (§5.7). This is deliberate: the framework owns *visual paradigms*; you own *product components*.

### 5.1 Glassmorphism

Frosted-glass surfaces built on `backdrop-filter: blur() saturate()`.

```html
<div class="glass p-8">
  <h3 class="text-lg font-bold text-white">Glass card</h3>
  <p class="mt-2 text-sm text-slate-300">Standard glass — translucent white over dark backgrounds.</p>
</div>

<div class="glass-light p-8">
  <h3 class="text-lg font-bold">Light glass</h3>
  <p class="mt-2 text-sm text-slate-600">Stronger light tint — best over photography.</p>
</div>

<div class="glass-dark p-8">
  <h3 class="text-lg font-bold text-white">Dark glass</h3>
  <p class="mt-2 text-sm text-slate-300">Slate tint — best over dark backgrounds.</p>
</div>
```

| Class | Effect |
|---|---|
| `.glass` | Translucent white (`rgba(255,255,255,0.08)`), `blur(12px) saturate(140%)`, subtle border + shadow, light text |
| `.glass-light` | Stronger light tint (`0.55` alpha), `blur(16px) saturate(160%)`, dark text |
| `.glass-dark` | Slate tint (`rgba(15,23,42,0.55)`), slate border, light text |

All three set `border-radius: 0.75rem` and include the `-webkit-` prefix for Safari. Override the radius with any `rounded-*` utility.

### 5.2 Neon Cyber

High-saturation glowing UI designed for dark backgrounds. Pairs with the `neonTheme` preset.

```html
<div class="neon-card p-6 text-center">
  <p class="neon-text text-lg font-bold tracking-wide">SYSTEM ONLINE</p>
  <p class="mt-2 text-sm text-slate-300">Glow intensifies when you hover the card.</p>
  <button class="neon-btn mt-4">Engage</button>
</div>

<!-- Apply the glow treatment to any element -->
<div class="neon-glow bg-slate-900 p-4 rounded-lg">Custom glowing panel</div>
```

| Class | Effect |
|---|---|
| `.neon-card` | Deep-navy card (`#0a1929`), cyan glow border; glow intensifies on hover |
| `.neon-btn` | Cyan→pink gradient button (`#00d9ff → #ff006e`), neon shadow, lifts 1px on hover |
| `.neon-glow` | Adds a layered cyan glow shadow to any element |
| `.neon-text` | Cyan text with layered `text-shadow` glow |

### 5.3 Brutalism

Raw, high-contrast, zero ornamentation. Pairs with the `brutalistTheme` preset.

```html
<div class="brutalist-card p-6">
  <h3 class="font-black uppercase tracking-wide">No frills</h3>
  <p class="mt-2 text-sm">Hard borders. Hard shadows. Zero rounding.</p>
  <button class="brutalist-btn mt-4">Smash</button>
</div>
```

| Class | Effect |
|---|---|
| `.brutalist-card` | White card, 3px black border, `border-radius: 0`, hard `8px 8px 0 #000` offset shadow; shifts and turns the shadow red on hover |
| `.brutalist-btn` | Yellow block button (`#facc15`), 3px border, hard shadow, uppercase black type; turns red on hover and physically "presses" (`translate(5px,5px)`, shadow collapses) on `:active` |

### 5.4 Minimalism

Quiet, professional surfaces. Pairs with the `minimalistTheme` preset.

```html
<div class="minimalist-card p-6">
  <h3 class="text-lg font-semibold">Simple</h3>
  <p class="mt-2 text-sm text-slate-600">Hairline border. Barely-there shadow.</p>
  <button class="minimalist-btn mt-4">Continue</button>
</div>
```

| Class | Effect |
|---|---|
| `.minimalist-card` | White card, 1px `#e5e7eb` border, `0.5rem` radius, minimal shadow; border darkens slightly on hover |
| `.minimalist-btn` | Dark pill button (`#111827`); inverts to light background with dark text on hover |

### 5.5 Skeletons (Loading States)

Shimmer placeholders for content that has not loaded yet. All three run the built-in `shimmer` keyframe animation (`background-position` sweep, 1.5s linear infinite).

```html
<div class="bg-white rounded-xl border border-slate-200 p-6 flex items-start gap-4">
  <div class="skeleton-circle w-12 h-12 shrink-0"></div>
  <div class="flex-1 space-y-2 py-1">
    <div class="skeleton-text w-3/4"></div>
    <div class="skeleton-text w-1/2"></div>
    <div class="skeleton-text w-5/6"></div>
  </div>
</div>
```

| Class | Effect |
|---|---|
| `.skeleton-rect` | Rounded-rectangle shimmer — set `w-*` / `h-*` on the element |
| `.skeleton-circle` | Circular shimmer for avatars (`border-radius: 9999px`) |
| `.skeleton-text` | Text-line shimmer with `height: 1em`, so it matches surrounding type size |

### 5.6 Helpers

Single-purpose treatments that lift any element:

```html
<div class="bg-white rounded-xl shadow-md p-6 hover-lift">
  Lifts 4px with a deeper shadow on hover.
</div>

<h1 class="text-4xl font-black gradient-text">Gradient headline</h1>

<div class="gradient-neon p-8 rounded-xl">Dark navy diagonal background</div>
<div class="gradient-pastel p-8 rounded-xl">Soft pink → blue → green background</div>
<div class="gradient-nature p-8 rounded-xl">Deep forest background</div>
<div class="gradient-brutalist p-8">Yellow → red background</div>
```

| Class | Effect |
|---|---|
| `.hover-lift` | `translateY(-4px)` + deeper shadow on hover, 200ms transition |
| `.gradient-text` | Blue → purple → pink text via `background-clip: text` |
| `.gradient-neon` | Dark navy diagonal gradient background |
| `.gradient-pastel` | Soft pink → blue → green gradient background |
| `.gradient-nature` | Deep forest gradient background |
| `.gradient-brutalist` | Yellow → red gradient background |

### 5.7 Utility-Composed Patterns: Buttons, Cards, Forms, Modals, Navbars

These patterns use **only documented utilities** — no built-in component classes. Copy them directly; each compiles under JIT.

**Buttons** — six treatments, one grammar:

```html
<!-- Primary -->
<button
  class="px-5 py-2.5 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 active:scale-95 transition shadow-md"
>
  Primary
</button>

<!-- Glass -->
<button class="glass px-5 py-2.5 text-white font-medium rounded-lg hover:bg-white/20 transition">
  Glass
</button>

<!-- Neon / Brutalist / Minimal (built-in components) -->
<button class="neon-btn">Neon</button>
<button class="brutalist-btn">Brutal</button>
<button class="minimalist-btn">Minimal</button>

<!-- Ghost -->
<button class="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-md font-medium transition">
  Ghost
</button>

<!-- Disabled state -->
<button
  class="px-5 py-2.5 bg-blue-500 text-white font-semibold rounded-lg opacity-50 disabled:cursor-not-allowed"
  disabled
>
  Disabled
</button>
```

**Cards** — standard, dark-mode-aware, and loading variants:

```html
<!-- Standard -->
<div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover-lift dark:bg-slate-800 dark:border-slate-700">
  <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Title</h3>
  <p class="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
    Body copy with comfortable line height.
  </p>
  <a href="#" class="inline-block mt-4 text-blue-500 hover:text-blue-600 font-medium">Learn more →</a>
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
```

**Forms** — accessible inputs composed from border, spacing, and focus variants:

```html
<form class="max-w-md space-y-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
  <div>
    <label for="email" class="block text-sm font-semibold text-slate-700">Email</label>
    <input
      id="email"
      type="email"
      placeholder="you@example.com"
      class="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
  <div>
    <label for="role" class="block text-sm font-semibold text-slate-700">Role</label>
    <select
      id="role"
      class="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option>Student</option>
      <option>Developer</option>
      <option>Teacher</option>
    </select>
  </div>
  <label class="flex items-center gap-2 text-sm text-slate-600">
    <input type="checkbox" class="peer h-4 w-4 rounded border-slate-300" />
    <span>Email me the course notes</span>
  </label>
  <button
    type="submit"
    class="w-full px-5 py-2.5 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 active:scale-[0.98] transition"
  >
    Enroll
  </button>
</form>
```

**Modal** — fixed overlay plus centered panel, no JavaScript required for the styling:

```html
<!-- Overlay -->
<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
  <!-- Panel -->
  <div class="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
    <h2 class="text-xl font-bold text-slate-900 dark:text-white">Confirm enrollment</h2>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
      You are about to enroll in the Nakshora CSS course module. Continue?
    </p>
    <div class="mt-6 flex justify-end gap-3">
      <button class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition">
        Cancel
      </button>
      <button class="px-4 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition">
        Confirm
      </button>
    </div>
  </div>
</div>
```

**Navbar** — sticky glass header that collapses links on mobile:

```html
<header class="sticky top-0 z-50 glass-dark">
  <nav class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
    <a class="text-white font-black text-xl tracking-tight" href="#">NAKSHORA</a>
    <div class="hidden md:flex items-center gap-8">
      <a class="text-slate-300 hover:text-white text-sm font-medium transition" href="#">Docs</a>
      <a class="text-slate-300 hover:text-white text-sm font-medium transition" href="#">Themes</a>
      <a class="text-slate-300 hover:text-white text-sm font-medium transition" href="#">Blog</a>
      <a
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition"
        href="#"
        >Get started</a
      >
    </div>
    <button class="md:hidden text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition">
      Menu
    </button>
  </nav>
</header>
```

---

## 6. Interactive Practical Learning Lab (Exercises)

Work through these exercises in order. Each states a goal, lists acceptance criteria, and then gives the complete solution so you can verify your work. Use any integration path; the CLI path (`nakshora dev`) gives the fastest feedback loop.

**Lab setup (all exercises):**

```bash
mkdir nakshora-lab && cd nakshora-lab
npm install -D @nakshora/cli
nakshora init
# point content at your files in nakshora.config.js:
# content: ['./*.html']
nakshora dev nakshora.css -o dist/nakshora.css
```

Link `dist/nakshora.css` from each exercise file and rebuild (watch mode rebuilds automatically — median 1.3 ms incremental).

### 6.1 Exercise 1: Responsive Profile Card

**Goal.** Build a profile card that stacks vertically on phones and switches to a horizontal layout on tablets and larger.

**Requirements:**

1. Card container: white surface, `rounded-xl`, border, shadow, `hover-lift`, max width `max-w-md`, padding `p-6`.
2. Avatar: use `skeleton-circle` sized `w-16 h-16` as a placeholder (swap in an `<img>` with the same sizing later).
3. Name (`text-xl font-bold`), role (`text-sm` in `text-slate-500`), and a two-line bio (`text-sm leading-relaxed`).
4. A primary follow button (`bg-blue-500`, hover darkens, presses down on `:active`).
5. Layout: `flex-col` by default, `sm:flex-row` with `sm:items-center` and `gap-4`.
6. Dark mode: card turns `dark:bg-slate-800`, text adapts. Test by toggling `class="dark"` on `<html>`.

**Solution:**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Exercise 1 — Profile card</title>
    <link rel="stylesheet" href="dist/nakshora.css" />
  </head>
  <body class="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-6">
    <article
      class="w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-md p-6 hover-lift flex flex-col sm:flex-row sm:items-center gap-4"
    >
      <div class="skeleton-circle w-16 h-16 shrink-0"></div>
      <div class="flex-1">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white">Ayesha Rahman</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">Front-end developer · Dhaka</p>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Builds responsive interfaces with utility-first CSS. Learning Nakshora one component at a time.
        </p>
        <button
          class="mt-4 px-5 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 active:scale-95 transition"
        >
          Follow
        </button>
      </div>
    </article>
  </body>
</html>
```

**Check your work:** narrow the window below 640px — the avatar stacks above the text. Widen it — the card turns horizontal. Add `class="dark"` to `<html>` — the card, text, and page background all switch. If any variant fails, run `nakshora doctor` and confirm your `content` glob includes this file (state and screen variants need JIT).

### 6.2 Exercise 2: Navigation Bar

**Goal.** Build a sticky navbar with a brand mark, three links, and a call-to-action button. Links show on `md:` screens and larger; a compact menu button shows below `md:`.

**Requirements:**

1. `header` is `sticky top-0 z-50` with the `glass-dark` treatment.
2. Inner `nav`: centered (`max-w-6xl mx-auto`), padded (`px-6`), fixed height (`h-16`), flex with `items-center justify-between`.
3. Brand: `font-black text-xl tracking-tight text-white`.
4. Link group: `hidden md:flex items-center gap-8`; links are `text-sm font-medium text-slate-300 hover:text-white transition`.
5. CTA button: `bg-blue-500 hover:bg-blue-600`, white semibold text, `rounded-lg`, padding `px-4 py-2`.
6. Mobile menu button: visible only below `md:` (`md:hidden`), subtle hover background (`hover:bg-white/10`).

**Solution:**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Exercise 2 — Navbar</title>
    <link rel="stylesheet" href="dist/nakshora.css" />
  </head>
  <body class="min-h-screen bg-slate-950">
    <header class="sticky top-0 z-50 glass-dark">
      <nav class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a class="text-white font-black text-xl tracking-tight" href="#">NAKSHORA</a>
        <div class="hidden md:flex items-center gap-8">
          <a class="text-slate-300 hover:text-white text-sm font-medium transition" href="#">Docs</a>
          <a class="text-slate-300 hover:text-white text-sm font-medium transition" href="#">Themes</a>
          <a class="text-slate-300 hover:text-white text-sm font-medium transition" href="#">Blog</a>
          <a
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition"
            href="#"
            >Get started</a
          >
        </div>
        <button
          class="md:hidden text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition"
        >
          Menu
        </button>
      </nav>
    </header>

    <main class="max-w-6xl mx-auto px-6 py-16">
      <div class="glass p-8 text-center">
        <h1 class="text-3xl font-bold text-white">Scroll — the header stays.</h1>
        <p class="mt-2 text-slate-300">Sticky positioning + glassmorphism, zero custom CSS.</p>
      </div>
      <div class="h-[120vh]"></div>
    </main>
  </body>
</html>
```

**Check your work:** resize across the 768px boundary — links and the menu button swap. Scroll the tall page — the header sticks. Hover each link — the color transitions to white. Run `nakshora inspect "md:flex"` to see the exact `@media (min-width: 768px)` rule the compiler emits.

### 6.3 Exercise 3 (Stretch): Dark-Mode Feature Grid with Loading State

**Goal.** Combine everything: a responsive grid, dark mode, a gradient headline, and a skeleton loader.

**Requirements:**

1. Page: `min-h-screen bg-slate-50 dark:bg-slate-950`, centered content column (`max-w-5xl mx-auto px-6 py-12`).
2. Headline uses `gradient-text` at `text-3xl md:text-4xl font-black`.
3. Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`.
4. Three cards: one standard utility card, one `.glass` card, one `.neon-card` — each dark-mode-aware where utilities allow.
5. Below the grid, a skeleton loader row (one `skeleton-circle` + two `skeleton-text` lines) inside a bordered panel.
6. A toggle button that adds/removes `dark` on `<html>` (three lines of vanilla JS — styling stays pure Nakshora).

**Solution:**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Exercise 3 — Feature grid</title>
    <link rel="stylesheet" href="dist/nakshora.css" />
  </head>
  <body class="min-h-screen bg-slate-50 dark:bg-slate-950">
    <main class="max-w-5xl mx-auto px-6 py-12">
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <h1 class="text-3xl md:text-4xl font-black gradient-text">Ship responsive UIs fast</h1>
        <button
          id="theme-toggle"
          class="px-4 py-2 text-sm font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          Toggle dark mode
        </button>
      </div>

      <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <article class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover-lift">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">Utility-first</h2>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            11,417 utilities across 35 categories. Compose any design in markup.
          </p>
          <a href="#" class="inline-block mt-4 text-sm font-medium text-blue-500 hover:text-blue-600">Learn more →</a>
        </article>

        <article class="glass p-6">
          <h2 class="text-lg font-bold text-white">Glassmorphism</h2>
          <p class="mt-2 text-sm text-slate-300 leading-relaxed">Backdrop blur, zero config.</p>
          <button class="mt-4 px-4 py-2 text-sm font-medium text-white rounded-lg hover:bg-white/20 transition">
            Preview
          </button>
        </article>

        <article class="neon-card p-6">
          <p class="neon-text font-bold tracking-wide">NEON CYBER</p>
          <p class="mt-2 text-sm text-slate-300 leading-relaxed">Glow built in for dark UIs.</p>
          <button class="neon-btn mt-4">Engage</button>
        </article>
      </div>

      <div class="mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 flex items-center gap-4">
        <div class="skeleton-circle w-12 h-12 shrink-0"></div>
        <div class="flex-1 space-y-2">
          <div class="skeleton-text w-3/4"></div>
          <div class="skeleton-text w-1/2"></div>
        </div>
      </div>
    </main>

    <script>
      document
        .getElementById('theme-toggle')
        .addEventListener('click', () => document.documentElement.classList.toggle('dark'));
    </script>
  </body>
</html>
```

**Check your work:** click the toggle — every `dark:` variant flips at once. Resize through 640px and 1024px — the grid gains columns. Inspect the built CSS with `nakshora build --stats` — note how small the JIT output is compared with the 5.98 MB full build. You now think in utilities.

---

## 7. Conclusion and Review Questions

### 7.1 Summary of Architectural Paradigms

You learned five paradigms that define Nakshora v3.1:

1. **Utility-first composition.** Small classes map to CSS declarations. You design in the `class` attribute instead of writing stylesheets.
2. **Mobile-first responsive design.** Base styles apply everywhere; ten screen prefixes (`xxs:` → `5xl:`, 200px → 5000px) layer overrides upward, with `max-*` twins for desktop-first exceptions and container queries (`@md:`) for component-relative breakpoints.
3. **Just-in-time compilation.** The engine extracts class candidates from your `content` files and emits only used CSS (median 18.2 ms warm build, 1.3 ms incremental). State variants exist only in JIT mode.
4. **Token-driven theming.** One resolved theme (colors, spacing, type, shadows, radii, breakpoints, motion) feeds every utility, generates `:root` CSS variables, and accepts presets, deep overrides, plugins, and CSS-first `@theme` blocks.
5. **Paradigm components.** Nineteen built-in classes deliver complete glass, neon, brutalist, minimalist, skeleton, and gradient treatments — always composable with utilities, never a replacement for them.

The framework's measurable shape: **11,417 utilities · 35 categories · 22 palettes × 11 shades · 10 screens · 155 variants · 5 presets · 0 bytes of runtime JavaScript · MIT license.**

### 7.2 Concept-Check Questions

Answer from memory, then verify against the section cited.

1. **Modes.** You add `hover:bg-blue-600` to a page built with the CDN link, but the hover style never applies. What causes this, and what are two ways to fix it? (§2.6, §3.1)
2. **Breakpoints.** Your design needs one column on phones, two columns on tablets, and four columns on desktops. Write the single `class` value for the grid container. At which exact pixel widths do the changes trigger? (§3.6, §4.6)
3. **Variants.** Explain the difference between `group-hover:` and `peer-focus:`. Where do you place the `group` and `peer` classes in each pattern? (§3.7)
4. **Theming.** You must add a brand color `#6d28d9` as `brand-500` so that `bg-brand-500`, `text-brand-500`, and `border-brand-500` all work. Show the config change and explain why all three utilities appear automatically. (§3.4)
5. **Architecture.** Contrast JIT mode with full mode: what triggers each, what each emits, and when you would choose one over the other. Include the approximate output sizes. (§3.1, §2.5)

**Answer key:**

1. State variants (`hover:`, `dark:`, `group-*`, …) emit **only in JIT mode**; the CDN file carries base + responsive utilities alone. Fix it by (a) adopting any compiler path — Vite, PostCSS, or CLI with `content` configured — or (b) writing the hover rule as custom CSS. Verify with `nakshora doctor` and `nakshora inspect "hover:bg-blue-600"`.
2. `class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"`. Changes trigger at `md` = **768px** and `xl` = **1280px** (mobile-first `min-width` queries; `sm`–`2xl` match Tailwind exactly).
3. `group-hover:` styles a **descendant** when an **ancestor** is hovered — place `group` on the ancestor, `group-hover:*` on the child. `peer-focus:` styles a **later sibling** when an **earlier sibling** gains focus — place `peer` on the earlier sibling, `peer-focus:*` on the later one (`~` combinator).
4. Add `theme: { colors: { brand: { 500: '#6d28d9' } } }` to `nakshora.config.js`. Every color entry automatically generates the `text-*`, `bg-*`, `border-*`, `from-*`, `via-*`, `to-*` families plus a `--color-brand-500` variable, because the generator derives all six families from the resolved `colors` scale.
5. **JIT:** triggered by `content` globs (or `--mode jit`); emits only used classes + `safelist`, including all state variants — typically **5–20 KB**. **Full:** triggered by absent `content` (or `--mode full`); emits all base + responsive utilities + components, no state variants — **~5.98 MB raw / ~133 KB Brotli**. Choose JIT for every project with a build step; choose full/CDN only for zero-tooling pages.

### 7.3 Quick-Reference Cheat Sheet

| Task | Classes / commands |
|---|---|
| Center content | `flex items-center justify-center` or `text-center` |
| Card surface | `bg-white rounded-xl shadow-md border border-slate-200 p-6` |
| Hover effect | `hover:bg-blue-600 transition` |
| Responsive grid | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6` |
| Show / hide by screen | `hidden md:block`, `max-md:hidden` |
| Dark mode | `<html class="dark">` + `dark:bg-slate-900 dark:text-white` |
| Sticky header | `sticky top-0 z-50` |
| Truncate text | `truncate` |
| Loading state | `skeleton-text` / `skeleton-circle` |
| Gradient text | `gradient-text` |
| Glass panel | `glass p-6` (+ `rounded-xl`) |
| Diagnose project | `nakshora doctor` |
| Preview one class | `nakshora inspect "md:hover:bg-blue-600"` |
| Build with stats | `nakshora build nakshora.css -o dist/nakshora.css --stats` |

### 7.4 Next Steps for Learners

- Read the [Utilities Reference](https://docs.nakshora.bsdc.info.bd/v3.1/hub/utilities/) hub (129 pages) and the [Colors](https://docs.nakshora.bsdc.info.bd/v3.1/hub/colors/) hub (361 pages) on the official docs platform.
- Work the [Tutorials](https://docs.nakshora.bsdc.info.bd/v3.1/hub/tutorials/) and [Recipes](https://docs.nakshora.bsdc.info.bd/v3.1/hub/recipes/) collections for guided practice.
- Study `docs/CONFIGURATION.md`, `docs/JIT.md`, and `docs/RESPONSIVE.md` in the repository for compiler internals.
- Experiment in the [Playground](https://nakshora.bsdc.info.bd/playground/), which compiles classes live in the browser with the same engine and no build step.

---

## 8. References

Real publications and primary sources about the Nakshora CSS framework, consulted for this guide:

1. **RRC Development — Global launch announcement (press release, September 13, 2026).** "RRC Development Announces the Global Launch of Nakshora: A Next-Generation, Open-Source Utility Frontend CSS Framework Built for the Semantic Web." Published on openPR. Describes the utility-first paradigm shift, the Sylhet-based team's goals, and the open-source release. <https://www.openpr.com/news/4630229/rrc-devolopment-announces-the-global-launch-of-nakshora>
2. **Rizwan Rahim Chowdhury — "I built a sub-4ms JIT CSS framework with native Glassmorphism and built-in LLM training files" (DEV Community, September 2026).** The author's technical account of the zero-dependency JIT engine, the utility catalog, Vite/PostCSS/CLI integrations, and the `llms.txt` + corpus + SFT-dataset strategy for AI-assisted development. <https://dev.to/debatesylhetbd/i-built-a-sub-4ms-jit-css-framework-with-native-glassmorphism-and-built-in-llm-training-files-3aah>
3. **Official documentation platform — Nakshora Docs.** Versioned guides, utility reference, recipes, and tutorials for v1.0–v3.1 (9,375+ articles). The v3.1 hub documents 11,417 utilities, 10 breakpoints, 155 variants, and the 2026-09-14 release. <https://docs.nakshora.bsdc.info.bd/> · <https://docs.nakshora.bsdc.info.bd/v3.1/>
4. **Source repository — `nakshora/nakshora` (GitHub, MIT license).** Monorepo with `packages/@nakshora/{core,cli,postcss,vite-plugin}`, full `docs/` collection, benchmarks, and test suites. <https://github.com/nakshora/nakshora>
5. **Project website and live playground.** Framework overview and in-browser JIT compilation demo. <https://nakshora.bsdc.info.bd> · <https://nakshora.bsdc.info.bd/playground/>
6. **npm registry — `@nakshora/core`, `@nakshora/cli`, `@nakshora/postcss`, `@nakshora/vite-plugin` (v3.1.0).** Published packages with provenance; GitHub Packages mirror. <https://www.npmjs.com/package/@nakshora/core>

---

*End of module. Version covered: 3.1.0 · License of the framework: MIT · Author of the framework: Rizwan Rahim Chowdhury (RRC Development).*
