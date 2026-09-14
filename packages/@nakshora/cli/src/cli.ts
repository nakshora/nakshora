// Nakshora CLI — build your utility CSS from the command line
// (the shebang is added by tsup via the `banner` option in tsup.config.ts)

import { Command } from 'commander';
import { existsSync, mkdirSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import { buildAICorpus, corpusToSFT, metadata, version, type NakshoraConfig } from '@nakshora/core';
import { runBuild, summarize, collectWatchPaths } from './build';
import { resolveConfig } from './config-loader';
import { createWatcher } from './watch';

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

program
  .command('build [input]')
  .description('compile Nakshora CSS (JIT by default when content is configured)')
  .option('-c, --config <path>', 'path to nakshora config')
  .option('-o, --output <file>', 'output file (default: stdout)')
  .option('-m, --minify', 'minify the output')
  .option('--mode <mode>', 'full | jit', undefined)
  .option('--watch', 'rebuild on change')
  .action(async (input: string | undefined, opts: BuildOpts) => {
    await doBuild(input, opts);
  });

interface BuildOpts {
  config?: string;
  output?: string;
  minify?: boolean;
  mode?: string;
  watch?: boolean;
}

async function doBuild(
  input: string | undefined,
  opts: BuildOpts,
  forceWatch = false,
): Promise<void> {
  const { config } = await withConfig({ opts: () => opts });
  const mode = (opts.mode ?? undefined) as 'full' | 'jit' | undefined;
  if (mode && mode !== 'full' && mode !== 'jit') {
    console.error(chalk.red(`Invalid --mode "${mode}" (expected full or jit)`));
    process.exit(1);
  }
  const started = Date.now();
  const result = await runBuild({ input, output: opts.output, minify: opts.minify, mode, config });
  const line = chalk.green(`✔ ${summarize(result, opts.output)} in ${Date.now() - started}ms`);
  if (!opts.output) console.error(line);

  if (opts.watch || forceWatch) {
    const paths = await collectWatchPaths(config, { input, config });
    console.log(chalk.dim(`Watching ${paths.length} path(s)… press Ctrl+C to stop`));
    const watcher = createWatcher(paths, () => {
      runBuild({ input, output: opts.output, minify: opts.minify, mode, config })
        .then((res) => console.error(chalk.green(`✔ rebuilt ${summarize(res, opts.output)}`)))
        .catch((err: Error) => console.error(chalk.red(`Build error: ${err.message}`)));
    });
    process.on('SIGINT', () => {
      watcher.close();
      process.exit(0);
    });
  }
}

program
  .command('dev [input]')
  .description('build with --watch (development mode)')
  .option('-c, --config <path>', 'path to nakshora config')
  .option('-o, --output <file>', 'output file (default: stdout)')
  .option('-m, --minify', 'minify the output')
  .option('--mode <mode>', 'full | jit', undefined)
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

// `nakshora --version` handled by commander; bare `nakshora` shows help
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
