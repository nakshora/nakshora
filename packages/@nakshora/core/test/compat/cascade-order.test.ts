// Whole-stylesheet cascade order vs tailwindcss@3.4.19.
//
// The per-candidate differential test proves every rule is right; this one
// proves the *order* of rules is right — which decides which utility wins
// when two apply to the same element. Nakshora ports Tailwind's
// `Offsets.compare` (layers → value-aware screen/container hooks → variant
// bit mask → parallel index → arbitrary properties → registration order),
// so the sorted sequence of selectors must be identical for the same input.

import { describe, expect, it } from 'vitest';
import postcss from 'postcss';
import tailwind from 'tailwindcss';
import containerQueries from '@tailwindcss/container-queries';
import typography from '@tailwindcss/typography';
import { CSSGenerator, parseCss, type CssNode } from '../../src/index';
import { dynamicCorpus, mediaStackCorpus } from './corpus';

/** Flatten a stylesheet to `@wrapper { … { selector` lines (rule order only). */
function outline(css: string): string[] {
  const flat = (nodes: CssNode[]): string[] =>
    nodes.flatMap((n) =>
      n.type === 'rule'
        ? [n.selector]
        : n.type === 'atrule' && n.nodes
          ? flat(n.nodes).map((s) => `@${n.name} ${n.params} { ${s}`)
          : [],
    );
  return flat(parseCss(css).nodes);
}

/**
 * Documented output-shape policies (COMPATIBILITY.md §2): Tailwind's
 * `not all and (min-width: N)` is Nakshora's `(max-width: N-0.02px)` and
 * nested media queries are combined into one query — media types first, then
 * the largest `min-width`, the smallest `max-width`, then the remaining
 * features in order of appearance. Rewrite the oracle line the same way.
 */
function policy(line: string): string {
  const parts = line.split(' { ');
  const selector = parts.pop() as string;
  const wrappers = parts;
  const media: string[] = [];
  const other: string[] = [];
  for (const w of wrappers) {
    if (w.startsWith('@media ')) media.push(w.slice(7));
    else other.push(w);
  }
  if (media.length === 0) return line;
  const types: string[] = [];
  const features: string[] = [];
  let min: string | undefined;
  let max: string | undefined;
  let minPx = -1;
  let maxPx = Infinity;
  for (const m of media) {
    const notAll = /^not all and \(min-width: (\d+(?:\.\d+)?)px\)$/.exec(m);
    const conds = notAll ? [`(max-width: ${Number(notAll[1]) - 0.02}px)`] : m.split(/\s+and\s+/);
    for (const c of conds) {
      const mm = /^\((min|max)-width: (\d+(?:\.\d+)?)px\)$/.exec(c);
      if (/^(all|print|screen)$/.test(c)) {
        if (!types.includes(c)) types.push(c);
      } else if (mm && mm[1] === 'min') {
        if (Number(mm[2]) > minPx) {
          minPx = Number(mm[2]);
          min = c;
        }
      } else if (mm) {
        if (Number(mm[2]) < maxPx) {
          maxPx = Number(mm[2]);
          max = c;
        }
      } else if (!features.includes(c)) features.push(c);
    }
  }
  const combined = [...types, ...(min ? [min] : []), ...(max ? [max] : []), ...features].join(
    ' and ',
  );
  // the combined query sits where the outermost media query was
  const out: string[] = [];
  let placed = false;
  for (const w of wrappers) {
    if (w.startsWith('@media ')) {
      if (!placed) out.push(`@media ${combined}`);
      placed = true;
    } else out.push(w);
  }
  return [...out, selector].join(' { ');
}

async function tailwindOutline(
  html: string,
  config: Record<string, unknown> = {},
  css = '@tailwind components; @tailwind utilities;',
): Promise<string[]> {
  const result = await postcss([
    tailwind({
      content: [{ raw: html, extension: 'html' }],
      corePlugins: { preflight: false },
      darkMode: 'class',
      plugins: [containerQueries],
      ...config,
    } as never),
  ]).process(css, { from: undefined });
  return outline(result.css)
    .filter((l) => !l.includes('@keyframes'))
    .map(policy);
}

