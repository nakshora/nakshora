// Real-world install of the packages: `pnpm pack` every workspace package,
// `npm install` the tarballs into a throw-away consumer project, then run the
// binary the way users do (`node_modules/.bin/nakshora`, `npx nakshora`) and
// import the libraries from both module systems.
//
// Regressions this catches:
//  - the bin silently doing nothing when invoked through a symlink
//    (`import.meta.url === 'file://' + argv[1]` never matched `.bin/nakshora`),
//  - `--minify` being ignored in JIT mode,
//  - `require('@nakshora/postcss')` returning `{ default }` instead of the plugin,
//  - packed tarballs missing `dist/` files or shipping a broken `exports` map.

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const repo = join(__dirname, '../../../..');
const packages = ['core', 'postcss', 'cli', 'vite-plugin'];
let consumer: string;
let packDir: string;

function run(
  cmd: string,
  args: string[],
  cwd: string,
): { stdout: string; stderr: string; status: number } {
  const r = spawnSync(cmd, args, {
    cwd,
    encoding: 'utf-8',
    env: { ...process.env, NO_COLOR: '1' },
  });
  return { stdout: r.stdout ?? '', stderr: r.stderr ?? '', status: r.status ?? -1 };
}

beforeAll(() => {
  packDir = mkdtempSync(join(tmpdir(), 'nakshora-pack-'));
  for (const p of packages) {
    execFileSync('pnpm', ['pack', '--pack-destination', packDir], {
      cwd: join(repo, 'packages/@nakshora', p),
      stdio: 'pipe',
    });
  }
  consumer = mkdtempSync(join(tmpdir(), 'nakshora-consumer-'));
  writeFileSync(
    join(consumer, 'package.json'),
    JSON.stringify({ name: 'consumer', private: true }),
  );
  const tarballs = readdirSync(packDir)
    .filter((f) => f.endsWith('.tgz') && !f.includes('vite-plugin'))
    .map((f) => join(packDir, f));
  execFileSync(
    'npm',
    ['install', '--no-audit', '--no-fund', '--prefer-offline', ...tarballs, 'postcss@8'],
    {
      cwd: consumer,
      stdio: 'pipe',
    },
  );
  writeFileSync(
    join(consumer, 'index.html'),
    '<div class="flex p-4 hover:bg-red-500 md:grid neon-btn">hi</div>',
  );
  writeFileSync(
    join(consumer, 'nakshora.config.json'),
    JSON.stringify({ content: ['./index.html'] }),
  );
}, 180_000);

afterAll(() => {
  rmSync(consumer, { recursive: true, force: true });
  rmSync(packDir, { recursive: true, force: true });
});

describe('packed tarballs', () => {
  it('produce one tarball per package at version 3.0.0', () => {
    const files = readdirSync(packDir).sort();
    expect(files).toEqual([
      'nakshora-cli-3.0.0.tgz',
      'nakshora-core-3.0.0.tgz',
      'nakshora-postcss-3.0.0.tgz',
      'nakshora-vite-plugin-3.0.0.tgz',
    ]);
  });

  it('install with dist/ present and a working bin symlink', () => {
    expect(existsSync(join(consumer, 'node_modules/@nakshora/core/dist/index.js'))).toBe(true);
    expect(existsSync(join(consumer, 'node_modules/@nakshora/core/dist/index.cjs'))).toBe(true);
    expect(existsSync(join(consumer, 'node_modules/@nakshora/cli/dist/cli.js'))).toBe(true);
    expect(existsSync(join(consumer, 'node_modules/.bin/nakshora'))).toBe(true);
  });
});

