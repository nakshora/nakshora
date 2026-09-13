# @nakshora/cli

**The Nakshora command line** — scaffold a config, compile utility CSS (full or
JIT), watch for changes, inspect the utility catalog and export AI training
assets.

[![npm version](https://img.shields.io/npm/v/@nakshora/cli?color=blue)](https://www.npmjs.com/package/@nakshora/cli)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/nakshora/nakshora/blob/main/LICENSE)
![node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)

Nakshora is a utility-first CSS framework with a JIT compiler and a
Tailwind-compatible class grammar. Use the CLI when there is no bundler in the
pipeline; for Vite use
[@nakshora/vite-plugin](https://www.npmjs.com/package/@nakshora/vite-plugin), for
webpack / Next.js / Laravel use
[@nakshora/postcss](https://www.npmjs.com/package/@nakshora/postcss).

## Install

```bash
npm install -D @nakshora/cli
```

Provides the `nakshora` binary (`npx nakshora --help`).

## Quick start

```bash
npx nakshora init                                      # nakshora.config.js + nakshora.css
npx nakshora build nakshora.css -o dist/nakshora.css   # compile
npx nakshora build nakshora.css -o dist/nakshora.min.css --minify
npx nakshora dev nakshora.css -o dist/nakshora.css     # watch mode
```

## Commands

| Command                  | What it does                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| `nakshora init`          | Scaffold `nakshora.config.js` + `nakshora.css` (`--json`, `--force`)                       |
| `nakshora build [input]` | Compile CSS to stdout or `-o <file>`, with `--minify`, `--watch`                           |
| `nakshora dev [input]`   | Build + watch (rebuilds on content/config change)                                          |
| `nakshora inspect`       | Print the full generated CSS to stdout                                                     |
| `nakshora export:ai`     | Export the utility corpus for AI/LLM training (`--out`, `--format json\|jsonl`, `--limit`) |

### Build flags

| Flag                  | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| `input`               | CSS file containing `@nakshora source;` / `@nakshora utilities;` |
| `-o, --output <file>` | Write to a file (default: stdout)                                |
| `-m, --minify`        | Minify the output                                                |
| `--mode <full\|jit>`  | Force the build mode (default: JIT when `content` is set)        |
| `-c, --config <path>` | Explicit config file                                             |
| `--watch`             | Rebuild on change                                                |

Config discovery walks up from the current directory and accepts
`nakshora.config.{js,mjs,cjs,ts,json}`.

## Example

```js
// nakshora.config.js
export default {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  safelist: ['lg:flex'],
  theme: {
    colors: { brand: { DEFAULT: '#6d28d9' } },
  },
};
```

```css
/* nakshora.css */
@nakshora source;
```

```bash
npx nakshora build nakshora.css -o dist/nakshora.min.css --minify
```

## Documentation

- [CLI reference](https://github.com/nakshora/nakshora/blob/main/docs/CLI.md)
- [Full setup guide](https://github.com/nakshora/nakshora/blob/main/docs/SETUP.md)
- [Configuration](https://github.com/nakshora/nakshora/blob/main/docs/CONFIGURATION.md)
- [Utilities by category](https://github.com/nakshora/nakshora/blob/main/docs/UTILITIES.md)
- [AI / LLM training assets](https://github.com/nakshora/nakshora/blob/main/docs/AI_TRAINING.md)

## License

MIT © Rizwan Rahim Chowdhury —
[nakshora/nakshora](https://github.com/nakshora/nakshora)
