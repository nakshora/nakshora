// Unit tests for the value layer (cssesc escaping, colour parsing, arbitrary-value normalisation).
import { test, expect } from 'vitest';
import {
  escapeClassName,
  coerceValue,
  normalizeValue,
  typeCheckers,
  splitTypeHint,
  negateValue,
} from '../src/values';
import { parseColor, withAlphaVariable, withAlphaValue } from '../src/color';
test('escape', () => {
  const cases: [string, string][] = [
    ['2xl:flex', '\\32xl\\:flex'],
    ['w-1/2', 'w-1\\/2'],
    ['bg-[#fff]', 'bg-\\[\\#fff\\]'],
    ['--x', '\\--x'],
    ['@md:p', '\\@md\\:p'],
    ['p-4!', 'p-4\\!'],
    ['a b', 'a\\ b'],
    ['é', '\\E9'],
    ['éa', '\\E9 a'],
    ['2a', '\\32 a'],
    ['1', '\\31'],
    ['-1', '\\-1'],
    ['-m-4', '-m-4'],
    [
      'grid-cols-[repeat(auto-fill,minmax(1rem,1fr))]',
      'grid-cols-\\[repeat\\(auto-fill\\2c minmax\\(1rem\\2c 1fr\\)\\)\\]',
    ],
    ['3xl:p-1', '\\33xl\\:p-1'],
    ['top-1.5', 'top-1\\.5'],
    ['text-[20px]/[30px]', 'text-\\[20px\\]\\/\\[30px\\]'],
    ['hover:bg-red-500/50', 'hover\\:bg-red-500\\/50'],
    ['-2xl', '\\-2xl'],
    ['5xl:x', '\\35xl\\:x'],
  ];
  for (const [i, o] of cases) expect(escapeClassName(i), i).toBe(o);
});
test('colors', () => {
  expect(withAlphaVariable('#3b82f6', 'background-color', '--tw-bg-opacity')).toEqual({
    '--tw-bg-opacity': '1',
    'background-color': 'rgb(59 130 246 / var(--tw-bg-opacity, 1))',
  });
  expect(withAlphaValue('#3b82f6', '0.5')).toBe('rgb(59 130 246 / 0.5)');
  expect(withAlphaVariable('#1234', 'color', '--tw-text-opacity')).toEqual({ color: '#1234' });
  expect(withAlphaVariable('hsl(0,0%,0%)', 'color', '--tw-text-opacity')).toEqual({
    '--tw-text-opacity': '1',
    color: 'hsl(0 0% 0% / var(--tw-text-opacity, 1))',
  });
  expect(withAlphaVariable('transparent', 'color', '--tw-text-opacity')).toEqual({
    color: 'transparent',
  });
  expect(withAlphaVariable('currentColor', 'color', '--tw-text-opacity')).toEqual({
    color: 'currentColor',
  });
  expect(withAlphaVariable('rgb(var(--x))', 'color', '--tw-text-opacity')).toEqual({
    color: 'rgb(var(--x))',
  });
  expect(withAlphaValue('rgb(var(--x))', '0.5')).toBe('rgb(var(--x) / 0.5)');
  expect(parseColor('oklch(0.5 0.1 20)')).toBeNull();
});
test('values', () => {
  expect(normalizeValue('calc(100%-theme(spacing.4))')).toBe('calc(100% - theme(spacing.4))');
  expect(normalizeValue('--x')).toBe('var(--x)');
  expect(normalizeValue('url(a_b.png)')).toBe('url(a_b.png)');
  expect(normalizeValue('a_b')).toBe('a b');
  expect(normalizeValue('a\\_b')).toBe('a_b');
  expect(typeCheckers.length('10px')).toBe(true);
  expect(typeCheckers.length('red')).toBe(false);
  expect(typeCheckers.color('#fff')).toBe(true);
  expect(typeCheckers.color('red')).toBe(true);
  expect(splitTypeHint('length:var(--x)')).toEqual({ hint: 'length', value: 'var(--x)' });
  expect(negateValue('1rem')).toBe('-1rem');
  expect(negateValue('var(--x)')).toBe('calc(var(--x) * -1)');
  expect(negateValue('-1rem')).toBe('1rem');
  expect(coerceValue('#123', ['color'], {})).toEqual({ type: 'color', value: '#123' });
  expect(coerceValue('10px', ['length', 'color'], {})).toEqual({ type: 'length', value: '10px' });
  // a bare var() satisfies only types whose validator accepts it (colour/position/image…) —  does not
  // a bare var() is not a length nor a colour (Tailwind rule) — `bg-[var(--c)]` resolves through the `any` type
  expect(coerceValue('var(--x)', ['length', 'color'], {})).toBeNull();
  expect(coerceValue('var(--x)', ['length', 'color', 'any'], {})).toEqual({
    type: 'any',
    value: 'var(--x)',
  });
  expect(coerceValue('length:var(--x)', ['length', 'color'], {})).toEqual({
    type: 'length',
    value: 'var(--x)',
  });
});
