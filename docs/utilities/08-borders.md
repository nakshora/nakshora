---
title: Border Utilities
---

# Border Utilities

> Part of the [Nakshora Utilities Reference](../UTILITIES.md). These tables are **generated from the framework source** — what you see here is exactly what the compiler emits.

Border width, style and radius (including per-corner radius).

## Borders

**16 utilities**

| Class           | CSS                                               | Description                  |
| --------------- | ------------------------------------------------- | ---------------------------- |
| `border`        | `border: 1px solid`                               | 1px solid border (all sides) |
| `border-0`      | `border: 0 solid`                                 | no border                    |
| `border-2`      | `border: 2px solid`                               | 2px solid border             |
| `border-4`      | `border: 4px solid`                               | 4px solid border             |
| `border-8`      | `border: 8px solid`                               | 8px solid border             |
| `border-t`      | `border-t-width: 1px; border-t-style: solid`      | t border                     |
| `border-r`      | `border-r-width: 1px; border-r-style: solid`      | r border                     |
| `border-b`      | `border-b-width: 1px; border-b-style: solid`      | b border                     |
| `border-l`      | `border-l-width: 1px; border-l-style: solid`      | l border                     |
| `border-x`      | `border-left: 1px solid; border-right: 1px solid` | left+right border            |
| `border-y`      | `border-top: 1px solid; border-bottom: 1px solid` | top+bottom border            |
| `border-solid`  | `border-style: solid`                             | border-style: solid          |
| `border-dashed` | `border-style: dashed`                            | border-style: dashed         |
| `border-dotted` | `border-style: dotted`                            | border-style: dotted         |
| `border-double` | `border-style: double`                            | border-style: double         |
| `border-none`   | `border-style: none`                              | border-style: none           |

## Border Radius

**90 utilities**

