// ---------------------------------------------------------------------------
// Nakshora Docs — block → HTML renderer (build-time, shared by prerender).
// ---------------------------------------------------------------------------
import { escapeHtml, renderInline, linkHref } from './model.mjs';

const CALLOUT_META = {
  tip: { icon: '💡', label: 'Tip', cls: 'callout-tip' },
  note: { icon: 'ℹ️', label: 'Note', cls: 'callout-note' },
  warn: { icon: '⚠️', label: 'Warning', cls: 'callout-warn' },
  new: { icon: '✨', label: 'New', cls: 'callout-new' },
  pro: { icon: '🚀', label: 'Pro tip', cls: 'callout-tip' }
};

export function headingId(text) {
  return String(text)
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function renderBlocks(blocks, base) {
  const out = [];
  const toc = [];
  for (const b of blocks) {
    switch (b.t) {
      case 'p':
        out.push(`<p>${renderInline(b.md, base)}</p>`);
        break;
      case 'h2': {
        const id = headingId(b.text);
        toc.push({ id, text: b.text, level: 2 });
        out.push(`<h2 id="${id}">${renderInline(b.text, base)}<a class="anchor" href="#${id}" aria-label="Link to this section">#</a></h2>`);
        break;
      }
      case 'h3': {
        const id = headingId(b.text);
        toc.push({ id, text: b.text, level: 3 });
        out.push(`<h3 id="${id}">${renderInline(b.text, base)}</h3>`);
        break;
      }
      case 'code': {
        const title = b.title ? `<div class="code-title">${escapeHtml(b.title)}</div>` : '';
        out.push(
          `<div class="code-block">${title}<div class="code-bar"><span class="code-lang">${escapeHtml(b.lang || 'code')}</span><button class="copy-btn" type="button" aria-label="Copy code">Copy</button></div><pre><code class="language-${escapeHtml(b.lang || 'text')}">${escapeHtml(b.code)}</code></pre></div>`
        );
        break;
      }
      case 'list': {
        const tag = b.ordered ? 'ol' : 'ul';
        const itemsList = Array.isArray(b.items) ? b.items : [b.items];
        const items = itemsList.map((i) => `<li>${renderInline(i, base)}</li>`).join('');
        out.push(`<${tag}>${items}</${tag}>`);
        break;
      }
      case 'table': {
        const head = b.head.map((h) => `<th>${renderInline(h, base)}</th>`).join('');
        const rows = b.rows
          .map((r) => `<tr>${r.map((c) => `<td>${renderInline(String(c), base)}</td>`).join('')}</tr>`)
          .join('');
        out.push(`<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`);
        break;
      }
      case 'callout': {
        const meta = CALLOUT_META[b.kind] || CALLOUT_META.note;
        out.push(
          `<div class="callout ${meta.cls}" role="note"><span class="callout-icon" aria-hidden="true">${meta.icon}</span><div><strong>${meta.label}.</strong> ${renderInline(b.md, base)}</div></div>`
        );
        break;
      }
      case 'swatches': {
        const chips = b.shades
          .map((s, i) => {
            const color = b.colors[i] || '#888';
            const dark = i >= Math.floor(b.shades.length / 2);
            return `<span class="swatch" style="background:${color};color:${dark ? '#fff' : '#0f172a'}"><span class="swatch-shade">${escapeHtml(String(s))}</span></span>`;
          })
          .join('');
        out.push(`<div class="swatches" role="img" aria-label="${escapeHtml(b.palette)} color palette shades">${chips}</div>`);
        break;
      }
      case 'cards': {
        const cardsHtml = b.items
          .map(
            (c) =>
              `<a class="link-card" href="${linkHref(c.slug, base)}"><span class="link-card-title">${escapeHtml(c.title)}</span><span class="link-card-desc">${escapeHtml(c.desc || '')}</span></a>`
          )
          .join('');
        out.push(`<div class="link-cards">${cardsHtml}</div>`);
        break;
      }
      default:
        break;
    }
  }
  return { html: out.join('\n'), toc };
}
