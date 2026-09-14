// Nakshora Core — value helpers
// Arbitrary-value normalisation, CSS data-type inference, negation and
// selector escaping. Behaviour mirrors Tailwind CSS 3.4 (MIT) so the
// differential test-suite can compare output declaration-for-declaration.

import { parseColor } from './color';

// ───────────────────────────── escaping ─────────────────────────────

/**
 * Escape a class name for use in a selector (CSS.escape semantics).
 * `2xl:flex` → `\32xl\:flex`, `w-1/2` → `w-1\/2`, `bg-[#fff]` → `bg-\[\#fff\]`.
 */
export function escapeClassName(className: string): string {
  // Direct port of cssesc(str, { isIdentifier: true }) — the exact function
  // Tailwind uses — followed by Tailwind's `\\,` → `\\2c ` rewrite.
  const SINGLE_ESCAPE = /[ -,./:-@[\]^`{-~]/;
  let output = '';
  for (let i = 0; i < className.length; i++) {
    const ch = className.charAt(i);
    const code = className.charCodeAt(i);
    if (code < 0x20 || code > 0x7e) {
      const cp = className.codePointAt(i) as number;
      if (cp > 0xffff) i++;
      output += `\\${cp.toString(16).toUpperCase()} `;
    } else if (ch === '\\' || SINGLE_ESCAPE.test(ch)) {
      output += `\\${ch}`;
    } else {
      output += ch;
    }
  }
  const first = className.charAt(0);
  if (/^-[-\d]/.test(output)) output = `\\-${output.slice(1)}`;
  else if (/\d/.test(first)) output = `\\3${first} ${output.slice(1)}`;
  // Drop the space after `\HEX` escapes when it is redundant (next char is
  // not a hex digit or space), unless preceded by an odd number of backslashes.
  output = output.replace(
    /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g,
    (m, bs: string | undefined, esc: string) => (bs && bs.length % 2 ? m : `${bs ?? ''}${esc}`),
  );
  return output.replace(/\\,/g, '\\2c ');
}

// ───────────────────────────── normalisation ─────────────────────────────

const MATH_FUNCTIONS = [
  'calc',
  'min',
  'max',
  'clamp',
  'mod',
  'rem',
  'sin',
  'cos',
  'tan',
  'asin',
  'acos',
  'atan',
  'atan2',
  'pow',
  'sqrt',
  'hypot',
  'log',
  'exp',
  'round',
];
const AUTO_VAR_INJECTION_EXCEPTIONS = new Set([
  'scroll-timeline-name',
  'timeline-scope',
  'view-timeline-name',
  'font-palette',
  'anchor-name',
  'anchor-scope',
  'position-anchor',
  'position-try-options',
  'scroll-timeline',
  'animation-timeline',
  'view-timeline',
  'position-try',
]);

const CSS_FUNCTIONS = ['min', 'max', 'clamp', 'calc'];
function isCSSFunction(value: string): boolean {
  return CSS_FUNCTIONS.some((fn) => new RegExp(`^${fn}\\(.*\\)`).test(value));
}

/** Split on `sep` at nesting depth 0 (respects (), [] and quotes). */
export function splitAtTopLevelOnly(input: string, sep: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let quote: string | null = null;
  let last = 0;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quote) {
      if (ch === '\\') i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === '(' || ch === '[' || ch === '{') depth++;
    else if (ch === ')' || ch === ']' || ch === '}') depth--;
    else if (depth === 0 && input.startsWith(sep, i)) {
      parts.push(input.slice(last, i));
      i += sep.length - 1;
      last = i + 1;
    }
  }
  parts.push(input.slice(last));
  return parts;
}

/**
 * Add whitespace around `+ - * /` and after `,` inside math functions
 * (`calc(1px+2px)` → `calc(1px + 2px)`). Exact port of Tailwind's
 * `addWhitespaceAroundMathOperators` (MIT).
 */
export function addWhitespaceAroundMathOperators(input: string): string {
  if (!MATH_FUNCTIONS.some((fn) => input.includes(fn))) return input;
  let result = '';
  const formattable: boolean[] = [];
  let valuePos: number | null = null;
  let lastValuePos: number | null = null;
  const isDigit = (c: number) => c >= 48 && c <= 57;
  const isLower = (c: number) => c >= 97 && c <= 122;
  const isUpper = (c: number) => c >= 65 && c <= 90;
  const isOp = (c: number) => c === 43 || c === 42 || c === 47 || c === 45; // + * / -
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    if (isDigit(char)) valuePos = i;
    else if (valuePos !== null && (char === 37 || isLower(char) || isUpper(char))) valuePos = i;
    else {
      lastValuePos = valuePos;
      valuePos = null;
    }
    if (char === 40) {
      // (
      result += input[i];
      let start = i;
      for (let j = i - 1; j >= 0; j--) {
        const inner = input.charCodeAt(j);
        if (isDigit(inner) || isLower(inner)) start = j;
        else break;
      }
      const fn = input.slice(start, i);
      if (MATH_FUNCTIONS.includes(fn)) {
        formattable.unshift(true);
        continue;
      } else if (formattable[0] && fn === '') {
        formattable.unshift(true);
        continue;
      }
      formattable.unshift(false);
      continue;
    } else if (char === 41) {
      // )
      result += input[i];
      formattable.shift();
    } else if (char === 44 && formattable[0]) {
      // ,
      result += ', ';
      continue;
    } else if (char === 32 && formattable[0] && result.charCodeAt(result.length - 1) === 32) {
      continue;
    } else if (isOp(char) && formattable[0]) {
      const trimmed = result.trimEnd();
      const prev = trimmed.charCodeAt(trimmed.length - 1);
      const prevPrev = trimmed.charCodeAt(trimmed.length - 2);
      const next = input.charCodeAt(i + 1);
      if ((prev === 101 || prev === 69) && isDigit(prevPrev)) {
        result += input[i];
        continue;
      } else if (isOp(prev)) {
        result += input[i];
        continue;
      } else if (prev === 40 || prev === 44) {
        result += input[i];
        continue;
      } else if (input.charCodeAt(i - 1) === 32) {
        result += `${input[i]} `;
      } else if (
        isDigit(prev) ||
        isDigit(next) ||
        prev === 41 ||
        next === 40 ||
        isOp(next) ||
        (lastValuePos !== null && lastValuePos === i - 1)
      ) {
        result += ` ${input[i]} `;
      } else {
        result += input[i];
      }
    } else {
      result += input[i];
    }
  }
  return result;
}

/**
 * Normalise an arbitrary value: `--x` → `var(--x)`, `_` → space (except `\_`),
 * math operator spacing, `url()` left untouched.
 */
export function normalizeValue(
  value: string,
  context?: { property?: string },
  isRoot = true,
): string {
  const isVarException =
    context?.property !== undefined && AUTO_VAR_INJECTION_EXCEPTIONS.has(context.property);
  if (value.startsWith('--') && !isVarException) return `var(${value})`;
  if (value.includes('url(')) {
    return value
      .split(/(url\(.*?\))/g)
      .filter(Boolean)
      .map((part) => (/^url\(.*?\)$/.test(part) ? part : normalizeValue(part, context, false)))
      .join('');
  }
  value = value
    .replace(/([^\\])_+/g, (full, before: string) => before + ' '.repeat(full.length - 1))
    .replace(/^_/g, ' ')
    .replace(/\\_/g, '_');
  if (isRoot) value = value.trim();
  return addWhitespaceAroundMathOperators(value);
}

/** Quote attribute-selector values: `state=open` → `state="open"`. */
export function normalizeAttributeSelectors(value: string): string {
  if (!value.includes('=')) return value;
  return value.replace(/(=.*)/g, (_full, match: string) => {
    if (match[1] === "'" || match[1] === '"') return match;
    if (match.length > 2) {
      const trailing = match[match.length - 1];
      if (match[match.length - 2] === ' ' && /^[isIS]$/.test(trailing)) {
        return `="${match.slice(1, -2)}" ${trailing}`;
      }
    }
    return `="${match.slice(1)}"`;
  });
}

// ───────────────────────────── data types ─────────────────────────────

export type DataType =
  | 'any'
  | 'color'
  | 'url'
  | 'image'
  | 'length'
  | 'percentage'
  | 'position'
  | 'lookup'
  | 'generic-name'
  | 'family-name'
  | 'number'
  | 'line-width'
  | 'absolute-size'
  | 'relative-size'
  | 'shadow'
  | 'size'
  | 'bg-size'
  | 'angle'
  | 'time'
  | 'integer';

const LENGTH_UNITS = [
  'cm',
  'mm',
  'Q',
  'in',
  'pc',
  'pt',
  'px',
  'em',
  'ex',
  'ch',
  'rem',
  'lh',
  'rlh',
  'vw',
  'vh',
  'vmin',
  'vmax',
  'vb',
  'vi',
  'svw',
  'svh',
  'lvw',
  'lvh',
  'dvw',
  'dvh',
  'cqw',
  'cqh',
  'cqi',
  'cqb',
  'cqmin',
  'cqmax',
];
const LENGTH_RE = new RegExp(
  `^[+-]?[0-9]*\\.?[0-9]+(?:[eE][+-]?[0-9]+)?(?:${LENGTH_UNITS.join('|')})$`,
);

export const typeCheckers: Record<string, (value: string) => boolean> = {
  any: () => true,
  url: (v) => v.startsWith('url('),
  number: (v) => !isNaN(Number(v)) || isCSSFunction(v),
  integer: (v) => /^-?\d+$/.test(v),
  percentage: (v) => (v.endsWith('%') && !isNaN(Number(v.slice(0, -1)))) || isCSSFunction(v),
  length: (v) => v === '0' || LENGTH_RE.test(v) || isCSSFunction(v),
  'line-width': (v) => ['thin', 'medium', 'thick'].includes(v),
  shadow: (v) => {
    const SHADOW_KEYWORDS = new Set(['inset', 'inherit', 'initial', 'revert', 'unset']);
    return splitAtTopLevelOnly(normalizeValue(v), ',').every((shadow) => {
      const parts = shadow.trim().split(/ +(?![^(]*\))/g);
      let lengths = 0;
      let seenKeyword = false;
      for (const part of parts) {
        if (!seenKeyword && SHADOW_KEYWORDS.has(part)) seenKeyword = true;
        else if (/^-?(\d+|\.\d+)(.*?)$/.test(part)) lengths++;
      }
      return lengths >= 2;
    });
  },
  color: (v) => {
    let colors = 0;
    const ok = splitAtTopLevelOnly(v, '_').every((part) => {
      part = normalizeValue(part);
      if (part.startsWith('var(')) return true;
      if (parseColor(part, { loose: true }) !== null) return (colors++, true);
      return false;
    });
    return ok && colors > 0;
  },
  image: (v) => {
    let images = 0;
    const ok = splitAtTopLevelOnly(v, ',').every((part) => {
      part = normalizeValue(part);
      if (part.startsWith('var(')) return true;
      if (
        part.startsWith('url(') ||
        typeCheckers.gradient(part) ||
        ['element(', 'image(', 'cross-fade(', 'image-set('].some((fn) => part.startsWith(fn))
      ) {
        images++;
        return true;
      }
      return false;
    });
    return ok && images > 0;
  },
  gradient: (v) => {
    v = normalizeValue(v);
    return [
      'conic-gradient',
      'linear-gradient',
      'radial-gradient',
      'repeating-conic-gradient',
      'repeating-linear-gradient',
      'repeating-radial-gradient',
    ].some((t) => v.startsWith(`${t}(`));
  },
  position: (v) => {
    let positions = 0;
    const ok = splitAtTopLevelOnly(v, '_').every((part) => {
      part = normalizeValue(part);
      if (part.startsWith('var(')) return true;
      if (
        ['center', 'top', 'right', 'bottom', 'left'].includes(part) ||
        typeCheckers.length(part) ||
        typeCheckers.percentage(part)
      ) {
        positions++;
        return true;
      }
      return false;
    });
    return ok && positions > 0;
  },
  'family-name': (v) => {
    let fonts = 0;
    const ok = splitAtTopLevelOnly(v, ',').every((part) => {
      part = normalizeValue(part);
      if (part.startsWith('var(')) return true;
      if (part.includes(' ') && !/(['"])([^"']+)\1/g.test(part)) return false;
      if (/^\d/g.test(part)) return false;
      fonts++;
      return true;
    });
    return ok && fonts > 0;
  },
  'generic-name': (v) =>
    [
      'serif',
      'sans-serif',
      'monospace',
      'cursive',
      'fantasy',
      'system-ui',
      'ui-serif',
      'ui-sans-serif',
      'ui-monospace',
      'ui-rounded',
      'math',
      'emoji',
      'fangsong',
    ].includes(v),
  'absolute-size': (v) =>
    [
      'xx-small',
      'x-small',
      'small',
      'medium',
      'large',
      'x-large',
      'xx-large',
      'xxx-large',
    ].includes(v),
  'relative-size': (v) => ['larger', 'smaller'].includes(v),
  size: (v) => typeCheckers['bg-size'](v),
  'bg-size': (v) => {
    const parts = splitAtTopLevelOnly(normalizeValue(v), ',');
    return parts.every((p) =>
      splitAtTopLevelOnly(p.trim(), ' ').every(
        (s) =>
          ['auto', 'cover', 'contain'].includes(s) ||
          typeCheckers.length(s) ||
          typeCheckers.percentage(s),
      ),
    );
  },
  angle: (v) =>
    /^[+-]?[0-9]*\.?[0-9]+(deg|rad|grad|turn)$/.test(v) || v === '0' || isCSSFunction(v),
  time: (v) => /^[+-]?[0-9]*\.?[0-9]+(ms|s)$/.test(v) || isCSSFunction(v),
  lookup: () => false,
};

const TYPE_HINTS = new Set<string>([
  'color',
  'url',
  'image',
  'length',
  'percentage',
  'position',
  'family-name',
  'generic-name',
  'number',
  'line-width',
  'absolute-size',
  'relative-size',
  'shadow',
  'size',
  'angle',
  'time',
  'integer',
  'any',
]);

/** Split an explicit type hint: `length:var(--x)` → ['length', 'var(--x)']. */
export function splitTypeHint(raw: string): { hint?: string; value: string } {
  const m = /^([a-z-]+):(.+)$/s.exec(raw);
  if (m && TYPE_HINTS.has(m[1])) return { hint: m[1], value: m[2] };
  return { value: raw };
}

/**
 * Coerce an arbitrary value against a list of accepted types. Returns the
 * matched type and the normalised value, or null when nothing matches.
 * An explicit hint (`[length:…]`) short-circuits inference.
 */
export function coerceValue(
  raw: string,
  types: DataType[],
  context?: { property?: string },
): { type: DataType; value: string } | null {
  const { hint, value } = splitTypeHint(raw);
  if (hint) {
    if (!types.includes(hint as DataType) && !(hint === 'any')) return null;
    return { type: hint as DataType, value: normalizeValue(value, context) };
  }
  const normalized = normalizeValue(value, context);
  for (const type of types) {
    const check = typeCheckers[type];
    if (check && check(value)) return { type, value: normalized };
  }
  return null;
}

// ───────────────────────────── negation ─────────────────────────────

/** `negateValue('1rem')` → `-1rem`, `('calc(x)')` → `calc(x * -1)`, `('auto')` → null */
export function negateValue(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  value = value.trim();
  if (value === '-') return null;
  if (/^-?[0-9]*\.?[0-9]+(?:[eE][+-]?[0-9]+)?[a-zA-Z%]*$/.test(value as string)) {
    const v = value as string;
    // `-0` is `0` for every unitless/unit value except `0px` (Tailwind emits `-0px`)
    if (/^0+(\.0+)?$/.test(v)) return v;
    if (v.startsWith('-')) return v.slice(1);
    return `-${v}`;
  }
  if (/^(calc|min|max|clamp|var)\(/.test(value as string)) return `calc(${value as string} * -1)`;
  return null;
}

// ───────────────────────────── misc ─────────────────────────────

/** camelCase → kebab-case for CSS properties (`backgroundColor` → `background-color`, `WebkitX` → `-webkit-x`). */
export function kebab(prop: string): string {
  if (prop.startsWith('--')) return prop;
  return prop
    .replace(/^(Webkit|Moz|Ms|O)(?=[A-Z])/, (m) => `-${m.toLowerCase()}`)
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

/** Alpha modifier (`50` → `0.5`, `[0.3]` → `0.3`, `[var(--o)]` → `var(--o)`). */
export function parseAlpha(
  modifier: string,
  opacityScale?: Record<string, unknown>,
): string | null {
  if (modifier.startsWith('[') && modifier.endsWith(']'))
    return normalizeValue(modifier.slice(1, -1));
  const themed = opacityScale?.[modifier];
  if (themed !== undefined) return String(themed);
  if (/^\d+(\.\d+)?$/.test(modifier)) return String(Number(modifier) / 100);
  return null;
}

/** Stable JSON stringification (sorted keys) for cache keys. */
export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'undefined';
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (typeof (value as { toJSON?: unknown }).toJSON === 'function')
    return stableStringify((value as { toJSON: () => unknown }).toJSON());
  const keys = Object.keys(value as object).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify((value as Record<string, unknown>)[k])}`).join(',')}}`;
}
