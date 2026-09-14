// Nakshora Core — class candidate extractor
// A port of Tailwind v3.4's default extractor (MIT): finds every plausible
// utility candidate in arbitrary source text (HTML, JSX, Vue, MDX, …),
// including arbitrary values, arbitrary variants, modifiers and `!important`.
//
// The regexes below are copied verbatim from Tailwind so that the two
// extractors agree byte-for-byte; keep their escaping as-is.
/* eslint-disable no-useless-escape */

const SPECIALS = /([[\]'"`])([^[\]'"`])?/g;
const ALLOWED_CLASS_CHARACTERS = /[^"'`\s<>\]]+/;

function any(sources: (string | RegExp)[]): string {
  return `(?:${sources.map(toSource).join('|')})`;
}
function optional(source: (string | RegExp)[] | string | RegExp): string {
  return `(?:${toSource(source)})?`;
}
function pattern(source: (string | RegExp)[]): RegExp {
  return new RegExp(toSource(source), 'g');
}
function toSource(source: (string | RegExp)[] | string | RegExp): string {
  const list = Array.isArray(source) ? source : [source];
  return list.map((s) => (s instanceof RegExp ? s.source : s)).join('');
}
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function* buildRegExps(prefix: string, separator: string): Generator<RegExp> {
  const prefixPattern = prefix !== '' ? optional(pattern([/-?/, escapeRegex(prefix)])) : '';
  const utility = any([
    // Arbitrary properties (without square brackets)
    /\[[^\s:'"`]+:[^\s\[\]]+\]/,
    // Arbitrary properties with balanced square brackets
    /\[[^\s:'"`\]]+:[^\s]+?\[[^\s]+\][^\s]+?\]/,
    // Utilities
    pattern([
      // Utility Name / Group Name
      any([/-?(?:\w+)/, /@(?:\w+)/]),
      // Normal/Arbitrary values
      optional(
        any([
          pattern([
            // Arbitrary values
            any([
              /-(?:\w+-)*\['[^\s]+'\]/,
              /-(?:\w+-)*\["[^\s]+"\]/,
              /-(?:\w+-)*\[`[^\s]+`\]/,
              /-(?:\w+-)*\[(?:[^\s\[\]]+\[[^\s\[\]]+\])*[^\s:\[\]]+\]/,
            ]),
            // Not immediately followed by an `{[(`
            /(?![{([]])/,
            // optionally followed by an opacity modifier
            /(?:\/[^\s'"`\\><$]*)?/,
          ]),
          pattern([
            // Arbitrary values
            any([
              /-(?:\w+-)*\['[^\s]+'\]/,
              /-(?:\w+-)*\["[^\s]+"\]/,
              /-(?:\w+-)*\[`[^\s]+`\]/,
              /-(?:\w+-)*\[(?:[^\s\[\]]+\[[^\s\[\]]+\])*[^\s\[\]]+\]/,
            ]),
            // Not immediately followed by an `{[(`
            /(?![{([]])/,
            // optionally followed by an opacity modifier
            /(?:\/[^\s'"`\\$]*)?/,
          ]),
          // Normal values w/o quotes — may include an opacity modifier
          /[-\/][^\s'"`\\$={><]*/,
        ]),
      ),
    ]),
  ]);
  const variantPatterns = [
    // Without quotes
    any([
      // This is here to provide special support for the `@` variant
      pattern([/@\[[^\s"'`]+\](\/[^\s"'`]+)?/, separator]),
      // With variant modifier (e.g.: group-[..]/modifier)
      pattern([/([^\s"'`\[\\]+-)?\[[^\s"'`]+\]\/[\w_-]+/, separator]),
      pattern([/([^\s"'`\[\\]+-)?\[[^\s"'`]+\]/, separator]),
      pattern([/[^\s"'`\[\\]+/, separator]),
    ]),
    // With quotes allowed
    any([
      // With variant modifier (e.g.: group-[..]/modifier)
      pattern([/([^\s"'`\[\\]+-)?\[[^\s`]+\]\/[\w_-]+/, separator]),
      pattern([/([^\s"'`\[\\]+-)?\[[^\s`]+\]/, separator]),
      pattern([/[^\s`\[\\]+/, separator]),
    ]),
  ];
  for (const variantPattern of variantPatterns) {
    yield pattern([
      // Variants
      '((?=((',
      variantPattern,
      ')+))\\2)?',
      // Important (optional)
      /!?/,
      prefixPattern,
      utility,
    ]);
  }
  // 5. Inner matches
  yield /[^<>"'`\s.(){}[\]#=%$][^<>"'`\s(){}[\]#=%$]*[^<>"'`\s.(){}[\]#=%:$]/g;
}

/**
 * Clips a string ensuring that parentheses, quotes, etc… are balanced
 * (used for arbitrary values only).
 */
function clipAtBalancedParens(input: string): string {
  if (!input.includes('-[')) return input;
  let depth = 0;
  const openStringTypes: string[] = [];
  const matches = Array.from(input.matchAll(SPECIALS)).flatMap((match) => {
    const [, ...groups] = match;
    return groups.map((group, idx) => ({ char: group, index: (match.index ?? 0) + idx }));
  });
  for (const match of matches) {
    const char = match.char;
    const inStringType = openStringTypes[openStringTypes.length - 1];
    if (char === inStringType) openStringTypes.pop();
    else if (char === "'" || char === '"' || char === '`') openStringTypes.push(char);
    if (inStringType) continue;
    if (char === '[') {
      depth++;
      continue;
    }
    if (char === ']') {
      depth--;
      continue;
    }
    if (depth < 0) return input.substring(0, match.index - 1);
    if (depth === 0 && char !== undefined && !ALLOWED_CLASS_CHARACTERS.test(char)) {
      return input.substring(0, match.index);
    }
  }
  return input;
}

function splitAtTopLevelDot(input: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let last = 0;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch === '[' || ch === '(') depth++;
    else if (ch === ']' || ch === ')') depth--;
    else if (ch === '.' && depth === 0) {
      parts.push(input.slice(last, i));
      last = i + 1;
    }
  }
  parts.push(input.slice(last));
  return parts;
}

export interface ExtractorOptions {
  prefix?: string;
  separator?: string;
}

const cache = new Map<string, RegExp[]>();

/** Create an extractor function for the given prefix/separator (cached). */
export function createExtractor(options: ExtractorOptions = {}): (content: string) => string[] {
  const prefix = options.prefix ?? '';
  const separator = options.separator ?? ':';
  const key = `${prefix}\u0000${separator}`;
  let patterns = cache.get(key);
  if (!patterns) {
    patterns = Array.from(buildRegExps(prefix, escapeRegex(separator)));
    cache.set(key, patterns);
  }
  const compiled = patterns;
  return (content: string): string[] => {
    const results: string[] = [];
    for (const p of compiled) {
      for (const result of content.match(p) ?? []) results.push(clipAtBalancedParens(result));
    }
    for (const result of results.slice()) {
      const segments = splitAtTopLevelDot(result);
      for (let idx = 0; idx < segments.length; idx++) {
        const segment = segments[idx];
        if (idx >= segments.length - 1) {
          results.push(segment);
          continue;
        }
        const next = Number(segments[idx + 1]);
        if (Number.isNaN(next)) results.push(segment);
        else idx++;
      }
    }
    return results;
  };
}

/**
 * Extract candidate class tokens from source chunks. HTML-escaped variant
 * syntax (`hover\:bg-blue-500`) is unescaped so both forms work.
 */
export function extractCandidates(
  chunks: string[],
  options: ExtractorOptions & { pattern?: string } = {},
): Set<string> {
  const out = new Set<string>();
  if (options.pattern) {
    const regex = new RegExp(options.pattern, 'g');
    for (const chunk of chunks)
      for (const m of chunk.matchAll(regex)) if (m[0].length > 1) out.add(m[0]);
    return out;
  }
  const extract = createExtractor(options);
  for (const chunk of chunks) {
    if (!chunk) continue;
    for (const token of extract(chunk)) {
      if (token.length < 2 || token.length > 256) continue;
      const unescaped = token.includes('\\') ? token.replace(/\\([:./[\]#!])/g, '$1') : token;
      out.add(unescaped);
    }
  }
  return out;
}
