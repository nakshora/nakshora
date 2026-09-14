// Differential compatibility test: Nakshora vs tailwindcss@3.4.19.
//
// For every candidate in the corpus (11,344 static classes + ≥1,300 dynamic
// candidates) both compilers must produce identical rules — selector,
// at-rule nesting, declaration order and values. The only accepted
// differences are the documented policies in docs/COMPATIBILITY.md §2:
//   1. stacked media queries are combined into one `@media` (tested
//      separately for equivalence);
//   2. `max-*` uses `(max-width: N-0.02px)` instead of `not all and (min-width)`;
//   3. Nakshora-only classes / variants that Tailwind does not have.

import { describe, expect, it } from 'vitest';
import { Engine, resolveTheme, maxWidthValue } from '../../src/index';
import { dynamicCorpus, mediaStackCorpus } from './corpus';
import { tailwindOracle, tailwindClassList, type OracleRule } from './oracle';

const engine = new Engine({
  theme: resolveTheme({}),
  darkMode: 'class',
  pluginEnabled: () => true,
  variantEnabled: () => true,
  important: false,
});

function compile(cls: string): OracleRule[] {
  return engine.compile(cls).map((r) => ({
    selector: r.selector,
    atrules: r.atrules.map((a) =>
      normAt(`@${a.kind === 'starting' ? 'starting-style' : a.kind} ${a.params}`),
    ),
    decls: Object.entries(r.decls),
  }));
}

/** `@media(min-width:200px) ` (PostCSS raw split of an arbitrary variant) ≡ `@media (min-width:200px)` */
function normAt(at: string): string {
  return at.replace(/^@(\w[\w-]*)\s*/, '@$1 ').trim();
}
function normalise(rules: OracleRule[]): OracleRule[] {
  return rules.map((r) => ({ ...r, atrules: r.atrules.map(normAt) }));
}

/** Candidates whose Tailwind output nests several `@media` — compared for equivalence in the media-stack test. */
function hasNestedMedia(rules: OracleRule[]): boolean {
  return rules.some((r) => r.atrules.filter((a) => a.startsWith('@media')).length > 1);
}

/** Nakshora extensions Tailwind 3.4 does not know (documented in COMPATIBILITY.md §4). */
const NAKSHORA_ONLY = new Set([
  'not-hover',
  'starting',
  'inert',
  'p-4!',
  'hover:p-4!', // trailing `!`, v4 variants
]);
function isNakshoraOnly(candidate: string): boolean {
  return [...NAKSHORA_ONLY].some(
    (n) =>
      candidate === n ||
      candidate.startsWith(`${n}:`) ||
      candidate.endsWith(`:${n}`) ||
      candidate.endsWith('!'),
  );
}

describe('tailwindcss@3.4.19 differential', () => {
  it('every static Tailwind class compiles to identical CSS', async () => {
    const classes = tailwindClassList();
    const ref = await tailwindOracle(classes);
    const missing: string[] = [];
    const different: string[] = [];
    let identical = 0;
    for (const cls of classes) {
      const want = normalise(ref[cls]);
      const got = compile(cls);
      if (want.length === 0) continue;
      if (got.length === 0) missing.push(cls);
      else if (JSON.stringify(got) !== JSON.stringify(want))
        different.push(`${cls}\n   want ${JSON.stringify(want)}\n   got  ${JSON.stringify(got)}`);
      else identical++;
    }
    expect(missing, `classes Tailwind emits and Nakshora does not:\n${missing.join('\n')}`).toEqual(
      [],
    );
    expect(different, `classes with different CSS:\n${different.slice(0, 20).join('\n')}`).toEqual(
      [],
    );
    expect(identical).toBeGreaterThanOrEqual(11_300);
  }, 120_000);

  it('arbitrary values, modifiers, variants and stacks compile identically', async () => {
    const corpus = dynamicCorpus();
    const ref = await tailwindOracle(corpus);
    const missing: string[] = [];
    const different: string[] = [];
    const extra: string[] = [];
    let nested = 0;
    for (const cls of corpus) {
      const want = normalise(ref[cls]);
      const got = compile(cls);
      if (want.length === 0) {
        // Tailwind rejects → Nakshora must reject too, unless it is a documented extension
        if (got.length && !isNakshoraOnly(cls)) extra.push(cls);
        continue;
      }
      if (hasNestedMedia(want)) {
        nested++;
        mediaEquivalent(cls, want, got, different);
        continue;
      }
      if (got.length === 0) missing.push(cls);
      else if (JSON.stringify(got) !== JSON.stringify(want))
        different.push(`${cls}\n   want ${JSON.stringify(want)}\n   got  ${JSON.stringify(got)}`);
    }
    expect(
      missing,
      `candidates Tailwind emits and Nakshora does not:\n${missing.join('\n')}`,
    ).toEqual([]);
    expect(
      different,
      `candidates with different CSS:\n${different.slice(0, 20).join('\n')}`,
    ).toEqual([]);
    expect(extra, `candidates Nakshora emits but Tailwind rejects:\n${extra.join('\n')}`).toEqual(
      [],
    );
    expect(corpus.length + mediaStackCorpus().length).toBeGreaterThanOrEqual(1_300);
    expect(nested).toBeGreaterThan(0);
  }, 120_000);

  it('media-query stacks are equivalent (combined into one @media — documented policy)', async () => {
    const corpus = mediaStackCorpus();
    const ref = await tailwindOracle(corpus);
    const problems: string[] = [];
    for (const cls of corpus) {
      const want = normalise(ref[cls]);
      const got = compile(cls);
      if (want.length === 0) {
        if (got.length) problems.push(`${cls}: Nakshora emits, Tailwind rejects`);
        continue;
      }
      mediaEquivalent(cls, want, got, problems);
    }
    expect(problems).toEqual([]);
  }, 120_000);
});

