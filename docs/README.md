# Nakshora Documentation

Everything you need to go from zero to production with Nakshora — the modern,
ultra-fast, utility-first CSS framework with a JIT compiler.

## 📖 Start here

| Document                                | What you'll learn                                              |
| --------------------------------------- | -------------------------------------------------------------- |
| [Getting Started](./GETTING_STARTED.md) | Build your first UI in 5 minutes                               |
| [Full Setup Guide](./SETUP.md)          | ⭐ Complete, end-to-end setup: every integration, step by step |
| [Installation](./INSTALLATION.md)       | npm / pnpm / yarn / CDN / framework install details            |
| [Migration Guide](./MIGRATION.md)       | Moving from Nakshora v1/v2 or Tailwind                         |

## 🧩 Reference

| Document                                          | Contents                                                                                 |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [Utilities Reference](./UTILITIES.md)             | Every utility, organized by category (3,000+ classes, generated from source)             |
| [Variants](./VARIANTS.md)                         | `hover:`, `focus:`, `active:`, `disabled:`, `group-*`, `peer-*`, `dark:` …               |
| [Responsive](./RESPONSIVE.md)                     | Breakpoints, mobile-first workflow, custom breakpoints                                   |
| [Configuration](./CONFIGURATION.md)               | Every config option, theme sections, plugins, important, corePlugins                     |
| [CSS-first config](./CSS_CONFIG.md)               | `@theme` / `@utility` / `@custom-variant` (Tailwind v4 syntax) on top of the config file |
| [JIT Compiler](./JIT.md)                          | Content scanning, safelist, purge, minification, sizes                                   |
| [Themes & Presets](./THEMES.md)                   | The 5 built-in presets + building your own theme                                         |
| [Design Components](./utilities/13-components.md) | Glass, neon, brutalist, minimalist, skeletons, helpers                                   |

## 🛠️ Integrations

| Document                       | Contents                                                                               |
| ------------------------------ | -------------------------------------------------------------------------------------- |
| [CLI](./CLI.md)                | `nakshora init / build / dev / doctor / migrate / lsp / inspect / export:ai`           |
| [Editors](./EDITORS.md)        | Language server: completion, hover, diagnostics, colours (VS Code, Neovim, Zed, Helix) |
| [PostCSS Plugin](./POSTCSS.md) | `@nakshora source` / `@nakshora utilities` at-rules                                    |
| [Vite Plugin](./VITE.md)       | Virtual CSS module, HMR, PostCSS pipeline                                              |
| [JavaScript API](./API.md)     | `CSSGenerator`, config helpers, plugin API — the full programmatic surface             |

## 🤖 AI / LLM integration

| Document                                      | Contents                                              |
| --------------------------------------------- | ----------------------------------------------------- |
| [AI Training](./AI_TRAINING.md)               | Fine-tune or RAG-augment LLMs with Nakshora knowledge |
| [`llms.txt`](../llms.txt)                     | Concise machine-readable framework description        |
| [`llms-full.md`](../llms-full.md)             | Complete documentation for LLM context windows        |
| [`ai/corpus.json`](../ai/corpus.json)         | Structured corpus of every utility (machine format)   |
| [`ai/sft-train.jsonl`](../ai/sft-train.jsonl) | Ready-to-use SFT (instruction-tuning) dataset         |

## 🚀 Operations

| Document                                | Contents                                                        |
| --------------------------------------- | --------------------------------------------------------------- |
| [Publishing](./PUBLISHING.md)           | How the automatic npm publishing system works (Changesets + CI) |
| [Performance](./PERFORMANCE.md)         | Build benchmarks, bundle sizes, JIT tuning                      |
| [Troubleshooting](./TROUBLESHOOTING.md) | Fix common build/integration problems                           |
| [Development](./DEVELOPMENT.md)         | Contributing to the framework itself                            |
| [Examples](./EXAMPLES.md)               | Copy-paste components: cards, navs, forms, heroes               |

## 📦 Monorepo packages

| Package                                                      | Description               |
| ------------------------------------------------------------ | ------------------------- |
| [`@nakshora/core`](../packages/@nakshora/core)               | JIT CSS compiler & engine |
| [`@nakshora/cli`](../packages/@nakshora/cli)                 | Command-line interface    |
| [`@nakshora/postcss`](../packages/@nakshora/postcss)         | PostCSS plugin            |
| [`@nakshora/vite-plugin`](../packages/@nakshora/vite-plugin) | Vite plugin with HMR      |

## Archive

Legacy v2 documentation lives in [docs/archive](./archive) — kept for reference only.
