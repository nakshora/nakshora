// `getStats` counts on the parsed stylesheet, not with regexes.
import { describe, expect, it } from 'vitest';
import { CSSGenerator } from '../src/index';

describe('getStats', () => {
  const gen = new CSSGenerator();

  it('counts rules, responsive rules and variant rules exactly on a small sheet', () => {
    const css = [
      '.a { color: red; }',
      '.hover\\:a:hover, .b { color: red; }', // variant (one selector of the list)
      '@media (min-width: 768px) {',
      '  .md\\:a { color: red; }', // responsive + variant
      '  .container { width: 100%; }', // responsive, no variant
      '}',
      '@container (min-width: 20rem) {',
      '  .\\@md\\:a { color: red; }', // container query counts as responsive
      '}',
      '@keyframes spin { from { x: 1 } to { x: 2 } }', // steps are not rules
      '@supports (display: grid) { .supports-\\[display\\:grid\\]\\:a { x: 1 } }', // variant, not responsive
    ].join('\n');
    const s = gen.getStats(css);
    expect(s).toMatchObject({ totalRules: 6, responsiveRules: 3, variantRules: 4 });
    expect(s.utilities).toBe(gen.getUtilities().length);
    expect(s.sizeBytes).toBe(Buffer.byteLength(css));
    expect(s.minifiedSizeBytes).toBeLessThan(s.sizeBytes);
  });

  it('JIT sheet: keyframes excluded, base rules carry no variant', () => {
    const css = gen.generateJIT('<a class="flex hover:flex md:p-2 @md:p-4 animate-spin">');
    const s = gen.getStats(css);
    expect(css).toContain('@keyframes spin');
    expect(s.responsiveRules).toBe(2);
    expect(s.variantRules).toBe(3);
    const utilityOnly = gen.getStats(
      gen.generateJIT('<a class="flex">', {}, { utilitiesOnly: true }),
    );
    expect(utilityOnly).toMatchObject({ totalRules: 1, responsiveRules: 0, variantRules: 0 });
  });

  it('full build: every responsive rule except the .container breakpoints has a variant', () => {
    const s = gen.getStats();
    expect(s.totalRules).toBeGreaterThan(60000);
    expect(s.responsiveRules - s.variantRules).toBe(5); // sm…2xl .container
    expect(s.variantRules).toBeLessThan(s.responsiveRules + 1);
  });
});