/**
 * Tailwind nests `@media` at-rules (outer → inner); Nakshora emits a single
 * `@media a and b`. Both must select the same rules with the same
 * declarations and every Tailwind condition must be present (or subsumed).
 */
function mediaEquivalent(
  cls: string,
  want: OracleRule[],
  got: OracleRule[],
  problems: string[],
): void {
  if (got.length !== want.length) {
    problems.push(`${cls}: rule count ${got.length} vs ${want.length}`);
    return;
  }
  for (let i = 0; i < want.length; i++) {
    const w = want[i];
    const g = got[i];
    if (w.selector !== g.selector || JSON.stringify(w.decls) !== JSON.stringify(g.decls)) {
      problems.push(
        `${cls}: selector/decls differ\n   want ${JSON.stringify(w)}\n   got  ${JSON.stringify(g)}`,
      );
      continue;
    }
    const wantConds = w.atrules.filter((a) => a.startsWith('@media')).map((a) => a.slice(7).trim());
    const gotMedia = g.atrules.filter((a) => a.startsWith('@media'));
    const nonMediaEqual =
      JSON.stringify(w.atrules.filter((a) => !a.startsWith('@media'))) ===
      JSON.stringify(g.atrules.filter((a) => !a.startsWith('@media')));
    if (!nonMediaEqual || gotMedia.length !== (wantConds.length ? 1 : 0)) {
      problems.push(
        `${cls}: at-rules differ\n   want ${JSON.stringify(w.atrules)}\n   got  ${JSON.stringify(g.atrules)}`,
      );
      continue;
    }
    if (!wantConds.length) continue;
    const gotConds = gotMedia[0]
      .slice(7)
      .split(/\s+and\s+/)
      .map((c) => c.trim());
    for (const cond of wantConds) {
      const notAll = /^not all and \(min-width: ([^)]+)\)$/.exec(cond.trim());
      const parts = notAll
        ? [`(max-width: ${maxWidthValue(notAll[1])})`]
        : cond.split(/\s+and\s+/).map((c) => c.trim());
      for (const expected of parts) {
        if (!gotConds.includes(expected) && !isSubsumed(expected, gotConds)) {
          problems.push(`${cls}: condition ${expected} not in ${JSON.stringify(gotConds)}`);
        }
      }
    }
  }
}

/** `(min-width: 640px)` is subsumed by a larger `(min-width: 1024px)` in the same query (and vice-versa for max). */
function isSubsumed(cond: string, gotConds: string[]): boolean {
  const min = /^\(min-width: (\d+(?:\.\d+)?)px\)$/.exec(cond);
  if (min)
    return gotConds.some((g) => {
      const m = /^\(min-width: (\d+(?:\.\d+)?)px\)$/.exec(g);
      return m && parseFloat(m[1]) >= parseFloat(min[1]);
    });
  const max = /^\(max-width: (\d+(?:\.\d+)?)px\)$/.exec(cond);
  if (max)
    return gotConds.some((g) => {
      const m = /^\(max-width: (\d+(?:\.\d+)?)px\)$/.exec(g);
      return m && parseFloat(m[1]) <= parseFloat(max[1]);
    });
  return false;
}
