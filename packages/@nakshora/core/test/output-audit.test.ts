// Output audits: no duplicate rules in the full build, and the minifier is
// lossless (every rule / declaration survives, strings and urls untouched).

import { describe, expect, it } from 'vitest';
import { CSSGenerator, parseCss, minifyCss, type CssNode } from '../src/index';

/** selector whitespace around combinators / commas is not significant */
const normSel = (s: string): string => s.replace(/\s*([>~+,])\s*/g, '$1').replace(/\s+/g, ' ');

function flatten(nodes: CssNode[], wrap: string[] = [], out: string[] = []): string[] {
  for (const n of nodes) {
    if (n.type === 'rule')
      out.push(
        `${wrap.join('|')}|${normSel(n.selector)}{${n.nodes
          .filter((d): d is Extract<CssNode, { type: 'decl' }> => d.type === 'decl')
          .map((d) => `${d.prop}:${d.value.replace(/\s+/g, ' ')}${d.important ? '!' : ''}`)
          .join(';')}}`,
      );
    else if (n.type === 'atrule' && n.nodes)
      flatten(n.nodes, [...wrap, `@${n.name} ${n.params.replace(/\s+/g, ' ')}`], out);
    else if (n.type === 'atrule') out.push(`${wrap.join('|')}|@${n.name} ${n.params}`);
  }
  return out;
}

describe('output audit', () => {
  it('the full utilities layer has no duplicate (wrapper, selector, declarations) rules', () => {
    const css = new CSSGenerator().getUtilitiesFull(false);
    const rules = flatten(parseCss(css).nodes);
    const seen = new Map<string, number>();
    for (const r of rules) seen.set(r, (seen.get(r) ?? 0) + 1);
    const dupes = [...seen].filter(([, n]) => n > 1).map(([r]) => r);
    expect(dupes.slice(0, 20)).toEqual([]);
    expect(rules.length).toBeGreaterThan(50_000);
  }, 60_000);

  it('JIT output has no duplicate selectors for a large mixed candidate set', () => {
    const html = Array.from(
      { length: 300 },
      (_, i) =>
        `<i class="p-${i % 12} md:p-${i % 12} hover:bg-red-${(i % 9) * 100 + 100} dark:text-white neon-btn glass @md:flex max-lg:hidden [--i:${i % 3}]">`,
    ).join('');
    const css = new CSSGenerator().generateFromContent(html).split('Utilities (JIT) ─── */')[1];
    const rules = flatten(parseCss(css).nodes);
    expect(new Set(rules).size).toBe(rules.length);
  });

  it('the minifier is lossless on the full build (same rule set, same declarations)', () => {
    const pretty = new CSSGenerator().generate({ mode: 'full' });
    const min = minifyCss(pretty);
    expect(min.length).toBeLessThan(pretty.length);
    const a = flatten(parseCss(pretty).nodes);
    const b = flatten(parseCss(min).nodes);
    expect(b.length).toBe(a.length);
    expect(a.join('\n') === b.join('\n')).toBe(true);
  }, 60_000);

  it('the minifier never touches strings, urls, custom properties or `!important`', () => {
    const src = [
      ".a { content: 'a  b'; }",
      '.b { background: url("/x y.png") no-repeat; }',
      '.c { --tw-x: 1  2   3; font-family: "Open  Sans", ui-sans-serif; }',
      '.d { color: red !important; }',
      "@media (min-width: 640px) { .e::before { content: '\\201C'; } }",
      '@supports (display: grid) { .f { grid-template-areas: "a b" "c d"; } }',
    ].join('\n');
    const min = minifyCss(src);
    expect(min).toContain("content:'a  b'");
    expect(min).toContain('url("/x y.png")');
    expect(min).toContain('--tw-x:1  2   3');
    expect(min).toContain('"Open  Sans"');
    expect(min).toContain('color:red!important');
    expect(min).toContain("content:'\\201C'");
    expect(min).toContain('grid-template-areas:"a b" "c d"');
    expect(min).not.toContain('\n');
    expect(flatten(parseCss(min).nodes)).toEqual(flatten(parseCss(src).nodes));
  });
});
