// Nakshora Core — tiny CSS AST
// A dependency-free parser/serialiser sufficient for the CSS Nakshora emits
// and processes (`@apply`, `theme()`, component filtering, minification).
// It understands nesting, at-rules, comments, strings and `url()`.

export interface CssDecl {
  type: 'decl';
  prop: string;
  value: string;
  important?: boolean;
}
export interface CssRule {
  type: 'rule';
  selector: string;
  nodes: CssNode[];
}
export interface CssAtRule {
  type: 'atrule';
  name: string;
  params: string;
  /** undefined for statement at-rules (`@import x;`) */
  nodes?: CssNode[];
}
export interface CssComment {
  type: 'comment';
  text: string;
}
export type CssNode = CssDecl | CssRule | CssAtRule | CssComment;

export interface CssRoot {
  type: 'root';
  nodes: CssNode[];
}

/** Parse a stylesheet. Tolerant: unterminated blocks are closed at EOF. */
export function parseCss(css: string): CssRoot {
  const root: CssRoot = { type: 'root', nodes: [] };
  const stack: { nodes: CssNode[] }[] = [root];
  let i = 0;
  const n = css.length;
  const top = () => stack[stack.length - 1].nodes;

  const readUntil = (stops: string): string => {
    // read until one of `stops` at nesting depth 0 (outside strings/parens)
    let depth = 0;
    let quote: string | null = null;
    const start = i;
    while (i < n) {
      const ch = css[i];
      if (quote) {
        if (ch === '\\') i++;
        else if (ch === quote) quote = null;
      } else if (ch === '\\')
        i++; // escaped char in a selector (`\'`, `\[`)
      else if (ch === '"' || ch === "'") quote = ch;
      else if (ch === '(' || ch === '[') depth++;
      else if (ch === ')' || ch === ']') depth = Math.max(0, depth - 1);
      else if (ch === '/' && css[i + 1] === '*') {
        const end = css.indexOf('*/', i + 2);
        i = end === -1 ? n : end + 1;
      } else if (depth === 0 && stops.includes(ch)) break;
      i++;
    }
    return css.slice(start, i);
  };

  while (i < n) {
    const ch = css[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (ch === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2);
      const text = css.slice(i + 2, end === -1 ? n : end);
      top().push({ type: 'comment', text });
      i = end === -1 ? n : end + 2;
      continue;
    }
    if (ch === '}') {
      if (stack.length > 1) stack.pop();
      i++;
      continue;
    }
    if (ch === ';') {
      i++;
      continue;
    }
    if (ch === '@') {
      const head = readUntil('{;}').trim();
      const m = /^@([\w-]+)\s*([\s\S]*)$/.exec(head);
      const name = m ? m[1] : head.slice(1);
      const params = m ? m[2].trim() : '';
      if (css[i] === '{') {
        const node: CssAtRule = { type: 'atrule', name, params, nodes: [] };
        top().push(node);
        stack.push(node as { nodes: CssNode[] });
        i++;
      } else {
        top().push({ type: 'atrule', name, params });
        if (css[i] === ';') i++;
      }
      continue;
    }
    // declaration or rule: read to `{`, `;` or `}`
    const head = readUntil('{;}');
    if (css[i] === '{') {
      const node: CssRule = { type: 'rule', selector: head.trim(), nodes: [] };
      top().push(node);
      stack.push(node);
      i++;
      continue;
    }
    // declaration
    const text = head.trim();
    if (text) {
      const colon = text.indexOf(':');
      if (colon > 0) {
        const prop = text.slice(0, colon).trim();
        let value = text.slice(colon + 1).trim();
        let important = false;
        if (/!\s*important$/i.test(value)) {
          important = true;
          value = value.replace(/\s*!\s*important$/i, '').trim();
        }
        top().push({ type: 'decl', prop, value, important });
      }
    }
    if (css[i] === ';') i++;
  }
  return root;
}

export interface SerializeOptions {
  minify?: boolean;
  indent?: string;
}

