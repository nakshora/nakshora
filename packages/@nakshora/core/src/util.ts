// Nakshora Core — internal helpers

import type { CSSProperties } from './types';
import { escapeClassName } from './values';
import { extractCandidates } from './extractor';
import { minifyCssSafe } from './css-ast';

/**
 * Escape a class name for use in a CSS selector.
 * `hover:bg-blue-500` → `hover\:bg-blue-500`
 */
export function escapeClass(className: string): string {
  return escapeClassName(className);
}

/**
 * Convert a CSSProperties object into a declaration block body,
 * e.g. `{ margin: '1rem' }` → `margin: 1rem`.
 * Respects `important` by appending `!important` to each value.
 */
export function stringifyDecls(decls: CSSProperties, important = false): string {
  const parts: string[] = [];
  for (const [prop, value] of Object.entries(decls)) {
    if (value === undefined || value === null) continue;
    const suffix = important ? ' !important' : '';
    parts.push(`${prop}: ${String(value)}${suffix}`);
  }
  return parts.join('; ');
}

/**
 * Convert a class name + suffix into a full CSS selector,
 * e.g. `('hover:bg-blue-500', ':hover')` → `.hover\:bg-blue-500:hover`
 */
export function classToSelector(className: string, suffix = '', ancestor = ''): string {
  const core = `.${escapeClass(className)}`;
  return ancestor ? `${ancestor} ${core}${suffix}` : `${core}${suffix}`;
}

/**
 * Extract candidate class tokens from HTML/JSX/template content.
 * Uses the Tailwind-compatible extractor (arbitrary values, variants,
 * modifiers) and unescapes HTML-escaped variant syntax (`hover\:bg-blue-500`).
 */
export function extractClasses(content: string[], pattern?: string): Set<string> {
  return extractCandidates(content, { pattern });
}

/**
 * Split a (possibly variant-prefixed) class into its parts:
 * `sm:hover:bg-blue-500` → { prefixes: ['sm','hover'], base: 'bg-blue-500' }
 */
export function splitClass(token: string): {
  prefixes: string[];
  base: string;
} {
  if (!token.includes(':')) return { prefixes: [], base: token };
  const parts = token.split(':');
  return { prefixes: parts.slice(0, -1), base: parts[parts.length - 1] };
}

/**
 * CSS minifier. Parses the stylesheet and re-serialises it without
 * whitespace or comments — strings, `url()` contents and custom-property
 * values are never touched (a regex minifier broke `content: 'a b'`).
 */
export function minifyCss(css: string): string {
  return minifyCssSafe(css);
}

/**
 * Byte length of a string (UTF-8).
 */
export function byteLength(str: string): number {
  return Buffer.byteLength(str, 'utf-8');
}

/**
 * Format a byte count for humans (12.3 KB)
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
