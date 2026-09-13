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
//   result is readable without opening the raw log. After publishing, the script
//   verifies each package through the GitHub REST API and flips any package that
//   came back private to public.
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
function summary(line) {
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

/**
 * "This version is already on the registry" — npmjs.com and GitHub Packages
 * word it differently:
 *   npmjs:          cannot publish over the previously published versions
 *   GH Packages:    409 Conflict - Cannot publish over existing version
 */
function isAlreadyPublished(output) {
  return /cannot publish over (the previously published|existing version)|already published|EPUBLISHCONFLICT|E409/i.test(
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
  return status === 200 && json?.type === 'Organization' ? 'orgs' : 'users';
}

/**
 * The REST API addresses npm packages WITHOUT the scope: `@google/zx` is
 * `orgs/google/packages/npm/zx`. Try the unscoped name first, then the encoded
 * scoped forms, so either convention works.
 */
function nameCandidates(name) {
  const unscoped = name.replace(/^@[^/]+\//, '');
  return [unscoped, encodeURIComponent(name), name.replace('@', '%40')].filter(
    (v, i, a) => a.indexOf(v) === i,
  );
}

/** Find a package, returning { apiName, pkg } or null. */
async function findPackage(kind, name) {
  for (const apiName of nameCandidates(name)) {
    const { status, json } = await ghApi(`/${kind}/${owner}/packages/npm/${apiName}`);
    if (status === 200 && json) return { apiName, pkg: json };
  }
  return null;
}

/** Everything the token can see, for diagnostics. */
async function listPackages(kind) {
  const { status, json } = await ghApi(`/${kind}/${owner}/packages?package_type=npm&per_page=100`);
  if (status !== 200 || !Array.isArray(json)) return `list returned HTTP ${status}`;
  if (json.length === 0) return 'registry API lists **no packages** for this token';
  return json.map((p) => `${p.name} (${p.visibility}, ${p.version_count} version(s))`).join(', ');
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
      annotate(
        'error',
        'GitHub Packages',
        `failed to pack ${label} (exit ${pack.status}): ${diag(pack.output)}`,
      );
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
        `${label} is already on the registry — ${diag(publish.output, 2)}`,
      );
      summary(`- ⏭️ \`${label}\` — already on the registry`);
      published++;
    } else {
      annotate(
        'error',
        'GitHub Packages',
        `failed to publish ${label} (exit ${publish.status}): ${diag(publish.output)}`,
      );
      summary(`- ❌ \`${label}\` — publish failed`);
      failures++;
    }
  }

  // 3. Verify through the API and make sure each package is publicly visible.
  const kind = await ownerKind();
  summary('');
  let listed = null;
  for (const { pkg } of targets) {
    const label = `${pkg.name}@${pkg.version}`;
    const found = await findPackage(kind, pkg.name);

    if (!found) {
      listed ??= await listPackages(kind);
      const msg =
        `${pkg.name} is not visible to this token (GET /${kind}/${owner}/packages/npm/{${nameCandidates(pkg.name).join('|')}} → 404); ${listed}. ` +
        `If npm reported "Cannot publish over existing version" above, the package exists but is private and/or not linked to this repository — ` +
        `an org owner has to open it at https://github.com/orgs/${owner}/packages and set visibility to public (Package settings → Danger Zone).`;
      annotate('error', 'GitHub Packages', msg);
      summary(`- ⚠️ \`${label}\` — **not visible** via the registry API (private or unlinked)`);
      failures++;
      continue;
    }

    const { apiName } = found;
    if (found.pkg.visibility !== 'public') {
      const patch = await ghApi(`/${kind}/${owner}/packages/npm/${apiName}`, {
        method: 'PATCH',
        body: { visibility: 'public' },
      });
      if (patch.status === 200) {
        annotate(
          'warning',
          'GitHub Packages',
          `${pkg.name} was ${found.pkg.visibility} — set to public`,
        );
        summary(
          `- 🔓 \`${label}\` — was **${found.pkg.visibility}**, now public · ${patch.json?.html_url ?? ''}`,
        );
      } else {
        annotate(
          'error',
          'GitHub Packages',
          `${pkg.name} is ${found.pkg.visibility} and could not be made public (PATCH → HTTP ${patch.status})`,
        );
        summary(
          `- ⚠️ \`${label}\` — still **${found.pkg.visibility}** (PATCH returned ${patch.status})`,
        );
        failures++;
      }
    } else {
      annotate(
        'notice',
        'GitHub Packages',
        `${pkg.name} verified public (${found.pkg.version_count} version(s))`,
      );
      summary(
        `- 🔎 \`${label}\` — verified **public** · ${found.pkg.version_count} version(s) · ${found.pkg.html_url}`,
      );
    }
  }
} finally {
  rmSync(npmrcPath, { force: true });
  rmSync(packDir, { recursive: true, force: true });
}

console.log(
  `\nGitHub Packages: ${published} published/already-there, ${failures} failed or not public`,
);
summary(`\n**Result:** ${published} published/already-there · ${failures} failed or not public`);
process.exit(failures > 0 ? 1 : 0);
