// Real `vite build` on every supported major (5, 6, 7, 8) using the *built*
// plugin (`dist/`), the way a consumer gets it. Guards against:
//  - the virtual module being parsed as JS by Rollup (id must end in `.css`),
//  - content globs resolving against process.cwd() instead of the Vite root,
//  - `@nakshora …` at-rules in project stylesheets not being expanded,
//  - the CJS entry drifting from the ESM one.

import { mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const dist = join(__dirname, '../dist');

type ViteModule = {
  version: string;
  build: (config: Record<string, unknown>) => Promise<unknown>;
};
type PluginFactory = (o: Record<string, unknown>) => unknown;

// Vite 7+ requires Node ^20.19 || >=22.12 (its own `engines`); on older
// runtimes those majors are skipped — the plugin itself supports Node >=18.
const [nodeMajor, nodeMinor] = process.versions.node.split('.').map(Number);
const modernNode =
  nodeMajor > 22 || (nodeMajor === 22 && nodeMinor >= 12) || (nodeMajor === 20 && nodeMinor >= 19);
const VITES: Array<[string, string]> = [
  ['vite', '5'],
  ['vite6', '6'],
  ...(modernNode
    ? ([
        ['vite7', '7'],
        ['vite8', '8'],
      ] as Array<[string, string]>)
    : []),
];

function scaffold(): string {
  const root = mkdtempSync(join(tmpdir(), 'nakshora-vite-'));
  mkdirSync(join(root, 'src'));
  writeFileSync(
    join(root, 'index.html'),
    '<!doctype html><html><body>' +
      '<div class="flex p-4 md:hover:bg-red-500/50 neon-btn">hi</div>' +
      '<script type="module" src="/src/main.js"></script></body></html>',
  );
  writeFileSync(join(root, 'src/main.js'), "import 'virtual:nakshora';\nimport './app.css';\n");
  writeFileSync(
    join(root, 'src/app.css'),
    '@nakshora utilities;\n.x { color: red }\n.btn { @apply px-4 hover:underline; color: theme(colors.blue.500); }\n',
  );
  return root;
}

async function buildWith(
  vite: ViteModule,
  nakshora: PluginFactory,
  content: string[] = ['index.html'],
): Promise<string> {
  const root = scaffold();
  await vite.build({
    root,
    logLevel: 'error',
    plugins: [nakshora({ content })],
    build: { outDir: 'dist', minify: false },
  });
  const assets = join(root, 'dist/assets');
  return readdirSync(assets)
    .filter((f) => f.endsWith('.css'))
    .map((f) => readFileSync(join(assets, f), 'utf-8'))
    .join('\n');
}

function check(css: string): void {
  expect(css).toContain('.flex');
  expect(css).toContain('.md\\:hover\\:bg-red-500\\/50:hover');
  expect(css).toContain('.neon-btn'); // design component used in index.html
  expect(css).toContain('.x'); // author CSS survives around `@nakshora utilities;`
  expect(css).toContain('.btn'); // `@apply` + theme() expanded by the PostCSS plugin
  expect(css).toContain('padding-left: 1rem');
  expect(css).toContain('.btn:hover');
  expect(css).toContain('#3b82f6');
  expect(css).not.toContain('@apply');
  expect(css).not.toContain('theme(');
  expect(css).not.toContain('@nakshora');
  // JIT: not the full build
  expect(css.length).toBeLessThan(200_000);
}

describe('real vite build (ESM plugin entry)', () => {
  for (const [pkg, major] of VITES) {
    it(`vite ${major}: builds a project with virtual:nakshora + @nakshora utilities;`, async () => {
      const vite = (await import(pkg)) as ViteModule;
      expect(vite.version.split('.')[0]).toBe(major);
      const { nakshora } = (await import(join(dist, 'index.js'))) as { nakshora: PluginFactory };
      check(await buildWith(vite, nakshora));
    }, 60_000);
  }
});

describe('real vite build (CJS plugin entry)', () => {
  it('vite 5 with require("@nakshora/vite-plugin")', async () => {
    const vite = (await import('vite')) as ViteModule;
    const mod = require(join(dist, 'index.cjs')) as {
      nakshora: PluginFactory;
      default: PluginFactory;
    };
    expect(typeof mod.nakshora).toBe('function');
    expect(mod.default).toBe(mod.nakshora);
    check(await buildWith(vite, mod.nakshora));
  }, 60_000);
});

describe('vite root handling', () => {
  it('content globs resolve against the Vite root, not process.cwd()', async () => {
    const vite = (await import('vite')) as ViteModule;
    const { nakshora } = (await import(join(dist, 'index.js'))) as { nakshora: PluginFactory };
    // `**/*.html` relative to process.cwd() (the repo) would pull in the repo's
    // own index.html; relative to the temp root it matches only the fixture.
    const css = await buildWith(vite, nakshora, ['**/*.html']);
    expect(css).toContain('.md\\:hover\\:bg-red-500\\/50:hover');
    expect(css).not.toContain('.btn-neon');
    expect(css.length).toBeLessThan(200_000);
  }, 60_000);
});