/** Serialise an AST. Pretty output mirrors Nakshora's one-line rule style. */
export function serializeCss(root: CssRoot | CssNode[], options: SerializeOptions = {}): string {
  const nodes = Array.isArray(root) ? root : root.nodes;
  const minify = options.minify ?? false;
  const out: string[] = [];
  const emit = (list: CssNode[], depth: number): void => {
    const pad = minify ? '' : '  '.repeat(depth);
    for (const node of list) {
      if (node.type === 'comment') {
        if (!minify || node.text.startsWith('!'))
          out.push(`${pad}/*${node.text}*/${minify ? '' : '\n'}`);
        continue;
      }
      if (node.type === 'decl') {
        out.push(
          `${pad}${node.prop}:${minify ? '' : ' '}${node.value}${node.important ? (minify ? '!important' : ' !important') : ''};${minify ? '' : '\n'}`,
        );
        continue;
      }
      if (node.type === 'atrule') {
        if (node.nodes === undefined) {
          out.push(
            `${pad}@${node.name}${node.params ? ` ${node.params}` : ''};${minify ? '' : '\n'}`,
          );
          continue;
        }
        const head = `@${node.name}${node.params ? ` ${node.params}` : ''}`;
        const onlyDecls = node.nodes.every((c) => c.type === 'decl');
        if (onlyDecls && !minify) {
          out.push(
            `${pad}${head} { ${node.nodes.map((d) => declText(d as CssDecl)).join(' ')} }\n`,
          );
          continue;
        }
        out.push(`${pad}${head}${minify ? '{' : ' {\n'}`);
        emit(node.nodes, depth + 1);
        out.push(`${pad}}${minify ? '' : '\n'}`);
        continue;
      }
      // rule
      const onlyDecls = node.nodes.every((c) => c.type === 'decl');
      if (minify) {
        const sel = compactSelector(node.selector);
        if (onlyDecls) {
          out.push(`${sel}{${node.nodes.map((d) => declText(d as CssDecl, true)).join('')}}`);
        } else {
          out.push(`${sel}{`);
          emit(node.nodes, depth + 1);
          out.push('}');
        }
        continue;
      }
      if (onlyDecls) {
        out.push(
          `${pad}${node.selector} { ${node.nodes.map((d) => declText(d as CssDecl)).join(' ')} }\n`,
        );
      } else {
        out.push(`${pad}${node.selector} {\n`);
        emit(node.nodes, depth + 1);
        out.push(`${pad}}\n`);
      }
    }
  };
  emit(nodes, 0);
  return out.join('');
}

/** Remove whitespace around combinators/commas outside brackets and quotes. */
function compactSelector(selector: string): string {
  let out = '';
  let depth = 0;
  let quote: string | null = null;
  for (let i = 0; i < selector.length; i++) {
    const ch = selector[i];
    if (quote) {
      out += ch;
      if (ch === '\\') out += selector[++i] ?? '';
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '\\') {
      out += ch + (selector[++i] ?? '');
      continue;
    }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth--;
    if (depth === 0 && (ch === '>' || ch === '+' || ch === '~' || ch === ',')) {
      out = out.trimEnd() + ch;
      while (selector[i + 1] === ' ') i++;
      continue;
    }
    out += ch;
  }
  return out;
}

function declText(d: CssDecl, minify = false): string {
  return `${d.prop}:${minify ? '' : ' '}${d.value}${d.important ? (minify ? '!important' : ' !important') : ''};`;
}

/** Safe minifier: parse → serialise. Never touches string contents. */
export function minifyCssSafe(css: string): string {
  return serializeCss(parseCss(css), { minify: true });
}

/** All class names referenced by a stylesheet's selectors (unescaped). */
export function classesInCss(root: CssRoot | CssNode[]): Set<string> {
  const set = new Set<string>();
  const walk = (list: CssNode[]): void => {
    for (const node of list) {
      if (node.type === 'rule') {
        for (const m of node.selector.matchAll(/\.((?:\\.|[\w-])+)/g))
          set.add(m[1].replace(/\\(.)/g, '$1'));
        walk(node.nodes);
      } else if (node.type === 'atrule' && node.nodes) walk(node.nodes);
    }
  };
  walk(Array.isArray(root) ? root : root.nodes);
  return set;
}

