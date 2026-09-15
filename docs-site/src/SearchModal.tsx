import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { highlight, searchAll, type SearchHit } from './search-engine';

interface Props {
  versions: string[];
  current: string;
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ versions, current, open, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<string>('all');
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const runSearch = useCallback(
    (q: string, sc: string) => {
      if (q.trim().length < 2) {
        setHits([]);
        setSuggestions([]);
        return;
      }
      setLoading(true);
      const vers = sc === 'all' ? versions : [sc];
      searchAll(vers, q, current)
        .then((r) => {
          setHits(r.hits);
          setSuggestions(r.suggestions);
          setSelected(0);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    },
    [versions, current]
  );

  useEffect(() => {
    if (open) {
      setQuery('');
      setHits([]);
      setSuggestions([]);
      setScope('all');
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => {
    const t = window.setTimeout(() => runSearch(query, scope), 120);
    return () => window.clearTimeout(t);
  }, [query, scope, runSearch]);

  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  const go = useCallback(
    (hit: SearchHit) => {
      window.location.href = `/${hit.version}/${hit.slug}/`;
    },
    []
  );

  const kbd = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, hits.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      }
      if (e.key === 'Enter' && hits[selected]) {
        e.preventDefault();
        go(hits[selected]);
      }
    },
    [open, hits, selected, onClose, go]
  );

  useEffect(() => {
    window.addEventListener('keydown', kbd);
    return () => window.removeEventListener('keydown', kbd);
  }, [kbd]);

  const scopeChips = useMemo(() => [{ id: 'all', label: 'All versions' }, ...versions.map((v) => ({ id: v, label: v }))], [versions]);

  if (!open) return null;
  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search Nakshora Docs" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="search-modal">
        <div className="search-input-row">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search every Nakshora version… (e.g. margin, glass, dark mode, নক্ষত্র)"
            aria-label="Search query"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="search-esc">esc</kbd>
        </div>
        <div className="search-scope" role="radiogroup" aria-label="Search scope">
          {scopeChips.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`scope-chip${scope === c.id ? ' active' : ''}`}
              onClick={() => setScope(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="search-results" ref={listRef}>
          {loading && query.trim().length >= 2 && <div className="search-status">Searching…</div>}
          {!loading && query.trim().length >= 2 && hits.length === 0 && (
            <div className="search-status">
              No matches for “{query}”.
              {suggestions.length > 0 && (
                <>
                  {' '}Did you mean:{' '}
                  {suggestions.map((s, i) => (
                    <button key={s} type="button" className="did-you-mean" onClick={() => setQuery(s)}>
                      {s}
                      {i < suggestions.length - 1 ? ',' : ''}
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
          {!loading &&
            hits.map((h, i) => (
              <a
                key={`${h.version}/${h.slug}`}
                href={`/${h.version}/${h.slug}/`}
                className={`search-hit${i === selected ? '' : ''}`}
                data-active={i === selected ? 'true' : 'false'}
                onMouseEnter={() => setSelected(i)}
                onClick={(e) => {
                  e.preventDefault();
                  go(h);
                }}
              >
                <span className="hit-version">{h.version}</span>
                <span className="hit-main">
                  <span className="hit-title">
                    {highlight(h.title, query).map((part, j) =>
                      part.hit ? <mark key={j}>{part.text}</mark> : <span key={j}>{part.text}</span>
                    )}
                  </span>
                  <span className="hit-meta">{h.category} · {h.section}</span>
                  <span className="hit-snippet">{h.snippet}</span>
                </span>
              </a>
            ))}
          {query.trim().length < 2 && (
            <div className="search-status search-hint">
              Type at least two characters. Search covers titles, keywords, tags and summaries across
              all four releases — in any alphabet. Use ↑ ↓ and Enter.
            </div>
          )}
        </div>
        <div className="search-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
          <span className="search-powered">Nakshora Search · BM25 + typo tolerance</span>
        </div>
      </div>
    </div>
  );
}
