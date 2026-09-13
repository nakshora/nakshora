# Troubleshooting

## "Class not found in the generated CSS" (JIT)

The JIT compiler only emits classes it can **see**. In order of likelihood:

1. **Content globs don't cover the file.** Make sure the file containing the
   class matches `content`.
2. **Class built dynamically** (`class={`p-${n}`}`) — the compiler can't see
   it. Add it to `safelist` (full names, no fragments).
3. **State variant but no content** — `hover:`/`dark:`/… only exist in JIT
   mode. Configure `content` or use full mode.
4. **Typo / unknown variant prefix** — unknown tokens are silently dropped
   by design (so JS identifiers in source don't pollute your CSS).
5. **`group-hover:` without `group` on the parent** — the CSS is correct;
   add `class="group"` to the parent.

Debug with:

```bash
nakshora inspect | grep "your-class"
```

## TypeScript config errors on Node 18/20

```
TypeScript configs require Node >= 22.18 (native type stripping)
```

Rename `nakshora.config.ts` → `nakshora.config.js` (or `.json`), or upgrade
Node.

## `ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL` / `--frozen-lockfile` mismatch

The lockfile is out of sync with `package.json`:

```bash
pnpm install        # regenerates pnpm-lock.yaml
git add pnpm-lock.yaml
```

Always commit `pnpm-lock.yaml` — CI installs with `--frozen-lockfile`.

## Vite: `import 'nakshora'` resolves to nothing

- Make sure `@nakshora/vite-plugin` is in `plugins` **before** other CSS
  plugins, and the project is restarted after adding it.
- The plugin is `enforce: 'pre'` — another plugin resolving `nakshora` first
  will shadow it. If you have a real module named `nakshora`, import the
  virtual module explicitly: `import 'virtual:nakshora'`.

## PostCSS: at-rules untouched

- The CSS file must actually contain `@nakshora source;` etc. (note the
  plugin is named `nakshora`, not `@nakshora`).
- In-memory sources (no file path) resolve content globs against
  `process.cwd()`.
- Check the plugin appears in your PostCSS plugin list
  (`console.log(require('postcss').plugins)` in a debug script).

## `pnpm build` fails in a package with "Cannot find base config file"

Each package's `tsconfig.json` extends
`../../../tools/ts-config/tsconfig.base.json` — if you move packages around,
update the `extends` path (three levels up to the repo root).

## CSS too large

You're on a full build. Add `content` (JIT) — see [Performance](./PERFORMANCE.md).

## Gradients look off

`bg-gradient-to-*` sets the `background-image` linear gradient; the color
stops come from `from-*`/`via-*`/`to-*` utilities (CSS variables
`--tw-gradient-*`). Use all three, or at least `from-*` + `to-*`:

```html
<div class="bg-gradient-to-br from-blue-500 to-purple-600">…</div>
```

## Dark mode not applying

- Add `class="dark"` to `<html>` (class-based strategy).
- `dark:` is a JIT variant — the class name must be in your content.
- Make sure nothing else overrides the property later in the cascade.

## CLI `nakshora: command not found`

```bash
npm link            # after a local install, or
npx nakshora --help # one-shot
```

## Publishing fails with E403/EPUBLISHCONFLICT

- E403 → check `NPM_TOKEN` scope (needs read/write) and that you're a
  maintainer of the `@nakshora` org on npm.
- EPUBLISHCONFLICT → the version already exists. Bump (changeset) or publish
  a snapshot.

## Generated CSS differs between machines

It shouldn't — output is deterministic for identical config + content.
If it does: a content file differs (git status?), or Node versions differ in
glibc ordering (not applicable here) — report it with `nakshora inspect`
output from both sides.