function nakshoraOutline(html: string, config: Record<string, unknown> = {}): string[] {
  const gen = new CSSGenerator({ darkMode: 'class', ...config } as never);
  return outline(
    gen.generateJIT(html, {}, { utilitiesOnly: true }).replace(/\/\*[\s\S]*?\*\//g, ''),
  ).filter((l) => !l.includes('@keyframes'));
}

/** Every variant family, stacked in both directions, plus value/name collisions. */
const CLASSES = [
  'flex p-4 p-12 p-2 mt-8 mt-10 m-1 pt-1 text-lg text-sm text-red-500 text-blue-200',
  'max-sm:flex max-md:flex max-lg:flex max-[900px]:flex max-[100px]:flex min-[900px]:flex min-[100px]:flex',
  'sm:flex md:flex lg:flex xl:flex 2xl:flex',
  '@md:flex @sm:flex @[900px]:flex @[100px]:flex @lg/main:flex @lg/aside:flex @lg:flex',
  '[&:hover]:flex [&:focus]:flex [@media(min-width:1px)]:flex [&_p]:flex [.x_&]:flex [&>*]:flex [@supports(a:b)]:flex',
  'sm:max-md:flex max-md:sm:flex md:max-lg:flex max-md:hover:flex hover:max-md:flex sm:hover:flex hover:sm:flex',
  'marker:flex marker:block sm:marker:flex sm:[&:hover]:flex [&:hover]:sm:flex selection:flex',
  'supports-[a:b]:flex sm:supports-[a:b]:flex supports-[a:b]:sm:flex supports-[c:d]:flex',
  'dark:sm:flex sm:dark:flex dark:flex md:dark:flex dark:md:flex dark:hover:flex hover:dark:flex',
  'hover:flex focus:flex group-hover:flex peer-focus:flex print:flex before:flex first:flex disabled:flex',
  'has-[p]:flex aria-checked:flex data-[x]:flex motion-safe:flex portrait:flex rtl:flex forced-colors:flex',
  'focus-within:flex active:flex group-focus:flex aria-busy:flex aria-[x]:flex group-aria-busy:flex group-aria-[y]:flex',
  'peer-aria-checked:flex group-data-[x]:flex group-has-[p]:flex peer-has-[p]:flex group-[.x]:flex peer-[.x]:flex peer-hover:flex',
  '[color:red] [background:blue] [border:0] container md:container hover:container',
  'sm:p-1 sm:m-1 hover:p-1 hover:m-1 sm:text-red-500 sm:text-lg ltr:flex landscape:flex contrast-more:flex motion-reduce:flex',
  'file:flex placeholder:flex backdrop:flex after:flex last:flex odd:flex even:flex visited:flex checked:flex required:flex',
  'invalid:flex empty:flex enabled:flex open:flex target:flex group-first:flex peer-last:flex group-open:flex peer-checked:flex',
  '*:flex first-letter:flex first-line:flex only:flex default:flex indeterminate:flex placeholder-shown:flex autofill:flex',
  'optional:flex valid:flex in-range:flex out-of-range:flex read-only:flex focus-visible:flex group-focus-visible:flex peer-active:flex',
  'group/x:flex group-hover/x:flex peer-focus/y:flex hover:[&:hover]:flex [&:hover]:hover:flex md:[&:hover]:flex [&:hover]:[&:focus]:flex',
  'hover:sm:p-1 sm:hover:p-1 sm:hover:m-1 hover:sm:m-1 lg:hover:underline print:hidden lg:prose-lg prose md:prose sm:prose-sm',
].join(' ');

describe('cascade order — differential against tailwindcss@3.4.19', () => {
  it('sorts the whole utilities layer like Tailwind (darkMode: class)', async () => {
    const html = `<i class="${CLASSES}">`;
    const want = await tailwindOutline(html, { plugins: [containerQueries, typography] });
    const got = nakshoraOutline(html, { plugins: [typography] });
    expect(got.length).toBeGreaterThan(200);
    expect(got).toEqual(want);
  }, 60_000);

  it('sorts the whole utilities layer like Tailwind (darkMode: media, dark moves after direction)', async () => {
    const html = `<i class="${CLASSES}">`;
    const want = await tailwindOutline(html, {
      darkMode: 'media',
      plugins: [containerQueries, typography],
    });
    const got = nakshoraOutline(html, { darkMode: 'media', plugins: [typography] });
    expect(got).toEqual(want);
  }, 60_000);

  it('sorts the dynamic and media-stack corpora like Tailwind', async () => {
    const SCREEN = /^(max-)?(xxs|xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|min-\[[^\]]+\]|max-\[[^\]]+\])$/;
    const corpus = [...dynamicCorpus(), ...mediaStackCorpus()].filter((c) => {
      // Nakshora-only syntax has no Tailwind position to compare against
      if (/(^|:)(not-[\w[]|starting:|inert:)/.test(c) || c.endsWith('!')) return false;
      // Two screens of the same family (`lg:xl:`, `max-md:max-sm:`) make
      // Tailwind's comparator inconsistent (see `dedupeHooks` in engine.ts);
      // its order for those is a sort artefact, Nakshora's is utility order.
      const screens = c
        .split(':')
        .slice(0, -1)
        .filter((v) => SCREEN.test(v));
      const families = screens.map((v) => (v.startsWith('max') ? 'max' : 'min'));
      return new Set(families).size === families.length;
    });
    const html = corpus.map((c) => `<i class='${c}'></i>`).join('\n');
    const want = await tailwindOutline(html);
    const got = nakshoraOutline(html);
    expect(got).toEqual(want);
  }, 120_000);

  it('plugin variants take the user-plugin slot (after data-*, before supports)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plugin = (api: any): void => {
      api.addVariant('hocus', ['&:hover', '&:focus']);
      api.matchVariant('nth', (v: string) => `&:nth-child(${v})`, { values: { 2: '2', 3: '3' } });
    };
    const html =
      '<i class="hocus:flex sm:flex hover:flex nth-3:flex nth-2:flex nth-[5]:flex data-[x]:flex supports-[a:b]:flex hocus:sm:flex sm:hocus:flex">';
    const want = await tailwindOutline(html, { plugins: [containerQueries, plugin] });
    const got = nakshoraOutline(html, { plugins: [plugin] });
    expect(got).toEqual(want);
  }, 60_000);

  it('is deterministic: candidate order in content never changes the output', () => {
    const list = CLASSES.split(' ');
    const a = nakshoraOutline(`<i class="${list.join(' ')}">`);
    const b = nakshoraOutline(`<i class="${[...list].reverse().join(' ')}">`);
    const c = nakshoraOutline(list.map((x) => `<b class='${x}'>`).join(''));
    expect(b).toEqual(a);
    expect(c).toEqual(a);
  });
});
