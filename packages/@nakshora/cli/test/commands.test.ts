// CLI features beyond the basic build: --content / --safelist overrides,
// stdin input, --source-map, --stats fields, --diff, `doctor`, `migrate`.
// Runs the built `dist/cli.js` with NAKSHORA_CLI=1 so the real argument
// parsing is exercised.

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { runBuild, generatedSourceMap } from '../src/build';
import { diagnose } from '../src/doctor';
import { migrateSource, migrateTailwindConfig } from '../src/migrate';
import { applyCliOverrides, diffSelectors } from '../src/cli';

const CLI = join(__dirname, '../dist/cli.js');
let tmp: string;

function cli(args: string[], cwd: string, input?: string) {
  const r = spawnSync(process.execPath, [CLI, ...args], {
    cwd,
    input,
    encoding: 'utf-8',
    env: { ...process.env, NAKSHORA_CLI: '1', FORCE_COLOR: '0' },
  });
  return { code: r.status, out: r.stdout, err: r.stderr };
}

beforeAll(() => {
  tmp = mkdtempSync(join(tmpdir(), 'nakshora-cmd-'));
  mkdirSync(join(tmp, 'src'));
  writeFileSync(
    join(tmp, 'src/a.html'),
    '<div class="flex p-4 hover:underline md:card-neon">x</div>',
  );
  writeFileSync(
    join(tmp, 'src/b.tsx'),
    'export const C = () => <i className="grid uhd:hidden gap-2" />;',
  );
  writeFileSync(
    join(tmp, 'nakshora.config.json'),
    JSON.stringify({ content: ['./src/**/*.{html,tsx}'] }),
  );
});
afterAll(() => rmSync(tmp, { recursive: true, force: true }));

describe('build flags', () => {
  it('--content and --safelist override the config', () => {
    const cfg = applyCliOverrides(
      { content: ['a'], safelist: ['x'] },
      { content: ['b'], safelist: ['y,z', 'w'] },
    );
    expect(cfg.content).toEqual(['b']);
    expect(cfg.safelist).toEqual(['x', 'y', 'z', 'w']);
    const r = cli(
      ['build', '--content', 'src/b.tsx', '--safelist', 'sr-only', 'text-red-500'],
      tmp,
    );
    expect(r.code).toBe(0);
    expect(r.out).toContain('.grid {');
    expect(r.out).not.toContain('.flex {'); // a.html not scanned
    expect(r.out).toContain('.sr-only {');
    expect(r.out).toContain('.text-red-500 {');
  });

  it('reads the input stylesheet from stdin (`-`)', () => {
    const r = cli(
      ['build', '-', '--content', 'src/a.html'],
      tmp,
      '@nakshora utilities;\n.x { @apply p-2; }\n',
    );
    expect(r.code).toBe(0);
    expect(r.out).toContain('.flex { display: flex; }');
    expect(r.out).toContain('.x { padding: 0.5rem; }');
    expect(r.out).not.toContain('@nakshora');
    const bad = cli(['build', '-'], tmp, '.x { @apply nope-1; }');
    expect(bad.code).toBe(1);
    expect(bad.err).toContain('<stdin>');
    expect(bad.err).toContain('nope-1');
  });

  it('--source-map writes <output>.map with a valid v3 map and the comment', async () => {
    const out = join(tmp, 'dist/sm.css');
    const res = await runBuild({
      config: { content: ['./src/**/*.html'] },
      output: out,
      cwd: tmp,
      sourceMap: true,
    });
    expect(res.mapFile).toBe(`${out}.map`);
    const css = readFileSync(out, 'utf-8');
    expect(css.trimEnd().endsWith('/*# sourceMappingURL=sm.css.map */')).toBe(true);
    const map = JSON.parse(readFileSync(`${out}.map`, 'utf-8'));
    expect(map.version).toBe(3);
    expect(map.file).toBe('sm.css');
    expect(map.sources).toEqual(['nakshora:generated']);
    expect(map.mappings.split(';').length).toBe(css.split('\n').length - 2); // css got 2 extra lines for the comment
    expect(generatedSourceMap('a\nb', 'x.css', 'in.css').sources).toEqual(['in.css']);
  });

  it('--stats reports candidates, unknown classes and timing', async () => {
    const res = await runBuild({
      config: { content: ['./src/**/*.{html,tsx}'] },
      cwd: tmp,
      dryRun: true,
    });
    expect(res.candidates).toBeGreaterThan(5);
    expect(res.unknown).toContain('md:card-neon'); // v1 name → no CSS
    expect(res.unknown).not.toContain('flex');
    expect(res.durationMs).toBeGreaterThan(0);
    const r = cli(['build', '--stats', '-o', 'dist/stats.css'], tmp);
    expect(r.code).toBe(0);
    expect(r.err).toMatch(/candidates\s+\d+/);
    expect(r.err).toMatch(/unknown\s+\d+ candidate/);
    expect(r.err).toContain('card-neon');
  });

  it('--diff shows selector changes against the existing output and writes nothing', () => {
    const out = join(tmp, 'dist/diff.css');
    mkdirSync(join(tmp, 'dist'), { recursive: true });
    writeFileSync(out, '.flex { display: flex; }\n.gone { color: red; }\n');
    const before = readFileSync(out, 'utf-8');
    const r = cli(['build', '--diff', '-o', 'dist/diff.css', '--content', 'src/a.html'], tmp);
    expect(r.code).toBe(0);
    expect(r.out).toContain('- .gone');
    expect(r.out).toContain('+ .p-4');
    expect(r.out).not.toContain('+ .flex');
    expect(readFileSync(out, 'utf-8')).toBe(before);
    expect(diffSelectors('.a{x:1}', '.a{x:1}.b{y:2}')).toEqual({ added: ['.b'], removed: [] });
    expect(diffSelectors('@media (min-width: 1px) {\n  .m { a: b }\n}', '')).toEqual({
      added: [],
      removed: ['.m'],
    });
  });
});

