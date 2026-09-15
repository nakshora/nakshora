# @nakshora/core

## 3.1.0

### Minor Changes

- [#9](https://github.com/nakshora/nakshora/pull/9) [`ad2986d`](https://github.com/nakshora/nakshora/commit/ad2986db2432293c3c2bf2c4e7141090c78b475c) Thanks [@arena-ai-coding-agent](https://github.com/apps/arena-ai-coding-agent)! - # Nakshora 3.1 — Tailwind 3.4 parity, 10-breakpoint responsive, CLI/LSP & CSS-first config

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

## 3.0.0

### Major Changes

- [#1](https://github.com/nakshora/nakshora/pull/1) [`3d1b710`](https://github.com/nakshora/nakshora/commit/3d1b7102b6bc9820c4b83164e874ac6a60bb7fa9) Thanks [@arena-ai-coding-agent](https://github.com/apps/arena-ai-coding-agent)! - # Nakshora 3.0 — the modern monorepo, JIT engine & AI-ready docs

  A ground-up modernization. Highlights:

  - **Modern pnpm monorepo** — `@nakshora/core`, `@nakshora/cli`,
    `@nakshora/postcss`, `@nakshora/vite-plugin` with shared `tools/ts-config`,
    committed `pnpm-lock.yaml`, ESLint 9 + Prettier, vitest (53 tests),
    Node 18/20/22 CI matrix.
  - **JIT engine (core)** — 3,091 utilities across 29 categories; state
    variants (`hover: focus: active: disabled: dark: group-*: peer-* …`);
    responsive + state combinations; safelist; `important: true | '#scope'`;
    `corePlugins` toggles; plugin API; 5 theme presets (neon, pastel,
    brutalist, minimalist, nature); built-in design components (glass, neon,
    brutalist, minimalist, skeletons, gradients); CSS variables for every
    token; deterministic output.
    - **Fixed**: `.mr-*`/`-right` spacing utilities emitted the scale key
      instead of the value.
    - **Fixed**: responsive media blocks were empty stubs.
    - **Fixed**: broken theme imports in v2.
  - **CLI** — `nakshora init / build / dev / inspect / export:ai`, config
    discovery (ts/js/mjs/cjs/json), watch mode, `--mode full|jit`.
  - **PostCSS plugin** — `@nakshora source|base|variables|keyframes|utilities|components`.
  - **Vite plugin** — virtual `import 'nakshora'` module, PostCSS pipeline
    injection, content watching with HMR.
  - **AI training assets** — `llms.txt`, `llms-full.md`, `ai/corpus.json`
    (structured corpus of every utility) and `ai/sft-train.jsonl` (SFT
    dataset), all regenerable via `pnpm ai:export`.
  - **Documentation** — full setup guide, per-category utility reference
    (generated from source), variants/responsive/config/JIT/themes/CLI/
    PostCSS/Vite/API/AI/publishing/performance/troubleshooting/migration
    guides; legacy v2 docs archived under `docs/archive/`.
  - **Publishing** — Changesets-based automatic release: npm (provenance) +
    GitHub Packages mirror + GitHub Release with tarballs.

### Patch Changes

- [#3](https://github.com/nakshora/nakshora/pull/3) [`01dac45`](https://github.com/nakshora/nakshora/commit/01dac454f04dfdcce89293320e3c4cd64c9dec1c) Thanks [@arena-ai-coding-agent](https://github.com/apps/arena-ai-coding-agent)! - Ship a package `README.md` (and `CHANGELOG.md`) inside the published tarball.
  `files` already listed `README.md`, but no package had one, so every package
  would have landed on npmjs.com showing "No readme found".
