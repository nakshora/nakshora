// Nakshora language service — editor intelligence without a transport.
//
// Everything an editor integration needs, computed from a `CSSGenerator`:
//   • class regions in a document (class/className attributes, `@apply`,
//     `clsx()/cn()/cva()/tw\`` string literals)
//   • completions for the token at an offset (variants + catalog + components)
//   • hover → the CSS a candidate compiles to
//   • diagnostics: unknown classes in `@apply` (error), unknown variant-prefixed
//     classes (warning), conflicting utilities in one attribute (warning)
//   • colour decorators for colour utilities
//
// Offsets are plain character offsets; `language-server.ts` maps them to LSP
// positions. The service is pure and synchronous so it can be unit-tested
// and reused by other editors.

import {
  CSSGenerator,
  parseColor,
  parseCss,
  serializeCss,
  walkRules,
  type CssNode,
  type NakshoraConfig,
  type UtilityRule,
} from '@nakshora/core';

export interface Region {
  /** offset of the first character of the class list */
  start: number;
  /** offset one past the last character */
  end: number;
  kind: 'attribute' | 'apply' | 'call';
}

export interface Token {
  text: string;
  start: number;
  end: number;
  region: Region;
}

export interface CompletionItem {
  label: string;
  /** `variant` items insert `name:`; `class` items insert the class */
  kind: 'class' | 'variant' | 'component';
  detail?: string;
  /** replacement range for the segment being completed */
  start: number;
  end: number;
}

export interface Hover {
  css: string;
  start: number;
  end: number;
}

export interface Diagnostic {
  code: 'unknownClass' | 'invalidApply' | 'cssConflict';
  severity: 'error' | 'warning' | 'information';
  message: string;
  start: number;
  end: number;
}

