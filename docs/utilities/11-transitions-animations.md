---
title: Transition & Animation Utilities
---

# Transition & Animation Utilities

> Part of the [Nakshora Utilities Reference](../UTILITIES.md). These tables are **generated from the framework source** — what you see here is exactly what the compiler emits.

Transition properties, durations, easings and built-in keyframe animations. All built-in keyframes: `spin` `ping` `pulse` `bounce` `fade` `slide` `shimmer`. In JIT mode, keyframes are emitted only for animations actually used.

## Transitions

**21 utilities**

| Class                  | CSS                                                                                                                                                                                                                                          | Description                                                        |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `transition`           | `transitionProperty: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; transitionTimingFunction: cubic-bezier(0.4, 0, 0.2, 1); transitionDuration: 150ms` | standard transition set                                            |
| `transition-all`       | `transitionProperty: all; transitionTimingFunction: cubic-bezier(0.4, 0, 0.2, 1); transitionDuration: 150ms`                                                                                                                                 | transition: all                                                    |
| `transition-none`      | `transitionProperty: none`                                                                                                                                                                                                                   | no transition                                                      |
| `transition-colors`    | `transitionProperty: color, background-color, border-color, text-decoration-color, fill, stroke; transitionTimingFunction: cubic-bezier(0.4, 0, 0.2, 1); transitionDuration: 150ms`                                                          | color transitions                                                  |
| `transition-opacity`   | `transitionProperty: opacity; transitionTimingFunction: cubic-bezier(0.4, 0, 0.2, 1); transitionDuration: 150ms`                                                                                                                             | opacity transitions                                                |
| `transition-shadow`    | `transitionProperty: box-shadow; transitionTimingFunction: cubic-bezier(0.4, 0, 0.2, 1); transitionDuration: 150ms`                                                                                                                          | box-shadow transitions                                             |
| `transition-transform` | `transitionProperty: transform; transitionTimingFunction: cubic-bezier(0.4, 0, 0.2, 1); transitionDuration: 150ms`                                                                                                                           | transform transitions                                              |
| `duration-0`           | `transitionDuration: 0ms`                                                                                                                                                                                                                    | transition-duration: 0ms                                           |
| `duration-75`          | `transitionDuration: 75ms`                                                                                                                                                                                                                   | transition-duration: 75ms                                          |
| `duration-100`         | `transitionDuration: 100ms`                                                                                                                                                                                                                  | transition-duration: 100ms                                         |
| `duration-150`         | `transitionDuration: 150ms`                                                                                                                                                                                                                  | transition-duration: 150ms                                         |
| `duration-200`         | `transitionDuration: 200ms`                                                                                                                                                                                                                  | transition-duration: 200ms                                         |
| `duration-300`         | `transitionDuration: 300ms`                                                                                                                                                                                                                  | transition-duration: 300ms                                         |
| `duration-500`         | `transitionDuration: 500ms`                                                                                                                                                                                                                  | transition-duration: 500ms                                         |
| `duration-700`         | `transitionDuration: 700ms`                                                                                                                                                                                                                  | transition-duration: 700ms                                         |
| `duration-1000`        | `transitionDuration: 1000ms`                                                                                                                                                                                                                 | transition-duration: 1000ms                                        |
| `ease-linear`          | `transition-timing-function: linear`                                                                                                                                                                                                         | transition-timing-function: linear                                 |
| `ease-in`              | `transition-timing-function: cubic-bezier(0.4, 0, 1, 1)`                                                                                                                                                                                     | transition-timing-function: cubic-bezier(0.4, 0, 1, 1)             |
| `ease-out`             | `transition-timing-function: cubic-bezier(0, 0, 0.2, 1)`                                                                                                                                                                                     | transition-timing-function: cubic-bezier(0, 0, 0.2, 1)             |
| `ease-in-out`          | `transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)`                                                                                                                                                                                   | transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)           |
| `ease-back`            | `transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55)`                                                                                                                                                                         | transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55) |

## Animations

**10 utilities**

| Class               | CSS                                                         | Description                                               |
| ------------------- | ----------------------------------------------------------- | --------------------------------------------------------- |
| `animate-spin`      | `animation: spin 1s linear infinite`                        | animation: spin 1s linear infinite                        |
| `animate-ping`      | `animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite`    | animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite    |
| `animate-pulse`     | `animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite` | animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite |
| `animate-bounce`    | `animation: bounce 1s infinite`                             | animation: bounce 1s infinite                             |
| `animate-fade`      | `animation: fade 300ms ease-out`                            | animation: fade 300ms ease-out                            |
| `animate-slide`     | `animation: slide 300ms ease-out`                           | animation: slide 300ms ease-out                           |
| `animate-shimmer`   | `animation: shimmer 1.5s linear infinite`                   | animation: shimmer 1.5s linear infinite                   |
| `animate-none`      | `animation: none`                                           | no animation                                              |
| `animation-paused`  | `animation-play-state: paused`                              | animation-play-state: paused                              |
| `animation-running` | `animation-play-state: running`                             | animation-play-state: running                             |

---

## Responsive & state variants

Every utility above accepts a responsive prefix (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) and — in JIT mode — a state variant (`hover:`, `focus:`, `active:`, `disabled:`, `dark:`, `group-hover:`, `peer-focus:`, …). See [Variants](../VARIANTS.md) and [Responsive](../RESPONSIVE.md).
