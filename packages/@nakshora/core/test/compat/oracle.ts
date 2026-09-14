// Tailwind 3.4.19 oracle used by the compatibility test-suite.
// Compiles candidates with the real `tailwindcss` package (dev dependency) and
// returns, per candidate, the rules Tailwind emitted for it.

import postcss from 'postcss';
import tailwind from 'tailwindcss';
import selectorParser from 'postcss-selector-parser';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import containerQueries from '@tailwindcss/container-queries';

export interface OracleRule {
  selector: string;
  atrules: string[];
  decls: [string, string][];
}
export type OracleResult = Record<string, OracleRule[]>;

const here = dirname(fileURLToPath(import.meta.url));
const cacheDir = join(here, '.cache');

/** Compile `candidates` with Tailwind (chunked, cached on disk by content hash). */
export async function tailwindOracle(
  candidates: string[],
  config: Record<string, unknown> = {},
  { plugins = [containerQueries], cacheKey = '' }: { plugins?: unknown[]; cacheKey?: string } = {},
): Promise<OracleResult> {
  const hash = createHash('sha1')
    .update(JSON.stringify([candidates, config, cacheKey]))
    .digest('hex')
    .slice(0, 16);
  const cacheFile = join(cacheDir, `oracle-${hash}.json`);
  if (existsSync(cacheFile)) return JSON.parse(readFileSync(cacheFile, 'utf8')) as OracleResult;

  const ref: OracleResult = {};
  const CHUNK = 400;
  for (let i = 0; i < candidates.length; i += CHUNK) {
    const chunk = candidates.slice(i, i + CHUNK);
    // one candidate per line, no attribute quoting issues (Tailwind scans raw text)
    const html = chunk.map((c) => `<i class='${c}'></i>`).join('\n');
    const result = await postcss([
      tailwind({
        content: [{ raw: html, extension: 'html' }],
        corePlugins: { preflight: false },
        darkMode: 'class',
        plugins,
        ...config,
      } as never),
    ]).process('@tailwind components; @tailwind utilities;', { from: undefined });
    const chunkSet = new Set(chunk);
    const byClass: Record<string, OracleRule[]> = {};
    result.root.walkRules((rule) => {
      const atrules: string[] = [];
      let p = rule.parent;
      while (p && p.type === 'atrule') {
        const at = p as postcss.AtRule;
        atrules.unshift(`@${at.name} ${at.params}`);
        p = at.parent;
      }
      const decls: [string, string][] = [];
      rule.each((d) => {
        if (d.type === 'decl') decls.push([d.prop, d.value + (d.important ? ' !important' : '')]);
      });
      const found = new Set<string>();
      selectorParser((sel) => {
        sel.walkClasses((n) => {
          if (chunkSet.has(n.value)) found.add(n.value);
        });
      }).processSync(rule.selector);
      for (const c of found) (byClass[c] ??= []).push({ selector: rule.selector, atrules, decls });
    });
    for (const c of chunk) ref[c] = byClass[c] ?? [];
  }
  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(cacheFile, JSON.stringify(ref));
  return ref;
}

/** The complete list of static Tailwind 3.4.19 classes (fixture). */
export function tailwindClassList(): string[] {
  return JSON.parse(
    readFileSync(join(here, '..', 'fixtures', 'tailwind-3.4.19-classes.json'), 'utf8'),
  ) as string[];
}
