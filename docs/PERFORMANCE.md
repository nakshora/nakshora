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
