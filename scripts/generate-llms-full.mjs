#!/usr/bin/env node
// Assembles llms-full.md — the complete documentation in one file,
// designed for LLM context windows and RAG ingestion.
//
// Usage: node scripts/generate-llms-full.mjs

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const DOCS = [
  'README.md',
  'docs/GETTING_STARTED.md',
  'docs/SETUP.md',
  'docs/INSTALLATION.md',
  'docs/UTILITIES.md',
  'docs/utilities/README.md',
  'docs/utilities/01-layout.md',
  'docs/utilities/02-spacing.md',
  'docs/utilities/03-sizing.md',
  'docs/utilities/04-flexbox-grid.md',
  'docs/utilities/05-typography.md',
  'docs/utilities/06-colors.md',
  'docs/utilities/07-backgrounds.md',
  'docs/utilities/08-borders.md',
  'docs/utilities/09-effects.md',
  'docs/utilities/10-transforms.md',
  'docs/utilities/11-transitions-animations.md',
  'docs/utilities/12-misc.md',
  'docs/utilities/13-components.md',
  'docs/VARIANTS.md',
  'docs/RESPONSIVE.md',
  'docs/COMPATIBILITY.md',
  'docs/CONFIGURATION.md',
  'docs/CSS_CONFIG.md',
  'docs/JIT.md',
  'docs/THEMES.md',
  'docs/CLI.md',
  'docs/EDITORS.md',
  'docs/PLAYGROUND.md',
  'docs/POSTCSS.md',
  'docs/VITE.md',
  'docs/API.md',
  'docs/AI_TRAINING.md',
  'docs/EXAMPLES.md',
  'docs/PERFORMANCE.md',
  'docs/PUBLISHING.md',
  'docs/TROUBLESHOOTING.md',
  'docs/MIGRATION.md',
];

let out = `# Nakshora — Complete Documentation (for LLMs)\n\n`;
out += `> This file is the complete Nakshora documentation assembled into a single document.\n`;
out += `> Framework: Nakshora v3 — utility-first CSS framework with a JIT compiler.\n\n`;

for (const rel of DOCS) {
  const abs = join(root, rel);
  if (!existsSync(abs)) {
    console.warn(`⚠️ missing: ${rel}`);
    continue;
  }
  let body = readFileSync(abs, 'utf-8').trim();
  // normalize internal relative links (keep them, but note base)
  const anchor = rel.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  out += `\n<!-- ===== ${rel} (#${anchor}) ===== -->\n\n${body}\n\n`;
}

writeFileSync(join(root, 'llms-full.md'), out);
console.log(`✅ llms-full.md written (${(out.length / 1024).toFixed(0)} KB)`);
