// Opt-in real cascade layers (`layers: true`).
import { describe, expect, it } from 'vitest';
import { CSSGenerator } from '../src/index';

const html = '<a class="flex hover:flex md:p-2 neon-btn">';

describe('layers: true', () => {
  it('JIT output declares the order and wraps the three sections', () => {
    const css = new CSSGenerator({ layers: true }).generateJIT(html);
    const lines = css.split('\n');
    expect(lines[1]).toBe('@layer base, components, utilities;');
    expect(lines[2]).toBe('@layer base {');
    const opens = lines.filter((l) => /^@layer [a-z]+ \{$/.test(l));
    expect(opens).toEqual(['@layer base {', '@layer components {', '@layer utilities {']);
    // utilities (incl. media wrappers) all live inside the utilities layer
    const util = css.slice(css.indexOf('@layer utilities {'));
    expect(util).toContain('.flex { display: flex; }');
    expect(util).toContain('.hover\\:flex:hover { display: flex; }');
    expect(util).toContain('@media (min-width: 768px) {\n  .md\\:p-2 { padding: 0.5rem; }\n}');
    expect(util.trimEnd().endsWith('}')).toBe(true);
    const comp = css.slice(css.indexOf('@layer components {'), css.indexOf('@layer utilities {'));
    expect(comp).toContain('.neon-btn');
  });

  it('full output is wrapped too and the default stays flat', () => {
    const full = new CSSGenerator({ layers: true }).generate({ mode: 'full' });
    expect(full.match(/^@layer [a-z]+ \{$/gm)).toEqual([
      '@layer base {',
      '@layer components {',
      '@layer utilities {',
    ]);
    expect(new CSSGenerator().generateJIT(html)).not.toContain('@layer');
    expect(new CSSGenerator().generate({ mode: 'full' })).not.toContain('@layer');
  });

  it('contains exactly the flat build plus the wrapper lines', () => {
    const flat = new CSSGenerator().generateJIT(html).split('\n');
    const layered = new CSSGenerator({ layers: true }).generateJIT(html).split('\n');
    const body = (lines: string[]) => lines.filter((l) => !/^@layer|^\}$/.test(l));
    expect(body(layered)).toEqual(body(flat));
    expect(layered.length - flat.length).toBe(1 + 3 + 3); // order stmt + 3 opens + 3 closes
    expect(layered.filter((l) => l === '}').length - flat.filter((l) => l === '}').length).toBe(3);
  });

  it('author @layer blocks pass through with @apply expanded', () => {
    const out = new CSSGenerator({ layers: true }).processCss(
      '@layer components {\n  .btn { @apply p-2 hover:flex; }\n}',
      { strict: true },
    );
    expect(out).toContain('@layer components {');
    expect(out).toContain('.btn { padding: 0.5rem; }');
    expect(out).toContain('.btn:hover { display: flex; }');
  });
});