describe('nakshora binary', () => {
  it('node_modules/.bin/nakshora --version prints 3.0.0', () => {
    const r = run(join(consumer, 'node_modules/.bin/nakshora'), ['--version'], consumer);
    expect(r.status).toBe(0);
    expect(r.stdout.trim()).toBe('3.0.0');
  });

  it('node_modules/.bin/nakshora build -o out.css writes a JIT build', () => {
    const r = run(
      join(consumer, 'node_modules/.bin/nakshora'),
      ['build', '-o', 'out.css'],
      consumer,
    );
    expect(r.status, r.stderr).toBe(0);
    const css = readFileSync(join(consumer, 'out.css'), 'utf-8');
    expect(css).toContain('JIT build');
    expect(css).toContain('.flex { display: flex; }');
    expect(css).toContain('.hover\\:bg-red-500:hover');
    expect(css).toContain('@media (min-width: 768px)');
    expect(css).toContain('.neon-btn');
    expect(css.length).toBeLessThan(50_000);
  });

  it('--minify actually minifies JIT output', () => {
    const r = run(
      join(consumer, 'node_modules/.bin/nakshora'),
      ['build', '-o', 'out.min.css', '--minify'],
      consumer,
    );
    expect(r.status, r.stderr).toBe(0);
    const pretty = readFileSync(join(consumer, 'out.css'), 'utf-8');
    const min = readFileSync(join(consumer, 'out.min.css'), 'utf-8');
    expect(min).toContain('.flex{display:flex;}');
    expect(min.length).toBeLessThan(pretty.length);
  });

  it('npx nakshora build (stdout) works', () => {
    const r = run('npx', ['--no-install', 'nakshora', 'build', '--minify'], consumer);
    expect(r.status, r.stderr).toBe(0);
    expect(r.stdout).toContain('.flex{display:flex;}');
    expect(r.stdout).toContain('.hover\\:bg-red-500:hover{');
  }, 60_000);

  it('splices @nakshora utilities; inside an input stylesheet', () => {
    writeFileSync(
      join(consumer, 'app.css'),
      '.before{color:red}\n@nakshora utilities;\n.after{color:blue}\n',
    );
    const r = run(join(consumer, 'node_modules/.bin/nakshora'), ['build', 'app.css'], consumer);
    expect(r.status, r.stderr).toBe(0);
    const before = r.stdout.indexOf('.before');
    const flex = r.stdout.indexOf('.flex {');
    const after = r.stdout.indexOf('.after');
    expect(before).toBeGreaterThanOrEqual(0);
    expect(flex).toBeGreaterThan(before);
    expect(after).toBeGreaterThan(flex);
    expect(r.stdout).not.toContain('@nakshora');
  });
});

describe('library entry points from a consumer project', () => {
  it('ESM: import { CSSGenerator } from "@nakshora/core" and the postcss plugin', () => {
    writeFileSync(
      join(consumer, 'esm.mjs'),
      [
        "import { CSSGenerator, version } from '@nakshora/core';",
        "import postcss from 'postcss';",
        "import nakshora from '@nakshora/postcss';",
        "import { runBuild } from '@nakshora/cli';",
        'const css = new CSSGenerator().generateFromContent(\'<a class="p-2">\');',
        "const r = await postcss([nakshora({ content: ['./index.html'] })]).process('@nakshora utilities;', { from: 'a.css' });",
        'console.log(JSON.stringify({ version, p2: css.includes(".p-2 { padding: 0.5rem; }"), pc: r.css.includes(".hover\\\\:bg-red-500:hover"), rb: typeof runBuild }));',
      ].join('\n'),
    );
    const r = run('node', ['esm.mjs'], consumer);
    expect(r.status, r.stderr).toBe(0);
    expect(JSON.parse(r.stdout.trim())).toEqual({
      version: '3.0.0',
      p2: true,
      pc: true,
      rb: 'function',
    });
  });

  it('CJS: require("@nakshora/core") / require("@nakshora/postcss")(…) / postcss.config.js style', () => {
    writeFileSync(
      join(consumer, 'cjs.cjs'),
      [
        "const { CSSGenerator, version } = require('@nakshora/core');",
        "const postcss = require('postcss');",
        "const nakshora = require('@nakshora/postcss');",
        "const { runBuild } = require('@nakshora/cli');",
        'const css = new CSSGenerator().generateFromContent(\'<a class="p-2">\');',
        'Promise.all([',
        // postcss.config.js: plugins: [require("@nakshora/postcss")({ … })]
        "  postcss([nakshora({ content: ['./index.html'] })]).process('@nakshora utilities;', { from: 'a.css' }),",
        // postcss-load-config: plugins: { "@nakshora/postcss": {} } → module used as the plugin creator
        "  postcss([nakshora]).process('@nakshora base;', { from: 'a.css' }),",
        ']).then(([a, b]) => console.log(JSON.stringify({ version, p2: css.includes(".p-2 { padding: 0.5rem; }"), pc: a.css.includes(".hover\\\\:bg-red-500:hover"), base: b.css.includes("box-sizing: border-box"), fn: typeof nakshora, flag: nakshora.postcss, rb: typeof runBuild })));',
      ].join('\n'),
    );
    const r = run('node', ['cjs.cjs'], consumer);
    expect(r.status, r.stderr).toBe(0);
    expect(JSON.parse(r.stdout.trim())).toEqual({
      version: '3.0.0',
      p2: true,
      pc: true,
      base: true,
      fn: 'function',
      flag: true,
      rb: 'function',
    });
  });
});
