// CSS validity detector: every byte Nakshora emits must be parseable CSS
// with known properties, valid selectors and no camelCase leaks.
// Uses css-tree's syntax database (matches property values against the
// CSS specs) — a permanent guard against regressions like `whiteSpace:` or
// `.2xl\:flex` (invalid selector) that shipped in 3.0.0.

import { describe, expect, it } from 'vitest';
import * as csstree from 'css-tree';
import { CSSGenerator, parseCss } from '../../src/index';
import { dynamicCorpus, mediaStackCorpus } from './corpus';

// Properties css-tree's database does not know yet (all real, spec'd properties).
const KNOWN_NEW_PROPERTIES = new Set([
  'mix-blend-mode:plus-darker', // css-tree 3.1 lacks `plus-darker` (Safari 17); Tailwind emits it too
  'field-sizing',
  'text-wrap',
  'forced-color-adjust',
  'scrollbar-gutter',
  'contain-intrinsic-size',
  'overflow-clip-margin',
  'print-color-adjust',
]);

/**
 * css-tree packs token offsets into 24 bits, so sources above ~16 M chars
 * must be linted in chunks split at top-level rule boundaries.
 */
function lint(css: string, label: string): string[] {
  const LIMIT = 8_000_000;
  if (css.length <= LIMIT) return lintChunk(css, label);
  const problems: string[] = [];
  let start = 0;
  while (start < css.length) {
    let end = Math.min(css.length, start + LIMIT);
    if (end < css.length) {
      // back up to a top-level `}\n` (depth 0)
      let depth = 0;
      let cut = -1;
      for (let i = start; i < end; i++) {
        if (css[i] === '{') depth++;
        else if (css[i] === '}') {
          depth--;
          if (depth === 0 && css[i + 1] === '\n') cut = i + 2;
        }
      }
      if (cut > start) end = cut;
    }
    problems.push(...lintChunk(css.slice(start, end), label));
    start = end;
  }
  return problems;
}

function lintChunk(css: string, label: string): string[] {
  const problems: string[] = [];
  const ast = csstree.parse(css, {
    positions: true,
    onParseError: (err: { message: string; line: number; column: number }) =>
      problems.push(`${label}: parse error ${err.message} @${err.line}:${err.column}`),
  });
  csstree.walk(ast, {
    visit: 'Declaration',
    enter(node) {
      const prop = node.property;
      if (prop.startsWith('--')) return; // custom properties: anything goes
      if (/[A-Z]/.test(prop)) problems.push(`${label}: camelCase property ${prop}`);
      if (KNOWN_NEW_PROPERTIES.has(prop)) return;
      const match = csstree.lexer.matchDeclaration(node);
      if (match.error) {
        const value = csstree.generate(node.value);
        if (KNOWN_NEW_PROPERTIES.has(`${prop}:${value}`)) return;
        // Values that legitimately depend on custom properties / math functions css-tree 3.1 does not model
        if (/var\(--|^(clamp|min|max)\(/.test(value)) return;
        if (
          match.error.name === 'SyntaxReferenceError' &&
          /Unknown property/.test(match.error.message)
        ) {
          problems.push(`${label}: unknown property ${prop}`);
          return;
        }
        problems.push(`${label}: ${prop}: ${value} → ${match.error.message}`);
      }
    },
  });
  csstree.walk(ast, {
    visit: 'Rule',
    enter(node) {
      const sel = csstree.generate(node.prelude);
      // an unescaped leading digit or `!`/`@`/`[` is an invalid selector
      if (/(^|[\s,>+~])\.(\d|!|@|\[)/.test(sel)) problems.push(`${label}: invalid selector ${sel}`);
    },
  });
  return problems;
}

describe('CSS validity (css-tree)', () => {
  it('the full build parses with zero errors, unknown properties or camelCase leaks', () => {
    const css = new CSSGenerator().generate({ mode: 'full' });
    const problems = lint(css, 'full');
    expect(problems.slice(0, 40)).toEqual([]);
    expect(problems.length).toBe(0);
  }, 120_000);

  it('the full build with every screen and state variant is valid too', () => {
    const gen = new CSSGenerator();
    const css = gen.getUtilitiesFull(true, { screens: 'all' });
    const problems = lint(css, 'full+variants');
    expect(problems.slice(0, 40)).toEqual([]);
  }, 120_000);

  it('dynamic candidates (arbitrary values, stacks) produce valid CSS', () => {
    const gen = new CSSGenerator();
    const css = gen.generateFromContent([...dynamicCorpus(), ...mediaStackCorpus()].join(' '));
    const problems = lint(css, 'dynamic').filter(
      // Tailwind 3.4 quirks reproduced on purpose so output stays identical (COMPATIBILITY.md §2.4):
      // `border-[3]` → `border-color: 3`, `text-[1.5]` → `color: 1.5`, `divide-[3px]` → `border-color: 3px`,
      // `font-[Open_Sans]` → `font-weight: Open Sans`, `outline-[3]` → `outline-width: 3`, `outline-offset-[3]` → `outline-offset: 3`
      (p) =>
        !/border-color: 3\b|color: 1\.5|border-color: 3px|font-weight: Open Sans|outline-width: 3\b|outline-offset: 3\b/.test(
          p,
        ),
    );
    expect(problems).toEqual([]);
  });

  it('minified output parses and keeps every rule (safe minifier)', () => {
    const gen = new CSSGenerator();
    const css = gen.generateFromContent(
      "<div class=\"flex p-4 md:hover:bg-red-500/50 content-['a_b'] bg-[url('/a_b.png')] font-['Open_Sans'] [&>*,&~*]:m-1\">",
    );
    const min = gen.minify(css);
    const problems = lint(min, 'minified');
    expect(problems).toEqual([]);
    const countRules = (s: string): number => {
      let n = 0;
      csstree.walk(csstree.parse(s), { visit: 'Rule', enter: () => n++ });
      return n;
    };
    expect(countRules(min)).toBe(countRules(css));
    // strings survive minification untouched
    expect(min).toContain("content:'a b'");
    expect(min).toContain("url('/a_b.png')"); // underscores inside url() stay literal (Tailwind rule)
    expect(min).toContain('>*,.'); // selector commas compacted outside brackets
    expect(min).toContain("font-family:'Open Sans'");
  });

  it('round-trip: every generated rule re-parses to the same declarations', () => {
    const gen = new CSSGenerator();
    const rules = gen.getUtilities();
    let checked = 0;
    const bad: string[] = [];
    for (const rule of rules) {
      const css = gen.compileClass(rule.class);
      const ast = parseCss(css);
      const first = ast.nodes.find((n) => n.type === 'rule' || n.type === 'atrule');
      if (!first) {
        bad.push(`${rule.class}: nothing emitted`);
        continue;
      }
      const declsOf = (n: typeof first): Record<string, string> => {
        if (n.type === 'rule')
          return Object.fromEntries(
            n.nodes
              .filter((d) => d.type === 'decl')
              .map((d) => [(d as { prop: string }).prop, (d as { value: string }).value]),
          );
        if (n.type === 'atrule' && n.nodes) return declsOf(n.nodes[0] as typeof first);
        return {};
      };
      const got = declsOf(first);
      for (const [k, v] of Object.entries(rule.decls)) {
        if ((got[k] ?? '').trim() !== String(v).trim())
          bad.push(`${rule.class}: ${k} = ${got[k]} ≠ ${String(v)}`);
      }
      checked++;
    }
    expect(bad.slice(0, 20)).toEqual([]);
    expect(checked).toBeGreaterThan(10_000);
  }, 120_000);
});
