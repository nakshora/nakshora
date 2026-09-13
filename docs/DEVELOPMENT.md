# Framework Development

Contributing to Nakshora itself (monorepo workflow).

## Setup

```bash
git clone https://github.com/nakshora/nakshora.git
cd nakshora
corepack enable              # pins pnpm 9.15.0 via packageManager field
pnpm install --frozen-lockfile
pnpm build
pnpm test
```

## Daily loop

```bash
pnpm build                 # all packages (tsup: ESM + CJS + d.ts)
pnpm build:core            # single package
pnpm test                  # vitest (53 tests)
pnpm test:watch
pnpm test:coverage
pnpm type-check            # tsc --noEmit in every package
pnpm lint                  # eslint 9 flat config
pnpm lint:fix
pnpm format                # prettier (write)
pnpm format:check          # prettier (CI gate)
pnpm benchmark             # build timings + sizes
```

## Monorepo layout

```
packages/@nakshora/core          # JIT engine (the heart)
packages/@nakshora/cli           # CLI + build pipeline (workspace:* → core)
packages/@nakshora/postcss       # PostCSS plugin (workspace:* → core)
packages/@nakshora/vite-plugin   # Vite plugin (workspace:* → core, postcss)
tools/ts-config                  # shared tsconfig base
scripts/                         # benchmark, doc/AI generators, gh publish
```

Dependency flow is strictly `cli/postcss/vite → core → (none)`.
`@nakshora/core` has **zero runtime dependencies** — keep it that way.

## Adding a utility

1. `packages/@nakshora/core/src/registry.ts` — add the rule(s) to the right
   group (`add(className, group, decls, category, description)`).
2. Add a test in `packages/@nakshora/core/test/generator.test.ts`.
3. Regenerate docs: `node scripts/generate-docs.mjs` (tables update from
   the registry — docs can't drift).
4. Regenerate AI corpus: `pnpm ai:export`.
5. `pnpm changeset:add` — announce the change.

## Adding a theme preset

`packages/@nakshora/core/src/themes/<name>.ts` exporting a `PresetConfig`,
re-export from `src/index.ts`, document in `docs/THEMES.md`.

## Releasing

See [Publishing](./PUBLISHING.md). Short version:

```bash
pnpm changeset:add
# … PR gets changesets status check …
# merge → CI publishes automatically
```

## Code style

- Prettier (`.prettierrc.json`): single quotes, semicolons, 100 cols.
- ESLint 9 flat config (`eslint.config.js`) with typescript-eslint
  recommended; no unused locals/params (`_`-prefix exempt).
- ESM everywhere (`"type": "module"`); CJS built alongside via tsup.
