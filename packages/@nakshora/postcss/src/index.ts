// Nakshora PostCSS plugin
// Usage:
//   postcss.config.js
//   module.exports = { plugins: [require('@nakshora/postcss')({ config: { content: [...] } })] }

import type { AtRule, Container, Plugin } from 'postcss';
import postcss from 'postcss';
import { globby } from 'globby';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CSSGenerator, type NakshoraConfig } from '@nakshora/core';

export interface NakshoraPostCSSOptions {
  /** Nakshora configuration (theme, content, safelist, important…) */
  config?: Partial<NakshoraConfig>;
  /**
   * JIT content. Raw strings or glob patterns (relative to the CSS file's
   * directory or the process cwd). Overrides `config.content` when set.
   */
  content?: string | string[];
  /** Minify the generated CSS */
  minify?: boolean;
  /**
   * Directory content globs resolve against. Defaults to the directory of the
   * CSS file being processed (falling back to `process.cwd()`); the Vite
   * plugin passes the project root so `content: ['index.html']` means the same
   * thing in `vite.config` and in every stylesheet.
   */
  base?: string;
}

/**
 * Resolve content sources (globs + raw strings) to file contents.
 */
async function resolveContent(
  content: string | string[] | undefined,
  baseDir: string,
): Promise<string[]> {
  if (!content) return [];
  const entries = Array.isArray(content) ? content : [content];
  const globs: string[] = [];
  const chunks: string[] = [];
  for (const entry of entries) {
    if (!entry) continue;
    if (entry.includes('*') || entry.includes('{') || entry.includes('[')) {
      globs.push(resolve(baseDir, entry));
    } else {
      try {
        chunks.push(readFileSync(resolve(baseDir, entry), 'utf-8'));
      } catch {
        chunks.push(entry); // raw template string
      }
    }
  }
  if (globs.length > 0) {
    const files = await globby(globs);
    for (const file of files) {
      try {
        chunks.push(readFileSync(resolve(baseDir, file), 'utf-8'));
      } catch {
        // skip unreadable
      }
    }
  }
  return chunks;
}

function layerCss(layer: string, generator: CSSGenerator): string {
  switch (layer) {
    case 'source':
      return generator.generate({ mode: 'full', minify: false });
    case 'base':
      return generator.getBase();
    case 'variables':
    case 'vars':
      return generator.getVariables();
    case 'keyframes':
      return generator.getKeyframes();
    case 'utilities':
    case 'utils':
      // Same utilities layer as `@nakshora source;` (responsive variants on the
      // core screens, no state variants — those are emitted in JIT mode only).
      return generator.getUtilitiesFull(false);
    case 'components':
      return generator.getComponents();
    default:
      return '';
  }
}

/**
 * Replace `atRule` with the nodes parsed from `css` in O(n).
 *
 * `atRule.replaceWith(...nodes)` inserts one node at a time (each insert is an
 * `indexOf` + array splice plus index bookkeeping) and spreads every node onto
 * the call stack — with a full build (hundreds of thousands of rules) that is
 * quadratic and overflows the stack. Rebuilding the parent's node list once
 * keeps document order and is linear.
 */
export function spliceCss(atRule: AtRule, css: string): void {
  const parent = atRule.parent as Container | undefined;
  if (!parent) return;
  const parsed = postcss.parse(css, { from: undefined });
  const fresh = parsed.nodes;
  parsed.nodes = [];
  for (const n of fresh) n.parent = parent;
  // keep the at-rule's leading whitespace so the output stays readable
  if (fresh[0] && !fresh[0].raws.before) fresh[0].raws.before = atRule.raws.before;
  const nodes = parent.nodes ?? [];
  const idx = parent.index(atRule);
  atRule.parent = undefined;
  parent.nodes = nodes.slice(0, idx).concat(fresh, nodes.slice(idx + 1));
  // `markDirty` is protected; the public way to invalidate the cached
  // "clean" flags is to mutate any raw-independent property.
  (parent as unknown as { markDirty(): void }).markDirty();
}

/**
 * Nakshora PostCSS plugin.
 *
 * Supported at-rules in your CSS:
 *   @nakshora source;      → base + variables + keyframes + ALL utilities + components
 *   @nakshora base;        → base styles only
 *   @nakshora variables;   → :root variables only
 *   @nakshora keyframes;   → @keyframes only
 *   @nakshora utilities;   → ALL utilities (no base)
 *   @nakshora components;  → design-paradigm components only
 *
 * If `content` is configured (option or config), `@nakshora source;` and
 * `@nakshora utilities;` switch to JIT mode: only used classes are emitted.
 */
export default function nakshora(options: NakshoraPostCSSOptions = {}): Plugin {
  return {
    postcssPlugin: 'nakshora',
    async Once(root) {
      const config: Partial<NakshoraConfig> = { ...(options.config ?? {}) };
      if (options.content !== undefined) config.content = options.content;

      const generator = new CSSGenerator(config);
      const baseDir =
        options.base ??
        (root.source?.input?.file ? resolve(root.source.input.file, '..') : process.cwd());
      const hasAtRule = root.nodes?.some((n) => n.type === 'atrule' && n.name === 'nakshora');
      if (!hasAtRule) return;

      const useJIT = config.content !== undefined || config.purge !== undefined;
      const content = await resolveContent(config.content ?? config.purge, baseDir);

      // collect first: splicing large blocks while walking would re-walk them
      const atRules: AtRule[] = [];
      root.walkAtRules('nakshora', (atRule: AtRule) => {
        atRules.push(atRule);
      });
      for (const atRule of atRules) {
        const param = atRule.params.trim().toLowerCase();
        let css: string;
        if (
          useJIT &&
          content.length > 0 &&
          (param === 'source' || param === 'utilities' || param === 'utils' || param === '')
        ) {
          css = generator.generateJIT(content, { minify: options.minify });
        } else {
          css = layerCss(param, generator);
          if (options.minify) css = generator.minify(css);
        }
        if (css) {
          spliceCss(atRule, css);
        } else {
          atRule.remove();
        }
      }
    },
  };
}

(nakshora as unknown as { postcss: true }).postcss = true;
