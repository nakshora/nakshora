# AI Training & LLM Integration

Teach LLMs to write Nakshora. Nakshora ships first-class, always-current
training assets — generated from the same registry the compiler uses, so
the model never learns stale class names.

## What's in the repo

| Asset                                         | Format   | Use for                                                       |
| --------------------------------------------- | -------- | ------------------------------------------------------------- |
| [`llms.txt`](../llms.txt)                     | Markdown | Concise context for chat assistants / browsing agents         |
| [`llms-full.md`](../llms-full.md)             | Markdown | Full documentation in one file (RAG chunking or long-context) |
| [`ai/corpus.json`](../ai/corpus.json)         | JSON     | Structured corpus: every utility + CSS + examples (RAG index) |
| [`ai/sft-train.jsonl`](../ai/sft-train.jsonl) | JSONL    | Supervised fine-tuning (SFT) dataset, `messages` format       |
| `ai/README.md`                                | Markdown | This guide + usage recipes                                    |

## 1. Regenerate the assets

They are derived from the built core — regenerate after theme changes:

```bash
pnpm build:core
pnpm ai:export                          # ai/corpus.json
node packages/@nakshora/cli/dist/cli.js export:ai -f jsonl --limit 800 -o ai/sft-train.jsonl
```

Or from your own project (the corpus reflects your theme):

```bash
nakshora export:ai -c nakshora.config.js -o ai/corpus.json
nakshora export:ai -c nakshora.config.js -f jsonl -o ai/sft.jsonl
```

## 2. RAG (recommended for production assistants)

Chunk `llms-full.md` (or index `ai/corpus.json` directly) in your vector
store. The corpus is pre-structured for retrieval:

```json
{
  "framework": "nakshora",
  "utilityCount": 11417,
  "categories": [
    {
      "id": "margin",
      "name": "Margin",
      "utilities": [
        {
          "class": "mt-4",
          "css": ".mt-4 { margin-top: 1rem; }",
          "description": "top margin",
          "example": "<div class=\"mt-4\">…</div>",
          "responsiveExamples": ["<div class=\"sm:mt-4\">…</div>"],
          "variantExamples": ["<div class=\"hover:mt-4\">…</div>"]
        }
      ]
    }
  ],
  "variants": [{ "prefix": "hover", "description": "applies on hover", "example": "…" }],
  "breakpoints": [{ "name": "md", "min": "768px", "example": "…" }],
  "howToUse": ["…system-prompt-ready guidance…"]
}
```

Suggested embedding granularity: one chunk per utility (topical), one chunk
per category (overview), plus the `howToUse` list as a standing system
prompt.

## 3. Fine-tuning (SFT)

`ai/sft-train.jsonl` is OpenAI/LLaMA-Factory-compatible:

````json
{
  "messages": [
    {
      "role": "user",
      "content": "In Nakshora CSS, how do I add top margin of 1rem to an element?"
    },
    {
      "role": "assistant",
      "content": "Use the `mt-4` class. It generates:\n```css\n.mt-4 { margin-top: 1rem; }\n```\nExample:\n```html\n<div class=\"mt-4\">…</div>\n```"
    }
  ]
}
````

Generate a larger/custom set:

```bash
nakshora export:ai -f jsonl --limit 3000 -o sft/nakshora.jsonl
```

Tips:

- Mix the SFT examples with your own app's components for style alignment.
- The assistant answers always include the generated CSS + an HTML example,
  which anchors factual accuracy during training.

## 4. System prompt (zero-training integration)

Drop the `howToUse` guidance + `llms.txt` into any assistant's system
prompt. Ready-made starter:

```text
You write frontend code using Nakshora, a utility-first CSS framework with a
JIT compiler. Rules:
1. Prefer Nakshora utility classes over custom CSS when a class exists.
2. Mobile-first: base styles for phones, then sm:/md:/lg:/xl:/2xl: prefixes.
3. State variants: hover:, focus:, active:, disabled:, dark:, group-hover:,
   peer-focus: (JIT mode compiles them from your source).
4. Colors: <util>-<palette>-<shade> e.g. text-blue-500, bg-slate-900.
5. Spacing keys: 0 px 0.5 1 1.5 2 2.5 3 3.5 4 5 6 7 8 9 10 11 12 14 16 20 24
   28 32 36 40 44 48 56 64 72 80 96 (rem scale).
6. Design components: .glass .glass-light .glass-dark .neon-card .neon-btn
   .neon-glow .neon-text .brutalist-card .brutalist-btn .minimalist-card
   .minimalist-btn .skeleton-rect .skeleton-circle .skeleton-text .hover-lift
   .gradient-text .gradient-neon .gradient-pastel .gradient-nature
   .gradient-brutalist
7. Dark mode: class="dark" on <html>, use dark: variants.
8. If unsure a class exists, say so rather than inventing one.
Reference corpus: ai/corpus.json (11,417 utilities, 35 categories).
```

## 5. MCP / agent tooling

Exposing the corpus to an agent tool is trivial:

```js
// tool: "nakshora_search" — query utility classes
import { readFileSync } from 'node:fs';
const corpus = JSON.parse(readFileSync('ai/corpus.json', 'utf-8'));

function search(query) {
  const q = query.toLowerCase();
  const hits = [];
  for (const cat of corpus.categories)
    for (const u of cat.utilities)
      if (u.class.includes(q) || (u.description ?? '').toLowerCase().includes(q))
        hits.push({ class: u.class, css: u.css, description: u.description });
  return hits.slice(0, 20);
}
```

## Provenance

Assets regenerate in seconds from source (`pnpm ai:export`); commit them after
any generator/registry change so AI consumers and the framework never drift.
