# Nakshora Utilities Reference

**3,091 utilities** organized into 13 categories. Every table below is
**generated from the framework source** — if you see a class here, the
compiler can emit it.

> 🔑 **Syntax cheat-sheet**
>
> - Color: `<utility>-<palette>-<shade>` → `text-blue-500`, `bg-slate-900`, `from-rose-400`
> - Spacing: `<utility>-<key>` → `p-4`, `mt-2`, `gap-x-6` (keys: `0 px 0.5 1 1.5 2 2.5 3 3.5 4 5 6 7 8 9 10 11 12 14 16 20 24 28 32 36 40 44 48 56 64 72 80 96`)
> - Responsive: `sm:md:lg:xl:2xl:` prefix → `md:grid-cols-2`
> - Variants (JIT): `hover: focus: active: disabled: dark: group-hover: peer-focus:` → `hover:bg-blue-600`
> - Combine (JIT): one responsive + one state → `md:hover:bg-blue-600`

## 📑 Categories

| #   | Category                                                                                     | Utilities |
| --- | -------------------------------------------------------------------------------------------- | --------- |
| 1   | [Layout (display, position, inset, z-index, overflow, visibility)](./utilities/01-layout.md) | ~500      |
| 2   | [Spacing (margin, padding, gap)](./utilities/02-spacing.md)                                  | 561       |
| 3   | [Sizing (width, height, min/max)](./utilities/03-sizing.md)                                  | ~230      |
| 4   | [Flexbox & Grid](./utilities/04-flexbox-grid.md)                                             | ~95       |
| 5   | [Typography & Text Decoration](./utilities/05-typography.md)                                 | ~70       |
| 6   | [Colors (text, background, border, gradient stops)](./utilities/06-colors.md)                | 1,452     |
| 7   | [Backgrounds (position, repeat, size, gradients)](./utilities/07-backgrounds.md)             | ~26       |
| 8   | [Borders & Radius](./utilities/08-borders.md)                                                | ~130      |
| 9   | [Effects (shadows, opacity, filters)](./utilities/09-effects.md)                             | ~55       |
| 10  | [Transforms (scale, rotate, translate)](./utilities/10-transforms.md)                        | ~140      |
| 11  | [Transitions & Animations](./utilities/11-transitions-animations.md)                         | ~35       |
| 12  | [Cursors, Whitespace & Misc](./utilities/12-misc.md)                                         | ~40       |
| 13  | [Design Components (glass, neon, brutalist, skeletons)](./utilities/13-components.md)        | built-in  |

## Quick lookup

**I want to…**

| …do this                        | Use                                             |
| ------------------------------- | ----------------------------------------------- |
| Center content horizontally     | `flex justify-center` or `text-center`          |
| Center content vertically       | `flex items-center` (min-height on parent)      |
| Make a card                     | `bg-white rounded-xl shadow-md p-6`             |
| Add hover effect                | `hover:bg-blue-600 transition`                  |
| 2-col mobile → 4-col desktop    | `grid grid-cols-2 md:grid-cols-4 gap-4`         |
| Full-height layout              | `min-h-screen flex flex-col`                    |
| Glassmorphism                   | `glass` component (+ utilities)                 |
| Dark mode                       | `dark` class on `<html>` + `dark:` variants     |
| Hide on mobile, show on desktop | `hidden md:block`                               |
| Truncate long text              | `truncate`                                      |
| Loading skeleton                | `skeleton-text` / `skeleton-circle`             |
| Sticky header                   | `sticky top-0 z-50`                             |
| Gradient text                   | `gradient-text`                                 |
| Gradient background             | `bg-gradient-to-br from-blue-500 to-purple-600` |
