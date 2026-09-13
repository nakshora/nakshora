// Nakshora PostCSS plugin
// Usage:
//   postcss.config.js
//   module.exports = { plugins: [require('@nakshora/postcss')({ config: { content: [...] } })] }

import type { AtRule, Plugin } from 'postcss';
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
      return generator.getUtilitiesFull();
    case 'components':
      return generator.getComponents();
    default:
      return '';
  }
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
      const baseDir = root.source?.input?.file
        ? resolve(root.source.input.file, '..')
        : process.cwd();
      const hasAtRule = root.nodes?.some((n) => n.type === 'atrule' && n.name === 'nakshora');
      if (!hasAtRule) return;

      const useJIT = config.content !== undefined || config.purge !== undefined;
      const content = await resolveContent(config.content ?? config.purge, baseDir);

      root.walkAtRules('nakshora', (atRule: AtRule) => {
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
          atRule.replaceWith(...postcss.parse(css, { from: undefined }).nodes);
        } else {
          atRule.remove();
        }
      });
    },
  };
}

(nakshora as unknown as { postcss: true }).postcss = true;
