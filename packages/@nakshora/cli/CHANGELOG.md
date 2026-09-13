# @nakshora/cli

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
- Updated dependencies [[`3d1b710`](https://github.com/nakshora/nakshora/commit/3d1b7102b6bc9820c4b83164e874ac6a60bb7fa9), [`01dac45`](https://github.com/nakshora/nakshora/commit/01dac454f04dfdcce89293320e3c4cd64c9dec1c)]:
  - @nakshora/core@3.0.0
