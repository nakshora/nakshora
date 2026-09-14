// docs/COMPATIBILITY.md §3 lists classes Nakshora does not emit and a list of
// v3 features that DO work. Both lists are checked here so the document can
// never drift from the engine: when something in the "missing" table starts
// working this test fails and the row must be removed (and vice-versa).

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CSSGenerator } from '../../src/index';

const doc = readFileSync(join(__dirname, '../../../../../docs/COMPATIBILITY.md'), 'utf-8');
const gen = new CSSGenerator();
const emits = (cls: string): boolean =>
  gen.generateFromContent(`<a class="${cls}">`).split('Utilities (JIT) ─── */')[1].trim().length >
  0;

const MISSING = [
  'group/x:flex',
  'in-focus:flex',
  'nth-3:flex',
  'nth-last-of-type-2:flex',
  '**:p-4',
  'inset-shadow-sm',
  'inset-ring',
  'mask-radial',
  'bg-linear-45',
  'rotate-x-45',
  'translate-z-1',
  'perspective-near',
  'text-shadow-sm',
  'wrap-break-word',
  'container-normal',
];

const SUPPORTED = [
  'size-4',
  'size-[3rem]',
  'text-balance',
  'text-pretty',
  'has-[:checked]:flex',
  'group-has-[a]:flex',
  'peer-has-[a]:flex',
  'group-hover/x:flex',
  'supports-[display:grid]:grid',
  'aria-checked:flex',
  'data-[x]:flex',
  'forced-colors:flex',
  '*:p-4',
  '@container',
  '@md:flex',
  '[--x:1]',
  '[mask-type:luminance]',
  '!p-4',
  'p-4!',
  'bg-red-500/50',
  'bg-opacity-50',
  'field-sizing-content',
  'font-stretch-expanded',
  'scheme-dark',
  'starting:opacity-0',
  'not-hover:flex',
  'inert:opacity-50',
  'break-words',
  'bg-gradient-to-r',
  '[&:nth-child(3)]:flex',
];

describe('docs/COMPATIBILITY.md §3 stays truthful', () => {
  it('every class in the "not supported" table really emits nothing', () => {
    const wrong = MISSING.filter(emits);
    expect(wrong, 'now supported — remove from §3').toEqual([]);
  });
  it('every class listed as supported really emits CSS', () => {
    const wrong = SUPPORTED.filter((c) => !emits(c));
    expect(wrong, 'listed as supported in §3 but emits nothing').toEqual([]);
  });
  it('the document mentions each missing family and the policies the tests rely on', () => {
    for (const s of [
      'in-*',
      'nth-*',
      '**:',
      'inset-shadow',
      'mask-',
      'bg-linear-',
      'rotate-x-',
      'text-shadow',
      'wrap-break-word',
      'container-normal',
    ])
      expect(doc, s).toContain(s);
    for (const s of ['2.2', '2.3', '2.4', '2.6', '§4', 'tailwindcss@3.4.19', 'css-tree@3.1.0'])
      expect(doc, s).toContain(s);
  });
});
