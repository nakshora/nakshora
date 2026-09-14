// Nakshora CLI — build your utility CSS from the command line
// (the shebang is added by tsup via the `banner` option in tsup.config.ts)

import { Command } from 'commander';
import { existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import { buildAICorpus, corpusToSFT, metadata, version, type NakshoraConfig } from '@nakshora/core';
import { runBuild, summarize, collectWatchPaths } from './build';
import { resolveConfig } from './config-loader';
import { createWatcher } from './watch';
import { startDevServer, type DevServer } from './serve';
import { diagnose, formatFindings } from './doctor';
import { runMigrate } from './migrate';

const program = new Command();

program
  .name('nakshora')
  .description('The modern, ultra-fast, utility-first CSS framework with a JIT compiler')
  .version(version, '-v, --version', 'output the version number')
  .showHelpAfterError('(run without args for help)');

async function withConfig(
  cmd: { opts(): { config?: string } },
  startDir: string = process.cwd(),
): Promise<{ config: Partial<NakshoraConfig>; file: string | null }> {
  const { config, file } = await resolveConfig(cmd.opts().config, startDir);
  if (file) {
    (config as NakshoraConfig & { __file?: string }).__file = file;
  }
  return { config, file };
}

program
  .command('init')
  .description('scaffold a nakshora.config.js and starter stylesheet in the current directory')
  .option('--force', 'overwrite existing files')
  .option('--json', 'create nakshora.config.json instead of JavaScript')
  .action(async (opts: { force?: boolean; json?: boolean }) => {
    const dir = process.cwd();
    const cfgFile = opts.json ? 'nakshora.config.json' : 'nakshora.config.js';
    const cssFile = 'nakshora.css';
    if ((existsSync(join(dir, cfgFile)) || existsSync(join(dir, cssFile))) && !opts.force) {
      console.error(
        chalk.red(`A Nakshora config already exists. Use ${chalk.bold('--force')} to overwrite.`),
      );
      process.exit(1);
    }
    const configContent = opts.json
      ? JSON.stringify(
          {
            content: ['./**/*.{html,js,ts,jsx,tsx,vue,astro,svelte,md}'],
            theme: {},
            safelist: [],
            plugins: [],
          },
          null,
          2,
        ) + '\n'
      : `// Nakshora configuration — https://github.com/nakshora/nakshora/blob/main/docs/CONFIGURATION.md
export default {
  // JIT: scan these files for class names (only used classes are compiled)
  content: ['./**/*.{html,js,ts,jsx,tsx,vue,astro,svelte,md}'],

  // Always-include classes (dynamic class names, component libraries…)
  safelist: [],

  // Theme overrides (colors, spacing, breakpoints, fonts, shadows…)
  theme: {},

  // Toggle utility groups, e.g. { transforms: false }
  corePlugins: {},

  // true → !important everywhere · '#app' → scope all rules
  important: false,

  // Plugins (add custom utilities/components)
  plugins: [],
};
`;
    writeFileSync(join(dir, cfgFile), configContent);
    writeFileSync(
      join(dir, cssFile),
      `/* Nakshora entry point\n   Consume this file in your bundler — or run: nakshora build nakshora.css -o dist/nakshora.css --minify\n   Layers: @nakshora source | base | variables | keyframes | utilities | components\n*/\n@nakshora source;\n`,
    );
    console.log(chalk.green(`✔ Created ${chalk.bold(cfgFile)} and ${chalk.bold(cssFile)}`));
    console.log(chalk.dim('\nNext steps:'));
    console.log(`  1. Add your markup with Nakshora classes`);
    console.log(`  2. ${chalk.bold('nakshora build nakshora.css -o dist/nakshora.css --minify')}`);
    console.log(
      chalk.dim('   (JIT mode compiles only the classes it finds in your content globs)'),
    );
  });

function buildOptions(cmd: Command): Command {
  return cmd
    .option('-c, --config <path>', 'path to nakshora config')
    .option('-o, --output <file>', 'output file (default: stdout)')
    .option('-m, --minify', 'minify the output')
    .option('--mode <mode>', 'full | jit', undefined)
    .option('--content <globs...>', 'JIT content globs / files (overrides config.content)')
    .option('--safelist <classes...>', 'classes to always emit (added to config.safelist)')
    .option('--source-map', 'write <output>.map next to the output')
    .option('--stats', 'print build statistics (candidates, unknown classes, sizes) to stderr')
    .option('--diff', 'do not write; show which selectors would change in the output file')
    .option('--watch', 'rebuild on change');
}

buildOptions(
  program
    .command('build [input]')
    .description(
      'compile Nakshora CSS (JIT by default when content is configured); input may be a .css file or `-` for stdin',
    ),
).action(async (input: string | undefined, opts: BuildOpts) => {
  await doBuild(input, opts);
});

interface BuildOpts {
  config?: string;
  output?: string;
  minify?: boolean;
  mode?: string;
  watch?: boolean;
  content?: string[];
  safelist?: string[];
  sourceMap?: boolean;
  stats?: boolean;
  diff?: boolean;
  serve?: boolean;
  port?: string;
  host?: string;
  root?: string;
  open?: boolean;
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString('utf-8');
}

/** Apply CLI overrides (`--content`, `--safelist`) on top of the loaded config. */
export function applyCliOverrides(
  config: Partial<NakshoraConfig>,
  opts: Pick<BuildOpts, 'content' | 'safelist'>,
): Partial<NakshoraConfig> {
  const out = { ...config };
  if (opts.content?.length) out.content = opts.content;
  if (opts.safelist?.length) {
    const safe = new Set([
      ...((config.safelist ?? []) as string[]),
      ...opts.safelist.flatMap((s) => s.split(/[\s,]+/)).filter(Boolean),
    ]);
    out.safelist = [...safe];
  }
  return out;
}

/** Selectors present in `a` but not `b`, and vice-versa (text-level, minified-insensitive). */
export function diffSelectors(
  before: string,
  after: string,
): { added: string[]; removed: string[] } {
  const sel = (css: string): Set<string> =>
    new Set(
      (css.match(/(^|[}{;\n])\s*([^{}@;/][^{}]*?)\s*\{/g) ?? []).map((m) =>
        m
          .replace(/^[}{;\n]\s*/, '')
          .replace(/\s*\{$/, '')
          .replace(/\s+/g, ' '),
      ),
    );
  const a = sel(before);
  const b = sel(after);
  return {
    added: [...b].filter((x) => !a.has(x)).sort(),
    removed: [...a].filter((x) => !b.has(x)).sort(),
  };
}

function printStats(result: Awaited<ReturnType<typeof runBuild>>, output?: string): void {
  const lines = [
    `${chalk.bold('build')}       ${result.durationMs.toFixed(1)} ms`,
    `${chalk.bold('classes')}     ${result.classes}`,
    `${chalk.bold('candidates')}  ${result.candidates}`,
    `${chalk.bold('size')}        ${result.sizeBytes} B (${result.minifiedSizeBytes} B minified)`,
    ...(output ? [`${chalk.bold('output')}      ${output}`] : []),
    ...(result.mapFile ? [`${chalk.bold('source map')}  ${result.mapFile}`] : []),
  ];
  if (result.unknown.length) {
    const shown = result.unknown.slice(0, 25);
    lines.push(
      `${chalk.bold('unknown')}     ${result.unknown.length} candidate(s) produced no CSS` +
        chalk.dim(
          ` (plain words are expected): ${shown.join(' ')}${result.unknown.length > shown.length ? ' …' : ''}`,
        ),
    );
  }
  console.error(lines.join('\n'));
}

async function doBuild(
  input: string | undefined,
  opts: BuildOpts,
  forceWatch = false,
): Promise<void> {
  const loaded = await withConfig({ opts: () => opts });
  const config = applyCliOverrides(loaded.config, opts);
  const mode = (opts.mode ?? undefined) as 'full' | 'jit' | undefined;
  if (mode && mode !== 'full' && mode !== 'jit') {
    console.error(chalk.red(`Invalid --mode "${mode}" (expected full or jit)`));
    process.exit(1);
  }
  const inputCss = input === '-' ? await readStdin() : undefined;
  const base = {
    input,
    inputCss,
    output: opts.output,
    minify: opts.minify,
    mode,
    config,
    sourceMap: opts.sourceMap,
    // `--serve` without `--output` keeps the stylesheet in memory (served at /nakshora.css)
    dryRun: Boolean(opts.serve && !opts.output),
  };

  if (opts.diff) {
    const result = await runBuild({ ...base, dryRun: true });
    const outPath = opts.output ? resolve(process.cwd(), opts.output) : undefined;
    const before = outPath && existsSync(outPath) ? readFileSync(outPath, 'utf-8') : '';
    const { added, removed } = diffSelectors(before, result.css);
    for (const r of removed) console.log(chalk.red(`- ${r}`));
    for (const a of added) console.log(chalk.green(`+ ${a}`));
    console.error(
      chalk.dim(
        `${added.length} added, ${removed.length} removed${outPath ? ` vs ${opts.output}` : ' (no --output: compared against empty)'}`,
      ),
    );
    if (opts.stats) printStats(result, opts.output);
    return;
  }

  const started = Date.now();
  const result = await runBuild(base);
  const target = opts.serve && !opts.output ? 'memory' : opts.output;
  const line = chalk.green(`✔ ${summarize(result, target)} in ${Date.now() - started}ms`);
  if (!opts.output || opts.serve) console.error(line);
  if (opts.stats) printStats(result, opts.output);

  if (opts.watch || forceWatch || opts.serve) {
    if (input === '-') {
      console.error(chalk.red('--watch cannot be combined with stdin input'));
      process.exit(1);
    }
    let server: DevServer | undefined;
    if (opts.serve) {
      const root = resolve(process.cwd(), opts.root ?? '.');
      const cssPath = opts.output
        ? '/' + relative(root, resolve(process.cwd(), opts.output))
        : '/nakshora.css';
      if (cssPath.startsWith('/..')) {
        console.error(chalk.red(`--output must live inside the served root (${root})`));
        process.exit(1);
      }
      server = await startDevServer({
        root,
        port: opts.port ? Number(opts.port) : 3000,
        host: opts.host,
        cssPath,
        css: result.css,
      });
      console.error(
        chalk.cyan(`➜ dev server ${server.url}`) +
          chalk.dim(` (serving ${root}; stylesheet at ${cssPath}, hot-swapped on rebuild)`),
      );
      if (!opts.output)
        console.error(chalk.dim(`  add <link rel="stylesheet" href="${cssPath}"> to your HTML`));
    }
    const paths = await collectWatchPaths(config, { input, config });
    console.error(chalk.dim(`Watching ${paths.length} path(s)… press Ctrl+C to stop`));
    let lastCss = result.css;
    const watcher = createWatcher(paths, () => {
      runBuild(base)
        .then((res) => {
          console.error(
            chalk.green(`✔ rebuilt ${summarize(res, target)} in ${res.durationMs.toFixed(0)}ms`),
          );
          if (opts.stats) printStats(res, opts.output);
          if (server) {
            if (res.css !== lastCss) server.updateCss(res.css);
            else server.reload();
          }
          lastCss = res.css;
        })
        .catch((err: Error) => console.error(chalk.red(`Build error: ${err.message}`)));
    });
    const stop = (): void => {
      watcher.close();
      void (server ? server.close() : Promise.resolve()).then(() => process.exit(0));
    };
    process.on('SIGINT', stop);
    process.on('SIGTERM', stop);
  }
}

buildOptions(program.command('dev [input]').description('build with --watch (development mode)'))
  .option('--serve', 'serve the project over HTTP with live CSS hot-swap / reload')
  .option('--port <port>', 'dev server port (default 3000)')
  .option('--host <host>', 'dev server host (default 0.0.0.0)')
  .option('--root <dir>', 'directory to serve (default: current directory)')
  .action(async (input: string | undefined, opts: BuildOpts) => {
    await doBuild(input, opts, true);
  });

program
  .command('inspect')
  .description('print the full generated CSS to stdout')
  .option('-c, --config <path>', 'path to nakshora config')
  .action(async (opts: { config?: string }) => {
    const { config } = await withConfig({ opts: () => opts });
    const result = await runBuild({ config, mode: 'full' });
    void result;
  });

program
  .command('export:ai')
  .description('export the utility corpus for AI/LLM training (RAG + SFT)')
  .option('-c, --config <path>', 'path to nakshora config')
  .option('-o, --out <file>', 'output file (default: ai/corpus.json)', 'ai/corpus.json')
  .option('-f, --format <format>', 'json | jsonl (SFT dataset)', 'json')
  .option('--limit <n>', 'max SFT examples', '500')
  .action(async (opts: { config?: string; out: string; format: string; limit: string }) => {
    const { config } = await withConfig({ opts: () => opts });
    const corpus = buildAICorpus(config, version);
    let out: string;
    let fileName: string;
    if (opts.format === 'jsonl') {
      out = corpusToSFT(corpus, parseInt(opts.limit, 10) || 500);
      fileName = opts.out.endsWith('.jsonl')
        ? opts.out
        : opts.out.replace(/\.json$/i, '') + '.jsonl';
    } else {
      out = JSON.stringify(corpus, null, 2);
      fileName = opts.out;
    }
    const abs = isAbsolute(fileName) ? fileName : resolve(process.cwd(), fileName);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, out);
    console.log(
      chalk.green(
        `✔ Exported ${corpus.utilityCount} utilities (${corpus.categories.length} categories) → ${fileName}`,
      ),
    );
  });

program
  .command('doctor')
  .description(
    'diagnose the project set-up: config, content globs, stylesheets, @apply, dependencies',
  )
  .option('-c, --config <path>', 'path to nakshora config')
  .option('--json', 'machine-readable output')
  .action(async (opts: { config?: string; json?: boolean }) => {
    const { findings } = await diagnose(process.cwd(), opts.config);
    if (opts.json) console.log(JSON.stringify(findings, null, 2));
    else console.log(formatFindings(findings));
    const errors = findings.filter((f) => f.level === 'error').length;
    const warns = findings.filter((f) => f.level === 'warn').length;
    if (!opts.json)
      console.log(
        `\n${errors ? chalk.red(`${errors} error(s)`) : chalk.green('no errors')}, ${warns ? chalk.yellow(`${warns} warning(s)`) : 'no warnings'}`,
      );
    if (errors) process.exit(1);
  });

program
  .command('migrate [globs...]')
  .description(
    'codemod: rename Nakshora v1 classes (--from v1) or port a Tailwind project (--from tailwind)',
  )
  .option('--from <source>', 'v1 | tailwind', 'tailwind')
  .option('--write', 'apply changes (default: dry run)')
  .action(async (globs: string[], opts: { from: string; write?: boolean }) => {
    if (opts.from !== 'v1' && opts.from !== 'tailwind') {
      console.error(chalk.red(`--from must be v1 or tailwind`));
      process.exit(1);
    }
    const patterns = globs.length
      ? globs
      : ['**/*.{html,js,jsx,ts,tsx,vue,svelte,astro,md,mdx,php}'];
    const res = await runMigrate({
      cwd: process.cwd(),
      from: opts.from,
      globs: patterns,
      write: !!opts.write,
    });
    for (const f of res.files)
      console.log(
        `${opts.write ? chalk.green('✔') : chalk.yellow('~')} ${f.file.replace(process.cwd() + '/', '')}  ` +
          chalk.dim(f.changes.map((c) => `${c.from}→${c.to}×${c.count}`).join(' ')),
      );
    if (res.config) {
      console.log(
        `${opts.write ? chalk.green('✔') : chalk.yellow('~')} ${res.config.from} → ${res.config.to}`,
      );
      for (const n of res.config.notes) console.log(chalk.dim(`   · ${n}`));
    }
    if (!res.files.length && !res.config) console.log(chalk.dim('nothing to migrate'));
    else if (!opts.write) console.log(chalk.dim('\ndry run — re-run with --write to apply'));
  });

// `nakshora --version` handled by commander; bare `nakshora` shows help
program
  .command('lsp')
  .description('start the Nakshora language server (LSP over stdio) for editor integrations')
  .option('-c, --config <path>', 'config file (default: discovered from the workspace root)')
  .action(async (opts: { config?: string }) => {
    const { startLanguageServer } = await import('./language-server');
    startLanguageServer({ config: opts.config });
  });

program.action(() => {
  program.outputHelp();
});

// Re-export for library usage
export { runBuild, resolveConfig, createWatcher, metadata };
export default program;

/**
 * True when this module is the process entry point. `npx nakshora`, pnpm/yarn
 * bins and global installs all run the binary through a symlink
 * (`node_modules/.bin/nakshora`), so `process.argv[1]` and `import.meta.url`
 * must be compared by real path — a plain string comparison silently did
 * nothing (exit 0, no output) for every symlinked invocation.
 */
function isEntryPoint(): boolean {
  if (process.env.NAKSHORA_CLI === '1') return true;
  const argv1 = process.argv[1];
  if (!argv1) return false;
  try {
    return realpathSync(argv1) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

// Execute when run as a binary
if (isEntryPoint()) {
  program.parseAsync(process.argv).catch((err) => {
    console.error(chalk.red(`Error: ${(err as Error).message}`));
    process.exit(1);
  });
}
