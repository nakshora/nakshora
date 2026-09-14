---
title: Transition & Animation Utilities
---

# Transition & Animation Utilities

> Part of the [Nakshora Utilities Reference](../UTILITIES.md). These tables are **generated from the framework source** — what you see here is exactly what the compiler emits.

Transition properties, durations, easings and built-in keyframe animations. All built-in keyframes: `spin` `ping` `pulse` `bounce` `fade` `slide` `shimmer`. In JIT mode, keyframes are emitted only for animations actually used.

## Transitions

**30 utilities**

| Class | CSS | Description |
| --- | --- | --- |
| `transition-none` | `transition-property: none` | transition-property: none |
| `transition-all` | `transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms` | transition-property: all |
| `transition` | `transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms` | transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter |
| `transition-colors` | `transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms` | transition-property: color, background-color, border-color, text-decoration-color, fill, stroke |
| `transition-opacity` | `transition-property: opacity; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms` | transition-property: opacity |
| `transition-shadow` | `transition-property: box-shadow; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms` | transition-property: box-shadow |
| `transition-transform` | `transition-property: transform; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms` | transition-property: transform |
| `delay-0` | `transition-delay: 0s` | transition-delay: 0s |
| `delay-75` | `transition-delay: 75ms` | transition-delay: 75ms |
| `delay-100` | `transition-delay: 100ms` | transition-delay: 100ms |
| `delay-150` | `transition-delay: 150ms` | transition-delay: 150ms |
| `delay-200` | `transition-delay: 200ms` | transition-delay: 200ms |
| `delay-300` | `transition-delay: 300ms` | transition-delay: 300ms |
| `delay-500` | `transition-delay: 500ms` | transition-delay: 500ms |
| `delay-700` | `transition-delay: 700ms` | transition-delay: 700ms |
| `delay-1000` | `transition-delay: 1000ms` | transition-delay: 1000ms |
| `duration-0` | `transition-duration: 0s` | transition-duration: 0s |
| `duration-75` | `transition-duration: 75ms` | transition-duration: 75ms |
| `duration-100` | `transition-duration: 100ms` | transition-duration: 100ms |
| `duration-150` | `transition-duration: 150ms` | transition-duration: 150ms |
| `duration-200` | `transition-duration: 200ms` | transition-duration: 200ms |
| `duration-300` | `transition-duration: 300ms` | transition-duration: 300ms |
| `duration-500` | `transition-duration: 500ms` | transition-duration: 500ms |
| `duration-700` | `transition-duration: 700ms` | transition-duration: 700ms |
| `duration-1000` | `transition-duration: 1000ms` | transition-duration: 1000ms |
| `ease-linear` | `transition-timing-function: linear` | transition-timing-function: linear |
| `ease-in` | `transition-timing-function: cubic-bezier(0.4, 0, 1, 1)` | transition-timing-function: cubic-bezier(0.4, 0, 1, 1) |
| `ease-out` | `transition-timing-function: cubic-bezier(0, 0, 0.2, 1)` | transition-timing-function: cubic-bezier(0, 0, 0.2, 1) |
| `ease-in-out` | `transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)` | transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) |
| `ease-back` | `transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55)` | transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55) |

## Animations

**10 utilities**

| Class | CSS | Description |
| --- | --- | --- |
| `animation-paused` | `animation-play-state: paused` | animation-play-state: paused |
| `animation-running` | `animation-play-state: running` | animation-play-state: running |
| `animate-none` | `animation: none` | animation: none |
| `animate-spin` | `animation: spin 1s linear infinite` | animation: spin 1s linear infinite |
| `animate-ping` | `animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite` | animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite |
| `animate-pulse` | `animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite` | animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite |
| `animate-bounce` | `animation: bounce 1s infinite` | animation: bounce 1s infinite |
| `animate-fade` | `animation: fade 300ms ease-out` | animation: fade 300ms ease-out |
| `animate-slide` | `animation: slide 300ms ease-out` | animation: slide 300ms ease-out |
| `animate-shimmer` | `animation: shimmer 1.5s linear infinite` | animation: shimmer 1.5s linear infinite |

---

## Responsive & state variants

Every utility above accepts a responsive prefix (`xxs:` … `5xl:`, `max-md:`, container `@md:`) and — in JIT mode — a state variant (`hover:`, `focus:`, `active:`, `disabled:`, `dark:`, `group-hover:`, `peer-focus:`, …). See [Variants](../VARIANTS.md) and [Responsive](../RESPONSIVE.md).