describe('CSS-first configuration via the CLI', () => {
  it('@theme/@utility/@custom-variant in the input stylesheet extend the config', async () => {
    const css = [
      '@theme { --color-brand-500: #123456; --breakpoint-3xl: 120rem; --my-token: 1px; }',
      '@utility tab-* { tab-size: --value(--tab-size-*, integer, [integer]); }',
      '@custom-variant hocus (&:hover, &:focus);',
      '@nakshora utilities;',
      '.btn { @apply tab-4 hocus:bg-brand-500; }',
    ].join('\n');
    writeFileSync(join(tmp, 'v4.html'), '<a class="3xl:tab-2 tab-[8] hocus:flex bg-brand-500">');
    const res = await runBuild({
      config: { content: ['v4.html'] },
      inputCss: css,
      cwd: tmp,
      dryRun: true,
    });
    expect(
      res.css.startsWith(
        ':root {\n  --color-brand-500: #123456;\n  --breakpoint-3xl: 120rem;\n  --my-token: 1px;\n}\n',
      ),
    ).toBe(true);
    expect(res.css).not.toMatch(/@theme|@utility|@custom-variant|@nakshora/);
    expect(res.css).toContain('.tab-\\[8\\] { tab-size: 8; }');
    expect(res.css).toContain('.hocus\\:flex:hover { display: flex; }');
    expect(res.css).toContain(
      '@media (min-width: 120rem) {\n  .\\33xl\\:tab-2 { tab-size: 2; }\n}',
    );
    expect(res.css).toContain('.btn { tab-size: 4; }');
    expect(res.css).toContain('.btn:focus { --tw-bg-opacity: 1; background-color: rgb(18 52 86');
    // only extractor noise is unknown — every real class compiled
    expect(res.unknown.filter((c) => !/^class|^tab-$/.test(c))).toEqual([]);
    // minified variant keeps the variables and drops the whitespace
    const min = await runBuild({
      config: { content: ['<a class="tab-4">'] },
      inputCss: css,
      cwd: tmp,
      dryRun: true,
      minify: true,
    });
    expect(min.css.startsWith(':root{--color-brand-500:#123456;')).toBe(true);
    expect(min.css).toContain('.tab-4{tab-size:4;}');
  });
});

