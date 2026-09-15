// ---------------------------------------------------------------------------
// Nakshora Docs — client search engine.
// Unicode-normalized tokenizer + BM25-style ranking over pre-built inverted
// indexes, with prefix boosts, popularity priors, title-match boosts and
// edit-distance "did you mean" suggestions.
// ---------------------------------------------------------------------------

export interface SearchDoc {
  s: string; // slug
  t: string; // title
  c: string; // category
  sec: string; // section
  sn: string; // snippet
  p: number; // popularity 0..100
}
export interface SearchIndex {
  docs: SearchDoc[];
  terms: Record<string, Array<[number, number]>>; // term → [docIdx, tf][]
  total: number;
}
export interface SearchHit {
  slug: string;
  title: string;
  category: string;
  section: string;
  snippet: string;
  score: number;
  version: string;
}
export interface SearchOutcome {
  hits: SearchHit[];
  suggestions: string[];
}

export function tokenize(text: string): string[] {
  return String(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w.length >= 2);
}

const indexCache = new Map<string, Promise<SearchIndex>>();

export function loadIndex(version: string): Promise<SearchIndex> {
  let p = indexCache.get(version);
  if (!p) {
    p = fetch(`/search/${version}.json`).then((r) => {
      if (!r.ok) throw new Error(`search index ${version}: ${r.status}`);
      return r.json() as Promise<SearchIndex>;
    });
    indexCache.set(version, p);
  }
  return p;
}

function levenshtein(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const prev = new Array(b.length + 1);
  const cur = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    cur[0] = i;
    let rowMin = cur[0];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (cur[j] < rowMin) rowMin = cur[j];
    }
    if (rowMin > max) return max + 1;
    for (let j = 0; j <= b.length; j++) prev[j] = cur[j];
  }
  return prev[b.length];
}

/** Suggest near-matches for an unknown token (max 2 edits). */
export function suggest(terms: string[], token: string, limit = 3): string[] {
  if (token.length < 3) return [];
  const out: Array<[string, number]> = [];
  for (const term of terms) {
    if (term.startsWith(token)) continue;
    const d = levenshtein(token, term, 2);
    if (d <= 2) out.push([term, d]);
  }
  return out.sort((a, b) => a[1] - b[1]).slice(0, limit).map(([t]) => t);
}

function snippetFor(doc: SearchDoc, tokens: string[]): string {
  const lower = doc.sn.toLowerCase();
  for (const tk of tokens) {
    const at = lower.indexOf(tk);
    if (at >= 0) {
      const start = Math.max(0, at - 48);
      const raw = doc.sn.slice(start, start + 190);
      return (start > 0 ? '…' : '') + raw + '…';
    }
  }
  return doc.sn.slice(0, 170) + (doc.sn.length > 170 ? '…' : '');
}

/** Rank a query against one loaded index. */
export function queryIndex(index: SearchIndex, version: string, rawQuery: string, limit = 20): SearchOutcome {
  const tokens = tokenize(rawQuery);
  const raw = rawQuery.trim().toLowerCase();
  const suggestions: string[] = [];
  const vocab = Object.keys(index.terms);
  if (tokens.length === 0) return { hits: [], suggestions: [] };

  const N = index.total;
  const scores = new Map<number, number>();

  for (const token of tokens) {
    let postings = index.terms[token];
    if (!postings) {
      // prefix completion
      const prefixed = vocab.filter((v) => v.startsWith(token) && v !== token).slice(0, 4);
      if (prefixed.length) {
        postings = [];
        for (const px of prefixed) postings.push(...(index.terms[px] || []));
      } else {
        const sugg = suggest(vocab, token);
        for (const s of sugg) if (!suggestions.includes(s)) suggestions.push(s);
        if (sugg.length) {
          postings = [];
          for (const s of sugg) postings.push(...(index.terms[s] || []));
        }
      }
    }
    if (!postings || !postings.length) continue;
    const df = postings.length;
    const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
    for (const [docIdx, tf] of postings) {
      const s = (1 + Math.log(tf)) * idf;
      scores.set(docIdx, (scores.get(docIdx) || 0) + s);
    }
  }

  const hits: SearchHit[] = [];
  for (const [docIdx, score] of scores) {
    const doc = index.docs[docIdx];
    let sc = score;
    const titleLower = doc.t.toLowerCase();
    if (raw.length > 3 && titleLower.includes(raw)) sc += 14;
    for (const token of tokens) if (titleLower.includes(token)) sc += 2.2;
    sc *= 0.75 + 0.5 * (doc.p / 100);
    hits.push({
      slug: doc.s,
      title: doc.t,
      category: doc.c,
      section: doc.sec,
      snippet: snippetFor(doc, tokens),
      score: sc,
      version
    });
  }
  hits.sort((a, b) => b.score - a.score);
  return { hits: hits.slice(0, limit), suggestions };
}

/** Cross-version search: run over every loaded (or loadable) index. */
export async function searchAll(
  versions: string[],
  rawQuery: string,
  preferred?: string,
  limit = 20
): Promise<SearchOutcome> {
  const indexes = await Promise.all(versions.map((v) => loadIndex(v).catch(() => null)));
  const merged: SearchHit[] = [];
  const suggestions: string[] = [];
  indexes.forEach((ix, i) => {
    if (!ix) return;
    const r = queryIndex(ix, versions[i], rawQuery, limit);
    merged.push(...r.hits);
    for (const s of r.suggestions) if (!suggestions.includes(s) && suggestions.length < 4) suggestions.push(s);
  });
  merged.sort((a, b) => {
    const pref = (x: SearchHit) => (x.version === preferred ? 1 : 0);
    if (pref(a) !== pref(b)) return pref(b) - pref(a);
    return b.score - a.score;
  });
  return { hits: merged.slice(0, limit), suggestions };
}

export function highlight(title: string, rawQuery: string): Array<{ text: string; hit: boolean }> {
  const tokens = tokenize(rawQuery);
  if (!tokens.length) return [{ text: title, hit: false }];
  const re = new RegExp(`(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = title.split(re);
  return parts.filter((p) => p !== '').map((p) => ({ text: p, hit: tokens.includes(p.toLowerCase()) }));
}
