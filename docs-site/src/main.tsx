// ---------------------------------------------------------------------------
// Nakshora Docs — client entry. The site is fully pre-rendered static HTML;
// this bundle is the interactive layer (React islands): search, theme, copy,
// scrollspy. Everything works without it — it only *enhances*.
// ---------------------------------------------------------------------------
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import SearchModal from './SearchModal';
import './chrome.css';

// ------------------------------------------------------------- theme
function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0d1030' : '#ffffff');
}
function preferredTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem('nakshora-theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* private mode */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function initTheme() {
  applyTheme(preferredTheme());
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    try {
      if (!localStorage.getItem('nakshora-theme')) applyTheme(e.matches ? 'dark' : 'light');
    } catch {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('nakshora-theme', next);
      } catch {
        /* ignore */
      }
      applyTheme(next);
    });
  });
}

// ------------------------------------------------------------- copy buttons
function initCopy() {
  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.copy-btn') as HTMLButtonElement | null;
    if (!btn) return;
    const block = btn.closest('.code-block');
    const codeEl = block?.querySelector('pre code');
    if (!codeEl) return;
    const text = codeEl.textContent || '';
    const done = () => {
      btn.textContent = 'Copied ✓';
      btn.classList.add('copied');
      window.setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 1600);
    };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done).catch(done);
    else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      done();
    }
  });
}

// ------------------------------------------------------------- TOC scrollspy
function initScrollSpy() {
  const links = Array.from(document.querySelectorAll<HTMLElement>('.toc a[href^="#"]'));
  if (!links.length) return;
  const byId = new Map(links.map((l) => [l.getAttribute('href')!.slice(1), l]));
  const setActive = (id: string) => {
    links.forEach((l) => l.classList.toggle('active', l === byId.get(id)));
  };
  const headings = Array.from(document.querySelectorAll<HTMLElement>('.article-body h2[id], .article-body h3[id]'));
  if (!headings.length) return;
  const obs = new IntersectionObserver(
    (entries) => {
      for (const en of entries) if (en.isIntersecting) setActive(en.target.id);
    },
    { rootMargin: '-80px 0px -70% 0px' }
  );
  headings.forEach((h) => obs.observe(h));
}

// ------------------------------------------------------------- active nav
function initNav() {
  const here = window.location.pathname.replace(/\/+$/, '');
  document.querySelectorAll<HTMLElement>('.sidebar a[href]').forEach((a) => {
    const href = (a.getAttribute('href') || '').replace(/\/+$/, '');
    if (href && here && href === here) {
      a.classList.add('current');
      a.setAttribute('aria-current', 'page');
    }
  });
}

// ------------------------------------------------------------- search island
let searchOpen = false;
const searchStateListeners = new Set<(open: boolean) => void>();
function setSearchOpen(open: boolean) {
  if (searchOpen === open) return;
  searchOpen = open;
  searchStateListeners.forEach((fn) => fn(open));
}

function SearchIsland({ versions, current, initialQuery }: { versions: string[]; current: string; initialQuery: string }) {
  const [open, setOpen] = useState(searchOpen);
  useEffect(() => {
    const fn = (o: boolean) => setOpen(o);
    searchStateListeners.add(fn);
    return () => {
      searchStateListeners.delete(fn);
    };
  }, []);
  return (
    <SearchModal versions={versions} current={current} open={open} initialQuery={initialQuery} onClose={() => setSearchOpen(false)} />
  );
}

function initSearch() {
  // WebSite SearchAction deep link: /?q=… opens the modal pre-filled.
  const q = new URLSearchParams(window.location.search).get('q') || '';
  document.querySelectorAll<HTMLElement>('[data-island="search"]').forEach((el) => {
    const versions = (el.dataset.versions || '').split(',').filter(Boolean);
    const current = el.dataset.current || versions[versions.length - 1] || 'v3.1';
    createRoot(el).render(
      <StrictMode>
        <SearchIsland versions={versions} current={current} initialQuery={q} />
      </StrictMode>
    );
  });
  if (q) setSearchOpen(true);

  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('[data-open-search]')) {
      e.preventDefault();
      setSearchOpen(true);
    }
  });
  window.addEventListener('keydown', (e) => {
    const el = e.target as HTMLElement;
    const typing = el?.closest?.('input, textarea, [contenteditable]');
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      setSearchOpen(!searchOpen);
    } else if (e.key === '/' && !typing) {
      e.preventDefault();
      setSearchOpen(true);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCopy();
  initScrollSpy();
  initNav();
  initSearch();
});
