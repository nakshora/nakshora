#!/usr/bin/env node
// Publish all Nakshora packages to GitHub Packages (npm registry) — and prove it.
//
//   - npmjs.com publishing is handled automatically by the release workflow
//     (changesets). This script is the companion step for GitHub Packages.
//   - Requires: NODE_AUTH_TOKEN / GITHUB_TOKEN with `packages: write`, and
//     packages built (`pnpm build`).
//
// Why pack with pnpm first?
//   Changesets intentionally keeps `workspace:*` ranges in the on-disk
//   package.json files (`changeset publish` delegates to `pnpm publish`, which
//   rewrites them on the fly). Plain `npm publish` does NOT understand the
//   `workspace:` protocol and dies with
//   `Unsupported URL Type "workspace:": workspace:*`.
//   So we let `pnpm pack` produce tarballs whose manifests already contain the
//   real versions, and publish those tarballs with npm (which supports
//   --registry/--userconfig for the GitHub Packages mirror).
//
// Reporting:
//   Every package outcome is emitted as a GitHub Actions annotation
//   (::notice / ::warning / ::error) and written to the job summary, so the
//   result is visible without opening the raw log. After publishing, the script
//   verifies each package through the GitHub REST API and flips any package that
//   came back private to public (GitHub Packages does not always inherit the
//   repository's visibility).
//
// Usage: node scripts/publish-github.mjs

