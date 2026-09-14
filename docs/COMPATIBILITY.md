# Tailwind CSS compatibility

Nakshora's engine is a re-implementation of the Tailwind CSS **v3.4** utility
grammar with a handful of documented output-shape policies and a set of
extras. Nothing in this file is a claim: every section names the test that
enforces it, and every number was produced by running that test in this
repository against `tailwindcss@3.4.19` (`pnpm test`).

| Section | What                                      | Enforced by                                             |
| ------- | ----------------------------------------- | ------------------------------------------------------- |
| §1      | Measured parity                           | `core/test/compat/tailwind-differential.test.ts`        |
| §2      | Intentional output differences (policies) | same + `cascade-order.test.ts`, `css-validity.test.ts`  |
| §3      | Not supported (yet) — with reasons        | probe list in this file, `tailwind-differential`        |
| §4      | Nakshora extras Tailwind v3 does not have | `theme.test.ts`, `responsive.test.ts`, `generator.test` |
| §5      | Plugins, `@apply`, `theme()`, dark mode   | `plugins-differential.test.ts`, `apply-theme-darkmode`  |

## 1. Measured parity

The oracle compiles candidates through real `tailwindcss@3.4.19` (PostCSS,
`@tailwind base/components/utilities`, `@tailwindcss/container-queries`
enabled) and compares selector, at-rule nesting, declaration order and values
with the Nakshora engine — see `test/compat/oracle.ts`.

| Corpus                                                                     | Compared           | Identical                              | Different | Missing |
| -------------------------------------------------------------------------- | ------------------ | -------------------------------------- | --------- | ------- |
| every static class Tailwind's default theme knows                          | 11,343             | 11,343                                 | 0         | 0       |
| dynamic corpus (arbitrary values, modifiers, stacks)                       | 1,338              | 1,338 (after §2 normalisation)         | 0         | 0       |
| media-query stacks (`print:md:`, `motion-safe:lg:`…)                       | subset of above    | equivalent (one merged `@media`, §2.2) | 0         | 0       |
| `@tailwindcss/typography` / `forms` / `aspect-ratio` / `container-queries` | full plugin output | identical                              | 0         | 0       |
| cascade order of a 3,000-rule mixed stylesheet                             | 1 run              | identical after §2 normalisation       | —         | —       |

Candidates Tailwind **rejects** must be rejected by Nakshora as well; the only
exceptions are the §4 extras (`NAKSHORA_ONLY` in the differential test).

