// Nakshora CLI — build pipeline shared by `build`/`dev`/`inspect`

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, isAbsolute, join, resolve } from 'node:path';
import {
  ApplyError,
  ContentCache,
  CSSGenerator,
  formatBytes,
  scanSources,
  type ScanFs,
  minifyCss,
  type GenerationOptions,
  type NakshoraConfig,
  extractCssConfig,
  hasCssConfig,
  mergeCssConfig,
} from '@nakshora/core';
import { resolveSources } from './content';

/** Process-wide incremental scan cache (mtime+size per file, hash per raw chunk). */
const contentCache = new ContentCache();
const scanFs: ScanFs = {
  stat: (p) => {
    try {
      const st = statSync(p);
      return { mtimeMs: st.mtimeMs, size: st.size };
    } catch {
      return null;
    }
  },
  read: (p) => readFileSync(p, 'utf-8'),
};

export interface BuildInput {
  /** Explicit input CSS file (may contain `@nakshora source` / `@nakshora utilities`); `-` = stdin */
  input?: string;
  /** Raw input CSS (used instead of reading `input`; the CLI fills this for stdin) */
  inputCss?: string;
  /** Output path (stdout when omitted) */
  output?: string;
  minify?: boolean;
  mode?: 'full' | 'jit';
  /** Loaded config (already resolved) */
  config: Partial<NakshoraConfig>;
  cwd?: string;
  /** Write `<output>.map` and append the `sourceMappingURL` comment */
  sourceMap?: boolean;
  /** Do not write anything (used by `--diff` / `--stats` dry runs) */
  dryRun?: boolean;
}

export interface BuildResult {
  css: string;
  classes: number;
  sizeBytes: number;
  minifiedSizeBytes: number;
  /** candidates found in content (JIT) */
  candidates: number;
  /** candidates that produced no CSS (unknown classes / plain words) */
  unknown: string[];
  /** wall time of the build in ms */
  durationMs: number;
  /** path of the written source map, when requested */
  mapFile?: string;
}

const SOURCE_RE = /@nakshora\s+source\s*;?/g;
const UTILITIES_RE = /@nakshora\s+utilities\s*;?/g;
const AUTHOR_RE = /@apply\b|@screen\b|\b(?:theme|screen)\(/;

/**
 * Run a full Nakshora build.
 */
export async function runBuild(input: BuildInput): Promise<BuildResult> {
  const started = performance.now();
  const cwd = input.cwd ?? process.cwd();
  // If an input file (or stdin) is given, read it first: `@theme` / `@utility` /
  // `@custom-variant` blocks (CSS-first configuration) extend the config.
  const absInput =
    input.input && input.input !== '-'
      ? isAbsolute(input.input)
        ? input.input
        : resolve(cwd, input.input)
      : undefined;
  let source: string | undefined =
    input.inputCss ??
    (absInput && existsSync(absInput) ? readFileSync(absInput, 'utf-8') : undefined);
  let config = input.config;
  let rootVars = '';
  if (source !== undefined && hasCssConfig(source)) {
    const extracted = extractCssConfig(source);
    source = extracted.css;
    rootVars = extracted.rootVars;
    config = mergeCssConfig(config, extracted.config);
  }
  const generator = new CSSGenerator(config);
  const { files, raw } = await resolveSources(config.content ?? config.purge, cwd);
  const hasContent = files.length + raw.length > 0;
  const mode: 'full' | 'jit' = input.mode ?? (hasContent ? 'jit' : 'full');
  const options: GenerationOptions = { minify: input.minify, mode };
  // incremental: unchanged files are not re-read or re-extracted between builds
  const candidates = hasContent ? scanSources(contentCache, scanFs, files, raw) : new Set<string>();

  let css: string;
  let classes: number;
  if (mode === 'jit') {
    css = generator.generateJITFromCandidates(candidates, options);
    classes = countClasses(css);
  } else {
    css = generator.generate({ ...options, mode: 'full' });
    classes = countClasses(css);
  }

  // Splice the generated CSS into the author stylesheet's at-rules
  if (source !== undefined) {
    {
      // `@apply` / `theme()` / `screen()` / `@screen` in the author stylesheet
      const authorPass = AUTHOR_RE.test(source);
      if (authorPass) {
        try {
          source = generator.processCss(source);
        } catch (err) {
          if (err instanceof ApplyError)
            throw new Error(
              `${input.input && input.input !== '-' ? input.input : '<stdin>'}: ${err.message}`,
            );
          throw err;
        }
      }
      if (authorPass || SOURCE_RE.test(source) || UTILITIES_RE.test(source)) {
        const hasJitContent = hasContent;
        // `@nakshora source;` → the complete pipeline for the active mode:
        // JIT build (base + variables + keyframes + used utilities + components)
        // when content is configured, otherwise the full build.
        const sourceCss = hasJitContent ? css : generator.generate({ minify: false, mode: 'full' });
        // `@nakshora utilities;` → just the utilities layer for the active mode
        // (full mode: same layer as `@nakshora source;`, no state variants).
        const utilCss = hasJitContent
          ? generator.generateJITFromCandidates(
              candidates,
              { minify: false },
              { utilitiesOnly: true },
            )
          : generator.getUtilitiesFull(false);
        const out = source.replace(SOURCE_RE, () => sourceCss).replace(UTILITIES_RE, () => utilCss);
        css = input.minify ? minifyCss(out) : out;
      } else if (rootVars) {
        css = input.minify ? minifyCss(source) : source;
      }
      // `@theme` variables become `:root` custom properties (Tailwind v4 semantics)
      if (rootVars) css = (input.minify ? minifyCss(rootVars) : rootVars) + css;
    }
  }

  let mapFile: string | undefined;
  if (input.output) {
    const outPath = isAbsolute(input.output) ? input.output : resolve(cwd, input.output);
    if (input.sourceMap) {
      mapFile = `${outPath}.map`;
      const map = generatedSourceMap(
        css,
        basename(outPath),
        input.input && input.input !== '-' ? input.input : undefined,
      );
      css += `\n/*# sourceMappingURL=${basename(mapFile)} */\n`;
      if (!input.dryRun) {
        mkdirSync(dirname(outPath), { recursive: true });
        writeFileSync(mapFile, JSON.stringify(map), 'utf-8');
      }
    }
    if (!input.dryRun) {
      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, css, 'utf-8');
    }
  } else if (!input.dryRun) {
    process.stdout.write(css);
  }

  const unknown =
    mode === 'jit'
      ? [...candidates].filter(
          (c) => generator.engine.compile(c).length === 0 && !isComponentClass(generator, c),
        )
      : [];

  return {
    css,
    classes,
    sizeBytes: Buffer.byteLength(css, 'utf-8'),
    minifiedSizeBytes: Buffer.byteLength(minifyCss(css), 'utf-8'),
    candidates: candidates.size,
    unknown,
    durationMs: performance.now() - started,
    mapFile,
  };
}

