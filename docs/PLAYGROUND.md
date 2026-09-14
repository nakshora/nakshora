# Playground

> Live: **<https://nakshora.bsdc.info.bd/playground/>** · Source: [`playground/`](../playground)

Type HTML (and optionally author CSS), see the exact stylesheet the JIT emits — in
the browser, with no server and no build step. The playground runs the **same
`@nakshora/core` ESM bundle** the CLI, PostCSS and Vite plugins use, so what you
see is byte-for-byte what a build produces.

## What it does

| Panel               | Behaviour                                                                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **HTML**            | Scanned with the standard extractor; every candidate is compiled on demand (JIT, default theme).                                                                    |
| **CSS** (optional)  | Author stylesheet: `@apply`, `theme()`, `screen()`, and the CSS-first config layer `@theme` / `@utility` / `@custom-variant` all work.                              |
| **Inspect a class** | `CSSGenerator#compileClass` for one candidate — shows the rule(s) or `not a Nakshora class`. Useful for variant stacks and arbitrary values.                        |
| **Preview**         | Sandboxed `<iframe srcdoc>` with the generated CSS inlined; nothing leaves the page.                                                                                |
| **Generated CSS**   | The output (pretty or minified — the `minify` toggle runs the real minifier) with byte size, rule count and compile time.                                           |
| **Presets**         | Card · Form + dark mode · Responsive grid (10 breakpoints, `max-*`, `@container`) · Variants & arbitrary values · `@theme`/`@utility`/`@apply` · Design components. |
| **Share**           | Encodes HTML + CSS + minify flag into the URL hash (`#…`) and copies the link. No storage, no network.                                                              |

## How it loads the engine

```js
// playground/playground.js
const ENGINE_SOURCES = [
  '../packages/@nakshora/core/dist/index.js', // repo checkout / self-hosted
  'https://cdn.jsdelivr.net/npm/@nakshora/core@3/dist/index.js', // fallback: npm release
];
```

The core bundle is built with `platform: 'neutral'` and has **no imports at all**
(no `node:` built-ins, no bare specifiers, no `Buffer`/`process` use) — so a plain
`<script type="module">` can import it. That property is enforced by
`packages/@nakshora/core/test/playground.test.ts`; if a future change pulls a Node
API into core, the test fails and the playground would have broken.

The compile pipeline in the browser mirrors `nakshora build` exactly:

```js
let config = { content: [] };
let rootVars = '';
if (hasCssConfig(author)) {
  const ex = extractCssConfig(author); // @theme / @utility / @custom-variant
  author = ex.css;
  rootVars = ex.rootVars;
  config = mergeCssConfig(config, ex.config);
}
const gen = new CSSGenerator(config);
let css = gen.generateJITFromCandidates(extractClasses([html, author]), { minify });
if (author.trim()) css += gen.processCss(author); // @apply / theme() / screen()
css = rootVars + css;
```

## Serving it

The page is static. Anything that serves the repository root works:

```bash
npx serve .            # then open http://localhost:3000/playground/
python3 -m http.server # http://localhost:8000/playground/
```

On the website the whole repo is deployed, so `../packages/@nakshora/core/dist/index.js`
resolves to the committed dist; a copy of `playground/` hosted elsewhere falls back
to jsDelivr automatically.

## The page's own stylesheet

`playground/index.html` is a JIT build of itself against the **default** theme —
`playground/playground.min.css` (17,887 B / 5,135 B gzip, measured) is produced by

```bash
node scripts/build-site.mjs           # writes site/index.min.css + playground/playground.min.css
node scripts/build-site.mjs --check   # exit 1 on drift (also asserted by the test-suite)
```

`playground.js` is included in the scan so classes toggled at runtime (`hidden`,
`flex`, `bg-slate-800`, …) are compiled too.

## Limits

- **No headless-browser test.** The sandbox has no Chromium; the test-suite runs
  the identical pipeline in Node against the same ESM file and asserts every preset
  compiles, every chrome class resolves, and the committed CSS has not drifted. A
  visual regression suite can be added when a browser is available in CI.
- **Default theme only.** There is no config editor yet — use the CSS panel
  (`@theme { --color-brand-500: … }`) to extend the theme; that path covers
  colours, spacing, fonts, screens, keyframes and custom utilities/variants
  (see [CSS-first config](./CSS_CONFIG.md)).
- **Full-build mode is not offered** in the page: the full stylesheet is ~6 MB
  pretty and would freeze the tab. Use `npx nakshora build` for that.
