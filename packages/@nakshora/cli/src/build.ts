// Nakshora CLI — build pipeline shared by `build`/`dev`/`inspect`

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
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
  /** Explicit input CSS file (may contain `@nakshora source` / `@nakshora utilities`) */
  input?: string;
  /** Output path (stdout when omitted) */
  output?: string;
  minify?: boolean;
  mode?: 'full' | 'jit';
  /** Loaded config (already resolved) */
  config: Partial<NakshoraConfig>;
  cwd?: string;
}

export interface BuildResult {
  css: string;
  classes: number;
  sizeBytes: number;
  minifiedSizeBytes: number;
}

const SOURCE_RE = /@nakshora\s+source\s*;?/g;
const UTILITIES_RE = /@nakshora\s+utilities\s*;?/g;
const AUTHOR_RE = /@apply\b|@screen\b|\b(?:theme|screen)\(/;

/**
 * Run a full Nakshora build.
 */
export async function runBuild(input: BuildInput): Promise<BuildResult> {
  const cwd = input.cwd ?? process.cwd();
  const config = input.config;
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

  // If an input file is given, splice the generated CSS into at-rules
  if (input.input) {
    const absInput = isAbsolute(input.input) ? input.input : resolve(cwd, input.input);
    if (existsSync(absInput)) {
      let source = readFileSync(absInput, 'utf-8');
      // `@apply` / `theme()` / `screen()` / `@screen` in the author stylesheet
      const authorPass = AUTHOR_RE.test(source);
      if (authorPass) {
        try {
          source = generator.processCss(source);
        } catch (err) {
          if (err instanceof ApplyError) throw new Error(`${input.input}: ${err.message}`);
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
      }
    }
  }

  if (input.output) {
    const outPath = isAbsolute(input.output) ? input.output : resolve(cwd, input.output);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, css, 'utf-8');
  } else {
    process.stdout.write(css);
  }

  return {
    css,
    classes,
    sizeBytes: Buffer.byteLength(css, 'utf-8'),
    minifiedSizeBytes: Buffer.byteLength(minifyCss(css), 'utf-8'),
  };
}

function countClasses(css: string): number {
  return (css.match(/\.([a-zA-Z0-9\\\-_]+)/g) ?? []).length;
}

/**
 * Human-readable build summary line.
 */
export function summarize(result: BuildResult, output: string | undefined): string {
  const size = output ? formatBytes(result.sizeBytes) : 'stdout';
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
