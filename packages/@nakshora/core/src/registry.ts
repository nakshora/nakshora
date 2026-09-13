// Nakshora Core — utility registry
// Data-driven catalog of every utility group. The generator iterates
// this list to emit CSS; docs & the AI corpus are generated from it too.

import type { CSSProperties, ThemeConfig, UtilityRule } from './types';

function spacingKeys(spacing: ThemeConfig['spacing']): string[] {
  return spacing ? Object.keys(spacing) : [];
}

function colorEntries(colors: ThemeConfig['colors']): [string, string, string][] {
  // returns [name, shade, value]
  const out: [string, string, string][] = [];
  if (!colors) return out;
  for (const [name, value] of Object.entries(colors)) {
    if (typeof value === 'string') {
      out.push([name, '', value]);
    } else if (value && typeof value === 'object') {
      for (const [shade, color] of Object.entries(value)) {
        if (typeof color === 'string') out.push([name, shade, color]);
      }
    }
  }
  return out;
}

/**
 * Build the complete list of utility rules for a resolved theme.
 */
export function buildUtilityList(theme: Required<ThemeConfig>): UtilityRule[] {
  const rules: UtilityRule[] = [];
  const add = (
    className: string,
    group: string,
    decls: CSSProperties,
    category: string,
    description?: string,
  ): void => {
    rules.push({ class: className, group, decls, category, description });
  };

  const spacing = theme.spacing;
  const sKeys = spacingKeys(spacing);

  // ────────────────────────── Display ──────────────────────────
  const displays: [string, string, string][] = [
    ['block', 'block', 'Block-level element'],
    ['inline-block', 'inline-block', 'Inline block-level element'],
    ['inline', 'inline', 'Inline element'],
    ['flex', 'flex', 'Flex container'],
    ['inline-flex', 'inline-flex', 'Inline flex container'],
    ['grid', 'grid', 'Grid container'],
    ['inline-grid', 'inline-grid', 'Inline grid container'],
    ['contents', 'contents', 'Element becomes transparent to its children'],
    ['hidden', 'none', 'Visually hidden (display: none)'],
  ];
  for (const [cls, value, desc] of displays) {
    add(cls, 'display', { display: value }, 'display', desc);
  }

  // ────────────────────────── Position ──────────────────────────
  for (const pos of ['static', 'relative', 'absolute', 'fixed', 'sticky']) {
    add(pos, 'position', { position: pos }, 'position', `position: ${pos}`);
  }

  // ────────────────────────── Inset ──────────────────────────
  for (const key of sKeys) {
    const v = spacing![key];
    add(`inset-${key}`, 'inset', { inset: v }, 'inset', `inset on all sides`);
    add(`inset-x-${key}`, 'inset', { 'inset-inline': v }, 'inset', 'inset on the horizontal axis');
    add(`inset-y-${key}`, 'inset', { 'inset-block': v }, 'inset', 'inset on the vertical axis');
    add(`top-${key}`, 'inset', { top: v }, 'inset', 'top offset');
    add(`right-${key}`, 'inset', { right: v }, 'inset', 'right offset');
    add(`bottom-${key}`, 'inset', { bottom: v }, 'inset', 'bottom offset');
    add(`left-${key}`, 'inset', { left: v }, 'inset', 'left offset');
  }

  // ────────────────────────── Z-Index ──────────────────────────
  for (const [key, value] of Object.entries(theme.zIndex)) {
    add(`z-${key}`, 'zIndex', { 'z-index': String(value) }, 'zIndex', `z-index: ${value}`);
  }

  // ────────────────────────── Overflow ──────────────────────────
  for (const value of ['auto', 'scroll', 'hidden', 'visible', 'clip']) {
    add(`overflow-${value}`, 'overflow', { overflow: value }, 'overflow', `overflow: ${value}`);
    add(
      `overflow-x-${value}`,
      'overflow',
      { 'overflow-x': value },
      'overflow',
      `overflow-x: ${value}`,
    );
    add(
      `overflow-y-${value}`,
      'overflow',
      { 'overflow-y': value },
      'overflow',
      `overflow-y: ${value}`,
    );
  }

  // ────────────────────────── Visibility ──────────────────────────
  add('visible', 'visibility', { visibility: 'visible' }, 'visibility', 'visible');
  add('invisible', 'visibility', { visibility: 'hidden' }, 'visibility', 'invisible');
  add(
    'sr-only',
    'visibility',
    {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: '0',
    },
    'visibility',
    'Visually hidden but accessible to screen readers',
  );
  add(
    'not-sr-only',
    'visibility',
    {
      position: 'static',
      width: 'auto',
      height: 'auto',
      padding: '0',
      margin: '0',
      overflow: 'visible',
      clip: 'auto',
      whiteSpace: 'normal',
    },
    'visibility',
    'Restore an sr-only element',
  );

  // ────────────────────────── Sizing ──────────────────────────
  for (const key of sKeys) {
    const v = spacing![key];
    add(`w-${key}`, 'sizing', { width: v }, 'sizing', `width`);
    add(`h-${key}`, 'sizing', { height: v }, 'sizing', 'height');
    add(`min-w-${key}`, 'sizing', { 'min-width': v }, 'sizing', 'min-width');
    add(`min-h-${key}`, 'sizing', { 'min-height': v }, 'sizing', 'min-height');
    add(`max-w-${key}`, 'sizing', { 'max-width': v }, 'sizing', 'max-width');
    add(`max-h-${key}`, 'sizing', { 'max-height': v }, 'sizing', 'max-height');
  }
  add('w-auto', 'sizing', { width: 'auto' }, 'sizing', 'width: auto');
  add('h-auto', 'sizing', { height: 'auto' }, 'sizing', 'height: auto');
  add('w-full', 'sizing', { width: '100%' }, 'sizing', 'width: 100%');
  add('h-full', 'sizing', { height: '100%' }, 'sizing', 'height: 100%');
  add('w-screen', 'sizing', { width: '100vw' }, 'sizing', 'width: viewport width');
  add('h-screen', 'sizing', { height: '100vh' }, 'sizing', 'height: viewport height');
  add('w-fit', 'sizing', { width: 'fit-content' }, 'sizing', 'width: fit-content');
  add('h-fit', 'sizing', { height: 'fit-content' }, 'sizing', 'height: fit-content');
  add('min-w-0', 'sizing', { 'min-width': '0' }, 'sizing', 'min-width: 0');
  add('min-h-0', 'sizing', { 'min-height': '0' }, 'sizing', 'min-height: 0');
  add('min-w-full', 'sizing', { 'min-width': '100%' }, 'sizing', 'min-width: 100%');
  add('min-h-full', 'sizing', { 'min-height': '100%' }, 'sizing', 'min-height: 100%');
  add('min-h-screen', 'sizing', { 'min-height': '100vh' }, 'sizing', 'min-height: viewport height');
  add(
    'min-h-svh',
    'sizing',
    { 'min-height': '100svh' },
    'sizing',
    'min-height: small viewport height',
  );
  add('max-w-full', 'sizing', { 'max-width': '100%' }, 'sizing', 'max-width: 100%');
  add('max-w-none', 'sizing', { 'max-width': 'none' }, 'sizing', 'max-width: none');
  add('max-h-full', 'sizing', { 'max-height': '100%' }, 'sizing', 'max-height: 100%');
  add('max-h-screen', 'sizing', { 'max-height': '100vh' }, 'sizing', 'max-height: viewport height');
  // Named max-width scale
  const maxWidths: Record<string, string> = {
    xs: '20rem',
    sm: '24rem',
    md: '28rem',
    lg: '32rem',
    xl: '36rem',
    '2xl': '42rem',
    '3xl': '48rem',
    '4xl': '56rem',
    '5xl': '64rem',
    '6xl': '72rem',
    '7xl': '80rem',
    full: '100%',
  };
  for (const [key, value] of Object.entries(maxWidths)) {
    add(`max-w-${key}`, 'sizing', { 'max-width': value }, 'sizing', `max-width: ${value}`);
  }

  // ────────────────────────── Margin ──────────────────────────
  for (const key of sKeys) {
    const v = spacing![key];
    add(`m-${key}`, 'margin', { margin: v }, 'spacing', 'margin on all sides');
    add(
      `mx-${key}`,
      'margin',
      { 'margin-left': v, 'margin-right': v },
      'spacing',
      'horizontal margin',
    );
    add(
      `my-${key}`,
      'margin',
      { 'margin-top': v, 'margin-bottom': v },
      'spacing',
      'vertical margin',
    );
    add(`mt-${key}`, 'margin', { 'margin-top': v }, 'spacing', 'top margin');
    add(`mb-${key}`, 'margin', { 'margin-bottom': v }, 'spacing', 'bottom margin');
    add(`ml-${key}`, 'margin', { 'margin-left': v }, 'spacing', 'left margin');
    add(`mr-${key}`, 'margin', { 'margin-right': v }, 'spacing', 'right margin');
  }

  // ────────────────────────── Padding ──────────────────────────
  for (const key of sKeys) {
    const v = spacing![key];
    add(`p-${key}`, 'padding', { padding: v }, 'spacing', 'padding on all sides');
    add(
      `px-${key}`,
      'padding',
      { 'padding-left': v, 'padding-right': v },
      'spacing',
      'horizontal padding',
    );
    add(
      `py-${key}`,
      'padding',
      { 'padding-top': v, 'padding-bottom': v },
      'spacing',
      'vertical padding',
    );
    add(`pt-${key}`, 'padding', { 'padding-top': v }, 'spacing', 'top padding');
    add(`pb-${key}`, 'padding', { 'padding-bottom': v }, 'spacing', 'bottom padding');
    add(`pl-${key}`, 'padding', { 'padding-left': v }, 'spacing', 'left padding');
    add(`pr-${key}`, 'padding', { 'padding-right': v }, 'spacing', 'right padding');
  }

  // ────────────────────────── Gap ──────────────────────────
  for (const key of sKeys) {
    const v = spacing![key];
    add(`gap-${key}`, 'gap', { gap: v }, 'spacing', 'gap on all axes');
    add(`gap-x-${key}`, 'gap', { 'column-gap': v }, 'spacing', 'column gap');
    add(`gap-y-${key}`, 'gap', { 'row-gap': v }, 'spacing', 'row gap');
  }

  // ────────────────────────── Flexbox ──────────────────────────
  const flexDirect = ['row', 'row-reverse', 'col', 'col-reverse'] as const;
  for (const d of flexDirect) {
    add(`flex-${d}`, 'flex', { 'flex-direction': d }, 'flexbox', `flex-direction: ${d}`);
  }
  for (const [cls, val] of [
    ['flex-wrap', 'wrap'],
    ['flex-nowrap', 'nowrap'],
    ['flex-wrap-reverse', 'wrap-reverse'],
  ] as const) {
    add(cls, 'flex', { 'flex-wrap': val }, 'flexbox', `flex-wrap: ${val}`);
  }
  for (const v of ['start', 'center', 'end', 'between', 'around', 'evenly']) {
    add(
      `justify-${v === 'between' ? 'between' : v}`,
      'flex',
      {
        'justify-content': v === 'start' ? 'flex-start' : v === 'end' ? 'flex-end' : `space-${v}`,
      },
      'flexbox',
      `justify-content: ${v === 'start' ? 'flex-start' : v === 'end' ? 'flex-end' : `space-${v}`}`,
    );
  }
  for (const v of ['start', 'center', 'end', 'stretch', 'baseline']) {
    add(
      `items-${v}`,
      'flex',
      { 'align-items': v === 'start' ? 'flex-start' : v === 'end' ? 'flex-end' : v },
      'flexbox',
      `align-items`,
    );
  }
  for (const v of ['start', 'center', 'end', 'between', 'around', 'stretch']) {
    add(
      `content-${v}`,
      'flex',
      {
        'align-content':
          v === 'start'
            ? 'flex-start'
            : v === 'end'
              ? 'flex-end'
              : v === 'between'
                ? 'space-between'
                : v === 'around'
                  ? 'space-around'
                  : v,
      },
      'flexbox',
      'align-content',
    );
  }
  for (const v of ['auto', 'start', 'center', 'end', 'stretch']) {
    add(
      `self-${v}`,
      'flex',
      { 'align-self': v === 'start' ? 'flex-start' : v === 'end' ? 'flex-end' : v },
      'flexbox',
      'align-self',
    );
  }
  add('flex-1', 'flex', { flex: '1 1 0%' }, 'flexbox', 'flex: 1 1 0%');
  add('flex-auto', 'flex', { flex: '1 1 auto' }, 'flexbox', 'flex: 1 1 auto');
  add('flex-initial', 'flex', { flex: '0 1 auto' }, 'flexbox', 'flex: 0 1 auto');
  add('flex-none', 'flex', { flex: 'none' }, 'flexbox', 'flex: none');
  add('grow', 'flex', { 'flex-grow': '1' }, 'flexbox', 'flex-grow: 1');
  add('grow-0', 'flex', { 'flex-grow': '0' }, 'flexbox', 'flex-grow: 0');
  add('shrink', 'flex', { 'flex-shrink': '1' }, 'flexbox', 'flex-shrink: 1');
  add('shrink-0', 'flex', { 'flex-shrink': '0' }, 'flexbox', 'flex-shrink: 0');
  for (let i = -6; i <= 6; i++) {
    add(`order-${i}`, 'flex', { order: String(i) }, 'flexbox', `order: ${i}`);
  }

  // ────────────────────────── Grid ──────────────────────────
  for (let i = 1; i <= 12; i++) {
    add(
      `grid-cols-${i}`,
      'grid',
      { 'grid-template-columns': `repeat(${i}, minmax(0, 1fr))` },
      'grid',
      `${i} equal columns`,
    );
    add(
      `col-span-${i}`,
      'grid',
      { 'grid-column': `span ${i} / span ${i}` },
      'grid',
      `span ${i} columns`,
    );
  }
  add('col-span-full', 'grid', { 'grid-column': '1 / -1' }, 'grid', 'span all columns');
  for (let i = 1; i <= 6; i++) {
    add(
      `grid-rows-${i}`,
      'grid',
      { 'grid-template-rows': `repeat(${i}, minmax(0, 1fr))` },
      'grid',
      `${i} equal rows`,
    );
    add(`row-span-${i}`, 'grid', { 'grid-row': `span ${i} / span ${i}` }, 'grid', `span ${i} rows`);
  }
  add('row-span-full', 'grid', { 'grid-row': '1 / -1' }, 'grid', 'span all rows');
  add('col-start-1', 'grid', { 'grid-column-start': '1' }, 'grid', 'column start 1');
  add('col-end-1', 'grid', { 'grid-column-end': '1' }, 'grid', 'column end 1');
  for (const v of ['row', 'col', 'row-dense', 'col-dense', 'dense']) {
    add(`grid-flow-${v}`, 'grid', { 'grid-auto-flow': v }, 'grid', `grid-auto-flow: ${v}`);
  }
  for (const v of ['auto', 'min', 'max', 'fr']) {
    add(`auto-cols-${v}`, 'grid', { 'grid-auto-columns': v }, 'grid', `grid-auto-columns: ${v}`);
    add(`auto-rows-${v}`, 'grid', { 'grid-auto-rows': v }, 'grid', `grid-auto-rows: ${v}`);
  }

  // ────────────────────────── Typography ──────────────────────────
  const typo = theme.typography;
  if (typo?.fontSize) {
    for (const [size, value] of Object.entries(typo.fontSize)) {
      if (Array.isArray(value)) {
        const [fs, lh] = value;
        add(
          `text-${size}`,
          'typography',
          { 'font-size': fs, 'line-height': lh },
          'typography',
          `font-size: ${fs}`,
        );
      } else {
        add(
          `text-${size}`,
          'typography',
          { 'font-size': value },
          'typography',
          `font-size: ${value}`,
        );
      }
    }
  }
  if (typo?.fontWeight) {
    for (const [weight, value] of Object.entries(typo.fontWeight)) {
      add(
        `font-${weight}`,
        'typography',
        { 'font-weight': String(value) },
        'typography',
        `font-weight: ${value}`,
      );
    }
  }
  if (theme.fontFamily) {
    for (const [family, value] of Object.entries(theme.fontFamily)) {
      add(
        `font-${family}`,
        'typography',
        { 'font-family': value },
        'typography',
        `font-family: ${family}`,
      );
    }
  }
  if (typo?.lineHeight) {
    for (const [height, value] of Object.entries(typo.lineHeight)) {
      add(
        `leading-${height}`,
        'typography',
        { 'line-height': value },
        'typography',
        `line-height: ${value}`,
      );
    }
  }
  if (typo?.letterSpacing) {
    for (const [spacingName, value] of Object.entries(typo.letterSpacing)) {
      add(
        `tracking-${spacingName}`,
        'typography',
        { 'letter-spacing': value },
        'typography',
        `letter-spacing: ${value}`,
      );
    }
  }
  for (const [align, cls] of [
    ['left', 'text-left'],
    ['center', 'text-center'],
    ['right', 'text-right'],
    ['justify', 'text-justify'],
    ['start', 'text-start'],
    ['end', 'text-end'],
  ] as const) {
    add(cls, 'typography', { 'text-align': align }, 'typography', `text-align: ${align}`);
  }
  for (const [transform, cls] of [
    ['uppercase', 'uppercase'],
    ['lowercase', 'lowercase'],
    ['capitalize', 'capitalize'],
    ['none', 'normal-case'],
  ] as const) {
    add(
      cls,
      'typography',
      { 'text-transform': transform },
      'typography',
      `text-transform: ${transform}`,
    );
  }
  add('italic', 'typography', { fontStyle: 'italic' }, 'typography', 'italic');
  add('not-italic', 'typography', { fontStyle: 'normal' }, 'typography', 'not-italic');
  add(
    'truncate',
    'typography',
    {
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      whiteSpace: 'nowrap',
    },
    'typography',
    'single-line ellipsis',
  );
  add(
    'text-ellipsis',
    'typography',
    { 'text-overflow': 'ellipsis' },
    'typography',
    'text-overflow: ellipsis',
  );
  add('text-clip', 'typography', { 'text-overflow': 'clip' }, 'typography', 'text-overflow: clip');
  add(
    'antialiased',
    'typography',
    {
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
    },
    'typography',
    'font smoothing',
  );

  // ────────────────────────── Text Decoration ──────────────────────────
  for (const [deco, cls] of [
    ['underline', 'underline'],
    ['overline', 'overline'],
    ['line-through', 'line-through'],
    ['none', 'no-underline'],
  ] as const) {
    add(
      cls,
      'textDecoration',
      { 'text-decoration-line': deco },
      'textDecoration',
      `text-decoration-line: ${deco}`,
    );
  }
  for (const w of ['thin', '2', '4', '8']) {
    add(
      `decoration-${w}`,
      'textDecoration',
      {
        'text-decoration-thickness': w === 'thin' ? '1px' : `${w}px`,
      },
      'textDecoration',
      'decoration thickness',
    );
  }
  for (const off of ['0', '1', '2', '4', '8']) {
    add(
      `underline-offset-${off}`,
      'textDecoration',
      { 'text-underline-offset': `${off}px` },
      'textDecoration',
      'underline offset',
    );
  }

  // ────────────────────────── Colors ──────────────────────────
  const colorTokens = colorEntries(theme.colors);
  for (const [name, shade, value] of colorTokens) {
    const suffix = shade ? `${name}-${shade}` : name;
    add(`text-${suffix}`, 'textColor', { color: value }, 'colors', `color: ${value}`);
    add(
      `bg-${suffix}`,
      'backgroundColor',
      { 'background-color': value },
      'colors',
      `background-color: ${value}`,
    );
    add(
      `border-${suffix}`,
      'borderColor',
      { 'border-color': value },
      'colors',
      `border-color: ${value}`,
    );
    add(
      `from-${suffix}`,
      'gradients',
      { '--tw-gradient-from': value },
      'colors',
      `gradient from: ${value}`,
    );
    add(
      `via-${suffix}`,
      'gradients',
      { '--tw-gradient-via': value },
      'colors',
      `gradient via: ${value}`,
    );
    add(
      `to-${suffix}`,
      'gradients',
      { '--tw-gradient-to': value },
      'colors',
      `gradient to: ${value}`,
    );
  }

  // ────────────────────────── Borders ──────────────────────────
  add('border', 'borders', { border: '1px solid' }, 'borders', '1px solid border (all sides)');
  add('border-0', 'borders', { border: '0 solid' }, 'borders', 'no border');
  for (const w of ['2', '4', '8']) {
    add(`border-${w}`, 'borders', { border: `${w}px solid` }, 'borders', `${w}px solid border`);
  }
  for (const side of ['t', 'r', 'b', 'l'] as const) {
    add(
      `border-${side}`,
      'borders',
      { [`border-${side}-width`]: '1px', [`border-${side}-style`]: 'solid' } as CSSProperties,
      'borders',
      `${side} border`,
    );
  }
  for (const side of ['x', 'y'] as const) {
    add(
      `border-${side}`,
      'borders',
      {
        ...(side === 'x'
          ? { 'border-left': '1px solid', 'border-right': '1px solid' }
          : { 'border-top': '1px solid', 'border-bottom': '1px solid' }),
      },
      'borders',
      `${side === 'x' ? 'left+right' : 'top+bottom'} border`,
    );
  }
  for (const style of ['solid', 'dashed', 'dotted', 'double', 'none'] as const) {
    add(
      `border-${style}`,
      'borders',
      { 'border-style': style },
      'borders',
      `border-style: ${style}`,
    );
  }

  // ────────────────────────── Border Radius ──────────────────────────
  const radiusEntries = Object.entries(theme.borderRadius);
  add(
    'rounded',
    'borderRadius',
    { 'border-radius': '0.25rem' },
    'borders',
    'border-radius: 0.25rem',
  );
  for (const [key, value] of radiusEntries) {
    add(
      `rounded-${key}`,
      'borderRadius',
      { 'border-radius': value },
      'borders',
      `border-radius: ${value}`,
    );
  }
  const corners = ['t', 'r', 'b', 'l', 'tl', 'tr', 'bl', 'br'] as const;
  for (const corner of corners) {
    add(
      `rounded-${corner}`,
      'borderRadius',
      { [borderCornerProp(corner)]: '0.25rem' } as CSSProperties,
      'borders',
      `${corner} corner radius`,
    );
    for (const [key, value] of radiusEntries) {
      add(
        `rounded-${corner}-${key}`,
        'borderRadius',
        { [borderCornerProp(corner)]: value } as CSSProperties,
        'borders',
        `${corner} corner radius: ${value}`,
      );
    }
  }
  function borderCornerProp(corner: string): string {
    if (corner === 't') return 'border-top-left-radius';
    if (corner === 'r') return 'border-top-right-radius';
    if (corner === 'b') return 'border-bottom-right-radius';
    if (corner === 'l') return 'border-bottom-left-radius';
    if (corner === 'tl') return 'border-top-left-radius';
    if (corner === 'tr') return 'border-top-right-radius';
    if (corner === 'bl') return 'border-bottom-left-radius';
    return 'border-bottom-right-radius';
  }

  // ────────────────────────── Backgrounds ──────────────────────────
  for (const pos of ['top', 'left', 'center', 'right', 'bottom'] as const) {
    add(
      `bg-${pos}`,
      'backgrounds',
      { 'background-position': pos },
      'backgrounds',
      `background-position: ${pos}`,
    );
  }
  for (const [rep, cls] of [
    ['no-repeat', 'bg-no-repeat'],
    ['repeat', 'bg-repeat'],
    ['repeat-x', 'bg-repeat-x'],
    ['repeat-y', 'bg-repeat-y'],
    ['round', 'bg-repeat-round'],
    ['space', 'bg-repeat-space'],
  ] as const) {
    add(
      cls,
      'backgrounds',
      { 'background-repeat': rep },
      'backgrounds',
      `background-repeat: ${rep}`,
    );
  }
  for (const size of ['auto', 'cover', 'contain'] as const) {
    add(
      `bg-${size}`,
      'backgrounds',
      { 'background-size': size },
      'backgrounds',
      `background-size: ${size}`,
    );
  }
  for (const attach of ['fixed', 'local', 'scroll'] as const) {
    add(
      `bg-${attach}`,
      'backgrounds',
      { 'background-attachment': attach },
      'backgrounds',
      `background-attachment: ${attach}`,
    );
  }
  for (const dir of ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'] as const) {
    add(
      `bg-gradient-to-${dir}`,
      'backgrounds',
      {
        backgroundImage: `linear-gradient(to ${dir === 't' ? 'top' : dir === 'tr' ? 'top right' : dir === 'r' ? 'right' : dir === 'br' ? 'bottom right' : dir === 'b' ? 'bottom' : dir === 'bl' ? 'bottom left' : dir === 'l' ? 'left' : 'top left'}, var(--tw-gradient-from), var(--tw-gradient-via, transparent), var(--tw-gradient-to))`,
      },
      'backgrounds',
      `linear gradient to ${dir}`,
    );
  }

  // ────────────────────────── Shadows ──────────────────────────
  for (const [key, value] of Object.entries(theme.shadows)) {
    const cls = key === 'base' ? 'shadow' : `shadow-${key}`;
    add(cls, 'shadows', { 'box-shadow': value }, 'effects', `box-shadow: ${value}`);
  }

  // ────────────────────────── Opacity ──────────────────────────
  for (const [key, value] of Object.entries(theme.opacity)) {
    add(`opacity-${key}`, 'opacity', { opacity: String(value) }, 'effects', `opacity: ${value}`);
  }

  // ────────────────────────── Filters ──────────────────────────
  add('blur-0', 'filters', { filter: 'none', 'backdrop-filter': 'none' }, 'effects', 'no blur');
  for (const [px, cls] of [
    ['4', 'blur-sm'],
    ['8', 'blur'],
    ['12', 'blur-md'],
    ['16', 'blur-lg'],
    ['24', 'blur-xl'],
    ['40', 'blur-2xl'],
  ] as const) {
    add(
      cls,
      'filters',
      { backdropFilter: `blur(${px}px)`, filter: `blur(${px}px)` },
      'effects',
      `backdrop-blur(${px}px)`,
    );
  }
  add('brightness-0', 'filters', { filter: 'brightness(0)' }, 'effects', 'brightness 0');
  for (const p of ['50', '75', '90', '95', '100', '105', '110', '125', '150', '200'] as const) {
    add(
      `brightness-${p}`,
      'filters',
      { filter: `brightness(${p}%)` },
      'effects',
      `brightness ${p}%`,
    );
  }
  add('grayscale', 'filters', { filter: 'grayscale(100%)' }, 'effects', 'grayscale');
  add('invert', 'filters', { filter: 'invert(100%)' }, 'effects', 'invert colors');
  add('saturate-0', 'filters', { filter: 'saturate(0)' }, 'effects', 'saturate 0');
  for (const p of ['50', '100', '150', '200'] as const) {
    add(`saturate-${p}`, 'filters', { filter: `saturate(${p}%)` }, 'effects', `saturate ${p}%`);
  }
  add('contrast-more', 'filters', { filter: 'contrast(1.2)' }, 'effects', 'contrast +20%');
  add('contrast-less', 'filters', { filter: 'contrast(0.8)' }, 'effects', 'contrast -20%');
  add(
    'drop-shadow',
    'filters',
    { filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.25))' },
    'effects',
    'drop shadow',
  );
  add(
    'drop-shadow-lg',
    'filters',
    { filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))' },
    'effects',
    'large drop shadow',
  );
  add('backdrop-blur', 'filters', { 'backdrop-filter': 'blur(8px)' }, 'effects', 'backdrop blur');
  add(
    'backdrop-grayscale',
    'filters',
    { 'backdrop-filter': 'grayscale(100%)' },
    'effects',
    'backdrop grayscale',
  );
  add(
    'backdrop-invert',
    'filters',
    { 'backdrop-filter': 'invert(100%)' },
    'effects',
    'backdrop invert',
  );

  // ────────────────────────── Transforms ──────────────────────────
  for (const v of [
    '50',
    '75',
    '90',
    '95',
    '100',
    '105',
    '110',
    '125',
    '150',
    '175',
    '200',
  ] as const) {
    add(
      `scale-${v}`,
      'transforms',
      { transform: `scale(${Number(v) / 100})` },
      'transforms',
      `scale ${v}%`,
    );
  }
  for (const d of ['0', '45', '90', '135', '180', '225', '270', '315', '360'] as const) {
    add(
      `rotate-${d}`,
      'transforms',
      { transform: `rotate(${d}deg)` },
      'transforms',
      `rotate ${d}deg`,
    );
  }
  add('-rotate-45', 'transforms', { transform: 'rotate(-45deg)' }, 'transforms', 'rotate -45deg');
  add('-rotate-90', 'transforms', { transform: 'rotate(-90deg)' }, 'transforms', 'rotate -90deg');
  add(
    '-rotate-180',
    'transforms',
    { transform: 'rotate(-180deg)' },
    'transforms',
    'rotate -180deg',
  );
  for (const key of sKeys) {
    const v = spacing![key];
    add(
      `translate-x-${key}`,
      'transforms',
      { transform: `translateX(${v})` },
      'transforms',
      'translateX',
    );
    add(
      `translate-y-${key}`,
      'transforms',
      { transform: `translateY(${v})` },
      'transforms',
      'translateY',
    );
    add(
      `-translate-x-${key}`,
      'transforms',
      { transform: `translateX(calc(-1 * ${v}))` },
      'transforms',
      '-translateX',
    );
    add(
      `-translate-y-${key}`,
      'transforms',
      { transform: `translateY(calc(-1 * ${v}))` },
      'transforms',
      '-translateY',
    );
  }
  add(
    'transform',
    'transforms',
    {
      transform: 'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))',
    },
    'transforms',
    'enable transform',
  );
  add(
    'transform-gpu',
    'transforms',
    { transform: 'translate3d(var(--tw-translate-x), var(--tw-translate-y), 0)' },
    'transforms',
    'GPU transform',
  );
  add('transform-none', 'transforms', { transform: 'none' }, 'transforms', 'no transform');

  // ────────────────────────── Transitions ──────────────────────────
  add(
    'transition',
    'transitions',
    {
      transitionProperty:
        'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      transitionDuration: '150ms',
    },
    'transitions',
    'standard transition set',
  );
  add(
    'transition-all',
    'transitions',
    {
      transitionProperty: 'all',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      transitionDuration: '150ms',
    },
    'transitions',
    'transition: all',
  );
  add(
    'transition-none',
    'transitions',
    { transitionProperty: 'none' },
    'transitions',
    'no transition',
  );
  add(
    'transition-colors',
    'transitions',
    {
      transitionProperty:
        'color, background-color, border-color, text-decoration-color, fill, stroke',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      transitionDuration: '150ms',
    },
    'transitions',
    'color transitions',
  );
  add(
    'transition-opacity',
    'transitions',
    {
      transitionProperty: 'opacity',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      transitionDuration: '150ms',
    },
    'transitions',
    'opacity transitions',
  );
  add(
    'transition-shadow',
    'transitions',
    {
      transitionProperty: 'box-shadow',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      transitionDuration: '150ms',
    },
    'transitions',
    'box-shadow transitions',
  );
  add(
    'transition-transform',
    'transitions',
    {
      transitionProperty: 'transform',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      transitionDuration: '150ms',
    },
    'transitions',
    'transform transitions',
  );
  for (const [key, value] of Object.entries(theme.duration)) {
    add(
      `duration-${key}`,
      'transitions',
      { transitionDuration: value },
      'transitions',
      `transition-duration: ${value}`,
    );
  }
  for (const [key, value] of Object.entries(theme.easing)) {
    add(
      `ease-${key}`,
      'transitions',
      { 'transition-timing-function': value },
      'transitions',
      `transition-timing-function: ${value}`,
    );
  }

  // ────────────────────────── Animations ──────────────────────────
  for (const [name, value] of Object.entries(theme.animation)) {
    add(`animate-${name}`, 'animations', { animation: value }, 'animations', `animation: ${value}`);
  }
  add('animate-none', 'animations', { animation: 'none' }, 'animations', 'no animation');
  for (const [play, cls] of [
    ['paused', 'animation-paused'],
    ['running', 'animation-running'],
  ] as const) {
    add(
      cls,
      'animations',
      { 'animation-play-state': play },
      'animations',
      `animation-play-state: ${play}`,
    );
  }

  // ────────────────────────── Cursors ──────────────────────────
  for (const cursor of [
    'default',
    'pointer',
    'wait',
    'text',
    'move',
    'help',
    'not-allowed',
    'resize',
    'zoom-in',
    'zoom-out',
  ] as const) {
    add(`cursor-${cursor}`, 'cursors', { cursor }, 'cursors', `cursor: ${cursor}`);
  }

  // ────────────────────────── Whitespace & Misc ──────────────────────────
  for (const [mode, cls] of [
    ['normal', 'whitespace-normal'],
    ['nowrap', 'whitespace-nowrap'],
    ['pre', 'whitespace-pre'],
    ['pre-line', 'whitespace-pre-line'],
    ['pre-wrap', 'whitespace-pre-wrap'],
    ['break-spaces', 'break-spaces'],
  ] as const) {
    add(cls, 'whitespace', { whiteSpace: mode }, 'whitespace', `white-space: ${mode}`);
  }
  for (const [val, cls] of [
    ['left', 'float-left'],
    ['right', 'float-right'],
    ['none', 'float-none'],
  ] as const) {
    add(cls, 'whitespace', { float: val }, 'whitespace', `float: ${val}`);
  }
  add('clear-left', 'whitespace', { clear: 'left' }, 'whitespace', 'clear: left');
  add('clear-right', 'whitespace', { clear: 'right' }, 'whitespace', 'clear: right');
  add('clear-both', 'whitespace', { clear: 'both' }, 'whitespace', 'clear: both');
  for (const val of ['none', 'disc', 'decimal'] as const) {
    add(`list-${val}`, 'whitespace', { listStyleType: val }, 'whitespace', `list-style: ${val}`);
  }
  add(
    'list-none',
    'whitespace',
    { 'list-style': 'none', 'list-style-type': 'none' } as CSSProperties,
    'whitespace',
    'remove list styling',
  );
  for (const val of ['none', 'visible', 'collapse', 'hidden', 'scroll'] as const) {
    add(
      `resize-${val}`,
      'whitespace',
      { resize: val } as CSSProperties,
      'whitespace',
      `resize: ${val}`,
    );
  }
  add(
    'select-none',
    'whitespace',
    { userSelect: 'none' } as CSSProperties,
    'whitespace',
    'user-select: none',
  );
  add(
    'select-text',
    'whitespace',
    { userSelect: 'text' } as CSSProperties,
    'whitespace',
    'user-select: text',
  );
  add(
    'select-all',
    'whitespace',
    { userSelect: 'all' } as CSSProperties,
    'whitespace',
    'user-select: all',
  );

  return rules;
}

/**
 * Group key → human-readable category name (for docs/AI export).
 */
export const GROUP_CATEGORIES: Record<string, string> = {
  display: 'Display',
  position: 'Position',
  inset: 'Inset (Offset)',
  zIndex: 'Stacking (Z-Index)',
  overflow: 'Overflow',
  visibility: 'Visibility',
  sizing: 'Sizing',
  margin: 'Margin',
  padding: 'Padding',
  gap: 'Gap',
  flex: 'Flexbox',
  grid: 'Grid',
  typography: 'Typography',
  textDecoration: 'Text Decoration',
  textColor: 'Text Colors',
  backgroundColor: 'Background Colors',
  borderColor: 'Border Colors',
  gradients: 'Gradient Stops',
  borders: 'Borders',
  borderRadius: 'Border Radius',
  backgrounds: 'Backgrounds',
  shadows: 'Shadows',
  opacity: 'Opacity',
  filters: 'Filters',
  transforms: 'Transforms',
  transitions: 'Transitions',
  animations: 'Animations',
  cursors: 'Cursors',
  whitespace: 'Whitespace & Misc',
};