describe('doctor', () => {
  it('reports config, content globs, apply errors and dependency issues', async () => {
    const proj = mkdtempSync(join(tmpdir(), 'nakshora-doc-'));
    try {
      writeFileSync(
        join(proj, 'package.json'),
        JSON.stringify({
          devDependencies: { '@nakshora/postcss': '3.0.0', tailwindcss: '3.4.19' },
        }),
      );
      writeFileSync(
        join(proj, 'nakshora.config.json'),
        JSON.stringify({
          content: ['./src/**/*.html', './nothing/**/*.vue'],
          safelist: ['flex', 'bogus-9'],
          variants: { hovr: false },
        }),
      );
      mkdirSync(join(proj, 'src'));
      writeFileSync(join(proj, 'src/i.html'), '<a class="flex">');
      writeFileSync(join(proj, 'app.css'), '@nakshora source;\n.a { @apply p-4 nope-2; }');
      writeFileSync(
        join(proj, 'theme.css'),
        '@theme { --color-brand-500: #123456; --my-token: 1px; }\n@utility tab-* { tab-size: --value(integer); width: --spacing(4); }\n.b { @apply bg-brand-500 tab-4; }',
      );
      const { findings } = await diagnose(proj);
      const by = (check: string) => findings.filter((f) => f.check === check);
      expect(by('config')[0].level).toBe('ok');
      expect(
        by('content').some((f) => f.level === 'warn' && f.message.includes('nothing/**/*.vue')),
      ).toBe(true);
      expect(by('content').some((f) => f.level === 'ok' && f.message.includes('1 file'))).toBe(
        true,
      );
      expect(by('safelist')[0].message).toContain('bogus-9');
      expect(by('safelist')[0].message).not.toContain('flex');
      expect(by('variants')[0].message).toContain('hovr');
      expect(by('apply')[0].level).toBe('error');
      expect(by('apply')[0].message).toContain('nope-2');
      expect(by('deps').some((f) => f.message.includes('postcss peer'))).toBe(true);
      expect(by('deps').some((f) => f.message.includes('tailwindcss'))).toBe(true);
      expect(by('css')[0].level).toBe('ok');
      // CSS-first config: recognised, notes surfaced, and @apply of its classes resolves
      expect(by('css-config').map((f) => [f.level, f.message.split(':')[0]])).toEqual([
        ['warn', 'theme.css'],
        ['warn', 'theme.css'],
        ['ok', '@theme / @utility / @custom-variant in theme.css'],
      ]);
      expect(by('css-config')[0].message).toContain('--my-token');
      expect(by('css-config')[1].message).toContain('`--spacing()` is not implemented');
      expect(by('apply').filter((f) => f.message.startsWith('theme.css'))).toEqual([
        expect.objectContaining({ level: 'ok' }),
      ]);
      const r = cli(['doctor'], proj);
      expect(r.code).toBe(1); // the @apply error
      expect(r.out).toContain('✖ apply');
      const j = cli(['doctor', '--json'], proj);
      expect(JSON.parse(j.out).length).toBe(findings.length);
    } finally {
      rmSync(proj, { recursive: true, force: true });
    }
  });

  it('a project without config gets a warning, not an error', async () => {
    const proj = mkdtempSync(join(tmpdir(), 'nakshora-doc2-'));
    try {
      const { findings } = await diagnose(proj);
      expect(findings.find((f) => f.check === 'config')?.level).toBe('warn');
      expect(cli(['doctor'], proj).code).toBe(0);
    } finally {
      rmSync(proj, { recursive: true, force: true });
    }
  });
});

describe('migrate', () => {
  it('renames v1 classes inside class/className attributes only, keeping variants', () => {
    const { text, changes } = migrateSource(
      '<a class="card-neon md:btn-neon uhd:flex k8:hidden text-mono-100">card-neon</a><b className="!card-neon">',
      'v1',
    );
    expect(text).toBe(
      '<a class="neon-card md:neon-btn 4xl:flex 5xl:hidden text-mono-100">card-neon</a><b className="!neon-card">',
    );
    expect(changes).toEqual(
      expect.arrayContaining([
        { from: 'card-neon', to: 'neon-card', count: 2 },
        { from: 'uhd', to: '4xl', count: 1 },
      ]),
    );
  });

  it('ports a tailwind.config.js and lists what to review', () => {
    const src = `/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');
module.exports = {
  content: ['./src/**/*.html'],
  theme: { screens: { sm: '600px' }, extend: { fontFamily: { sans: ['Inter', ...defaultTheme.fontFamily.sans] } } },
  plugins: [require('@tailwindcss/typography'), plugin(() => {})],
};`;
    const { text, notes } = migrateTailwindConfig(src);
    expect(text).toContain("import('@nakshora/core').NakshoraConfig");
    expect(text).toContain("const { defaultTheme } = require('@nakshora/core');");
    expect(text).toContain("const { plugin } = require('@nakshora/core');");
    expect(text).not.toContain("'tailwindcss/defaultTheme'");
    expect(text).not.toContain("'tailwindcss/plugin'");
    expect(notes.join('\n')).toContain('theme.screens');
    expect(notes.join('\n')).toContain('@tailwindcss/typography');
    expect(notes.join('\n')).toContain('darkMode');
  });

  it('CLI dry-run lists files, --write applies and creates nakshora.config.js', () => {
    const proj = mkdtempSync(join(tmpdir(), 'nakshora-mig-'));
    try {
      writeFileSync(join(proj, 'index.html'), '<a class="flex-grow overflow-ellipsis">');
      writeFileSync(
        join(proj, 'tailwind.config.js'),
        "module.exports = { content: ['./*.html'], darkMode: 'media' }",
      );
      const dry = cli(['migrate'], proj);
      expect(dry.code).toBe(0);
      expect(dry.out).toContain('index.html');
      expect(dry.out).toContain('flex-grow→grow');
      expect(dry.out).toContain('tailwind.config.js → nakshora.config.js');
      expect(dry.out).toContain('dry run');
      expect(existsSync(join(proj, 'nakshora.config.js'))).toBe(false);
      const w = cli(['migrate', '--write'], proj);
      expect(w.code).toBe(0);
      expect(readFileSync(join(proj, 'index.html'), 'utf-8')).toBe(
        '<a class="grow text-ellipsis">',
      );
      expect(readFileSync(join(proj, 'nakshora.config.js'), 'utf-8')).toContain(
        "darkMode: 'media'",
      );
      const v1 = cli(['migrate', '--from', 'v1', '--write'], proj);
      expect(v1.out).toContain('nothing to migrate');
    } finally {
      rmSync(proj, { recursive: true, force: true });
    }
  });
});
