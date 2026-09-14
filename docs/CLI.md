# CLI Reference

`@nakshora/cli` provides the `nakshora` binary.

```bash
npm install -D @nakshora/cli
npx nakshora --help
```

## Commands

### `nakshora init`

Scaffold `nakshora.config.js` + `nakshora.css` in the current directory.

```bash
nakshora init            # JavaScript config
nakshora init --json     # JSON config
nakshora init --force    # overwrite existing files
```

### `nakshora build [input]`

Compile CSS.

```bash
nakshora build                          # full build → stdout
nakshora build nakshora.css             # process an input file with @nakshora at-rules
nakshora build nakshora.css -o dist/nakshora.css
nakshora build nakshora.css -o dist/nakshora.min.css --minify
nakshora build --mode full              # force full build
nakshora build --mode jit               # force JIT (requires content)
nakshora build --watch                  # rebuild on change
nakshora build -c path/to/config.js     # explicit config
```

| Flag                  | Description                                                                                               |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| `input`               | Optional CSS file containing `@nakshora source;` / `@nakshora utilities;`, `@apply`, `theme()`, `@screen` |
| `-o, --output <file>` | Write to file (default: stdout)                                                                           |
| `-m, --minify`        | Minify output                                                                                             |
| `--mode <full\|jit>`  | Force the build mode (default: JIT when content is configured)                                            |
| `-c, --config <path>` | Explicit config file                                                                                      |
| `--watch`             | Rebuild on change (incremental: only changed files are re-scanned)                                        |
| `--content <globs…>`  | JIT content globs / files — overrides `config.content`                                                    |
| `--safelist <cls…>`   | Classes always emitted (space or comma separated), added to the config                                    |
| `--source-map`        | Write `<output>.map` (v3; marks the CSS as generated) + `sourceMappingURL`                                |
| `--stats`             | Print build time, class/candidate counts, sizes and unknown candidates                                    |
| `--diff`              | Dry run: list selectors that would be added/removed vs the existing output                                |

`input` may be `-` to read the stylesheet from **stdin**:

```bash
echo '@nakshora utilities; .btn { @apply px-4 rounded; }' | nakshora build - --content 'src/**/*.html'
```

When `input` is given, `@apply` / `theme()` / `screen()` / `@screen` in it are
expanded (see [POSTCSS.md](POSTCSS.md#apply-theme-screen-and-screen)); an
unknown class fails the build with `input.css: The \`x\` class does not exist…`.

**Build mode selection:**

1. `--mode` wins when provided
2. `content` (or legacy `purge`) configured → **JIT** (only used classes,
   including all state variants)
3. otherwise → **full** (all base + responsive utilities + components)

### `nakshora dev [input]`

`build --watch` with the same flags, plus an optional **dev server** for
bundler-less projects:

| Flag           | Default   | Meaning                                                         |
| -------------- | --------- | --------------------------------------------------------------- |
| `--serve`      | off       | serve `--root` over HTTP; inject a live-reload client into HTML |
| `--port <n>`   | `3000`    |                                                                 |
| `--host <h>`   | `0.0.0.0` | bind address (works behind containers/proxies)                  |
| `--root <dir>` | `.`       | directory to serve                                              |

```bash
nakshora dev --serve                       # http://localhost:3000/, stylesheet at /nakshora.css (in memory)
nakshora dev --serve -o public/app.css     # stylesheet also written; served at /public/app.css
```

On every rebuild the server pushes a Server-Sent Event: a CSS change
hot-swaps the `<link>` without reloading; a markup change that produces the
same CSS reloads the page. The client is ~30 lines, injected before
`</body>`, and only talks to `/__nakshora/events`. It is a development
convenience, not a production server (no compression, no caching, no HTTPS).

### `nakshora doctor`

Diagnoses the project without building: Node version, config discovery and
load errors, every `content` glob (files matched, globs into `node_modules`,
raw strings), `safelist` entries that produce nothing, unknown `variants`
keys, stylesheets missing `@nakshora source;`, `@apply`/`theme()` that would
fail, and dependency mismatches (`@nakshora/postcss` without `postcss`,
Tailwind installed alongside). Exit code 1 on errors. `--json` for tooling.

```
✔ node      Node v22.22.3
✔ config    loaded /app/nakshora.config.js
▲ content   glob matches no files: ./pages/**/*.vue
            ↳ resolved relative to /app
✖ apply     src/app.css: The `btn-primry` class does not exist…
```

### `nakshora migrate [globs…]`

Codemods (dry run by default, `--write` applies):

- `--from tailwind` (default): rewrites `tailwind.config.{js,cjs,mjs,ts}` into
  `nakshora.config.*` (type comment, `tailwindcss/defaultTheme|colors|plugin`
  imports → `@nakshora/core`) and prints review notes (`theme.screens` replaces
  the 10-step scale, `darkMode` default differs, ignored keys, official
  plugins that keep working). Source files get the handful of renamed
  utilities (`flex-grow` → `grow`, `overflow-ellipsis` → `text-ellipsis`, …).
- `--from v1`: Nakshora v1 class names inside `class`/`className` attributes
  (`card-neon` → `neon-card`, `btn-neon` → `neon-btn`, `uhd:` → `4xl:`,
  `k8:` → `5xl:`), variant prefixes preserved.

### `nakshora lsp`

Starts the language server (LSP over stdio): completion, hover, diagnostics
and colour swatches for any editor. `-c <path>` pins the config; otherwise
it is discovered from the workspace root. Setup per editor in
[EDITORS.md](./EDITORS.md).

### `nakshora inspect`

Print the full generated CSS to stdout (handy for debugging what the config
produces).

```bash
nakshora inspect | grep -m1 "flex"
nakshora inspect | wc -c
```

### `nakshora export:ai`

Export the **AI/LLM training corpus** (structured data about every utility).

```bash
nakshora export:ai                              # → ai/corpus.json
nakshora export:ai -f jsonl                     # → ai/corpus.jsonl (SFT dataset)
nakshora export:ai -f jsonl --limit 800 -o ai/sft-train.jsonl
nakshora export:ai -c path/to/config.js         # corpus reflects your theme
```

See [AI Training](./AI_TRAINING.md).

### `nakshora --version` / `nakshora -v`

Print the version.

## Config discovery

Without `-c`, the CLI searches for the nearest config walking up from the
current directory (max 5 levels):

```
nakshora.config.ts → nakshora.config.js → nakshora.config.mjs → nakshora.config.cjs → nakshora.config.json
```

## Library usage

The build pipeline is importable without the CLI:

```js
import { runBuild, resolveConfig, resolveContent, createWatcher } from '@nakshora/cli';

const { config } = await resolveConfig();
const result = await runBuild({ config, output: 'dist/nakshora.css', minify: true });
console.log(result.classes, result.sizeBytes);
```

## Programmatic engine

The engine itself lives in `@nakshora/core`:

```js
import { CSSGenerator } from '@nakshora/core';

const generator = new CSSGenerator({
  content: ['./src/**/*.html'],
  theme: { colors: { brand: { 500: '#6d28d9' } } },
});

console.log(generator.generate({ mode: 'jit', minify: true }));
console.log(generator.generate({ mode: 'full' }));
console.log(generator.getStats());
```

Full API: [API.md](./API.md).
