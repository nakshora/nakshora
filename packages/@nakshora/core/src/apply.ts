// Nakshora Core — `@apply`, `theme()`, `screen()`, `@screen` processing
//
// Works on Nakshora's own CSS AST so it has no PostCSS dependency; the PostCSS
// and Vite integrations feed author CSS through `processAuthorCss()`.

import {
  collapseAdjacentRules,
  parseCss,
  serializeCss,
  type CssAtRule,
  type CssDecl,
  type CssNode,
  type CssRoot,
  type CssRule,
} from './css-ast';
import { compareRules, type CompiledRule, type Engine } from './engine';
import { escapeClassName, splitAtTopLevelOnly } from './values';

export class ApplyError extends Error {
  constructor(
    message: string,
    public readonly candidate?: string,
  ) {
    super(message);
    this.name = 'ApplyError';
  }
}

export interface ProcessOptions {
  /** throw on unknown `@apply` classes (default true) */
  strict?: boolean;
}

/** Replace `theme(colors.red.500)` / `theme('spacing.4')` / `theme(colors.red.500 / 50%)` in a value. */
export function replaceThemeFunctions(value: string, engine: Engine): string {
  if (!value.includes('theme(') && !value.includes('screen(')) return value;
  let out = value.replace(/theme\(((?:[^()]|\([^()]*\))*)\)/g, (_whole, inner: string) => {
    const path = inner
      .trim()
      .replace(/^['"]|['"]$/g, '')
      .replace(/\s*\/\s*/g, '/');
    const resolved = engine.lookupTheme(path);
    if (resolved === undefined)
      throw new ApplyError(`'${path}' does not exist in your theme config.`);
    return resolved;
  });
  out = out.replace(/screen\(([^)]+)\)/g, (_whole, name: string) => {
    const key = name.trim().replace(/^['"]|['"]$/g, '');
    const px = engine.theme.screens[key];
    if (px === undefined) throw new ApplyError(`The '${key}' screen does not exist in your theme.`);
    return `(min-width: ${px})`;
  });
  return out;
}

/**
 * Expand `@apply` directives, `theme()`/`screen()` functions and `@screen`
 * at-rules in author CSS. Returns the transformed stylesheet.
 */
export function processAuthorCss(
  css: string,
  engine: Engine,
  options: ProcessOptions = {},
): string {
  const root = parseCss(css);
  processNodes(root.nodes, engine, options);
  return serializeCss(root);
}

/** In-place processing of an AST (used by the PostCSS plugin on its own root). */
export function processAst(root: CssRoot, engine: Engine, options: ProcessOptions = {}): void {
  processNodes(root.nodes, engine, options);
}

function processNodes(
  nodes: CssNode[],
  engine: Engine,
  options: ProcessOptions,
  parent?: CssRule,
  insideAtRule?: string,
  directChildren = false,
): void {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.type === 'decl') {
      node.value = replaceThemeFunctions(node.value, engine);
      continue;
    }
    if (node.type === 'atrule') {
      if (node.name === 'apply' && directChildren) continue;
      if (node.name === 'screen') {
        const key = node.params.trim();
        const px = engine.theme.screens[key];
        if (px === undefined)
          throw new ApplyError(`The '${key}' screen does not exist in your theme.`);
        node.name = 'media';
        node.params = `(min-width: ${px})`;
      } else if (node.name === 'apply') {
        if (!parent) throw new ApplyError('`@apply` must be used inside a rule.');
        // only reached for `@apply` nested in an at-rule inside the rule —
        // top-level ones are expanded by `expandRule`
        const list = node.params
          .replace(/\s!important$/, '')
          .trim()
          .split(/\s+/);
        throw new ApplyError(
          insideAtRule === 'screen'
            ? `@apply is not supported within nested at-rules like @screen. We suggest you write this as @apply ${list.map((c) => `${node.params.trim()}:${c}`).join(' ')} instead.`
            : `@apply is not supported within nested at-rules like @${insideAtRule}. You can fix this by un-nesting @${insideAtRule}.`,
        );
      }
      if (node.params) node.params = replaceThemeFunctions(node.params, engine);
      if (node.nodes) processNodes(node.nodes, engine, options, parent, node.name);
      continue;
    }
    if (node.type === 'rule') {
      // children first (theme(), nested rules, nested at-rules); top-level
      // `@apply` children are left in place and expanded by `expandRule`
      processNodes(node.nodes, engine, options, node, undefined, true);
      if (!node.nodes.some((n) => n.type === 'atrule' && n.name === 'apply')) continue;
      const out = expandRule(node, engine, options);
      nodes.splice(i, 1, ...out);
      i += out.length - 1;
    }
  }
}

/**
 * Tailwind semantics for a rule containing `@apply`: the rule is partitioned
 * at every `@apply` (`partitionApplyAtRules`), each `@apply` becomes a clone
 * holding the applied declarations followed by its variant sibling rules in
 * cascade order, and adjacent clones with the same selector are merged again
 * afterwards (`collapseAdjacentRules`) — so
 * `.a { color: red; @apply p-1 hover:m-1; width: 1px }` yields
 * `.a { color: red; padding: … } .a:hover { … } .a { width: 1px }`.
 */
function expandRule(rule: CssRule, engine: Engine, options: ProcessOptions): CssNode[] {
  const groups: CssNode[][] = [];
  let current: CssNode[] = [];
  for (const child of rule.nodes) {
    if (child.type === 'atrule' && child.name === 'apply') {
      if (current.length) groups.push(current);
      current = [];
      groups.push([child]);
    } else current.push(child);
  }
  if (current.length) groups.push(current);
  const out: CssNode[] = [];
  for (const group of groups) {
    const first = group[0];
    if (group.length === 1 && first.type === 'atrule' && first.name === 'apply') {
      const { decls, extraRules } = expandApply(first.params, engine, rule, options);
      if (decls.length) out.push({ ...rule, nodes: decls });
      extraRules.sort((a, b) => compareRules(a.rule, b.rule) || a.seq - b.seq);
      for (const r of extraRules) out.push(r.node);
    } else out.push({ ...rule, nodes: group });
  }
  return collapseAdjacentRules(out);
}

interface SiblingRule {
  node: CssNode;
  rule: CompiledRule;
  seq: number;
}
let siblingSeq = 0;

/**
 * Expand `@apply a b hover:c !important` for `parent`.
 * Plain utilities become declarations (returned in cascade order); variant
 * utilities become sibling rules whose selectors are derived from the parent
 * selector, tagged with their cascade weight for later insertion.
 */
export function expandApply(
  params: string,
  engine: Engine,
  parent: CssRule,
  options: ProcessOptions,
): { decls: CssDecl[]; extraRules: SiblingRule[] } {
  let important = false;
  let list = params.trim();
  if (/\s!important$/.test(list)) {
    important = true;
    list = list.replace(/\s!important$/, '');
  }
  const candidates = list.split(/\s+/).filter(Boolean);
  const decls: CssDecl[] = [];
  const extraRules: SiblingRule[] = [];
  // Tailwind expands in *cascade* order (the utilities layer order), not in
  // the order the classes were written — `@apply py-2 rounded px-4` yields
  // border-radius before padding. Collect, sort, then expand.
  const compiled: { candidate: string; rule: CompiledRule }[] = [];
  const parentClasses = [...parent.selector.matchAll(/\.((?:\\.|[\w-])+)/g)].map((m) =>
    m[1].replace(/\\(.)/g, '$1'),
  );
  for (const candidate of candidates) {
    if (candidate === 'group' || candidate === 'peer')
      throw new ApplyError(`@apply should not be used with the '${candidate}' utility`, candidate);
    const rules = engine.compile(candidate);
    if (rules.length === 0) {
      if (options.strict === false) continue;
      throw new ApplyError(
        `The \`${candidate}\` class does not exist. If \`${candidate}\` is a custom class, make sure it is defined within a \`@layer\` directive or a plugin.`,
        candidate,
      );
    }
    const base = candidate.slice(candidate.lastIndexOf(':') + 1).replace(/^!/, '');
    if (parentClasses.includes(candidate) || parentClasses.includes(base))
      throw new ApplyError(
        `You cannot \`@apply\` the \`${candidate}\` utility here because it creates a circular dependency.`,
        candidate,
      );
    for (const rule of rules) compiled.push({ candidate, rule });
  }
  compiled.sort((a, b) => compareRules(a.rule, b.rule));
  for (const { candidate, rule } of compiled) {
    const bang = important || rule.candidate.startsWith('!');
    const ruleDecls: CssDecl[] = Object.entries(rule.decls).map(([prop, value]) => {
      const isImp = bang || / !important$/.test(value);
      return {
        type: 'decl',
        prop,
        value: value.replace(/ !important$/, ''),
        important: isImp || undefined,
      };
    });
    const escaped = `.${escapeClassName(candidate)}`;
    const isPlain = rule.atrules.length === 0 && rule.selector === escaped;
    if (isPlain) {
      decls.push(...ruleDecls);
      continue;
    }
    // derive selector: replace the candidate class with each parent selector
    const selectors = splitAtTopLevelOnly(parent.selector, ',').map((s) => s.trim());
    const newSelector = selectors
      .map((ps) => {
        if (rule.selector === escaped) return ps;
        // `.hover\:x:hover` → `${ps}:hover`; `.group:hover .group-hover\:x` → `.group:hover ${ps}`
        return rule.selector.split(escaped).join(ps);
      })
      .join(', ');
    let node: CssNode = { type: 'rule', selector: newSelector, nodes: ruleDecls };
    for (let a = rule.atrules.length - 1; a >= 0; a--) {
      const at = rule.atrules[a];
      node = {
        type: 'atrule',
        name: atName(at.kind, at.params),
        params: atParams(at.kind, at.params),
        nodes: [node],
      } as CssAtRule;
    }
    extraRules.push({ node, rule, seq: siblingSeq++ });
  }
  return { decls, extraRules };
}

function atName(kind: CompiledRule['atrules'][number]['kind'], params: string): string {
  if (kind === 'raw') return params.split(/\s+/)[0];
  if (kind === 'starting') return 'starting-style';
  return kind;
}
function atParams(kind: CompiledRule['atrules'][number]['kind'], params: string): string {
  if (kind === 'raw') return params.slice(params.indexOf(' ') + 1);
  if (kind === 'starting') return '';
  return params;
}
