# Editor integration (IntelliSense)

Nakshora ships a **language server** in `@nakshora/cli` — `nakshora lsp` —
plus the pure `LanguageService` it is built on. Any LSP client gets:

| Feature     | What you get                                                                                                                                                                                                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Completion  | every catalog class (11,417 by default, plus your theme/plugins), all 155 variants (`hover:`, `md:`, `group-hover:`, `@md:`, `not-`…), design-system components; completes the segment after the last `:`                                                                            |
| Hover       | the exact CSS the class compiles to (variants and media included)                                                                                                                                                                                                                    |
| Diagnostics | `invalidApply` (error) — `@apply` of a class that does not exist; `unknownClass` (warning) — variant-prefixed class that compiles to nothing; `cssConflict` (warning) — two classes in one attribute setting the same properties under the same variant (`p-4 p-2`, `md:p-4 md:p-2`) |
| Colours     | swatches for colour utilities (`bg-blue-500/50`, `text-white`, custom `brand`)                                                                                                                                                                                                       |

Class lists are recognised in `class`, `className`, `class:list` attributes,
in `clsx()`, `cn()`, `cva()`, `classNames()`, `twMerge()`, `cx()` string
arguments, in `` tw`…` `` templates and in `@apply` (CSS/SCSS/Less/PostCSS).

The server discovers `nakshora.config.{ts,js,mjs,cjs,json}` from the
workspace root (or `initializationOptions.config`) and reloads when it is
saved. Plain markup typos are **not** flagged — unprefixed unknown classes
are usually application classes.

## VS Code

There is no marketplace extension yet. Use any generic LSP client
extension, e.g. [`generic-lsp`](https://marketplace.visualstudio.com/items?itemName=llllvvuu.generic-lsp)
or the built-in support of `vscode-languageclient` in your own extension:

```jsonc
// .vscode/settings.json (generic-lsp)
"generic-lsp.servers": [
  {
    "name": "nakshora",
    "command": ["npx", "nakshora", "lsp"],
    "languages": ["html", "javascriptreact", "typescriptreact", "vue", "svelte", "astro", "css", "scss"]
  }
]
```

## Neovim (0.10+)

```lua
vim.lsp.config('nakshora', {
  cmd = { 'npx', 'nakshora', 'lsp' },
  filetypes = { 'html', 'javascriptreact', 'typescriptreact', 'vue', 'svelte', 'astro', 'css', 'scss' },
  root_markers = { 'nakshora.config.js', 'nakshora.config.ts', 'nakshora.config.mjs', 'nakshora.config.cjs', 'nakshora.config.json' },
})
vim.lsp.enable('nakshora')
```

## Zed

```jsonc
// settings.json
"lsp": { "nakshora": { "binary": { "path": "npx", "arguments": ["nakshora", "lsp"] } } }
```

## Helix

```toml
# languages.toml
[language-server.nakshora]
command = "npx"
args = ["nakshora", "lsp"]

[[language]]
name = "html"
language-servers = ["vscode-html-language-server", "nakshora"]
```

## Programmatic use

```ts
import { LanguageService } from '@nakshora/cli';

const ls = new LanguageService({ config: { theme: { extend: { colors: { brand: '#123456' } } } } });
ls.complete(text, offset, 'html'); // { items, incomplete }
ls.hover(text, offset); // { css, start, end } | null
ls.diagnostics(text, 'css'); // [{ code, severity, message, start, end }]
ls.colors(text); // [{ start, end, red, green, blue, alpha }]
```

Offsets are UTF-16 character offsets into `text`; the LSP layer converts
them to positions. The service is synchronous and has no I/O — the tests in
`packages/@nakshora/cli/test/language-service.test.ts` cover every feature
and drive `nakshora lsp` end-to-end over stdio.

## Not implemented

- Marketplace extension packaging (VS Code / Open VSX) — the server is
  ready; the extension would be a ~30-line `vscode-languageclient` wrapper.
- Code actions (e.g. "remove conflicting class"), rename, go-to-definition
  for plugin components, `theme()`/`screen()` completion inside CSS values.
- Semantic sorting of classes (Prettier plugin).
