import { Plugin } from 'postcss';
import { NakshoraConfig } from '@nakshora/core';

interface NakshoraPostCSSOptions {
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
declare function nakshora(options?: NakshoraPostCSSOptions): Plugin;

export { type NakshoraPostCSSOptions, nakshora as default };
