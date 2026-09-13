# Nakshora AI Training Assets

Machine-readable knowledge of the entire framework — for LLM fine-tuning
(SFT), retrieval-augmented generation (RAG), and agent tooling.

## Files

| File              | Size    | Format   | Purpose                                                                                                                                                                                                    |
| ----------------- | ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `corpus.json`     | ~1.8 MB | JSON     | Structured corpus: **3,091 utilities** across 29 categories, each with class, generated CSS, description, examples (plain + responsive + variant). Plus all variants, breakpoints and `howToUse` guidance. |
| `sft-train.jsonl` | ~230 KB | JSONL    | 800 supervised fine-tuning examples in `{"messages":[{role, content}]}` format (OpenAI / LLaMA-Factory compatible).                                                                                        |
| `../llms.txt`     | small   | Markdown | Concise framework description for LLM context (llms.txt standard).                                                                                                                                         |
| `../llms-full.md` | large   | Markdown | Complete documentation in a single file for long-context/RAG ingestion.                                                                                                                                    |

## Regenerate

```bash
pnpm build:core
pnpm ai:export                                  # corpus.json
node packages/@nakshora/cli/dist/cli.js export:ai -f jsonl --limit 800 -o ai/sft-train.jsonl
```

From a consumer project (corpus reflects _your_ theme):

```bash
nakshora export:ai -c nakshora.config.js -o ai/corpus.json
nakshora export:ai -c nakshora.config.js -f jsonl --limit 3000 -o ai/sft.jsonl
```

## Usage recipes

1. **Chat assistant (RAG)** — embed `corpus.json` utilities (or chunks of
   `llms-full.md`) into a vector store; append the corpus `howToUse` list to
   the system prompt. See [AI Training docs](../docs/AI_TRAINING.md).
2. **Fine-tune** — train on `sft-train.jsonl`; each example maps a natural
   language styling request to the correct class + generated CSS + HTML.
3. **Agent tool** — expose a `nakshora_search` tool over `corpus.json` so
   agents can verify classes before writing markup.

## Provenance

These files are **generated from the built core** — the same registry the
compiler uses. They are committed so AI consumers never see a version that
differs from the shipped framework; regenerate + commit after any
registry/theme change.
