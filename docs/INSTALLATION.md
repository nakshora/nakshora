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

> `https://cdn.jsdelivr.net/gh/nakshora/nakshora@main/min.main.css` (the historical URL) serves the
> same bytes as `dist/css/nakshora.min.css`. The frozen v1.0.0 stylesheet is
> `…@main/minified-version/v1.0.0.css` — see `minified-version/cdn.md`.

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
