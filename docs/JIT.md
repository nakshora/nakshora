# JIT Compiler

Nakshora 3 compiles your CSS on demand. Two build modes:

| Mode     | What's emitted                                                                                                                    | When                                    |
| -------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| **full** | base + variables + keyframes + **all** utilities + responsive variants + components                                               | default when no `content` is configured |
| **jit**  | base + variables + used keyframes + **only the classes found in your content** (incl. state variants & combinations) + components | `content` configured, or `--mode jit`   |

Measured with `pnpm benchmark` (22 palettes, 11,417 utilities; see
[PERFORMANCE.md](PERFORMANCE.md) for the full table):

| Build                                          | Raw         | Minified    | Time                    |
| ---------------------------------------------- | ----------- | ----------- | ----------------------- |
| full (sm–2xl)                                  | 6,533,388 B | 5,982,603 B | 371 ms                  |
| JIT (200 lines of HTML)                        | 18,412 B    | 16,083 B    | 18 ms warm / 28 ms cold |
| JIT incremental rebuild (500 files, 1 changed) | —           | —           | 1.3 ms                  |

## How JIT works

1. **Scan** — content sources (glob → file → raw string) are read.
2. **Extract** — every class-like token is pulled with a regex
   (default `[[\w\\:/.-]+`, configurable via `extractorPattern`).
   Escaped colons (`hover\:x` in HTML/CSS) are unescaped.
3. **Match** — each token is split into variant prefixes + base class
   (`md:hover:bg-blue-600` → `[md, hover]` + `bg-blue-600`). Tokens whose base
   class exists in the catalog and whose prefixes are known variants are
   compiled; unknown tokens are silently dropped.
4. **Emit** — base rules first, then `@media` blocks (sorted by min-width),
   then components.

## Content sources

```js
content: [
  './src/**/*.{html,js,ts,jsx,tsx,vue,svelte}', // globs → files read
  'templates/**/*.md', // any file
  '<div class="dynamic-name">x</div>', // raw strings (kept as-is)
];
```

## Safelist

Classes you can't express statically (built at runtime) must be safelisted —
the compiler can't see them:

```js
safelist: ['md:grid-cols-2', 'md:grid-cols-3', 'hover:bg-brand-500'],
```

Tip: if you build class names dynamically, prefer an explicit map:

```js
const cols = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3' };
// safelist: Object.values(cols)
```

## Legacy `purge`

Tailwind-compatible `purge: [...]` works as an alias of `content`
(`content` wins when both are set).

## Minification

- `minify: true` (CLI `--minify`, plugin option) → whitespace/comment
  minifier, applied to the whole result.
- Bundlers (Vite/webpack/Next) minify in production by default.

## Sizes

Full-build size is dominated by the color matrix (22 palettes × 11 shades ×
6 utilities × 6 responsive slots). You can shrink it:

```js
corePlugins: { gradients: false, filters: false, whitespace: false },
variants: { visited: false, focusWithin: false },
```

But for end-user projects **JIT is the recommended mode** — output scales
with your actual markup (typically a few KB).

## What JIT guarantees

- Every emitted rule is 1:1 with a real utility (no dead CSS)
- State variants work with any base utility
- All 10 screens (`xxs:`…`5xl:`) plus `max-*`, `min-[…]`/`max-[…]` and
  container queries (`@md:`, `@min-*`, `@max-*`) are available — the full
  build only pre-generates `sm`–`2xl` (`screens: 'all'` opts in)
- Responsive + state combinations (`md:hover:x`, `print:md:x`) work and
  stacked media variants collapse into one `@media`
- Keyframes are emitted only for animations you actually use
- Deterministic output (same content → same bytes)
