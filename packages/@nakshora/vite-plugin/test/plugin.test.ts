import { describe, expect, it } from 'vitest';
import { nakshora } from '../src/index';

interface TestPlugin {
  name: string;
  enforce: 'pre';
  resolveId: (id: string) => string | null;
  load: (id: string) => Promise<string | null>;
  config: (c: { css?: { postcss?: { plugins?: unknown[] } } }) => void;
}

function asTestPlugin(p: ReturnType<typeof nakshora>): TestPlugin {
  return p as unknown as TestPlugin;
}

describe('@nakshora/vite-plugin', () => {
  const plugin = asTestPlugin(nakshora());

  it('has the right identity', () => {
    expect(plugin.name).toBe('nakshora');
    expect(plugin.enforce).toBe('pre');
  });

  it('resolves the virtual module', () => {
    expect(plugin.resolveId('nakshora')).toBe('\0virtual:nakshora');
    expect(plugin.resolveId('virtual:nakshora')).toBe('\0virtual:nakshora');
    expect(plugin.resolveId('react')).toBeNull();
  });

  it('loads CSS for the virtual module (full build without content)', async () => {
    const css = (await plugin.load('\0virtual:nakshora')) as string;
    expect(css).toContain('.flex { display: flex; }');
    expect(css).toContain('@media (min-width: 640px) {');
  });

  it('loads JIT CSS when content is provided', async () => {
    const p = asTestPlugin(nakshora({ content: '<div class="p-4 bg-emerald-500">x</div>' }));
    const css = (await p.load('\0virtual:nakshora')) as string;
    expect(css).toContain('.p-4 { padding: 1rem; }');
    expect(css).toContain('.bg-emerald-500 { background-color: #10b981; }');
    expect(css).not.toContain('.flex { display: flex; }');
  });

  it('injects the postcss plugin into vite css config', () => {
    const config: { css?: { postcss?: { plugins?: unknown[] } } } = { css: {} };
    plugin.config(config);
    const postcss = config.css?.postcss;
    expect(postcss).toBeDefined();
    expect(Array.isArray(postcss?.plugins)).toBe(true);
    expect(postcss!.plugins!.length).toBe(1);
    expect(typeof postcss!.plugins![0]).toBe('object');
  });

  it('merges with existing postcss plugins', () => {
    const existing = { postcssPlugin: 'existing' };
    const config: { css?: { postcss?: { plugins?: unknown[] } } } = {
      css: { postcss: { plugins: [existing] } },
    };
    plugin.config(config);
    const plugins = config.css!.postcss!.plugins!;
    expect(plugins.length).toBe(2);
    expect(plugins[0]).toBe(existing);
  });

  it('skips postcss injection when disabled', () => {
    const p = asTestPlugin(nakshora({ postcss: false }));
    const config: { css?: { postcss?: { plugins?: unknown[] } } } = { css: {} };
    p.config(config);
    expect(config.css?.postcss).toBeUndefined();
  });
});
