# Installation

## Package registry (npmjs.com)

```bash
npm install @nakshora/core          # engine only (library usage)
npm install -D @nakshora/cli        # CLI
npm install -D @nakshora/postcss    # PostCSS plugin
npm install -D @nakshora/vite-plugin # Vite plugin
```

`pnpm add -D …` and `yarn add -D …` work identically.

| Package                 | Size (gzip, ESM dist) | Needs                                                                 |
| ----------------------- | --------------------- | --------------------------------------------------------------------- |
| `@nakshora/core`        | ~71 KB                | nothing — runs in Node ≥ 18 _and_ the browser (no Node APIs)          |
| `@nakshora/cli`         | ~78 KB                | Node ≥ 18                                                             |
| `@nakshora/postcss`     | ~65 KB                | `postcss ^8.4`, Node ≥ 18                                             |
| `@nakshora/vite-plugin` | ~128 KB               | `vite ^5 \|\| ^6 \|\| ^7 \|\| ^8` (Vite 7+ itself needs Node ≥ 20.19) |

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

### What the browser actually downloads

`nakshora.min.css` is 5,982,603 B on disk but **132,967 B over brotli** and
575,520 B over gzip (jsDelivr negotiates both automatically and caches at the
edge; the pinned `@v3.0.0` URL is immutable, `@main` revalidates every 12 h).
The repo ships the precompressed sidecars for self-hosting:

| File                           | Bytes     | Produced by                           |
| ------------------------------ | --------- | ------------------------------------- |
| `dist/css/nakshora.min.css`    | 5,982,603 | `scripts/generate-css.mjs`            |
| `dist/css/nakshora.min.css.br` | 132,967   | same script, brotli quality 11 (text) |
| `dist/css/nakshora.min.css.gz` | 575,520   | same script, gzip level 9             |

Serve them as-is with `nginx` (`brotli_static on; gzip_static on;`), Apache
(`mod_brotli` + `MultiViews`), Netlify / Cloudflare Pages / Vercel (automatic
for sidecars), or S3 + CloudFront (upload the `.br` with
`Content-Encoding: br`). A test decompresses both sidecars and asserts they
equal `nakshora.min.css` byte-for-byte.

Even so: the full build is for zero-tooling pages. Any project with a build
step should use JIT (typically 5–20 KB; the landing page is 3,936 B gzipped).

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
