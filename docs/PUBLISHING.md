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
   changesets action, which bumps versions (`pnpm changeset version`), writes
   the `CHANGELOG.md` files, and opens a **"Version Packages" release PR**
   (`changeset-release/main`).

   > ⚠️ The action's `version:` input must be `pnpm changeset version` — **not**
   > `pnpm version`. pnpm intercepts the bare `version` command and prints its
   > own version manifest instead of running the root `version` script, so
   > nothing gets bumped and the release PR is never opened (the action then
   > fails trying to open a PR with no commits).

2. Merging that release PR into `main` triggers the action again; this time
   there are no pending changesets but unpublished versions exist, so it runs
   `pnpm publish:packages` (= `changeset publish`):
   - publishes to **npmjs.com** with **provenance**
     (`NPM_CONFIG_PROVENANCE=true`; changesets detects pnpm and publishes via
     `pnpm publish`, which rewrites `workspace:*` ranges to real versions)
   - pushes the version tags (`@nakshora/core@3.0.0`, …)
   - creates a **GitHub Release per package** with its changelog
3. A mirror is then published to **GitHub Packages**
   (`node scripts/publish-github.mjs`): each package is packed with `pnpm pack`
   (so `workspace:*` dependencies are resolved in the tarball manifest — plain
   `npm publish` cannot handle the `workspace:` protocol) and the tarball is
   published with npm against a temporary, script-only `.npmrc`.
4. The same tarballs are attached to the GitHub Releases and uploaded as
   `npm-tarballs` workflow artifacts.

Both merges are normal PR merges — the whole pipeline is automatic.

## 3. Required secrets & permissions

| Secret         | Value                                                                   | Where                   |
| -------------- | ----------------------------------------------------------------------- | ----------------------- |
| `NPM_TOKEN`    | npm **Granular Access Token**, _Read and write_ for the `@nakshora` org | repo Settings → Secrets |
| `GITHUB_TOKEN` | auto-provided                                                           | —                       |

Create the token at
[npmjs.com → Access Tokens → Granular Access Token](https://www.npmjs.com/settings/~/tokens/granular-access-tokens/new):
**Write** access, scoped to the `@nakshora` org. Then
_Settings → Secrets and variables → Actions → New repository secret_ →
`NPM_TOKEN`.

The release job also needs these `permissions:` (declared at the top of
`release.yml`):

| Permission             | Used for                                            |
| ---------------------- | --------------------------------------------------- |
| `contents: write`      | pushing version tags, committing the release branch |
| `pull-requests: write` | opening/updating the "Version Packages" PR          |
| `packages: write`      | publishing the mirror to GitHub Packages            |
| `id-token: write`      | npm provenance (OIDC) / npm trusted publishing      |

The release job prints a preflight line reporting whether `NPM_TOKEN` is set
(versioning works without it, publishing does not).

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

| Old problem                                                                                                                                                                               | Fix                                                                                                |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `npm publish --registry … --workspace-root` (invalid flag)                                                                                                                                | removed; per-package publish via changesets + `scripts/publish-github.mjs`                         |
| Double publish (changesets action + extra "Publish to NPM" step)                                                                                                                          | single publish path: `pnpm publish:packages` → `changeset publish`                                 |
| `publishConfig.registry` pinned to npmjs, silently overriding the GitHub Packages registry                                                                                                | removed from package manifests; registry set per-invocation                                        |
| Missing `pnpm-lock.yaml` → `--frozen-lockfile` CI failures                                                                                                                                | lockfile committed; stale `package-lock.json` deleted                                              |
| Empty packages (no `dist/`) publishing                                                                                                                                                    | publish gated on `dist/` existing; CI builds first                                                 |
| GitHub Release with nonexistent `dist/**` files                                                                                                                                           | releases are created by the changesets action with per-package changelogs                          |
| `changesets/action@v1` `status:` input (removed upstream)                                                                                                                                 | PR check runs `changeset status` directly; release job uses the action's release-PR + publish flow |
| `type-check` before `build` (TS2307 — workspace types live in `dist/`)                                                                                                                    | `pnpm type-check` builds first; CI build step precedes the check                                   |
| `@changesets/config.json` `ignore` listing a nonexistent package (hard error)                                                                                                             | `ignore` now only contains packages that exist (`@nakshora/ts-config`)                             |
| `version: pnpm version` in the release workflow — pnpm intercepts the bare `version` command and prints its own version manifest, so nothing was bumped and no release PR was ever opened | `version: pnpm changeset version`                                                                  |
| `@changesets/changelog-github` referenced by `.changeset/config.json` but never installed → `changeset version` crashed with `MODULE_NOT_FOUND`                                           | added to root `devDependencies` (and the lockfile)                                                 |
| `release` job skipped on pushes to `main` because the PR-only changesets check was skipped (skip propagates through `needs` without a status function)                                    | `if: ${{ !cancelled() && needs.test.result == 'success' && … }}`                                   |
| GitHub Packages mirror failed: `npm publish` cannot resolve the `workspace:*` ranges changesets leaves in the manifests                                                                   | `scripts/publish-github.mjs` packs with `pnpm pack` and publishes the tarball                      |
| GitHub Packages mirror would 403 even with a valid token — `packages: write` missing from the workflow's `permissions:` block                                                             | `packages: write` added                                                                            |
| Packages published with no README on npmjs.com (`files` listed a README that didn't exist)                                                                                                | per-package `README.md` added; `CHANGELOG.md` shipped too                                          |

## 7. Versioning policy

Changesets semver: `patch` (fixes), `minor` (new utilities/features),
`major` (breaking). All four public packages bump together in practice
(`changeset` asks per-package; link them with `"fixed": ["@nakshora/core", "@nakshora/cli", "@nakshora/postcss", "@nakshora/vite-plugin"]` in `.changeset/config.json` if you want strict lockstep).
