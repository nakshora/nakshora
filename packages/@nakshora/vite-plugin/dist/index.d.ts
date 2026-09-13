import { Plugin } from 'vite';
import { NakshoraConfig } from '@nakshora/core';

interface NakshoraViteOptions {
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
/**
 * Nakshora Vite plugin.
 *
 * - `import 'nakshora'` (or `import 'virtual:nakshora'`) injects the
 *   stylesheet. With `content` configured it compiles in JIT mode.
 * - `.css` files containing `@nakshora source;` / `@nakshora utilities;`
 *   are transformed automatically via PostCSS.
 * - Content files are watched; changes trigger an HMR refresh.
 */
declare function nakshora(options?: NakshoraViteOptions): Plugin;

export { type NakshoraViteOptions, nakshora as default, nakshora };
