# Contributing to Nakshora

Thank you for your interest in contributing to Nakshora! We welcome
contributions from everyone in the community.

## Table of contents

1. [Code of Conduct](#code-of-conduct)
2. [Development setup](#development-setup)
3. [Development process](#development-process)
4. [Reporting bugs](#reporting-bugs)
5. [Suggesting enhancements](#suggesting-enhancements)
6. [Pull requests](#pull-requests)
7. [Style guide](#style-guide)
8. [Community](#community)

## Code of Conduct

We are committed to a welcoming, inclusive community. Be respectful, accept
constructive criticism gracefully, focus on what is best for the community,
and show empathy.

## Development setup

Prerequisites: **Node.js ≥ 18 (22 LTS recommended)**, **pnpm ≥ 9**, Git.

```bash
git clone https://github.com/nakshora/nakshora.git
cd nakshora
corepack enable                      # activates pnpm 9 (see packageManager)
pnpm install --frozen-lockfile
pnpm build
pnpm test                            # 53 tests
```

The day-to-day loop is documented in [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Development process

- Work on a feature branch off `main`.
- Keep the quality gate green: `pnpm build && pnpm test && pnpm type-check && pnpm lint && pnpm format:check`.
- Add tests for new utilities/behavior (see `packages/@nakshora/core/test/`).
- If you touch the registry or themes, regenerate the docs and AI assets:
  `node scripts/generate-docs.mjs && pnpm ai:export && node scripts/generate-llms-full.mjs`.
- Announce your change with a changeset: `pnpm changeset:add` (pick the
  affected packages + patch/minor/major).

## Reporting bugs

Open an issue with:

- Nakshora version (`nakshora --version`)
- Node version + OS
- Minimal reproduction (markup + config)
- Expected vs. actual CSS output (`nakshora inspect | grep …`)

## Suggesting enhancements

Open an issue with a "🚀 Enhancement" label request. Big ideas: discuss in a
discussion first. The architecture lives in
[JIT_COMPILER_ARCHITECTURE (archive)](docs/archive/JIT_COMPILER_ARCHITECTURE.md)
and [docs/API.md](docs/API.md).

## Pull requests

1. Fork + branch: `git checkout -b feat/my-utility`
2. Make your change; keep the gate green.
3. Add a changeset: `pnpm changeset:add`
4. Commit with clear messages; open the PR.
5. CI runs: Test & Quality (Node 18/20/22), Changesets status.
6. On merge to `main`: versions bump and packages publish automatically
   (see [docs/PUBLISHING.md](docs/PUBLISHING.md)).

## Style guide

- **Prettier** (`.prettierrc.json`): single quotes, semicolons, 100 cols, LF.
- **ESLint 9** flat config (`eslint.config.js`), typescript-eslint recommended.
- **TypeScript strict** everywhere; ESM sources (`"type": "module"`).
- `@nakshora/core` must keep **zero runtime dependencies**.
- Utility names follow the existing grammar (`group-` + scale key; colors
  `util-palette-shade`).

## Community

- Website: [nakshora.dev](https://nakshora.dev)
- GitHub: [nakshora/nakshora](https://github.com/nakshora/nakshora)
- Issues: [nakshora/nakshora/issues](https://github.com/nakshora/nakshora/issues)
- Author: Rizwan Rahim Chowdhury ([rrc.bsdc.info.bd](https://rrc.bsdc.info.bd))
