// One version string, everywhere: src/version.ts, every package.json, the
// root package.json, the CSS banners and the AI corpus.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { CSSGenerator, buildAICorpus, metadata, version } from '../src/index';

const root = join(__dirname, '../../../..');
const pkgVersion = (p: string): string =>
  (JSON.parse(readFileSync(join(root, p), 'utf-8')) as { version: string }).version;

it('src/version.ts matches all five package.json files', () => {
  for (const p of ['core', 'cli', 'postcss', 'vite-plugin'])
    expect(pkgVersion(`packages/@nakshora/${p}/package.json`), p).toBe(version);
  expect(pkgVersion('package.json')).toBe(version);
  expect(metadata.version).toBe(version);
});

it('CSS banners and the AI corpus carry that version', () => {
  const gen = new CSSGenerator();
  expect(
    gen.generateJIT('<a class="flex">').startsWith(`/*! Nakshora v${version} — JIT build`),
  ).toBe(true);
  expect(gen.getBase()).not.toContain(`v${version}-`);
  expect(buildAICorpus().version).toBe(version);
});
