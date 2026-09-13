---
title: Flexbox & Grid Utilities
---

# Flexbox & Grid Utilities

> Part of the [Nakshora Utilities Reference](../UTILITIES.md). These tables are **generated from the framework source** — what you see here is exactly what the compiler emits.

Everything you need for one-dimensional (Flexbox) and two-dimensional (CSS Grid) layouts.

## Flexbox

**50 utilities**

| Class               | CSS                              | Description                    |
| ------------------- | -------------------------------- | ------------------------------ |
| `flex-row`          | `flex-direction: row`            | flex-direction: row            |
| `flex-row-reverse`  | `flex-direction: row-reverse`    | flex-direction: row-reverse    |
| `flex-col`          | `flex-direction: col`            | flex-direction: col            |
| `flex-col-reverse`  | `flex-direction: col-reverse`    | flex-direction: col-reverse    |
| `flex-wrap`         | `flex-wrap: wrap`                | flex-wrap: wrap                |
| `flex-nowrap`       | `flex-wrap: nowrap`              | flex-wrap: nowrap              |
| `flex-wrap-reverse` | `flex-wrap: wrap-reverse`        | flex-wrap: wrap-reverse        |
| `justify-start`     | `justify-content: flex-start`    | justify-content: flex-start    |
| `justify-center`    | `justify-content: space-center`  | justify-content: space-center  |
| `justify-end`       | `justify-content: flex-end`      | justify-content: flex-end      |
| `justify-between`   | `justify-content: space-between` | justify-content: space-between |
| `justify-around`    | `justify-content: space-around`  | justify-content: space-around  |
| `justify-evenly`    | `justify-content: space-evenly`  | justify-content: space-evenly  |
| `items-start`       | `align-items: flex-start`        | align-items                    |
| `items-center`      | `align-items: center`            | align-items                    |
| `items-end`         | `align-items: flex-end`          | align-items                    |
| `items-stretch`     | `align-items: stretch`           | align-items                    |
| `items-baseline`    | `align-items: baseline`          | align-items                    |
| `content-start`     | `align-content: flex-start`      | align-content                  |
| `content-center`    | `align-content: center`          | align-content                  |
| `content-end`       | `align-content: flex-end`        | align-content                  |
| `content-between`   | `align-content: space-between`   | align-content                  |
| `content-around`    | `align-content: space-around`    | align-content                  |
| `content-stretch`   | `align-content: stretch`         | align-content                  |
| `self-auto`         | `align-self: auto`               | align-self                     |
| `self-start`        | `align-self: flex-start`         | align-self                     |
| `self-center`       | `align-self: center`             | align-self                     |
| `self-end`          | `align-self: flex-end`           | align-self                     |
| `self-stretch`      | `align-self: stretch`            | align-self                     |
| `flex-1`            | `flex: 1 1 0%`                   | flex: 1 1 0%                   |
| `flex-auto`         | `flex: 1 1 auto`                 | flex: 1 1 auto                 |
| `flex-initial`      | `flex: 0 1 auto`                 | flex: 0 1 auto                 |
| `flex-none`         | `flex: none`                     | flex: none                     |
| `grow`              | `flex-grow: 1`                   | flex-grow: 1                   |
| `grow-0`            | `flex-grow: 0`                   | flex-grow: 0                   |
| `shrink`            | `flex-shrink: 1`                 | flex-shrink: 1                 |
| `shrink-0`          | `flex-shrink: 0`                 | flex-shrink: 0                 |
| `order--6`          | `order: -6`                      | order: -6                      |
| `order--5`          | `order: -5`                      | order: -5                      |
| `order--4`          | `order: -4`                      | order: -4                      |
| `order--3`          | `order: -3`                      | order: -3                      |
| `order--2`          | `order: -2`                      | order: -2                      |
| `order--1`          | `order: -1`                      | order: -1                      |
| `order-0`           | `order: 0`                       | order: 0                       |
| `order-1`           | `order: 1`                       | order: 1                       |
| `order-2`           | `order: 2`                       | order: 2                       |
| `order-3`           | `order: 3`                       | order: 3                       |
| `order-4`           | `order: 4`                       | order: 4                       |
| `order-5`           | `order: 5`                       | order: 5                       |
| `order-6`           | `order: 6`                       | order: 6                       |

## Grid

**53 utilities**

