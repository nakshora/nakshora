# Automatic NPM Publishing

How Nakshora's packages get published — automatically, safely, on every
release.

## The system at a glance

```
┌──────────────┐   ┌───────────────────────┐   ┌──────────────────────────┐
│ Dev PR with  │──▶│ merge → main:         │──▶│ merge release PR:        │
│ changeset    │   │ "Version Packages"    │   │ npm (provenance)         │
│ (.changeset/ │   │ release PR opened     │   │ + tags + GitHub Releases │
│  xxx.md)     │   │ (bumps + changelogs)  │   │ + GitHub Packages mirror │
└──────────────┘   └───────────────────────┘   └──────────────────────────┘
```

Built on [Changesets](https://github.com/changesets/changesets) (release-PR
mode of `changesets/action@v1`) + GitHub Actions. No manual `npm version` /
`npm publish` steps.

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

The release workflow runs a **Changesets status** check on the PR that
validates the config and reports which packages will be bumped.

## 2. Merge → automatic release (two merges)

Changesets uses the **release-PR flow**:

1. A dev PR with changesets merges into `main` → the release job runs the
   changesets action, which bumps versions (`pnpm version` script =
   `changeset version`), writes the `CHANGELOG.md` files, and opens a
   **"Version Packages" release PR** (`changeset-release/main`).
2. Merging that release PR into `main` triggers the action again; this time
   there are no pending changesets but unpublished versions exist, so it runs
   `pnpm publish:packages` (= `changeset publish`):
   - publishes to **npmjs.com** with **provenance**
     (`NPM_CONFIG_PROVENANCE=true`)
   - pushes the version tags (`@nakshora/core@3.0.0`, …)
   - creates a **GitHub Release per package** with its changelog
3. A mirror is then published to **GitHub Packages**
   (`node scripts/publish-github.mjs`, scoped via a temporary `.npmrc`).

Both merges are normal PR merges — the whole pipeline is automatic.

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

| Old problem                                                                                | Fix                                                                                                |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `npm publish --registry … --workspace-root` (invalid flag)                                 | removed; per-package publish via changesets + `scripts/publish-github.mjs`                         |
| Double publish (changesets action + extra "Publish to NPM" step)                           | single publish path: `pnpm publish:packages` → `changeset publish`                                 |
| `publishConfig.registry` pinned to npmjs, silently overriding the GitHub Packages registry | removed from package manifests; registry set per-invocation                                        |
| Missing `pnpm-lock.yaml` → `--frozen-lockfile` CI failures                                 | lockfile committed; stale `package-lock.json` deleted                                              |
| Empty packages (no `dist/`) publishing                                                     | publish gated on `dist/` existing; CI builds first                                                 |
| GitHub Release with nonexistent `dist/**` files                                            | releases are created by the changesets action with per-package changelogs                          |
| `changesets/action@v1` `status:` input (removed upstream)                                  | PR check runs `changeset status` directly; release job uses the action's release-PR + publish flow |
| `type-check` before `build` (TS2307 — workspace types live in `dist/`)                     | `pnpm type-check` builds first; CI build step precedes the check                                   |
| `@changesets/config.json` `ignore` listing a nonexistent package (hard error)              | `ignore` now only contains packages that exist (`@nakshora/ts-config`)                             |

## 7. Versioning policy

Changesets semver: `patch` (fixes), `minor` (new utilities/features),
`major` (breaking). All four public packages bump together in practice
(`changeset` asks per-package; link them with `"fixed": ["@nakshora/core", "@nakshora/cli", "@nakshora/postcss", "@nakshora/vite-plugin"]` in `.changeset/config.json` if you want strict lockstep).
