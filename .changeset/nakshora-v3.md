---
'@nakshora/core': major
'@nakshora/cli': major
'@nakshora/postcss': major
'@nakshora/vite-plugin': major
---

# Nakshora 3.0 — the modern monorepo, JIT engine & AI-ready docs

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
