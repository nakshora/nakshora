import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { resolveContent } from '../src/content';
import { findConfigFile, loadConfigFile } from '../src/config-loader';
import { runBuild, summarize } from '../src/build';

let tmp: string;

beforeAll(() => {
  tmp = mkdtempSync(join(tmpdir(), 'nakshora-cli-'));
  mkdirSync(join(tmp, 'src'), { recursive: true });
  writeFileSync(
    join(tmp, 'src', 'index.html'),
    '<div class="flex items-center gap-4 p-4 bg-blue-500 hover:bg-blue-600 md:grid md:grid-cols-2">hi</div>',
  );
  writeFileSync(
    join(tmp, 'nakshora.config.json'),
    JSON.stringify({
      content: ['./src/**/*.{html,js,ts}'],
      safelist: ['lg:flex'],
      theme: { colors: { brand: { 500: '#123456' } } },
    }),
  );
});

afterAll(() => rmSync(tmp, { recursive: true, force: true }));

describe('content resolution', () => {
  it('resolves glob patterns to file contents', async () => {
    const chunks = await resolveContent(['./src/**/*.{html,js,ts}'], tmp);
    expect(chunks.length).toBe(1);
    expect(chunks[0]).toContain('bg-blue-500');
  });

  it('keeps raw strings as-is', async () => {
    const chunks = await resolveContent(['<div class="p-9">raw</div>'], tmp);
    expect(chunks[0]).toBe('<div class="p-9">raw</div>');
  });
});

describe('config loader', () => {
  it('finds the nearest config file', () => {
    const found = findConfigFile(join(tmp, 'src'));
    expect(found).toBe(join(tmp, 'nakshora.config.json'));
  });

  it('loads JSON configs', async () => {
    const cfg = await loadConfigFile(join(tmp, 'nakshora.config.json'));
    expect(cfg.content).toBeDefined();
    expect((cfg.theme as Record<string, unknown>).colors).toBeDefined();
  });
});

describe('runBuild', () => {
  it('builds JIT CSS from config content globs', async () => {
    const out = join(tmp, 'dist', 'out.css');
    const result = await runBuild({
      config: { content: ['./src/**/*.html'], safelist: ['lg:flex'] },
      output: out,
      cwd: tmp,
      minify: false,
    });
    const css = readFileSync(out, 'utf-8');
    expect(css).toContain(
      '.bg-blue-500 { --tw-bg-opacity: 1; background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1)); }',
    );
    expect(css).toContain('.hover\\:bg-blue-600:hover');
    expect(css).toContain('.md\\:grid-cols-2');
    expect(css).toContain('.lg\\:flex { display: flex; }');
    // JIT emits only the component blocks that the content actually uses
    expect(css).not.toContain('.neon-card');
    expect(result.classes).toBeGreaterThan(5);
    expect(result.sizeBytes).toBeGreaterThan(0);
  });

  it('includes a design component block only when its class is used', async () => {
    const out = join(tmp, 'dist', 'components.css');
    await runBuild({
      config: { content: ['<div class="neon-card p-2">x</div>'] },
      output: out,
      cwd: tmp,
      minify: false,
    });
    const css = readFileSync(out, 'utf-8');
    expect(css).toContain('.neon-card {');
    expect(css).toContain('.p-2 { padding: 0.5rem; }');
    expect(css).not.toContain('.brutalist-card');
  });

  it('splices generated CSS into @nakshora at-rules', async () => {
    const input = join(tmp, 'input.css');
    const out = join(tmp, 'dist', 'spliced.css');
    writeFileSync(input, '@nakshora source;\n@nakshora utilities;\nbody { color: red; }\n');
    await runBuild({
      config: { content: ['./src/**/*.html'] },
      input,
      output: out,
      cwd: tmp,
      mode: 'full',
    });
    const css = readFileSync(out, 'utf-8');
    expect(css).toContain('@nakshora'.length > 0 ? 'box-sizing: border-box' : 'x');
    expect(css).toContain('body { color: red; }');
    expect(css).not.toContain('@nakshora');
  });

  it('expands @apply / theme() in the input stylesheet and fails loudly on unknown classes', async () => {
    const input = join(tmp, 'apply.css');
    const out = join(tmp, 'dist', 'apply.css');
    writeFileSync(
      input,
      '@nakshora utilities;\n.btn { @apply px-4 hover:bg-red-500; color: theme(colors.blue.500); }\n',
    );
    await runBuild({ config: { content: ['./src/**/*.html'] }, input, output: out, cwd: tmp });
    const css = readFileSync(out, 'utf-8');
    expect(css).toContain('.btn { padding-left: 1rem; padding-right: 1rem; }');
    expect(css).toContain('.btn:hover { --tw-bg-opacity: 1;');
    expect(css).toContain('.btn { color: #3b82f6; }');
    expect(css).not.toContain('@apply');
    expect(css).not.toContain('@nakshora');
    // author-only stylesheet (no `@nakshora` at-rule) is processed too
    writeFileSync(input, '.a { @apply p-2; }\n');
    await runBuild({ config: { content: ['./src/**/*.html'] }, input, output: out, cwd: tmp });
    expect(readFileSync(out, 'utf-8')).toBe('.a { padding: 0.5rem; }\n');
    writeFileSync(input, '.a { @apply nope-42; }\n');
    await expect(
      runBuild({ config: { content: ['./src/**/*.html'] }, input, output: out, cwd: tmp }),
    ).rejects.toThrow(/apply\.css: .*nope-42/);
  });

  it('prints a summary line', async () => {
    const result = await runBuild({
      config: { content: ['./src/**/*.html'] },
      output: join(tmp, 'dist', 's.css'),
      cwd: tmp,
    });
    const line = summarize(result, join(tmp, 'dist', 's.css'));
    expect(line).toMatch(/classes/);
  });
});