Validity: all 11,417 catalogued utilities, the full build with every screen
and state variant, and the dynamic corpus parse with `css-tree@3.1.0` with
zero syntax errors, unknown properties (apart from an allow-list of
properties newer than css-tree's data, e.g. `field-sizing`) or invalid
selectors — `css-validity.test.ts`.

## 2. Output-shape policies (intentional differences)

These are the **only** places where Nakshora's bytes differ from Tailwind's
for the same class. Each is normalised in the differential tests so any other
difference fails CI.

### 2.1 Colour declarations

Same as Tailwind 3.4: `--tw-bg-opacity: 1; background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1))`.
Legacy `bg-opacity-50` etc. are supported (deprecated) and set the variable.

### 2.2 Stacked media variants are combined

Tailwind nests: `@media print { @media (min-width: 768px) { … } }`.
Nakshora emits one query: `@media print and (min-width: 768px) { … }` —
media types first, then the largest `min-width`, the smallest `max-width`,
then remaining features in order of appearance. Arbitrary `[@media(…)]:`
wrappers are never rewritten. `combineMedia: false` restores nesting.
Tests: `responsive.test.ts` "combining and stacking", differential
"media-query stacks are equivalent".

### 2.3 `max-*` screens

Tailwind: `@media not all and (min-width: 768px)`. Nakshora:
`@media (max-width: 767.98px)`. Same match set on every real device;
`(max-width)` is what authors expect to read. `maxWidthValue()` is exported.

### 2.4 Tailwind quirks reproduced on purpose

`border-[3]` → `border-color: 3`, `text-[1.5]` → `color: 1.5`,
`font-[Open_Sans]` → `font-weight: Open Sans`, `outline-[3]` →
`outline-width: 3`. They are invalid CSS in both frameworks; Nakshora keeps
them so output stays identical (allow-listed in `css-validity.test.ts`).

### 2.5 `.container`

Same output as Tailwind for `sm`–`2xl`. Nakshora's extra screens (§4) do
**not** add `max-width: 200px` / `5000px` caps unless
`theme.container.minScreen/maxScreen` opt in.

### 2.6 Full build vs JIT

The pre-built full bundle wraps utilities in the five classic screens only
(`generate({ mode: 'full', screens: 'all' })` opts in); JIT supports all
screens and every variant. Component blocks from the design system are emitted
by JIT only when their class appears.

### 2.7 Cascade order

Identical to Tailwind's `Offsets` comparator for every candidate in the
corpus after §2.2/§2.3 normalisation, with two documented exceptions:
`@keyframes` are emitted once (Tailwind repeats them per variant wrapper)
and stacks of the **same** screen family (`lg:xl:`) sort by their outermost
screen (Tailwind's comparator is inconsistent for those; see
`cascade-order.test.ts`).

### 2.8 Dark mode selector

`darkMode: 'class'` emits `:is(.dark *)` (Tailwind 3.4.1+ form),
`'media'` → `@media (prefers-color-scheme: dark)`,
`['selector', '[data-theme=dark]']` / `['class', '.x']` / `['variant', …]`
as in Tailwind — `apply-theme-darkmode.test.ts`.

## 3. Not supported

Everything below was probed on this build (`node -e` against
`packages/@nakshora/core/dist`, JIT compile of the class; "missing" means no
CSS is emitted). Tailwind **v3.4** does not have these either — they are
**v4-only** grammar and therefore out of the v3 parity target. Listed so that
nobody mistakes silence for support.

| Class / variant                                                              | Status  | Reason                                                                            |
| ---------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------- |
| `group/x:` (bare named group as variant)                                     | missing | v3 has no bare `group/name:` variant — use `group-hover/x:` (supported)           |
| `in-*:` (`in-focus:`)                                                        | missing | v4 variant                                                                        |
| `nth-*:`, `nth-last-of-type-*:`                                              | missing | v4 variants; `first:`/`last:`/`odd:`/`even:`/`only:` and `[&:nth-child(3)]:` work |
| `**:` (descendant)                                                           | missing | v4 variant; `*:` (direct children) works                                          |
| `inset-shadow-*`, `inset-ring*`                                              | missing | v4 utilities                                                                      |
| `mask-*` (`mask-radial`, `mask-linear-*`)                                    | missing | v4 utilities; `[mask-type:…]` arbitrary properties work                           |
| `bg-linear-*`, `bg-conic-*`, `bg-radial-*`                                   | missing | v4 gradient grammar; `bg-gradient-to-*` + `from/via/to` work                      |
| `rotate-x-*`, `rotate-y-*`, `translate-z-*`, `perspective-*`, `transform-3d` | missing | v4 3D transforms                                                                  |
| `text-shadow-*`                                                              | missing | v4 utility                                                                        |
| `wrap-break-word`, `wrap-anywhere`                                           | missing | v4 names; `break-words`, `break-all` work                                         |
| `container-normal` / `container-size`                                        | missing | v4 names; `@container` and `@container/name` work                                 |
| v4 `@theme {}` / `@utility` / `@custom-variant` directives                   | missing | Tailwind v4 config-in-CSS — see Phase D P2 (not started)                          |
| Tailwind v3 `safelist` `{ pattern: /…/, variants: […] }` object form         | partial | strings and RegExp are supported; per-pattern `variants` lists are not            |

Tailwind v3 features that **are** supported and often assumed missing:
`size-*`, `text-balance`/`text-pretty`, `has-[…]:`, `group-has-*`,
`peer-has-*`, `supports-[…]:`, `aria-*`/`data-*` (named + arbitrary),
`forced-colors:`, `*:`, `@container`/`@md:`, `[--x:1]` and
`[prop:value]` arbitrary properties, `!` important (both `!p-4` and `p-4!`),
`theme()` in arbitrary values, opacity modifiers everywhere.

## 4. Nakshora extras (not in Tailwind v3.4)

| Area       | Extra                                                                                                                                                    |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Screens    | `xxs` 200, `xs` 400, `3xl` 1920, `4xl` 2560, `5xl` 5000 (+ `max-*` for each); `theme.breakpoints` merge                                                  |
| Variants   | `not-*` (`not-hover:`), `starting:` (`@starting-style`), `inert:`, `@min-*` / `@max-*` container variants, `min-[…]:` / `max-[…]:` arbitrary screens     |
| Utilities  | `animation-paused` / `animation-running`, `break-spaces`, `font-stretch-*`, `field-sizing-*`, `scheme-*`                                                 |
| Theme      | `animation` fade/slide/shimmer, `borderRadius.xs`, `boxShadow.glow`, `maxWidth.screen-*`, `rotate` 135–360, `scale` 175/200, `zIndex.hide`, `containers` |
| Components | design-system component layer (`neon-btn`, `glass-card`, …) — `corePlugins.components: false` removes them; user `addComponents` are never affected      |
| Config     | `theme.breakpoints`, `theme.container.minScreen/maxScreen`, `variants.maxResponsive`, `combineMedia`, `presets` in Nakshora preset form                  |

`theme.test.ts` fails if a default-theme key appears that is neither in
Tailwind's default theme nor in this extras list.

## 5. `@apply`, `theme()`, dark mode, plugins

- `@apply` (variants, `!important`, cascade-ordered expansion, sibling variant
  rules, adjacent-rule collapsing, `group`/`peer` rejection, circular
  detection, nested-at-rule rejection) — byte-identical to Tailwind on the
  corpus in `apply-theme-darkmode.test.ts`; wired into `nakshora build
<input>`, `@nakshora/postcss` (default on, `apply: false` opts out) and the
  Vite plugin.
- `theme()` supports every path form Tailwind accepts (`colors.red.500`,
  `'spacing.4'`, `spacing[2.5]`, `colors.red.500 / 50%`, default values);
  `theme('spacing.2\\.5')` is rejected by Tailwind too and is not a target.
- Plugin adapter: `plugins` accepts Nakshora plugins, plain functions, Tailwind
  `plugin()` objects and uncalled `plugin.withOptions()`; `addUtilities`,
  `addComponents`, `addBase`, `addVariant`, `matchUtilities`,
  `matchComponents`, `matchVariant`, `theme()`, `config()`, `e()`,
  `corePlugins()` and `postcss` are implemented. CSS-in-JS nesting follows
  `postcss-nested`; numeric values get `px` unless unitless.
  Typography, forms, aspect-ratio and container-queries produce identical CSS.

## Versions used for every number above

`tailwindcss@3.4.19`, `postcss@8.4.49`, `css-tree@3.1.0`,
`@tailwindcss/typography@0.5.16`, `@tailwindcss/forms@0.5.10`,
`@tailwindcss/aspect-ratio@0.4.2`, `@tailwindcss/container-queries@0.1.1`,
container-query ordering cross-checked against `tailwindcss@4.3.3`.
Node 22.
