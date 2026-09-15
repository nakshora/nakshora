// ---------------------------------------------------------------------------
// Nakshora Docs — article model & text helpers (build-time, deterministic).
// ---------------------------------------------------------------------------

/** FNV-1a hash → deterministic 0..1 float from a string (stable "popularity"). */
export function seeded(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return ((h >>> 0) % 100000) / 100000;
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function stripMarkdown(s) {
  return String(s)
    .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*([^*]*)\*\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Inline markup supported everywhere in article prose:
 *  `code`            → <code>
 *  **bold**          → <strong>
 *  [[slug|label]]    → internal link (resolved against a version root)
 *  [[slug]]          → internal link, label = slug
 */
export function linkHref(slug, base = '') {
  // [[../v3.1/foo]] = absolute cross-version link; everything else is version-relative.
  if (slug.startsWith('../')) return '/' + slug.slice(3) + '/';
  // the bare 'index' slug is a version/core home.
  if (slug === 'index') return base ? `${base}/` : '/';
  return `${base}/${slug}/`;
}
export function renderInline(text, base = '') {
  let out = escapeHtml(text);
  out = out.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (_m, slug, label) => {
    return `<a href="${linkHref(slug, base)}" class="doc-link">${label}</a>`;
  });
  out = out.replace(/\[\[([^\]]+)\]\]/g, (_m, slug) => {
    return `<a href="${linkHref(slug, base)}" class="doc-link">${slug}</a>`;
  });
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return out;
}

/**
 * Article factory. `slug` must be unique inside a version.
 * blocks: array of block objects rendered by lib/render.mjs
 */
export function article(fields) {
  const a = {
    slug: fields.slug,
    title: fields.title,
    section: fields.section || 'guides',
    category: fields.category || 'General',
    summary: fields.summary || '',
    tags: fields.tags || [],
    keywords: fields.keywords || [],
    blocks: fields.blocks || [],
    related: fields.related || [],
    prev: fields.prev || null,
    next: fields.next || null,
    hub: fields.hub || null,
    popularity: fields.popularity ?? seeded(fields.slug),
    order: fields.order ?? 500,
    noindex: !!fields.noindex,
    updated: fields.updated || '2026-09-15',
    toc: []
  };
  if (!a.slug) throw new Error('article missing slug: ' + a.title);
  return a;
}

// ---- block builders -------------------------------------------------------
export const p = (md) => ({ t: 'p', md });
export const h2 = (text) => ({ t: 'h2', text });
export const h3 = (text) => ({ t: 'h3', text });
export const code = (lang, codeStr, title = '') => ({ t: 'code', lang, code: codeStr, title });
export const list = (items, ordered = false) => ({ t: 'list', items, ordered });
export const table = (head, rows) => ({ t: 'table', head, rows });
export const callout = (kind, md) => ({ t: 'callout', kind, md });
export const swatches = (palette, shades, colors) => ({ t: 'swatches', palette, shades, colors });
export const cards = (items) => ({ t: 'cards', items }); // [{slug,title,desc}]

/**
 * Deterministic prose assembler. Joins sentence fragments so generated pages
 * read naturally and differ per topic.
 */
export function prose(...parts) {
  return parts.filter(Boolean).join(' ');
}

export function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function plural(n, word, pluralWord) {
  return `${n.toLocaleString('en-US')} ${n === 1 ? word : pluralWord || word + 's'}`;
}