| Class                 | CSS                                                 | Description               |
| --------------------- | --------------------------------------------------- | ------------------------- |
| `grid-cols-1`         | `grid-template-columns: repeat(1, minmax(0, 1fr))`  | 1 equal columns           |
| `col-span-1`          | `grid-column: span 1 / span 1`                      | span 1 columns            |
| `grid-cols-2`         | `grid-template-columns: repeat(2, minmax(0, 1fr))`  | 2 equal columns           |
| `col-span-2`          | `grid-column: span 2 / span 2`                      | span 2 columns            |
| `grid-cols-3`         | `grid-template-columns: repeat(3, minmax(0, 1fr))`  | 3 equal columns           |
| `col-span-3`          | `grid-column: span 3 / span 3`                      | span 3 columns            |
| `grid-cols-4`         | `grid-template-columns: repeat(4, minmax(0, 1fr))`  | 4 equal columns           |
| `col-span-4`          | `grid-column: span 4 / span 4`                      | span 4 columns            |
| `grid-cols-5`         | `grid-template-columns: repeat(5, minmax(0, 1fr))`  | 5 equal columns           |
| `col-span-5`          | `grid-column: span 5 / span 5`                      | span 5 columns            |
| `grid-cols-6`         | `grid-template-columns: repeat(6, minmax(0, 1fr))`  | 6 equal columns           |
| `col-span-6`          | `grid-column: span 6 / span 6`                      | span 6 columns            |
| `grid-cols-7`         | `grid-template-columns: repeat(7, minmax(0, 1fr))`  | 7 equal columns           |
| `col-span-7`          | `grid-column: span 7 / span 7`                      | span 7 columns            |
| `grid-cols-8`         | `grid-template-columns: repeat(8, minmax(0, 1fr))`  | 8 equal columns           |
| `col-span-8`          | `grid-column: span 8 / span 8`                      | span 8 columns            |
| `grid-cols-9`         | `grid-template-columns: repeat(9, minmax(0, 1fr))`  | 9 equal columns           |
| `col-span-9`          | `grid-column: span 9 / span 9`                      | span 9 columns            |
| `grid-cols-10`        | `grid-template-columns: repeat(10, minmax(0, 1fr))` | 10 equal columns          |
| `col-span-10`         | `grid-column: span 10 / span 10`                    | span 10 columns           |
| `grid-cols-11`        | `grid-template-columns: repeat(11, minmax(0, 1fr))` | 11 equal columns          |
| `col-span-11`         | `grid-column: span 11 / span 11`                    | span 11 columns           |
| `grid-cols-12`        | `grid-template-columns: repeat(12, minmax(0, 1fr))` | 12 equal columns          |
| `col-span-12`         | `grid-column: span 12 / span 12`                    | span 12 columns           |
| `col-span-full`       | `grid-column: 1 / -1`                               | span all columns          |
| `grid-rows-1`         | `grid-template-rows: repeat(1, minmax(0, 1fr))`     | 1 equal rows              |
| `row-span-1`          | `grid-row: span 1 / span 1`                         | span 1 rows               |
| `grid-rows-2`         | `grid-template-rows: repeat(2, minmax(0, 1fr))`     | 2 equal rows              |
| `row-span-2`          | `grid-row: span 2 / span 2`                         | span 2 rows               |
| `grid-rows-3`         | `grid-template-rows: repeat(3, minmax(0, 1fr))`     | 3 equal rows              |
| `row-span-3`          | `grid-row: span 3 / span 3`                         | span 3 rows               |
| `grid-rows-4`         | `grid-template-rows: repeat(4, minmax(0, 1fr))`     | 4 equal rows              |
| `row-span-4`          | `grid-row: span 4 / span 4`                         | span 4 rows               |
| `grid-rows-5`         | `grid-template-rows: repeat(5, minmax(0, 1fr))`     | 5 equal rows              |
| `row-span-5`          | `grid-row: span 5 / span 5`                         | span 5 rows               |
| `grid-rows-6`         | `grid-template-rows: repeat(6, minmax(0, 1fr))`     | 6 equal rows              |
| `row-span-6`          | `grid-row: span 6 / span 6`                         | span 6 rows               |
| `row-span-full`       | `grid-row: 1 / -1`                                  | span all rows             |
| `col-start-1`         | `grid-column-start: 1`                              | column start 1            |
| `col-end-1`           | `grid-column-end: 1`                                | column end 1              |
| `grid-flow-row`       | `grid-auto-flow: row`                               | grid-auto-flow: row       |
| `grid-flow-col`       | `grid-auto-flow: col`                               | grid-auto-flow: col       |
| `grid-flow-row-dense` | `grid-auto-flow: row-dense`                         | grid-auto-flow: row-dense |
| `grid-flow-col-dense` | `grid-auto-flow: col-dense`                         | grid-auto-flow: col-dense |
| `grid-flow-dense`     | `grid-auto-flow: dense`                             | grid-auto-flow: dense     |
| `auto-cols-auto`      | `grid-auto-columns: auto`                           | grid-auto-columns: auto   |
| `auto-rows-auto`      | `grid-auto-rows: auto`                              | grid-auto-rows: auto      |
| `auto-cols-min`       | `grid-auto-columns: min`                            | grid-auto-columns: min    |
| `auto-rows-min`       | `grid-auto-rows: min`                               | grid-auto-rows: min       |
| `auto-cols-max`       | `grid-auto-columns: max`                            | grid-auto-columns: max    |
| `auto-rows-max`       | `grid-auto-rows: max`                               | grid-auto-rows: max       |
| `auto-cols-fr`        | `grid-auto-columns: fr`                             | grid-auto-columns: fr     |
| `auto-rows-fr`        | `grid-auto-rows: fr`                                | grid-auto-rows: fr        |

---

## Responsive & state variants

Every utility above accepts a responsive prefix (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) and — in JIT mode — a state variant (`hover:`, `focus:`, `active:`, `disabled:`, `dark:`, `group-hover:`, `peer-focus:`, …). See [Variants](../VARIANTS.md) and [Responsive](../RESPONSIVE.md).
