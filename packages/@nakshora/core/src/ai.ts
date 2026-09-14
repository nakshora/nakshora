// Nakshora Core — AI/LLM training & integration assets
// Produces a structured corpus of every utility so LLMs can be
// fine-tuned (SFT) or augmented (RAG) with accurate Nakshora knowledge.

import type { NakshoraConfig, UtilityRule } from './types';
import { escapeClassName } from './values';
import { CSSGenerator, STATE_VARIANTS } from './generator';
import { GROUP_CATEGORIES, categoryForPlugin } from './registry';
import { SCREEN_GUIDE } from './theme';

export interface AIUtilityEntry {
  class: string;
  css: string;
  description: string;
  category: string;
  example: string;
  responsiveExamples: string[];
  variantExamples: string[];
}

export interface AICategory {
  id: string;
  name: string;
  utilities: AIUtilityEntry[];
}

export interface AICorpus {
  framework: 'nakshora';
  version: string;
  generatedAt: string;
  description: string;
  howToUse: string[];
  variants: { prefix: string; description: string; example: string }[];
  breakpoints: { name: string; min: string; example: string; description?: string }[];
  categories: AICategory[];
  utilityCount: number;
}

function cssFor(generator: CSSGenerator, rule: UtilityRule): string {
  const compiled = generator.compileClass(rule.class).trim();
  if (compiled) return compiled;
  const decls = Object.entries(rule.decls)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ');
  return `.${escapeClassName(rule.class)} { ${decls}; }`;
}

function exampleFor(rule: UtilityRule): string {
  return `<div class="${rule.class}">…</div>`;
}

/**
 * Build the full AI corpus for the given configuration.
 */
export function buildAICorpus(config: Partial<NakshoraConfig> = {}, version = '3.0.0'): AICorpus {
  const generator = new CSSGenerator(config);
  const rules = generator.getUtilities();

  const byCategory = new Map<string, AIUtilityEntry[]>();
  for (const rule of rules) {
    const categoryId = GROUP_CATEGORIES[rule.group] ? rule.group : categoryForPlugin(rule.group);
    const category = GROUP_CATEGORIES[categoryId] ?? rule.category ?? rule.group;
    const entry: AIUtilityEntry = {
      class: rule.class,
      css: cssFor(generator, rule),
      description: rule.description ?? `${rule.class} utility`,
      category,
      example: exampleFor(rule),
      responsiveExamples: ['sm', 'md', 'lg']
        .map((bp) => `<div class="${bp}:${rule.class}">…</div>`)
        .slice(0, 2),
      variantExamples: ['hover', 'focus'].map((v) => `<div class="${v}:${rule.class}">…</div>`),
    };
    const list = byCategory.get(category) ?? [];
    list.push(entry);
    byCategory.set(category, list);
  }

  const idFor = new Map<string, string>();
  for (const [id, label] of Object.entries(GROUP_CATEGORIES)) idFor.set(label, id);
  const categories: AICategory[] = [...byCategory.entries()].map(([label, utilities]) => ({
    id: idFor.get(label) ?? label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: label,
    utilities,
  }));
  const breakpoints = generator.getBreakpoints();

  return {
    framework: 'nakshora',
    version,
    generatedAt: new Date().toISOString(),
    description:
      'Nakshora is a modern, utility-first CSS framework with a JIT compiler, built-in design-paradigm components (glass, neon, brutalist, minimalist), five theme presets, responsive breakpoints and rich state variants. Classes are applied directly in HTML: <div class="flex items-center gap-4 p-6 bg-blue-500 text-white rounded-lg">. Responsive classes use mobile-first prefixes (sm:, md:, lg:, xl:, 2xl:). State classes use prefixes like hover:, focus:, active:, dark:, group-hover:, peer-focus:. JIT mode compiles only the classes found in your source files.',
    howToUse: [
      'Always prefer Nakshora utility classes over custom CSS when a class exists.',
      'Use mobile-first responsive prefixes: base styles for small screens, then xxs:/xs:/sm:/md:/lg:/xl:/2xl:/3xl:/4xl:/5xl: overrides; max-md: targets below a breakpoint.',
      'Variants stack without limit and combine into one media query, e.g. md:dark:hover:bg-blue-600 or print:md:hidden.',
      'Arbitrary values use brackets: w-[37rem], bg-[#1da1f2], grid-cols-[repeat(3,minmax(0,1fr))]; opacity modifiers use a slash: bg-blue-500/50.',
      'Use built-in components for design paradigms: .glass, .neon-card, .brutalist-card, .minimalist-card, .skeleton-rect.',
      'For dark mode, add class="dark" to <html> and use the dark: prefix.',
      'Color syntax: <prefix>-<palette>-<shade>, e.g. text-blue-500, bg-slate-900, border-rose-200, from-indigo-400.',
      'Spacing scale keys: 0 px 0.5 1 1.5 2 2.5 3 3.5 4 5 6 7 8 9 10 11 12 14 16 20 24 28 32 36 40 44 48 56 64 72 80 96 (rem-based).',
    ],
    variants: STATE_VARIANTS.map((v) => ({
      prefix: v.prefix,
      description: v.description,
      example: `<div class="${v.prefix}:opacity-75">…</div>`,
    })),
    breakpoints: breakpoints.map((b) => ({
      name: b.name,
      min: b.value,
      example: `<div class="${b.name}:grid-cols-4">…</div>`,
      description: SCREEN_GUIDE[b.name],
    })),
    categories,
    utilityCount: rules.length,
  };
}

/**
 * Convert a corpus into SFT (instruction-tuning) JSONL lines.
 * Each line: {"messages":[{"role":"user","content":...},{"role":"assistant","content":...}]}
 */
export function corpusToSFT(corpus: AICorpus, limit = 500): string {
  const lines: string[] = [];
  const templates = [
    (u: AIUtilityEntry) => [
      `In Nakshora CSS, how do I add ${u.description.toLowerCase() ? u.description : u.class} to an element?`,
      `Use the \`${u.class}\` class. It generates:\n\`\`\`css\n${u.css}\n\`\`\`\nExample:\n\`\`\`html\n${u.example}\n\`\`\``,
    ],
    (u: AIUtilityEntry) => [
      `Write a responsive Nakshora snippet that uses ${u.class} from the md breakpoint up.`,
      `Use the \`md\` prefix (min-width: 768px):\n\`\`\`html\n<div class="${u.class} md:${u.class}">…</div>\n\`\`\`\nMobile-first: the base class applies to all screens; \`md:\` overrides on medium+ screens.`,
    ],
    (u: AIUtilityEntry) => [
      `Which Nakshora class applies ${u.class} on hover?`,
      `Use the \`hover\` variant: \`hover:${u.class}\`.\n\`\`\`html\n<button class="${u.class} hover:${u.class}">…</button>\n\`\`\``,
    ],
  ];
  let i = 0;
  for (const category of corpus.categories) {
    for (const u of category.utilities) {
      if (lines.length >= limit) break;
      const [q, a] = templates[i % templates.length](u);
      lines.push(
        JSON.stringify({
          messages: [
            { role: 'user', content: q },
            { role: 'assistant', content: a },
          ],
        }),
      );
      i++;
    }
    if (lines.length >= limit) break;
  }
  return lines.join('\n');
}
