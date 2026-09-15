// Minimal typings for the vendored @nakshora/core 3.1 browser bundle.
export interface UtilityRule { className: string; css: string; category?: string; description?: string }
export interface ResolvedBreakpoint { name: string; px: number }
export interface GenerationStats { rules: number; responsive: number; variants: number; bytes: number; classes?: number }
export declare class CSSGenerator {
  constructor(config?: Record<string, unknown>);
  generate(options?: Record<string, unknown>): string;
  generateFromContent(content: string | string[], options?: Record<string, unknown>): string;
  getUtilities(): UtilityRule[];
  getUtility(className: string): UtilityRule | undefined;
  getVariantNames(): string[];
  getBreakpoints(): ResolvedBreakpoint[];
  compileClass(candidate: string): string;
  getStats(css?: string): GenerationStats;
  minify(css: string): string;
  processCss(css: string, options?: { strict?: boolean }): string;
  themeValue(path: string): string | undefined;
  getBase(): string;
  getVariables(): string;
}
export declare const version: string;
export declare function formatBytes(n: number): string;
export declare function extractClasses(content: string[]): Set<string>;
export declare const GROUP_CATEGORIES: Record<string, string[]>;
