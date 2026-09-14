// Nakshora Vite plugin
// Usage:
//   vite.config.js
//   import { nakshora } from '@nakshora/vite-plugin'
//   export default { plugins: [nakshora({ config: { content: [...] } })] }

import type { Plugin as VitePlugin } from 'vite';
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { globby } from 'globby';
import {
  CSSGenerator,
  ContentCache,
  scanSources,
  type NakshoraConfig,
  type ScanFs,
} from '@nakshora/core';

/** Process-wide incremental scan cache (dev server rebuilds only re-read changed files). */
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
import nakshoraPostcss from '@nakshora/postcss';
import { createWatcher, type WatcherHandle } from './watch';

export interface NakshoraViteOptions {
  /** Nakshora configuration (theme, content, safelist, important…) */
  config?: Partial<NakshoraConfig>;
  /** JIT content globs (relative to the project root). Overrides config.content. */
  content?: string | string[];
  /** Minify generated CSS (off by default — Vite minifies in production) */
  minify?: boolean;
  /**
   * Process `@nakshora …` at-rules inside .css files through PostCSS
   * (default: true)
   */
  postcss?: boolean;
}

const VIRTUAL_ID = 'virtual:nakshora';
// The resolved id must end in `.css` so Vite's CSS pipeline (and Rollup in
// `vite build`) treats the module as a stylesheet instead of parsing it as JS.
const RESOLVED_VIRTUAL_ID = '\0' + VIRTUAL_ID + '.css';

async function resolveCandidates(
  content: string | string[] | undefined,
  root: string,
): Promise<Set<string>> {
  if (!content) return new Set();
  const entries = Array.isArray(content) ? content : [content];
  const globs: string[] = [];
  const files: string[] = [];
  const raw: string[] = [];
  for (const entry of entries) {
    if (!entry) continue;
    if (entry.includes('*') || entry.includes('{') || entry.includes('[')) {
      globs.push(resolve(root, entry));
    } else {
      const abs = resolve(root, entry);
      if (scanFs.stat(abs)) files.push(abs);
      else raw.push(entry);
    }
  }
  if (globs.length > 0) files.push(...(await globby(globs, { cwd: root, absolute: true })).sort());
  return scanSources(contentCache, scanFs, files, raw);
}

/**
 * Nakshora Vite plugin.
 *
 * - `import 'nakshora'` (or `import 'virtual:nakshora'`) injects the
 *   stylesheet. With `content` configured it compiles in JIT mode.
 * - `.css` files containing `@nakshora source;` / `@nakshora utilities;`
 *   are transformed automatically via PostCSS.
 * - Content files are watched; changes trigger an HMR refresh.
 */
export function nakshora(options: NakshoraViteOptions = {}): VitePlugin {
  const postcssEnabled = options.postcss ?? true;
  let watcher: WatcherHandle | null = null;
  // Vite project root (content globs are relative to it, not to process.cwd())
  let root = process.cwd();

  return {
    name: 'nakshora',
    enforce: 'pre',
    configResolved(resolved) {
      root = resolved.root;
    },
    config(config) {
      if (!postcssEnabled) return;
      const plugin = nakshoraPostcss({
        config: options.config,
        content: options.content,
        minify: options.minify,
        // `config` runs before `configResolved`; resolve the root the same way Vite will
        base: resolve(config.root ?? process.cwd()),
      });
      const css = config.css ?? {};
      const postcss = css.postcss;
      if (postcss && typeof postcss === 'object' && 'plugins' in postcss) {
        postcss.plugins = [...(postcss.plugins ?? []), plugin];
      } else {
        config.css = { ...css, postcss: { plugins: [plugin] } };
      }
    },
    resolveId(id) {
      if (id === VIRTUAL_ID || id === 'nakshora') return RESOLVED_VIRTUAL_ID;
      return null;
    },
    async load(id) {
      if (id !== RESOLVED_VIRTUAL_ID) return null;
      const config: Partial<NakshoraConfig> = { ...(options.config ?? {}) };
      if (options.content !== undefined) config.content = options.content;
      const generator = new CSSGenerator(config);
      const candidates = await resolveCandidates(config.content ?? config.purge, root);
      const css =
        candidates.size > 0
          ? generator.generateJITFromCandidates(candidates, { minify: options.minify })
          : generator.generate({ mode: 'full', minify: options.minify });
      return css;
    },
    configureServer(server) {
      const content = options.content ?? options.config?.content ?? options.config?.purge;
      if (!content) return;
      const entries = Array.isArray(content) ? content : [content];
      const dirs = new Set<string>();
      for (const entry of entries) {
        if (!entry) continue;
        const raw = entry.split('*')[0].split('{')[0].split('[')[0];
        for (const base of [root, process.cwd()]) {
          const abs = resolve(base, raw);
          try {
            const st = statSync(abs);
            if (st.isDirectory()) dirs.add(abs);
            else dirs.add(resolve(abs, '..'));
          } catch {
            // glob points to a not-yet-existing dir — watch the root instead
            dirs.add(root);
          }
        }
      }
      watcher = createWatcher([...dirs], () => {
        const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      });
      return () => {
        watcher?.close();
        watcher = null;
      };
    },
  };
}

export default nakshora;
