# Publishing the guide on Wikiversity (new-account safe)

## Why page creation was blocked

Wikiversity's abuse filter disallows **new accounts** from creating a **new page
containing external links** ("New user exceeded new page limit"). Our full
article has 16 external links, so a single paste trips the filter.

## The workaround: publish in 7 small, link-free steps

Every `part*.wikitext` file below has **zero external links outside code
blocks** (URLs inside `<syntaxhighlight>` code samples don't count as links
and were left intact so code stays runnable). Domains in prose are written
without `https://`, which MediaWiki does not auto-link.

| Step | File | Action |
| ---- | ---- | ------ |
| 1 | `part1_create_page_title_and_intro.wikitext` | **Create** page `Nakshora Css Framework Guide (v3.1)`, paste, Publish |
| 2 | `part2_installation.wikitext` | **Edit** page, paste at the very **end**, Publish |
| 3 | `part3_architecture.wikitext` | Edit, paste at end, Publish |
| 4 | `part4_layout_utilities.wikitext` | Edit, paste at end, Publish |
| 5 | `part5_components.wikitext` | Edit, paste at end, Publish |
| 6 | `part6_exercises.wikitext` | Edit, paste at end, Publish |
| 7 | `part7_conclusion_references.wikitext` | Edit, paste at end, Publish |

Rules for every step:

- Use **Create source / Edit source** (wikitext editor), not VisualEditor.
- Leave the `<!-- PART ... -->` comment line in place; it is invisible to readers.
- Do **not** put any URL in the edit summary.
- After step 1 the page exists, so the "new page" rule can't fire again.

## Restoring clickable links later

Once the account is **autoconfirmed** (4+ days old with 10+ edits), external
links are allowed. Then do one final edit: select-all, replace the entire page
content with `docs/WIKIVERSITY_GUIDE.wikitext` (the original, with real
`[https://… label]` links), and Publish.

## If a step still gets blocked

1. Double-check you pasted a `part*.wikitext` file, not the full guide.
2. Use Wikiversity's **Report / Colloquium** to ask an administrator to review
   the filter hit (quote the rule name from the red error box).
3. Earning autoconfirmed status (10 small constructive edits + 4 days) removes
   these limits permanently.
