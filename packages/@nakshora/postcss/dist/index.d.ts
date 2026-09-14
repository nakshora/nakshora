import { Plugin, AtRule } from 'postcss';
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
    /**
     * Directory content globs resolve against. Defaults to the directory of the
     * CSS file being processed (falling back to `process.cwd()`); the Vite
     * plugin passes the project root so `content: ['index.html']` means the same
     * thing in `vite.config` and in every stylesheet.
     */
    base?: string;
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
declare function spliceCss(atRule: AtRule, css: string): void;
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

export { type NakshoraPostCSSOptions, nakshora as default, spliceCss };
