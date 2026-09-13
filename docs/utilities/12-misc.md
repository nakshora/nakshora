---
title: Cursor, Whitespace & Misc Utilities
---

# Cursor, Whitespace & Misc Utilities

> Part of the [Nakshora Utilities Reference](../UTILITIES.md). These tables are **generated from the framework source** — what you see here is exactly what the compiler emits.

Cursors, white-space, floats, clearing, lists, resize and user-select.

## Cursors

**10 utilities**

| Class                | CSS                   | Description         |
| -------------------- | --------------------- | ------------------- |
| `cursor-default`     | `cursor: default`     | cursor: default     |
| `cursor-pointer`     | `cursor: pointer`     | cursor: pointer     |
| `cursor-wait`        | `cursor: wait`        | cursor: wait        |
| `cursor-text`        | `cursor: text`        | cursor: text        |
| `cursor-move`        | `cursor: move`        | cursor: move        |
| `cursor-help`        | `cursor: help`        | cursor: help        |
| `cursor-not-allowed` | `cursor: not-allowed` | cursor: not-allowed |
| `cursor-resize`      | `cursor: resize`      | cursor: resize      |
| `cursor-zoom-in`     | `cursor: zoom-in`     | cursor: zoom-in     |
| `cursor-zoom-out`    | `cursor: zoom-out`    | cursor: zoom-out    |

## Whitespace & Misc

**24 utilities**

| Class                 | CSS                                       | Description               |
| --------------------- | ----------------------------------------- | ------------------------- |
| `whitespace-normal`   | `whiteSpace: normal`                      | white-space: normal       |
| `whitespace-nowrap`   | `whiteSpace: nowrap`                      | white-space: nowrap       |
| `whitespace-pre`      | `whiteSpace: pre`                         | white-space: pre          |
| `whitespace-pre-line` | `whiteSpace: pre-line`                    | white-space: pre-line     |
| `whitespace-pre-wrap` | `whiteSpace: pre-wrap`                    | white-space: pre-wrap     |
| `break-spaces`        | `whiteSpace: break-spaces`                | white-space: break-spaces |
| `float-left`          | `float: left`                             | float: left               |
| `float-right`         | `float: right`                            | float: right              |
| `float-none`          | `float: none`                             | float: none               |
| `clear-left`          | `clear: left`                             | clear: left               |
| `clear-right`         | `clear: right`                            | clear: right              |
| `clear-both`          | `clear: both`                             | clear: both               |
| `list-none`           | `listStyleType: none`                     | list-style: none          |
| `list-disc`           | `listStyleType: disc`                     | list-style: disc          |
| `list-decimal`        | `listStyleType: decimal`                  | list-style: decimal       |
| `list-none`           | `list-style: none; list-style-type: none` | remove list styling       |
| `resize-none`         | `resize: none`                            | resize: none              |
| `resize-visible`      | `resize: visible`                         | resize: visible           |
| `resize-collapse`     | `resize: collapse`                        | resize: collapse          |
| `resize-hidden`       | `resize: hidden`                          | resize: hidden            |
| `resize-scroll`       | `resize: scroll`                          | resize: scroll            |
| `select-none`         | `userSelect: none`                        | user-select: none         |
| `select-text`         | `userSelect: text`                        | user-select: text         |
| `select-all`          | `userSelect: all`                         | user-select: all          |

---

## Responsive & state variants

Every utility above accepts a responsive prefix (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) and — in JIT mode — a state variant (`hover:`, `focus:`, `active:`, `disabled:`, `dark:`, `group-hover:`, `peer-focus:`, …). See [Variants](../VARIANTS.md) and [Responsive](../RESPONSIVE.md).
