// Nakshora Core — internal helpers

import type { CSSProperties } from './types';

/**
 * Escape a class name for use in a CSS selector.
 * `hover:bg-blue-500` → `hover\:bg-blue-500`
 */
export function escapeClass(className: string): string {
  return className.replace(/([.:#[\]\\])/g, '\\$1');
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

const DEFAULT_EXTRACTOR = /[[\w\\:/.-]+/g;

/**
 * Extract candidate class tokens from HTML/JSX/template content.
 * Handles escaped variant syntax (`hover\:bg-blue-500`) used in HTML.
 */
export function extractClasses(content: string[], pattern?: string): Set<string> {
  const regex = pattern ? new RegExp(pattern, 'g') : DEFAULT_EXTRACTOR;
  const classes = new Set<string>();
  for (const chunk of content) {
    if (!chunk) continue;
    for (const match of chunk.matchAll(regex)) {
      const token = match[0];
      // Skip obvious non-classes (URLs, long identifiers)
      if (token.length > 64) continue;
      // Unescape HTML class escaping: hover\:bg-x → hover:bg-x
      const unescaped = token.replace(/\\:/g, ':').replace(/\\\\/g, '\\');
      // Strip leading dot (e.g. `.hidden` in CSS files)
      const cleaned = unescaped.replace(/^\.+/, '');
      if (cleaned.length > 1) classes.add(cleaned);
    }
  }
  return classes;
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
 * Lightweight CSS minifier.
 * Removes comments, collapses whitespace, trims around punctuation.
 * Safe for Nakshora's generated output (no strings containing braces).
 */
export function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>~])\s*/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+\}/g, '}')
    .trim();
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
