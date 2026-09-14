// Nakshora PostCSS plugin
// Usage:
//   postcss.config.js
//   module.exports = { plugins: [require('@nakshora/postcss')({ config: { content: [...] } })] }

import type { AtRule, Container, Plugin, Result, Root } from 'postcss';
import postcss from 'postcss';
import { globby } from 'globby';
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  CSSGenerator,
  ApplyError,
  ContentCache,
  scanSources,
  extractCssConfig,
  mergeCssConfig,
  type NakshoraConfig,
  type ScanFs,
} from '@nakshora/core';

const CSS_CONFIG_AT_RULES = new Set(['theme', 'utility', 'custom-variant']);

/** Process-wide incremental scan cache shared by every plugin instance. */
const contentCache = new ContentCache();
const scanFs: ScanFs = {
  stat: (p) => {
    try {
      const st = statSync(p);
      return { mtimeMs: st.mtimeMs, size: st.size };
    } catch {
      return null;
    }
  },
  read: (p) => readFileSync(p, 'utf-8'),
};

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
   * Expand `@apply`, `theme()` / `screen()` and `@screen` in author CSS
   * (default: true). Errors are reported as PostCSS errors with the file name.
   */
  apply?: boolean;
  /**
   * Directory content globs resolve against. Defaults to the directory of the
   * CSS file being processed (falling back to `process.cwd()`); the Vite
   * plugin passes the project root so `content: ['index.html']` means the same
   * thing in `vite.config` and in every stylesheet.
   */
  base?: string;
}

/**
 * Resolve content sources (globs, file paths, raw strings) to a candidate set
 * through the incremental cache: unchanged files are not re-read.
 */
async function resolveCandidates(
  content: string | string[] | undefined,
  baseDir: string,
): Promise<Set<string>> {
  if (!content) return new Set();
  const entries = Array.isArray(content) ? content : [content];
  const globs: string[] = [];
  const files: string[] = [];
  const raw: string[] = [];
  for (const entry of entries) {
    if (!entry) continue;
    if (entry.includes('*') || entry.includes('{') || entry.includes('[')) {
      globs.push(resolve(baseDir, entry));
    } else {
      const abs = resolve(baseDir, entry);
      if (scanFs.stat(abs)) files.push(abs);
      else raw.push(entry); // raw template string
    }
  }
  if (globs.length > 0) files.push(...(await globby(globs, { absolute: true })).sort());
  return scanSources(contentCache, scanFs, files, raw);
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

/** Does the stylesheet use any author-CSS feature (`@apply`, `theme()`, `screen()`, `@screen`)? */
export function needsAuthorPass(root: Root): boolean {
  let found = false;
  root.walk((node) => {
    if (found) return false;
    if (node.type === 'atrule' && (node.name === 'apply' || node.name === 'screen')) found = true;
    else if (node.type === 'decl' && /\b(?:theme|screen)\(/.test(node.value)) found = true;
    else if (node.type === 'atrule' && /\b(?:theme|screen)\(/.test(node.params)) found = true;
    return found ? false : undefined;
  });
  return found;
}

/**
 * Expand `@apply` / `theme()` / `@screen` on the whole root. Nakshora's own
 * CSS AST is used for the transform (identical to `nakshora build`); the
 * result is parsed back so later PostCSS plugins see real nodes. Errors are
 * rethrown as PostCSS `CssSyntaxError`s pointing at the stylesheet.
 */
export function runAuthorPass(root: Root, generator: CSSGenerator, result: Result): void {
  let css: string;
  try {
    css = generator.processCss(root.toString());
  } catch (err) {
    if (err instanceof ApplyError) {
      const node =
        (err.candidate &&
          (() => {
            let hit: AtRule | undefined;
            root.walkAtRules('apply', (at) => {
              if (!hit && at.params.split(/\s+/).includes(err.candidate as string)) hit = at;
            });
            return hit;
          })()) ||
        root;
      throw node.error(err.message, { plugin: 'nakshora', word: err.candidate });
    }
    throw err;
  }
  const parsed = postcss.parse(css, { from: result.opts.from });
  root.removeAll();
  root.append(parsed.nodes);
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
 *   @apply …; theme(…); screen(…); @screen md { … }  → expanded in place
 *
 * If `content` is configured (option or config), `@nakshora source;` and
 * `@nakshora utilities;` switch to JIT mode: only used classes are emitted.
 */
export default function nakshora(options: NakshoraPostCSSOptions = {}): Plugin {
  return {
    postcssPlugin: 'nakshora',
    async Once(root, { result }) {
      const config: Partial<NakshoraConfig> = { ...(options.config ?? {}) };
      if (options.content !== undefined) config.content = options.content;

      const baseDir =
        options.base ??
        (root.source?.input?.file ? resolve(root.source.input.file, '..') : process.cwd());
      const hasAtRule = root.nodes?.some((n) => n.type === 'atrule' && n.name === 'nakshora');
      const authorPass = options.apply !== false && needsAuthorPass(root);
      // CSS-first configuration: `@theme` / `@utility` / `@custom-variant`
      // blocks extend the config and are replaced by the `:root` variables.
      const cssConfigNodes = (root.nodes ?? []).filter(
        (n): n is AtRule => n.type === 'atrule' && CSS_CONFIG_AT_RULES.has(n.name),
      );
      if (!hasAtRule && !authorPass && cssConfigNodes.length === 0) return;
      let resolved = config;
      if (cssConfigNodes.length) {
        const extracted = extractCssConfig(cssConfigNodes.map((n) => n.toString()).join('\n'));
        resolved = mergeCssConfig(config, extracted.config);
        for (const note of extracted.notes)
          result.warn(note, { node: cssConfigNodes[0], plugin: 'nakshora' });
        const first = cssConfigNodes[0];
        for (const n of cssConfigNodes.slice(1)) n.remove();
        if (extracted.rootVars) spliceCss(first, extracted.rootVars);
        else first.remove();
      }
      const generator = new CSSGenerator(resolved);
      // `@apply` first so applied utilities never get spliced generated CSS
      // re-scanned, and so `@nakshora` output itself is left untouched.
      if (authorPass) runAuthorPass(root, generator, result);
      if (!hasAtRule) return;

      const useJIT = config.content !== undefined || config.purge !== undefined;
      const candidates = useJIT
        ? await resolveCandidates(config.content ?? config.purge, baseDir)
        : new Set<string>();

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
          candidates.size > 0 &&
          (param === 'source' || param === 'utilities' || param === 'utils' || param === '')
        ) {
          css = generator.generateJITFromCandidates(candidates, { minify: options.minify });
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