function isComponentClass(generator: CSSGenerator, cls: string): boolean {
  return generator.getComponents().includes(`.${cls.replace(/[^\w-]/g, '')}`);
}

/**
 * Source map for generated CSS. Every generated line maps to line 1 of a
 * virtual `nakshora:generated` source (or to the input stylesheet when one
 * was spliced); this satisfies tooling that insists on a map and marks the
 * output as generated, without pretending utilities have an author location.
 */
export function generatedSourceMap(
  css: string,
  file: string,
  inputFile?: string,
): { version: 3; file: string; sources: string[]; names: string[]; mappings: string } {
  const lines = css.split('\n').length;
  // "AAAA" = generated col 0 → source 0, line 0, col 0; each following line
  // repeats the same (relative) segment.
  const mappings = Array.from({ length: lines }, () => 'AAAA').join(';');
  return {
    version: 3,
    file,
    sources: [inputFile ?? 'nakshora:generated'],
    names: [],
    mappings,
  };
}

function countClasses(css: string): number {
  return (css.match(/\.([a-zA-Z0-9\\\-_]+)/g) ?? []).length;
}

/**
 * Human-readable build summary line.
 */
export function summarize(result: BuildResult, output: string | undefined | 'memory'): string {
  const size =
    output === 'memory'
      ? `${formatBytes(result.sizeBytes)} in memory`
      : output
        ? formatBytes(result.sizeBytes)
        : 'stdout';
  return `${result.classes} classes · ${size} (${formatBytes(result.minifiedSizeBytes)} min)`;
}

/**
 * Collect all file paths a build depends on (for watching).
 */
export async function collectWatchPaths(
  config: Partial<NakshoraConfig>,
  input: BuildInput,
  cwd: string = process.cwd(),
): Promise<string[]> {
  const paths = new Set<string>();
  const content = Array.isArray(config.content)
    ? config.content
    : config.content
      ? [config.content]
      : (config.purge ?? []);
  for (const entry of content) {
    if (!entry) continue;
    if (entry.includes('*')) {
      // resolve glob roots (strip the pattern part)
      const root = entry.split('*')[0];
      const abs = isAbsolute(root) ? root : resolve(cwd, root);
      try {
        if (statSync(abs).isDirectory()) paths.add(abs);
      } catch {
        const dir = dirname(abs);
        try {
          if (statSync(dir).isDirectory()) paths.add(dir);
        } catch {
          // ignore
        }
      }
    } else if (!entry.includes(' ') && existsSync(resolve(cwd, entry))) {
      const abs = resolve(cwd, entry);
      if (statSync(abs).isFile()) paths.add(abs);
      else if (statSync(abs).isDirectory()) paths.add(abs);
    }
  }
  if (input.input) {
    const abs = isAbsolute(input.input) ? input.input : join(cwd, input.input);
    if (existsSync(abs)) paths.add(abs);
  }
  if (input.config && (input.config as NakshoraConfig & { __file?: string }).__file) {
    paths.add((input.config as NakshoraConfig & { __file?: string }).__file as string);
  }
  return [...paths];
}