| Class             | CSS                                    | Description                |
| ----------------- | -------------------------------------- | -------------------------- |
| `rounded`         | `border-radius: 0.25rem`               | border-radius: 0.25rem     |
| `rounded-none`    | `border-radius: 0`                     | border-radius: 0           |
| `rounded-xs`      | `border-radius: 0.125rem`              | border-radius: 0.125rem    |
| `rounded-sm`      | `border-radius: 0.25rem`               | border-radius: 0.25rem     |
| `rounded-md`      | `border-radius: 0.375rem`              | border-radius: 0.375rem    |
| `rounded-lg`      | `border-radius: 0.5rem`                | border-radius: 0.5rem      |
| `rounded-xl`      | `border-radius: 0.75rem`               | border-radius: 0.75rem     |
| `rounded-2xl`     | `border-radius: 1rem`                  | border-radius: 1rem        |
| `rounded-3xl`     | `border-radius: 1.5rem`                | border-radius: 1.5rem      |
| `rounded-full`    | `border-radius: 9999px`                | border-radius: 9999px      |
| `rounded-t`       | `border-top-left-radius: 0.25rem`      | t corner radius            |
| `rounded-t-none`  | `border-top-left-radius: 0`            | t corner radius: 0         |
| `rounded-t-xs`    | `border-top-left-radius: 0.125rem`     | t corner radius: 0.125rem  |
| `rounded-t-sm`    | `border-top-left-radius: 0.25rem`      | t corner radius: 0.25rem   |
| `rounded-t-md`    | `border-top-left-radius: 0.375rem`     | t corner radius: 0.375rem  |
| `rounded-t-lg`    | `border-top-left-radius: 0.5rem`       | t corner radius: 0.5rem    |
| `rounded-t-xl`    | `border-top-left-radius: 0.75rem`      | t corner radius: 0.75rem   |
| `rounded-t-2xl`   | `border-top-left-radius: 1rem`         | t corner radius: 1rem      |
| `rounded-t-3xl`   | `border-top-left-radius: 1.5rem`       | t corner radius: 1.5rem    |
| `rounded-t-full`  | `border-top-left-radius: 9999px`       | t corner radius: 9999px    |
| `rounded-r`       | `border-top-right-radius: 0.25rem`     | r corner radius            |
| `rounded-r-none`  | `border-top-right-radius: 0`           | r corner radius: 0         |
| `rounded-r-xs`    | `border-top-right-radius: 0.125rem`    | r corner radius: 0.125rem  |
| `rounded-r-sm`    | `border-top-right-radius: 0.25rem`     | r corner radius: 0.25rem   |
| `rounded-r-md`    | `border-top-right-radius: 0.375rem`    | r corner radius: 0.375rem  |
| `rounded-r-lg`    | `border-top-right-radius: 0.5rem`      | r corner radius: 0.5rem    |
| `rounded-r-xl`    | `border-top-right-radius: 0.75rem`     | r corner radius: 0.75rem   |
| `rounded-r-2xl`   | `border-top-right-radius: 1rem`        | r corner radius: 1rem      |
| `rounded-r-3xl`   | `border-top-right-radius: 1.5rem`      | r corner radius: 1.5rem    |
| `rounded-r-full`  | `border-top-right-radius: 9999px`      | r corner radius: 9999px    |
| `rounded-b`       | `border-bottom-right-radius: 0.25rem`  | b corner radius            |
| `rounded-b-none`  | `border-bottom-right-radius: 0`        | b corner radius: 0         |
| `rounded-b-xs`    | `border-bottom-right-radius: 0.125rem` | b corner radius: 0.125rem  |
| `rounded-b-sm`    | `border-bottom-right-radius: 0.25rem`  | b corner radius: 0.25rem   |
| `rounded-b-md`    | `border-bottom-right-radius: 0.375rem` | b corner radius: 0.375rem  |
| `rounded-b-lg`    | `border-bottom-right-radius: 0.5rem`   | b corner radius: 0.5rem    |
| `rounded-b-xl`    | `border-bottom-right-radius: 0.75rem`  | b corner radius: 0.75rem   |
| `rounded-b-2xl`   | `border-bottom-right-radius: 1rem`     | b corner radius: 1rem      |
| `rounded-b-3xl`   | `border-bottom-right-radius: 1.5rem`   | b corner radius: 1.5rem    |
| `rounded-b-full`  | `border-bottom-right-radius: 9999px`   | b corner radius: 9999px    |
| `rounded-l`       | `border-bottom-left-radius: 0.25rem`   | l corner radius            |
| `rounded-l-none`  | `border-bottom-left-radius: 0`         | l corner radius: 0         |
| `rounded-l-xs`    | `border-bottom-left-radius: 0.125rem`  | l corner radius: 0.125rem  |
| `rounded-l-sm`    | `border-bottom-left-radius: 0.25rem`   | l corner radius: 0.25rem   |
| `rounded-l-md`    | `border-bottom-left-radius: 0.375rem`  | l corner radius: 0.375rem  |
| `rounded-l-lg`    | `border-bottom-left-radius: 0.5rem`    | l corner radius: 0.5rem    |
| `rounded-l-xl`    | `border-bottom-left-radius: 0.75rem`   | l corner radius: 0.75rem   |
| `rounded-l-2xl`   | `border-bottom-left-radius: 1rem`      | l corner radius: 1rem      |
| `rounded-l-3xl`   | `border-bottom-left-radius: 1.5rem`    | l corner radius: 1.5rem    |
| `rounded-l-full`  | `border-bottom-left-radius: 9999px`    | l corner radius: 9999px    |
| `rounded-tl`      | `border-top-left-radius: 0.25rem`      | tl corner radius           |
| `rounded-tl-none` | `border-top-left-radius: 0`            | tl corner radius: 0        |
| `rounded-tl-xs`   | `border-top-left-radius: 0.125rem`     | tl corner radius: 0.125rem |
| `rounded-tl-sm`   | `border-top-left-radius: 0.25rem`      | tl corner radius: 0.25rem  |
| `rounded-tl-md`   | `border-top-left-radius: 0.375rem`     | tl corner radius: 0.375rem |
| `rounded-tl-lg`   | `border-top-left-radius: 0.5rem`       | tl corner radius: 0.5rem   |
| `rounded-tl-xl`   | `border-top-left-radius: 0.75rem`      | tl corner radius: 0.75rem  |
| `rounded-tl-2xl`  | `border-top-left-radius: 1rem`         | tl corner radius: 1rem     |
| `rounded-tl-3xl`  | `border-top-left-radius: 1.5rem`       | tl corner radius: 1.5rem   |
| `rounded-tl-full` | `border-top-left-radius: 9999px`       | tl corner radius: 9999px   |
| `rounded-tr`      | `border-top-right-radius: 0.25rem`     | tr corner radius           |
| `rounded-tr-none` | `border-top-right-radius: 0`           | tr corner radius: 0        |
| `rounded-tr-xs`   | `border-top-right-radius: 0.125rem`    | tr corner radius: 0.125rem |
| `rounded-tr-sm`   | `border-top-right-radius: 0.25rem`     | tr corner radius: 0.25rem  |
| `rounded-tr-md`   | `border-top-right-radius: 0.375rem`    | tr corner radius: 0.375rem |
| `rounded-tr-lg`   | `border-top-right-radius: 0.5rem`      | tr corner radius: 0.5rem   |
| `rounded-tr-xl`   | `border-top-right-radius: 0.75rem`     | tr corner radius: 0.75rem  |
| `rounded-tr-2xl`  | `border-top-right-radius: 1rem`        | tr corner radius: 1rem     |
| `rounded-tr-3xl`  | `border-top-right-radius: 1.5rem`      | tr corner radius: 1.5rem   |
| `rounded-tr-full` | `border-top-right-radius: 9999px`      | tr corner radius: 9999px   |
| `rounded-bl`      | `border-bottom-left-radius: 0.25rem`   | bl corner radius           |
| `rounded-bl-none` | `border-bottom-left-radius: 0`         | bl corner radius: 0        |
| `rounded-bl-xs`   | `border-bottom-left-radius: 0.125rem`  | bl corner radius: 0.125rem |
| `rounded-bl-sm`   | `border-bottom-left-radius: 0.25rem`   | bl corner radius: 0.25rem  |
| `rounded-bl-md`   | `border-bottom-left-radius: 0.375rem`  | bl corner radius: 0.375rem |
| `rounded-bl-lg`   | `border-bottom-left-radius: 0.5rem`    | bl corner radius: 0.5rem   |
| `rounded-bl-xl`   | `border-bottom-left-radius: 0.75rem`   | bl corner radius: 0.75rem  |
| `rounded-bl-2xl`  | `border-bottom-left-radius: 1rem`      | bl corner radius: 1rem     |
| `rounded-bl-3xl`  | `border-bottom-left-radius: 1.5rem`    | bl corner radius: 1.5rem   |
| `rounded-bl-full` | `border-bottom-left-radius: 9999px`    | bl corner radius: 9999px   |
| `rounded-br`      | `border-bottom-right-radius: 0.25rem`  | br corner radius           |
| `rounded-br-none` | `border-bottom-right-radius: 0`        | br corner radius: 0        |
| `rounded-br-xs`   | `border-bottom-right-radius: 0.125rem` | br corner radius: 0.125rem |
| `rounded-br-sm`   | `border-bottom-right-radius: 0.25rem`  | br corner radius: 0.25rem  |
| `rounded-br-md`   | `border-bottom-right-radius: 0.375rem` | br corner radius: 0.375rem |
| `rounded-br-lg`   | `border-bottom-right-radius: 0.5rem`   | br corner radius: 0.5rem   |
| `rounded-br-xl`   | `border-bottom-right-radius: 0.75rem`  | br corner radius: 0.75rem  |
| `rounded-br-2xl`  | `border-bottom-right-radius: 1rem`     | br corner radius: 1rem     |
| `rounded-br-3xl`  | `border-bottom-right-radius: 1.5rem`   | br corner radius: 1.5rem   |
| `rounded-br-full` | `border-bottom-right-radius: 9999px`   | br corner radius: 9999px   |

---

## Responsive & state variants

Every utility above accepts a responsive prefix (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) and — in JIT mode — a state variant (`hover:`, `focus:`, `active:`, `disabled:`, `dark:`, `group-hover:`, `peer-focus:`, …). See [Variants](../VARIANTS.md) and [Responsive](../RESPONSIVE.md).