export interface ColorInformation {
  start: number;
  end: number;
  /** 0–1 components */
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

export interface LanguageServiceOptions {
  config?: Partial<NakshoraConfig>;
  /** extra attribute names treated as class lists (default: class, className, class:list) */
  classAttributes?: string[];
  /** extra call names whose string arguments are class lists */
  classFunctions?: string[];
  /** maximum completion items returned (default 300) */
  completionLimit?: number;
}

const DEFAULT_ATTRIBUTES = ['class', 'className', 'class:list'];
const DEFAULT_FUNCTIONS = ['clsx', 'cn', 'cva', 'classNames', 'twMerge', 'tw', 'cx'];
const TOKEN_CHARS = /[^\s"'`<>{}]/;
/** structural classes that produce no CSS on their own */
const MARKER_CLASSES = /^(?:group|peer)(?:\/[\w-]+)?$/;

const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class LanguageService {
  private generator: CSSGenerator;
  private catalog: UtilityRule[] = [];
  private catalogIndex = new Map<string, UtilityRule>();
  private components: string[] = [];
  private variants: { name: string; functional: boolean; description: string }[] = [];
  private attributes: string[];
  private functions: string[];
  private limit: number;
  private attributeRe: RegExp;
  private callRe: RegExp;

  constructor(options: LanguageServiceOptions = {}) {
    this.attributes = [...DEFAULT_ATTRIBUTES, ...(options.classAttributes ?? [])];
    this.functions = [...DEFAULT_FUNCTIONS, ...(options.classFunctions ?? [])];
    this.limit = options.completionLimit ?? 300;
    this.attributeRe = new RegExp(
      `(?:^|[\\s(,{])(?:${this.attributes.map(escapeRe).join('|')})\\s*=\\s*(["'\`])`,
      'g',
    );
    this.callRe = new RegExp(`\\b(?:${this.functions.map(escapeRe).join('|')})\\s*(\\(|\`)`, 'g');
    this.generator = new CSSGenerator(options.config ?? {});
    this.index();
  }

  /** Swap the configuration (config file changed). */
  reload(config: Partial<NakshoraConfig> = {}): void {
    this.generator = new CSSGenerator(config);
    this.index();
  }

  private index(): void {
    this.catalog = this.generator.getUtilities();
    this.catalogIndex = new Map(this.catalog.map((u) => [u.class, u]));
    const componentCss = this.generator.getComponents();
    this.components = [
      ...new Set([...componentCss.matchAll(/\.((?:\\.|[\w-])+)/g)].map((m) => m[1])),
    ]
      .filter((c) => !this.catalogIndex.has(c))
      .sort();
    this.variants = this.generator.getVariantDefinitions().map((v) => ({
      name: v.name,
      functional: v.functional === true,
      description: v.description,
    }));
  }

  // ───────────────────────────── regions / tokens ─────────────────────────────

  /** Class-list regions of a document. `languageId` selects the scanners. */
  regions(text: string, languageId = 'html'): Region[] {
    const out: Region[] = [];
    const isCss = /^(?:css|scss|less|postcss)$/.test(languageId);
    if (!isCss) {
      this.attributeRe.lastIndex = 0;
      for (const m of text.matchAll(this.attributeRe)) {
        const quote = m[1];
        const start = m.index + m[0].length;
        let end = text.indexOf(quote, start);
        if (end === -1) {
          // still typing — the attribute runs to the end of the line
          const nl = text.indexOf('\n', start);
          end = nl === -1 ? text.length : nl;
        }
        out.push({ start, end, kind: 'attribute' });
      }
      for (const m of text.matchAll(this.callRe)) {
        const open = m.index + m[0].length - 1;
        if (m[1] === '`') {
          const end = text.indexOf('`', open + 1);
          if (end !== -1) out.push({ start: open + 1, end, kind: 'call' });
          continue;
        }
        const close = matchParen(text, open);
        if (close === -1) continue;
        const body = text.slice(open + 1, close);
        for (const s of body.matchAll(/(["'`])((?:\\.|(?!\1)[^\\])*)\1/g))
          out.push({
            start: open + 1 + s.index + 1,
            end: open + 1 + s.index + 1 + s[2].length,
            kind: 'call',
          });
      }
    }
    for (const m of text.matchAll(/@apply\s+([^;{}]*)/g)) {
      const start = m.index + m[0].length - m[1].length;
      out.push({ start, end: start + m[1].trimEnd().length, kind: 'apply' });
    }
    return out.sort((a, b) => a.start - b.start);
  }

  /** Every class token of every region. */
  tokens(text: string, languageId = 'html'): Token[] {
    const out: Token[] = [];
    for (const region of this.regions(text, languageId)) {
      const slice = text.slice(region.start, region.end);
      for (const m of slice.matchAll(/\S+/g)) {
        const raw = m[0];
        if (raw.includes('${')) continue; // template expression
        out.push({
          text: raw,
          start: region.start + m.index,
          end: region.start + m.index + raw.length,
          region,
        });
      }
    }
    return out;
  }

  /** The token under `offset` (or the empty token at the caret inside a region). */
  tokenAt(text: string, offset: number, languageId = 'html'): Token | null {
    const region = this.regions(text, languageId).find((r) => offset >= r.start && offset <= r.end);
    if (!region) return null;
    let start = offset;
    while (start > region.start && TOKEN_CHARS.test(text[start - 1])) start--;
    let end = offset;
    while (end < region.end && TOKEN_CHARS.test(text[end])) end++;
    return { text: text.slice(start, end), start, end, region };
  }

  // ───────────────────────────── features ─────────────────────────────

  complete(
    text: string,
    offset: number,
    languageId = 'html',
  ): { items: CompletionItem[]; incomplete: boolean } {
    const token = this.tokenAt(text, offset, languageId);
    if (!token) return { items: [], incomplete: false };
    const typed = text.slice(token.start, offset);
    const lastColon = typed.lastIndexOf(':');
    const segStart = token.start + lastColon + 1;
    const segment = typed.slice(lastColon + 1);
    const important = segment.startsWith('!');
    const needle = important ? segment.slice(1) : segment;
    const items: CompletionItem[] = [];
    const range = { start: segStart + (important ? 1 : 0), end: token.end };

    if (token.region.kind !== 'apply') {
      for (const v of this.variants) {
        if (!v.name.startsWith(needle) || (v.name.startsWith('@') && !needle.startsWith('@')))
          continue;
        items.push({
          label: v.functional ? `${v.name}-` : `${v.name}:`,
          kind: 'variant',
          detail: v.description,
          ...range,
        });
      }
    }
    // Whole segment under the caret (text after the caret included) so the
    // class already written ranks first when the list is cut at the limit.
    const whole = text.slice(range.start, token.end);
    const matches = this.catalog.filter((u) => u.class.startsWith(needle));
    if (whole.length > needle.length)
      matches.sort((a, b) => Number(b.class.startsWith(whole)) - Number(a.class.startsWith(whole)));
    const incomplete = matches.length > this.limit;
    for (const u of matches.slice(0, this.limit))
      items.push({ label: u.class, kind: 'class', detail: u.description, ...range });
    if (token.region.kind !== 'apply')
      for (const c of this.components)
        if (c.startsWith(needle)) items.push({ label: c, kind: 'component', ...range });
    return { items, incomplete };
  }

  /** CSS of the candidate under `offset` (null when unknown). */
  hover(text: string, offset: number, languageId = 'html'): Hover | null {
    const token = this.tokenAt(text, offset, languageId);
    if (!token || !token.text) return null;
    const css = this.compile(token.text);
    if (!css) return null;
    return { css, start: token.start, end: token.end };
  }

  compile(candidate: string): string {
    const css = this.generator.compileClass(candidate);
    if (css.trim()) return css.trimEnd();
    if (this.isComponent(candidate))
      return componentRule(this.generator.getComponents(), candidate);
    return '';
  }

  diagnostics(text: string, languageId = 'html'): Diagnostic[] {
    const out: Diagnostic[] = [];
    const byRegion = new Map<Region, Token[]>();
    for (const t of this.tokens(text, languageId)) {
      const list = byRegion.get(t.region) ?? [];
      list.push(t);
      byRegion.set(t.region, list);
    }
    for (const [region, tokens] of byRegion) {
      const conflictKeys = new Map<string, Token[]>();
      for (const t of tokens) {
        const rules = this.generator.engine.compile(t.text);
        const known = rules.length > 0 || MARKER_CLASSES.test(t.text) || this.isComponent(t.text);
        if (!known) {
          if (region.kind === 'apply')
            out.push({
              code: 'invalidApply',
              severity: 'error',
              message: `\`${t.text}\` is not a Nakshora utility or component — @apply would fail`,
              start: t.start,
              end: t.end,
            });
          else if (t.text.includes(':') && !t.text.startsWith('['))
            out.push({
              code: 'unknownClass',
              severity: 'warning',
              message: `\`${t.text}\` is not a Nakshora class (unknown variant or utility)`,
              start: t.start,
              end: t.end,
            });
          continue;
        }
        if (rules.length === 0) continue;
        const rule = rules[0];
        const props = Object.keys(rule.decls).filter((p) => !p.startsWith('--'));
        if (props.length === 0) continue;
        const key = JSON.stringify([
          rule.atrules.map((a) => `${a.kind}:${a.params}`),
          rule.selector.replace(/\.(?:\\.|[\w-])+/, '.X'),
          props.sort(),
        ]);
        const list = conflictKeys.get(key) ?? [];
        list.push(t);
        conflictKeys.set(key, list);
      }
      for (const list of conflictKeys.values()) {
        const distinct = [...new Set(list.map((t) => t.text))];
        if (distinct.length < 2) continue;
        for (const t of list)
          out.push({
            code: 'cssConflict',
            severity: 'warning',
            message: `\`${t.text}\` applies the same CSS properties as ${distinct
              .filter((d) => d !== t.text)
              .map((d) => `\`${d}\``)
              .join(', ')}`,
            start: t.start,
            end: t.end,
          });
      }
    }
    return out.sort((a, b) => a.start - b.start);
  }

  colors(text: string, languageId = 'html'): ColorInformation[] {
    const out: ColorInformation[] = [];
    for (const t of this.tokens(text, languageId)) {
      const rules = this.generator.engine.compile(t.text);
      if (rules.length === 0) continue;
      for (const value of Object.values(rules[0].decls)) {
        const color = extractColor(String(value));
        if (!color) continue;
        out.push({ start: t.start, end: t.end, ...color });
        break;
      }
    }
    return out;
  }

  private isComponent(candidate: string): boolean {
    const base = candidate.slice(candidate.lastIndexOf(':') + 1).replace(/^!/, '');
    return this.components.includes(base);
  }
}

function matchParen(text: string, open: number): number {
  let depth = 0;
  let quote: string | null = null;
  for (let i = open; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (ch === '\\') i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') quote = ch;
    else if (ch === '(') depth++;
    else if (ch === ')' && --depth === 0) return i;
  }
  return -1;
}

function componentRule(css: string, candidate: string): string {
  const base = candidate.slice(candidate.lastIndexOf(':') + 1).replace(/^!/, '');
  const re = new RegExp(`\\.${escapeRe(base)}(?![\\w-])`);
  const out: CssNode[] = [];
  for (const { rule, ancestors } of walkRules(parseCss(css).nodes))
    if (re.test(rule.selector) && ancestors.every((a) => a.name !== 'keyframes')) out.push(rule);
  return serializeCss(out).trimEnd();
}

/** First colour in a CSS value, as 0–1 rgba (null when none / currentColor). */
export function extractColor(
  value: string,
): { red: number; green: number; blue: number; alpha: number } | null {
  const cleaned = value.replace(/\/\s*var\([^)]*\)/g, '').trim();
  const m = cleaned.match(/#[0-9a-f]{3,8}\b|(?:rgba?|hsla?)\([^)]*\)|\btransparent\b/i);
  if (!m) return null;
  const parsed = parseColor(m[0]);
  if (!parsed) return null;
  const alpha = parsed.alpha === undefined ? 1 : parseFloat(parsed.alpha);
  if (Number.isNaN(alpha)) return null;
  const n = parsed.color.map(parseFloat);
  if (n.some(Number.isNaN)) return null;
  if (parsed.mode === 'hsl') {
    const [r, g, b] = hslToRgb(n[0], n[1] / 100, n[2] / 100);
    return { red: r, green: g, blue: b, alpha };
  }
  return { red: n[0] / 255, green: n[1] / 255, blue: n[2] / 255, alpha };
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const k = (n: number): number => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number): number => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [f(0), f(8), f(4)];
}
