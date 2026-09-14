import { describe, expect, it } from 'vitest';
import postcss from 'postcss';
import nakshora, { spliceCss } from '../src/index';

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
    expect(css).toContain(
      '.bg-blue-500 { --tw-bg-opacity: 1; background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1)); }',
    );
    expect(css).toContain('@media (min-width: 640px) {');
    expect(css).toContain('.neon-card');
    expect(css).not.toContain('@nakshora');
  });

  it('uses JIT mode when content is provided', async () => {
    const css = await run('@nakshora utilities;', {
      content: '<div class="mt-4 hover:bg-rose-500">x</div>',
    });
    expect(css).toContain('.mt-4 { margin-top: 1rem; }');
    expect(css).toContain(
      '.hover\\:bg-rose-500:hover { --tw-bg-opacity: 1; background-color: rgb(244 63 94 / var(--tw-bg-opacity, 1)); }',
    );
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
    expect(css).toContain(
      '.bg-blue-500 { --tw-bg-opacity: 1; background-color: rgb(18 52 86 / var(--tw-bg-opacity, 1)); }',
    );
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

describe('spliceCss', () => {
  it('replaces the at-rule in place and keeps document order', () => {
    const root = postcss.parse('a{x:1}\n@nakshora utilities;\nb{y:2}');
    const at = root.nodes[1] as postcss.AtRule;
    spliceCss(at, '.p-1 { padding: 1px; }\n@media (min-width: 1px) { .q { r: s; } }');
    expect(root.nodes.map((n) => n.type)).toEqual(['rule', 'rule', 'atrule', 'rule']);
    expect(root.nodes.every((n) => n.parent === root)).toBe(true);
    expect(root.toString()).toBe(
      'a{x:1}\n.p-1 { padding: 1px; }\n@media (min-width: 1px) { .q { r: s; } }\nb{y:2}',
    );
  });

  it('is linear for full-build sized output (regression: replaceWith(...spread) was quadratic)', () => {
    // 200k rules ≈ the size of the responsive full build
    const big = Array.from({ length: 200_000 }, (_, i) => `.c${i}{p:${i}}`).join('\n');
    const root = postcss.parse('a{x:1}\n@nakshora utilities;\nb{y:2}');
    const t = performance.now();
    spliceCss(root.nodes[1] as postcss.AtRule, big);
    const ms = performance.now() - t;
    expect(root.nodes.length).toBe(200_002);
    expect(root.first?.toString()).toBe('a{x:1}');
    expect(root.last?.toString()).toBe('b{y:2}');
    expect(ms).toBeLessThan(5_000); // measured ≈ 0.4 s; the old path took > 30 s / overflowed
  });
});