/** Iterate over every rule (depth-first), with its at-rule ancestors. */
export function* walkRules(
  nodes: CssNode[],
  ancestors: CssAtRule[] = [],
): Generator<{ rule: CssRule; ancestors: CssAtRule[] }> {
  for (const node of nodes) {
    if (node.type === 'rule') {
      yield { rule: node, ancestors };
      yield* walkRules(node.nodes, ancestors);
    } else if (node.type === 'atrule' && node.nodes) {
      yield* walkRules(node.nodes, [...ancestors, node]);
    }
  }
}

export type CssInJs = { [key: string]: string | number | CssInJs | CssInJs[] | undefined | null };

/** camelCase → kebab-case (`backgroundColor` → `background-color`, `WebkitLineClamp` → `-webkit-line-clamp`). */
export function kebabProp(prop: string): string {
  if (prop.startsWith('--')) return prop;
  return prop
    .replace(/^(Webkit|Moz|Ms|O)(?=[A-Z])/, (m) => `-${m.toLowerCase()}`)
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * Convert a CSS-in-JS object (Tailwind plugin style) into a *flat* list of
 * AST nodes. Scalar values are declarations, `@…` keys are at-rules, other
 * keys are rules. Nested rules are resolved against their parent (`&` = the
 * parent selector, otherwise a descendant) and hoisted to the top level, so
 * the result never needs a second flattening pass. At-rules keep nesting;
 * declarations directly inside a nested at-rule are wrapped in a rule for the
 * enclosing selector (`.a { @media x { color: red } }` → `@media x { .a { … } }`).
 */
/** postcss-js: properties whose numeric values stay unitless (everything else gets `px`). */
const UNITLESS = new Set([
  'box-flex',
  'box-flex-group',
  'column-count',
  'flex',
  'flex-grow',
  'flex-positive',
  'flex-shrink',
  'flex-negative',
  'font-weight',
  'line-clamp',
  'line-height',
  'opacity',
  'order',
  'orphans',
  'tab-size',
  'widows',
  'z-index',
  'zoom',
  'fill-opacity',
  'stroke-dashoffset',
  'stroke-opacity',
  'stroke-width',
]);

/** postcss-js number semantics: `{ borderTopWidth: 1 }` → `1px`, `{ opacity: 0 }` → `0`. */
export function numberToCss(prop: string, value: number): string {
  if (value === 0 || prop.startsWith('--') || UNITLESS.has(prop)) return String(value);
  return `${value}px`;
}

export function cssInJsToNodes(input: CssInJs | CssInJs[], parentSelector?: string): CssNode[] {
  const out: CssNode[] = [];
  const list = Array.isArray(input) ? input : [input];
  for (const obj of list) {
    if (!obj || typeof obj !== 'object') continue;
    // Source order is preserved: a run of declarations that is interrupted by
    // a nested rule becomes its own rule, exactly like postcss-nested does
    // (`.prose { color; a {…}; font-size }` → `.prose{color}` `.prose a{…}` `.prose{font-size}`).
    let run: CssNode[] = [];
    const flush = (): void => {
      if (run.length === 0) return;
      if (parentSelector === undefined) out.push(...run);
      else out.push({ type: 'rule', selector: parentSelector, nodes: run });
      run = [];
    };
    for (const [key, value] of Object.entries(obj)) {
      if (value === undefined || value === null) continue;
      if (typeof value === 'string' || typeof value === 'number') {
        const prop = kebabProp(key);
        let v = typeof value === 'number' ? numberToCss(prop, value) : value;
        let important = false;
        if (/!important$/i.test(v)) {
          important = true;
          v = v.replace(/\s*!important$/i, '');
        }
        run.push({ type: 'decl', prop, value: v, important });
        continue;
      }
      if (
        Array.isArray(value) &&
        value.every((v) => typeof v === 'string' || typeof v === 'number')
      ) {
        // e.g. { transitionProperty: ['a', 'b'] } → duplicate declarations
        const prop = kebabProp(key);
        for (const v of value as unknown[])
          run.push({
            type: 'decl',
            prop,
            value: typeof v === 'number' ? numberToCss(prop, v) : String(v),
          });
        continue;
      }
      flush();
      if (key.startsWith('@')) {
        const m = /^@([\w-]+)\s*([\s\S]*)$/.exec(key.trim());
        const name = m ? m[1] : key.slice(1);
        const params = m ? m[2].trim() : '';
        const inner = cssInJsToNodes(value as CssInJs | CssInJs[], parentSelector);
        out.push({ type: 'atrule', name, params, nodes: inner });
        continue;
      }
      // rule; resolve `&` against the parent
      const selectors = splitSelectorList(key);
      const resolved = selectors
        .map((sel) => {
          if (parentSelector === undefined) return sel;
          const parents = splitSelectorList(parentSelector);
          if (sel.includes('&')) return parents.map((p) => sel.replace(/&/g, p)).join(', ');
          return parents.map((p) => `${p} ${sel}`).join(', ');
        })
        .join(', ');
      const inner = cssInJsToNodes(value as CssInJs | CssInJs[], resolved);
      if (inner.length === 0) out.push({ type: 'rule', selector: resolved, nodes: [] });
      else out.push(...inner);
    }
    flush();
  }
  return out;
}

/**
 * Port of Tailwind's `collapseAdjacentRules`: merge *adjacent* rules with the
 * same selector (and adjacent at-rules with the same name+params), recursing
 * into at-rules. Non-adjacent duplicates are left alone (cascade order).
 */
export function collapseAdjacentRules(nodes: CssNode[]): CssNode[] {
  const out: CssNode[] = [];
  const ws = (s: string): string => s.replace(/\s+/g, ' ');
  for (const node of nodes) {
    const prev = out[out.length - 1];
    if (
      prev &&
      node.type === 'rule' &&
      prev.type === 'rule' &&
      ws(prev.selector) === ws(node.selector)
    ) {
      prev.nodes.push(...node.nodes);
      continue;
    }
    if (
      prev &&
      node.type === 'atrule' &&
      prev.type === 'atrule' &&
      node.name !== 'font-face' &&
      prev.name === node.name &&
      ws(prev.params) === ws(node.params) &&
      prev.nodes &&
      node.nodes
    ) {
      prev.nodes.push(...node.nodes);
      continue;
    }
    out.push(node.type === 'atrule' && node.nodes ? { ...node, nodes: [...node.nodes] } : node);
  }
  for (const node of out)
    if (node.type === 'atrule' && node.nodes) node.nodes = collapseAdjacentRules(node.nodes);
  return out;
}

/** Split a selector list on top-level commas (commas inside `:is(a, b)` / attribute values are kept). */
export function splitSelectorList(selector: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let quote: string | null = null;
  let cur = '';
  for (let i = 0; i < selector.length; i++) {
    const ch = selector[i];
    if (quote) {
      cur += ch;
      if (ch === '\\' && i + 1 < selector.length) cur += selector[++i];
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth--;
    else if (ch === ',' && depth === 0) {
      parts.push(cur.trim());
      cur = '';
      continue;
    }
    cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

/** Flatten nested rules (`.a { .b { } }`) into a flat list with resolved selectors; at-rules keep nesting. */
export function flattenNodes(nodes: CssNode[]): CssNode[] {
  const out: CssNode[] = [];
  for (const node of nodes) {
    if (node.type === 'rule') {
      const decls = node.nodes.filter((n) => n.type === 'decl' || n.type === 'comment');
      const nested = node.nodes.filter((n) => n.type !== 'decl' && n.type !== 'comment');
      if (decls.length || nested.length === 0)
        out.push({ type: 'rule', selector: node.selector, nodes: decls });
      for (const child of nested) {
        if (child.type === 'rule') {
          const sel = child.selector.includes('&')
            ? child.selector.replace(/&/g, node.selector)
            : `${node.selector} ${child.selector}`;
          out.push(...flattenNodes([{ type: 'rule', selector: sel, nodes: child.nodes }]));
        } else if (child.type === 'atrule' && child.nodes) {
          out.push({
            type: 'atrule',
            name: child.name,
            params: child.params,
            nodes: flattenNodes([{ type: 'rule', selector: node.selector, nodes: child.nodes }]),
          });
        }
      }
    } else if (node.type === 'atrule' && node.nodes) {
      out.push({
        type: 'atrule',
        name: node.name,
        params: node.params,
        nodes: flattenNodes(node.nodes),
      });
    } else out.push(node);
  }
  return out;
}
