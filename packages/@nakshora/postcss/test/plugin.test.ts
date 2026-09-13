import { describe, expect, it } from 'vitest';
import postcss from 'postcss';
import nakshora from '../src/index';

async function run(css: string, options = {}) {
  const result = await postcss([nakshora(options)]).process(css, {
    from: undefined,
  });
  return result.css;
}

describe('@nakshora/postcss', () => {
  it('expands @nakshora source; (full build)', async () => {
    const css = await run('@nakshora source;');
    expect(css).toContain('.flex { display: flex; }');
    expect(css).toContain('.bg-blue-500 { background-color: #3b82f6; }');
    expect(css).toContain('@media (min-width: 640px) {');
    expect(css).toContain('.neon-card');
    expect(css).not.toContain('@nakshora');
  });

  it('uses JIT mode when content is provided', async () => {
    const css = await run('@nakshora utilities;', {
      content: '<div class="mt-4 hover:bg-rose-500">x</div>',
    });
    expect(css).toContain('.mt-4 { margin-top: 1rem; }');
    expect(css).toContain('.hover\\:bg-rose-500:hover { background-color: #f43f5e; }');
    expect(css).not.toContain('.flex { display: flex; }');
  });

  it('supports @nakshora base;', async () => {
    const css = await run('@nakshora base;');
    expect(css).toContain('box-sizing: border-box;');
    expect(css).not.toContain('.flex { display: flex; }');
  });

  it('supports @nakshora variables;', async () => {
    const css = await run('@nakshora variables;');
    expect(css).toContain(':root {');
    expect(css).toContain('--color-blue-500: #3b82f6;');
    expect(css).not.toContain('.flex { display: flex; }');
  });

  it('supports @nakshora components;', async () => {
    const css = await run('@nakshora components;');
    expect(css).toContain('.glass {');
    expect(css).toContain('.brutalist-card');
    expect(css).not.toContain('.flex { display: flex; }');
  });

  it('supports @nakshora keyframes;', async () => {
    const css = await run('@nakshora keyframes;');
    expect(css).toContain('@keyframes spin');
    expect(css).not.toContain('.flex { display: flex; }');
  });

  it('applies theme config overrides', async () => {
    const css = await run('@nakshora utilities;', {
      config: { theme: { colors: { blue: { 500: '#123456' } } } },
    });
    expect(css).toContain('.bg-blue-500 { background-color: #123456; }');
  });

  it('minifies when requested', async () => {
    const css = await run('@nakshora base;', { minify: true });
    expect(css).not.toContain('\n  ');
    expect(css).toContain('box-sizing:border-box');
  });

  it('leaves CSS without at-rules untouched', async () => {
    const css = await run('body { color: red; }');
    expect(css).toBe('body { color: red; }');
  });
});
