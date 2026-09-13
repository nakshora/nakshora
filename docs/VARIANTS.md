# Variants

Variants apply utilities in specific states or contexts.
**State variants are emitted by the JIT compiler** — configure `content`
(see [JIT](./JIT.md)) so the compiler can see your class names.

## State variants

| Prefix           | CSS generated                     | When it applies                   |
| ---------------- | --------------------------------- | --------------------------------- |
| `hover:`         | `.hover\:x:hover`                 | pointer is over the element       |
| `focus:`         | `.focus\:x:focus`                 | element has focus                 |
| `focus-visible:` | `.focus-visible\:x:focus-visible` | keyboard focus                    |
| `focus-within:`  | `.focus-within\:x:focus-within`   | element or a descendant has focus |
| `active:`        | `.active\:x:active`               | element is pressed/active         |
| `visited:`       | `.visited\:x:visited`             | link was visited                  |
| `disabled:`      | `.disabled\:x:disabled`           | element is disabled               |
| `first:`         | `.first\:x:first-child`           | first child                       |
| `last:`          | `.last\:x:last-child`             | last child                        |

## Group variants (parent → child)

Add `group` to the parent, then target children:

```html
<a class="group flex items-center gap-2">
  <span class="text-slate-700">Docs</span>
  <span class="opacity-0 group-hover:opacity-100 transition">→</span>
</a>
```

| Prefix         | CSS generated                  |
| -------------- | ------------------------------ |
| `group-hover:` | `.group:hover .group-hover\:x` |
| `group-focus:` | `.group:focus .group-focus\:x` |

## Peer variants (sibling → sibling)

Add `peer` to the earlier sibling, then target later siblings:

```html
<div class="space-y-2">
  <input type="checkbox" id="t" class="peer" />
  <label for="t" class="peer-checked-visible"> </label>
  <span class="hidden peer-focus:inline">focus ring label</span>
</div>
```

| Prefix        | CSS generated                  |
| ------------- | ------------------------------ |
| `peer-hover:` | `.peer:hover ~ .peer-hover\:x` |
| `peer-focus:` | `.peer:focus ~ .peer-focus\:x` |

## Dark mode

Class-based: add `dark` to any ancestor (convention: `<html class="dark">`).

```html
<div class="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">…</div>
```

CSS generated: `.dark .dark\:bg-slate-900 { background-color: #0f172a; }`

## Responsive + state (JIT)

One responsive prefix + one state prefix can be combined, in either order:

```html
<button class="bg-blue-500 hover:bg-blue-600 md:hover:bg-indigo-600">…</button>
```

```css
@media (min-width: 768px) {
  .md\:hover\:bg-indigo-600:hover {
    background-color: #4f46e5;
  }
}
```

## Escaping in HTML

In plain HTML the colon is written literally — nothing to escape:

```html
<button class="hover:bg-blue-600">…</button>
```

In **JSX/TSX** you escape it:

```tsx
<button className="hover\\:bg-blue-600">…</button>
```

In CSS files (e.g. safelist strings inside CSS) the escaped form
`hover\:bg-blue-600` is also recognized by the JIT extractor.

## Disabling variants

```js
// nakshora.config.js
export default {
  variants: {
    visited: false, // never emit visited:
    focusWithin: false,
    dark: false, // or disable dark mode entirely
  },
};
```
