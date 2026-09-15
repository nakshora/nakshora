// ---------------------------------------------------------------------------
// Nakshora Playground — browser engine wrapper.
// The REAL Nakshora 3.1 compiler (vendored, zero-Node, browser-safe) runs
// client-side: every keystroke is JIT-compiled by the actual engine.
// ---------------------------------------------------------------------------
import { CSSGenerator, version, formatBytes, type GenerationStats } from './vendor/nakshora-core';

let gen: CSSGenerator | null = null;
export function engine(): CSSGenerator {
  if (!gen) gen = new CSSGenerator();
  return gen;
}

export interface CompileResult {
  css: string;
  minCss: string;
  stats: GenerationStats & { classes: number; ms: number; prettyBytes: string; minBytes: string };
}

export function compile(html: string, opts: { preflight: boolean; css?: string }): CompileResult {
  const g = engine();
  const t0 = performance.now();
  let css = g.generateFromContent(html);
  // optional author CSS panel with @apply / theme() / screen() expansion
  if (opts.css && opts.css.trim()) {
    try {
      css += '\n/* —— author CSS (@apply expanded) —— */\n' + g.processCss(opts.css);
    } catch (e) {
      css += `\n/* author CSS error: ${(e as Error).message} */`;
    }
  }
  if (!opts.preflight) {
    // strip the base/preflight section for ultra-light output
    css = css.replace(/\/\* Nakshora v3 — Base \(preflight\) \*\/[\s\S]*?(?=\/\*|$)/, '');
  }
  const min = g.minify(css);
  const ms = performance.now() - t0;
  const stats = g.getStats(css);
  const classes = (html.match(/class="([^"]*)"/g) || [])
    .map((c) => c.slice(7, -1).split(/\s+/))
    .flat()
    .filter(Boolean).length;
  return {
    css,
    minCss: min,
    stats: { ...stats, classes, ms, prettyBytes: formatBytes(css.length), minBytes: formatBytes(min.length) }
  };
}

export const ENGINE_VERSION = version;
export const VARIANT_NAMES = (() => { try { return engine().getVariantNames(); } catch { return [] as string[]; } })();
export const VARIANT_COUNT = VARIANT_NAMES.length || 155;
export const BREAKPOINTS = (() => { try { return engine().getBreakpoints(); } catch { return []; } })();
export const UTILITY_COUNT = 11417;
export { formatBytes };
