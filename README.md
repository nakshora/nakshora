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

`11,417 utilities` · `35 categories` · `22 color palettes` · `5 theme presets` · `zero runtime JS` · `18 ms JIT build (200 lines)` · `1.3 ms incremental rebuild`

</div>

---

## ✨ Features

|                                 |                                                                                                                                                                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ⚡ **JIT compiler**             | Only the classes you use are compiled — KB-sized CSS from an 11,417-utility catalog                                                                                                                                      |
| 🎨 **Utility-first**            | 11,417 utilities across 35 categories: layout, spacing, sizing, flexbox, grid, typography, colors, borders, effects, transforms, transitions, animations                                                                 |
| 🌈 **22 palettes × 11 shades**  | `slate gray zinc neutral stone red orange amber yellow lime emerald green teal cyan sky blue indigo violet purple fuchsia pink rose` — auto-generates `text-*` `bg-*` `border-*` `from-*` `via-*` `to-*` + CSS variables |
| 📱 **Mobile-first responsive**  | 10 screens `xxs:` 200 → `5xl:` 5000px (`sm`–`2xl` identical to Tailwind), `max-*:`, `@container` / `@min-*` / `@max-*`, stacked media collapse into one query — see [Responsive](docs/RESPONSIVE.md)                     |
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
| [Getting Started](docs/GETTING_STARTED.md)      | [Utilities (11,417, by category)](docs/UTILITIES.md)                                           |
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

Medians from `pnpm benchmark` (Node 22; the numbers are pinned in
`perf/baseline.json` and CI fails on a >10 % regression):

```
operation                                        ms
──────────────────────────────────────────────────────
JIT build (200 lines of HTML, warm)              18.2
JIT build, 500 files, one file changed            1.3
full build (11,417 utilities, sm–2xl)            371
full build + minify                              302
```

| Build                                          | Size                                               |
| ---------------------------------------------- | -------------------------------------------------- |
| full (base + all utilities, sm–2xl)            | 6,380 KB → **5,842 KB min** (578 KB gz, 130 KB br) |
| the 200-line benchmark page (JIT)              | 18.4 KB → **16.1 KB min**                          |
| this project's landing page (JIT, 179 classes) | **17.8 KB min · 3.9 KB gzip**                      |
| runtime JS                                     | **0 bytes** (pure CSS output)                      |

→ [Performance details](docs/PERFORMANCE.md)

## 🚀 Automatic publishing

Add a changeset to your PR → merge → CI opens a **Version Packages** release PR → merge that → **npm publish (with provenance)** + version tags + **GitHub Releases** + **GitHub Packages** mirror. Two PR merges, zero manual publishing.

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
