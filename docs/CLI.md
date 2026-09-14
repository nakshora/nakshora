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
| `--watch`             | Rebuild on change                                                                                         |

When `input` is given, `@apply` / `theme()` / `screen()` / `@screen` in it are
expanded (see [POSTCSS.md](POSTCSS.md#apply-theme-screen-and-screen)); an
unknown class fails the build with `input.css: The \`x\` class does not exist…`.

**Build mode selection:**

1. `--mode` wins when provided
2. `content` (or legacy `purge`) configured → **JIT** (only used classes,
   including all state variants)
3. otherwise → **full** (all base + responsive utilities + components)

### `nakshora dev [input]`

Alias for `build --watch` — development mode with the same flags (minus
`--watch`).

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
