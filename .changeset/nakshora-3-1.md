---
'@nakshora/core': minor
'@nakshora/cli': minor
'@nakshora/postcss': minor
'@nakshora/vite-plugin': minor
---

# Nakshora 3.1 — Tailwind 3.4 parity, 10-breakpoint responsive, CLI/LSP & CSS-first config

A feature release. The engine reaches Tailwind 3.4 parity (verified by a
differential oracle), the responsive system grows from four breakpoints to ten,
and the CLI gains a language server, a dependency-free dev server and
Tailwind-v4-style CSS-first configuration.

- **Engine parity (core)** — a permanent differential oracle against
  `tailwindcss@3.4.19` proves 11,343 static and 1,338 dynamic classes
  byte-identical, and the official plugins (`@tailwindcss/typography`, `forms`,
  `aspect-ratio`, `container-queries`) run unchanged. Adds `@apply`, `theme()`,
  `screen()`, `darkMode: 'class' | 'media' | 'selector'`, the legacy
  `*-opacity-*` helpers, `size-*`, the full Tailwind plugin API (including the
  `bare` extension) and opt-in `@layer` output. The catalog grows from 3,091 to
  **11,417 utilities** across 35 categories, 22 palettes and 10 screens.
- **Responsive (core)** — a 10-step breakpoint scale (`xxs` 200px … `5xl`
  5000px) with `max-*` variants at `px-0.02`, combined media queries that stack
  to the tighter bound, `theme.breakpoints`, `@container` / `@min-*` / `@max-*`
  container variants, and `.container` max-widths from `sm` through `2xl`.
- **CSS-first configuration** — Tailwind-v4 syntax written in the stylesheet
  itself: `@theme`, `@utility` and `@custom-variant`.
- **CLI** — `nakshora lsp` (a language server plus a reusable `LanguageService`
  for editor IntelliSense), `nakshora dev --serve` (a dependency-free dev server
  with CSS hot-swap), new `build` flags `--content`, `--safelist`,
  `--source-map`, `--stats`, `--diff` and `--minify`, CSS from stdin, and the
  `doctor` and `migrate` commands.
- **Plugins** — `@apply` / `theme()` / `@screen` are wired through
  `@nakshora/postcss`, `@nakshora/cli` and `@nakshora/vite-plugin`; the Vite
  plugin is verified against real Vite 5/6/7/8 builds, and both plugins against
  packed-tarball installs (ESM and CJS). `@nakshora/core`'s `dist` now contains
  zero Node API references — enforced by a test — so it runs in the browser.
- **Node 18 support** — `postcss`, `cli` and `vite-plugin` now use `fast-glob@3`
  instead of the ESM-only `globby@14`, so their CJS entry points are
  `require()`-able on Node 18; the dev server also closes cleanly there.
- **Performance** — per-resolved-theme catalog memoisation, an incremental
  content cache (mtime + hash), deterministic scanning and an output dedup
  audit. A CI gate (`scripts/benchmark.mjs` + `perf/baseline.json`) fails the
  build on a regression of more than 10 % and 2 ms.
- **Tests & docs** — 53 → **238** tests across 31 files. New or rewritten:
  `docs/COMPATIBILITY.md` (which lists the remaining v4-only gaps honestly),
  `docs/RESPONSIVE.md`, `docs/CSS_CONFIG.md`, `docs/EDITORS.md`,
  `docs/PLAYGROUND.md` and the generated utility reference; regenerated
  `ai/corpus.json` and `llms-full.md`. Every numeric claim in the README and
  docs is pinned to the code by `doc-claims.test.ts`.
