# Performance

Nakshora is fast to build and light at runtime.

## Benchmarks

Measured with `pnpm benchmark` (medians; Node v22.22.3, this repository's
sandbox — a laptop-class x86 runner is typically 1.5–2× faster). The same
numbers live in `perf/baseline.json`, and `pnpm benchmark:check` fails when
any of them regresses by more than 10 % (plus 2 ms absolute for timings).

| Operation                                     | Measured   |
| --------------------------------------------- | ---------- |
| `new CSSGenerator()` (cold, no memo)          | 7.7 ms     |
| catalog build (11,417 utilities, cold)        | 30.6 ms    |
| catalog with cross-instance memo hit          | 10.8 ms    |
| JIT, 200 lines of HTML, cold generator        | 28.1 ms    |
| JIT, 200 lines of HTML, warm generator        | 18.2 ms    |
| minify that JIT output                        | 0.85 ms    |
| 500 files (20k candidates), cold scan + JIT   | 190 ms     |
| 500 files, **one file changed**, incremental  | **1.3 ms** |
| full build (all utilities, sm–2xl responsive) | 371 ms     |
| full build minify                             | 302 ms     |

The JIT numbers are dominated by candidate **extraction** (Tailwind's
extractor regexes, ported verbatim): 200 lines ≈ 16 ms of the 18 ms. That is
why the CLI, the PostCSS plugin and the Vite plugin keep a per-process
`ContentCache` (mtime + size per file, content hash per raw string): a rebuild
only re-extracts files that changed. Output is byte-identical whichever path
produced it — pinned by `core/test/content-cache.test.ts`.

The catalog is memoised across `Engine` instances keyed by the resolved theme

- enabled core plugins (`core/test/catalog-memo.test.ts` checks isolation:
  different themes, disabled plugins and plugin-added utilities never share).

The Performance workflow (`.github/workflows/performance.yml`) measures the
reference commit (merge-base for PRs, `HEAD~1` for pushes) **on the same
runner**, then the head, and fails on a >10 % regression; both reports are
stored as artifacts for 90 days.

## Bundle sizes

Exact bytes from the same benchmark run:

| Artifact                                                        | Raw          | Minified     | gzip        | brotli    |
| --------------------------------------------------------------- | ------------ | ------------ | ----------- | --------- |
| full CSS (base + all utilities, sm–2xl responsive + components) | 6,533,388 B  | 5,982,603 B  | 592,255 B   | 132,967 B |
| full CSS with all 10 screens (`screens: 'all'`)                 | 12,104,047 B | 11,077,622 B | 1,085,165 B | 184,609 B |
| JIT, the 200-line benchmark page                                | 18,412 B     | 16,083 B     | —           | —         |
| JIT, the project landing page (`index.html`, 179 classes)       | —            | 17,790 B     | 3,936 B     | —         |

The full build exists for the CDN / no-build-step use case. Every real
project should use JIT: output scales with the classes you use, not with the
11,417-utility catalog.

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
- **CDN full build** → zero-setup, 5,983 KB min / 133 KB brotli (browser caches it well)

## Build performance tips

- Watch mode rebuilds are debounced by the OS file watcher; a 200-line
  project rebuilds in single-digit milliseconds.
- The minifier is a fast single-pass regex — prefer bundler minification in
  production (Vite uses esbuild) and keep CLI `--minify` for static sites.
