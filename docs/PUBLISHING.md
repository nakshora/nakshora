# Automatic NPM Publishing

How Nakshora's packages get published — automatically, safely, on every
release.

## The system at a glance

```
┌─────────────┐    ┌──────────────────┐    ┌─────────────────────────┐
│  PR with    │    │ main push        │    │ artifacts               │
│  changeset  │───▶│ changesets       │───▶│ npm (provenance)        │
│  (.changeset│    │ action:          │    │ GitHub Packages         │
│  /xxx.md)   │    │ version→publish  │    │ GitHub Release + tarballs
└─────────────┘    └──────────────────┘    └─────────────────────────┘
```

Built on [Changesets](https://github.com/changesets/changesets) + GitHub
Actions. No manual `npm version` / `npm publish` steps.

## Packages

| Package                                            | Registry access                |
| -------------------------------------------------- | ------------------------------ |
| `@nakshora/core`                                   | public (npm + GitHub Packages) |
| `@nakshora/cli`                                    | public                         |
| `@nakshora/postcss`                                | public                         |
| `@nakshora/vite-plugin`                            | public                         |
| `@nakshora/ts-config`, `@nakshora/scripts` (tools) | private — never published      |

## 1. Announce a change (in your PR)

```bash
pnpm changeset:add        # interactive: pick packages + bump type
```

creates `.changeset/<name>.md`:

```md
---
'@nakshora/core': minor
'@nakshora/cli': patch
---

Add `wide:` breakpoint support to JIT mode.
```

The **Test & Quality** workflow shows a Changesets status check on the PR
(`Ready to publish` / `New version`).

## 2. Merge → automatic release

On merge to `main`, `.github/workflows/release.yml`:

1. Runs the full quality gate (type-check, 53 tests, lint, format, build on
   Node 18/20/22).
2. `changesets/action`:
   - no pending changesets → does nothing
   - pending changesets → bumps versions (`pnpm version` script =
     `changeset version`), writes `CHANGELOG.md` files, commits & pushes
     (or opens a version PR depending on repo config)
3. `pnpm publish:packages` (= `changeset publish`) publishes to **npmjs.com**
   with **provenance** (`NPM_CONFIG_PROVENANCE=true`).
4. Packs `.tgz` tarballs, publishes a mirror to **GitHub Packages**
   (`node scripts/publish-github.mjs`, scoped via a temporary `.npmrc`).
5. Creates a **GitHub Release** (`v<version>`) with the changelog + tarballs.

## 3. Required secrets

| Secret         | Value                  | Where                   |
| -------------- | ---------------------- | ----------------------- |
| `NPM_TOKEN`    | read/write npmjs token | repo Settings → Secrets |
| `GITHUB_TOKEN` | auto-provided          | —                       |

That's it. `packageManager: pnpm@9.15.0` + `pnpm-lock.yaml` make CI installs
reproducible (`pnpm install --frozen-lockfile`).

## 4. Local publishing (emergency / testing)

```bash
pnpm install --frozen-lockfile
pnpm build                                   # all packages need dist/
pnpm changeset:add                           # announce
pnpm changeset version                       # bump locally
pnpm publish:packages                        # publish to npm (needs NPM_TOKEN in env)
NODE_AUTH_TOKEN=ghp_… node scripts/publish-github.mjs   # GitHub Packages mirror
```

Test the packages without publishing:

```bash
npm pack -C packages/@nakshora/core        # creates .tgz
npm install ../nakshora-core-3.0.0.tgz     # in a scratch project
```

## 5. Snapshot / preview releases

```bash
pnpm changeset version --snapshot alpha    # → 3.0.0-alpha.0
pnpm changeset publish --snapshot
```

## 6. What fixed the old publishing failures

The v2 pipeline had several broken pieces; all resolved in v3:

| Old problem                                                                                | Fix                                                                        |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| `npm publish --registry … --workspace-root` (invalid flag)                                 | removed; per-package publish via changesets + `scripts/publish-github.mjs` |
| Double publish (changesets action + extra "Publish to NPM" step)                           | single publish path: `pnpm publish:packages` → `changeset publish`         |
| `publishConfig.registry` pinned to npmjs, silently overriding the GitHub Packages registry | removed from package manifests; registry set per-invocation                |
| Missing `pnpm-lock.yaml` → `--frozen-lockfile` CI failures                                 | lockfile committed; stale `package-lock.json` deleted                      |
| Empty packages (no `dist/`) publishing                                                     | publish gated on `dist/` existing; CI builds first                         |
| GitHub Release with nonexistent `dist/**` files                                            | release attaches packed `releases/*.tgz`                                   |

## 7. Versioning policy

Changesets semver: `patch` (fixes), `minor` (new utilities/features),
`major` (breaking). All four public packages bump together in practice
(`changeset` asks per-package; link them with `"fixed": ["@nakshora/core", "@nakshora/cli", "@nakshora/postcss", "@nakshora/vite-plugin"]` in `.changeset/config.json` if you want strict lockstep).