import { execFileSync } from 'node:child_process';
import {
  appendFileSync,
  existsSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  writeFileSync,
  readFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const REGISTRY = 'https://npm.pkg.github.com';
const API = 'https://api.github.com';
const IN_ACTIONS = process.env.GITHUB_ACTIONS === 'true';

const token = process.env.NODE_AUTH_TOKEN ?? process.env.GITHUB_TOKEN;
if (!token) {
  console.error('❌ Missing NODE_AUTH_TOKEN / GITHUB_TOKEN environment variable.');
  process.exit(1);
}

const root = resolve(new URL('..', import.meta.url).pathname);
const packagesDir = join(root, 'packages', '@nakshora');
const [owner] = (process.env.GITHUB_REPOSITORY ?? 'nakshora/nakshora').split('/');

// ── reporting helpers ───────────────────────────────────────────────────────
const summaryLines = [];
function summary(line) {
  summaryLines.push(line);
  if (process.env.GITHUB_STEP_SUMMARY) {
    try {
      appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${line}\n`);
    } catch {
      /* non-fatal */
    }
  }
}
function annotate(level, title, message) {
  if (IN_ACTIONS) console.log(`::${level} title=${title}::${message.replace(/\n/g, '%0A')}`);
  console.log(`[${level}] ${title}: ${message}`);
}

// ── npm/pnpm plumbing ───────────────────────────────────────────────────────
// npm/pnpm config used only by this script (never written into the repo tree).
const npmrcPath = join(root, '.npmrc.gh.tmp');
writeFileSync(
  npmrcPath,
  `@nakshora:registry=${REGISTRY}\n//npm.pkg.github.com/:_authToken=${token}\n`,
);
const packDir = mkdtempSync(join(tmpdir(), 'nakshora-gh-pack-'));

/** Run a command, returning { status, output } without throwing. */
function run(cmd, args, cwd) {
  try {
    const output = execFileSync(cmd, args, {
      cwd,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    process.stdout.write(output);
    return { status: 0, output };
  } catch (error) {
    const output = `${error.stdout ?? ''}${error.stderr ?? ''}`;
    process.stdout.write(output);
    return { status: error.status ?? error.code ?? 1, output };
  }
}

function isAlreadyPublished(output) {
  return /cannot publish over the previously published|already published|EPUBLISHCONFLICT/i.test(
    output,
  );
}

/** The lines worth putting in an annotation: registry target + any error. */
function diag(output, lines = 4) {
  const all = output
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const key = all.filter((l) =>
    /Publishing to|npm (error|warn)|EPUBLISHCONFLICT|E4\d\d|forbidden|Unsupported URL|already published/i.test(
      l,
    ),
  );
  const picked = key.length > 0 ? key : all.filter((l) => !l.startsWith('npm notice'));
  return picked.slice(-lines).join(' | ');
}

// ── GitHub Packages REST helpers ────────────────────────────────────────────
async function ghApi(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    /* keep raw text */
  }
  return { status: res.status, json, text };
}

/** GitHub Packages lives under /orgs/{org} or /users/{user}. */
async function ownerKind() {
  const { status, json } = await ghApi(`/orgs/${owner}`);
  if (status === 200 && json?.type === 'Organization') return 'orgs';
  return 'users';
}

async function getPackage(kind, name) {
  return ghApi(`/${kind}/${owner}/packages/npm/${encodeURIComponent(name)}`);
}

// ── main ────────────────────────────────────────────────────────────────────
let failures = 0;
let published = 0;
const targets = [];
try {
  const dirs = readdirSync(packagesDir).map((d) => join(packagesDir, d));
  for (const dir of dirs) {
    const pkgPath = join(dir, 'package.json');
    if (!existsSync(pkgPath)) continue;
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    if (pkg.private) continue;
    if (!existsSync(join(dir, 'dist'))) {
      const msg = `${pkg.name}: no dist/ found — run \`pnpm build\` first.`;
      annotate('error', 'GitHub Packages', msg);
      summary(`- ❌ \`${pkg.name}\` — ${msg}`);
      failures++;
      continue;
    }
    targets.push({ dir, pkg });
  }

  summary(`## GitHub Packages mirror (${targets.length} package(s))\n`);

  for (const { dir, pkg } of targets) {
    const label = `${pkg.name}@${pkg.version}`;

    // 1. Pack with pnpm → tarball with `workspace:*` resolved to real versions.
    rmSync(packDir, { recursive: true, force: true });
    const pack = run('pnpm', ['pack', '--pack-destination', packDir], dir);
    const tarballs = existsSync(packDir)
      ? readdirSync(packDir).filter((f) => f.endsWith('.tgz'))
      : [];
    if (pack.status !== 0 || tarballs.length !== 1) {
      const msg = `failed to pack ${label} (exit ${pack.status}): ${diag(pack.output)}`;
      annotate('error', 'GitHub Packages', msg);
      summary(`- ❌ \`${label}\` — pack failed`);
      failures++;
      continue;
    }
    const tarball = join(packDir, tarballs[0]);

    // 2. Publish the tarball to GitHub Packages.
    const publish = run(
      'npm',
      [
        'publish',
        tarball,
        '--registry',
        REGISTRY,
        '--access',
        'public',
        `--userconfig=${npmrcPath}`,
      ],
      dir,
    );
    if (publish.status === 0) {
      annotate('notice', 'GitHub Packages', `published ${label} — ${diag(publish.output, 2)}`);
      summary(`- ✅ \`${label}\` — published`);
      published++;
    } else if (isAlreadyPublished(publish.output)) {
      annotate(
        'notice',
        'GitHub Packages',
        `${label} reported as already published — ${diag(publish.output, 2)}`,
      );
      summary(`- ⏭️ \`${label}\` — already published`);
      published++;
    } else {
      const msg = `failed to publish ${label} (exit ${publish.status}): ${diag(publish.output)}`;
      annotate('error', 'GitHub Packages', msg);
      summary(`- ❌ \`${label}\` — publish failed`);
      failures++;
    }
  }

  // 3. Verify through the API and make sure each package is publicly visible.
  const kind = await ownerKind();
  summary('');
  for (const { pkg } of targets) {
    const label = `${pkg.name}@${pkg.version}`;
    const { status, json } = await getPackage(kind, pkg.name);
    if (status !== 200 || !json) {
      const msg = `verification failed — GET /${kind}/${owner}/packages/npm/${pkg.name} returned ${status}. The package is not visible to this token.`;
      annotate('error', 'GitHub Packages', msg);
      summary(`- ⚠️ \`${label}\` — **not found in the registry API** (HTTP ${status})`);
      failures++;
      continue;
    }
    if (json.visibility !== 'public') {
      const patch = await ghApi(`/${kind}/${owner}/packages/npm/${encodeURIComponent(pkg.name)}`, {
        method: 'PATCH',
        body: { visibility: 'public' },
      });
      if (patch.status === 200) {
        annotate(
          'warning',
          'GitHub Packages',
          `${pkg.name} was ${json.visibility} — set to public`,
        );
        summary(`- 🔓 \`${label}\` — was **${json.visibility}**, now public`);
      } else {
        annotate(
          'error',
          'GitHub Packages',
          `${pkg.name} is ${json.visibility} and could not be made public (HTTP ${patch.status})`,
        );
        summary(
          `- ⚠️ \`${label}\` — still **${json.visibility}** (PATCH returned ${patch.status})`,
        );
        failures++;
      }
    } else {
      summary(
        `- 🔎 \`${label}\` — verified public · ${json.version_count} version(s) · ${json.html_url}`,
      );
    }
  }
} finally {
  rmSync(npmrcPath, { force: true });
  rmSync(packDir, { recursive: true, force: true });
}

console.log(`\nGitHub Packages: ${published} published, ${failures} failed/unverified`);
summary(`\n**Result:** ${published} published · ${failures} failed/unverified`);
process.exit(failures > 0 ? 1 : 0);
