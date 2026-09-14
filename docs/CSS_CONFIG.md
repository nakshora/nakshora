# CSS-first configuration (`@theme`, `@utility`, `@custom-variant`)

Tailwind v4 moved configuration into the stylesheet. Nakshora accepts the
same three directives **in addition to** `nakshora.config.*` — the blocks
are turned into `theme.extend` entries and a plugin, then removed from the
output. Works in the CLI (`nakshora build app.css`), the PostCSS plugin and
therefore Vite. Everything on this page is pinned by
`core/test/css-config.test.ts`, `postcss/test/plugin.test.ts` and
`cli/test/commands.test.ts`.

```css
/* app.css */
@theme {
  --color-brand-500: #123456;
  --color-brand-600: #0f2d4a;
  --breakpoint-3xl: 120rem;
  --font-display: 'Inter', sans-serif;
  --text-huge: 4rem;
  --text-huge--line-height: 1;
  --spacing-18: 4.5rem;
  --radius-pill: 9999px;
  --shadow-glow: 0 0 20px var(--color-brand-500);
  --animate-wiggle: wiggle 1s ease-in-out infinite;
  @keyframes wiggle {
    0%,
    100% {
      transform: rotate(-3deg);
    }
    50% {
      transform: rotate(3deg);
    }
  }
}

@utility content-auto {
  content-visibility: auto;
}
@utility tab-* {
  tab-size: --value(--tab-size-*, integer, [integer]);
}
@utility scrollbar-hidden {
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
}

@custom-variant hocus (&:hover, &:focus);
@custom-variant theme-midnight (&:where([data-theme='midnight'] *));
@custom-variant any-hover {
  @media (any-hover: hover) {
    @slot;
  }
}

@nakshora source;
.btn {
  @apply p-18 rounded-pill hocus:content-auto;
}
```

`<a class="bg-brand-500 3xl:flex text-huge p-18 shadow-glow animate-wiggle tab-4 tab-[3] hocus:flex any-hover:underline">`
compiles (JIT) to:

```css
:root {
  --color-brand-500: #123456;
  --color-brand-600: #0f2d4a;
  --breakpoint-3xl: 120rem;
  … every @theme variable, as authored …
}
.animate-wiggle { animation: wiggle 1s ease-in-out infinite; }
.bg-brand-500 { --tw-bg-opacity: 1; background-color: rgb(18 52 86 / var(--tw-bg-opacity, 1)); }
.p-18 { padding: 4.5rem; }
.text-huge { font-size: 4rem; line-height: 1; }
.shadow-glow { --tw-shadow: 0 0 20px #123456; … }
.tab-4 { tab-size: 4; }
.tab-\[3\] { tab-size: 3; }
.hocus\:flex:hover { display: flex; }
.hocus\:flex:focus { display: flex; }
@media (any-hover: hover) { .any-hover\:underline { text-decoration-line: underline; } }
@media (min-width: 120rem) { .\33xl\:flex { display: flex; } }
.btn { padding: 4.5rem; border-radius: 9999px; }
.btn:hover { content-visibility: auto; }
.btn:focus { content-visibility: auto; }
```

## `@theme`

| Namespace         | Theme key                  | Utilities                                                                 |
| ----------------- | -------------------------- | ------------------------------------------------------------------------- |
| `--color-*`       | `colors`                   | `bg-*`, `text-*`, `border-*`, …                                           |
| `--font-*`        | `fontFamily`               | `font-*`                                                                  |
| `--text-*`        | `fontSize`                 | `text-*` (+ `--text-x--line-height`, `--letter-spacing`, `--font-weight`) |
| `--font-weight-*` | `fontWeight`               | `font-*`                                                                  |
| `--tracking-*`    | `letterSpacing`            | `tracking-*`                                                              |
| `--leading-*`     | `lineHeight`               | `leading-*`                                                               |
| `--breakpoint-*`  | `screens` (extend)         | `3xl:` …                                                                  |
| `--container-*`   | `containers`               | `@wide:` …                                                                |
| `--spacing-*`     | `spacing`                  | `p-*`, `m-*`, `w-*`, `gap-*`, …                                           |
| `--radius-*`      | `borderRadius`             | `rounded-*`                                                               |
| `--shadow-*`      | `boxShadow`                | `shadow-*`                                                                |
| `--drop-shadow-*` | `dropShadow`               | `drop-shadow-*`                                                           |
| `--blur-*`        | `blur`                     | `blur-*`                                                                  |
| `--aspect-*`      | `aspectRatio`              | `aspect-*`                                                                |
| `--ease-*`        | `transitionTimingFunction` | `ease-*`                                                                  |
| `--animate-*`     | `animation`                | `animate-*` (+ nested `@keyframes`)                                       |

- `--color-brand-500` / `-600` build a palette (`bg-brand-500/50` works);
  `--color-mint` is a single colour.
- `var(--other-theme-var)` inside a value is resolved for the utility
  (`shadow-glow` gets `#123456`) while the `:root` copy stays as authored.
- **Every** variable is also emitted as a `:root` custom property (Tailwind
  semantics), including ones with no namespace (`--my-token`) — those produce
  a warning (`nakshora doctor` / PostCSS `result.warn`) and nothing else.
- `@theme reference { … }` adds theme values without emitting variables;
  `inline` / `static` are accepted and behave like plain `@theme`.
- `--perspective-*`, `--inset-shadow-*` map to v4-only utilities → variable
  only, with a warning.

**Not supported** (warned, never silent): `--color-*: initial` namespace
resets — use `theme.colors` in `nakshora.config.*` to replace a scale;
`@source` (use `content`), `@variant` inside rules, `@plugin`, `@config`.

## `@utility`

- `@utility name { … }` → `addUtilities` (static, all variants, in the
  catalog / IntelliSense).
- `@utility name-* { prop: --value(…); }` → `matchUtilities`. `--value()`
  arguments: `--namespace-*` (theme keys, e.g. `--tab-size-*` or
  `--spacing-*`), a bare type (`integer`, `number`, `percentage`), and
  `[type]` / `[*]` for arbitrary values. Bare integers are a Nakshora
  extension of `matchUtilities` (`{ bare: 'integer' }`) — Tailwind v3 plugins
  cannot express `tab-4` without a theme entry.
- Nested `&::-webkit-scrollbar { … }` / `@media` blocks follow `postcss-nested`.
- `--modifier()`, `--alpha()`, `--spacing()` functions are not implemented —
  the literal text would stay in the output, so `nakshora doctor` warns about
  them (`css-config` check).

## `@custom-variant`

- Shorthand `@custom-variant hocus (&:hover, &:focus);` → `addVariant` with
  parallel branches.
- Block form with `@slot`: `@custom-variant any-hover { @media (any-hover: hover) { @slot; } }`
  and `{ &:where([data-x] *) { @slot; } }`.
- Nested at-rule + selector combinations are flattened to a single `@media`
  wrapper _or_ a single selector template — a variant that needs both (e.g.
  `@media … { &:hover { @slot } }`) is emitted as two branches.

## Precedence

`nakshora.config.*` is loaded first; `@theme` values are merged into
`theme.extend` (so they **add** to the scale; use the config to replace),
and `@utility`/`@custom-variant` become the last plugin. Values defined in
both places: the CSS wins for the same key.
