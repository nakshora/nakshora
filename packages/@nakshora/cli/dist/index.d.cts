import { NakshoraConfig } from '@nakshora/core';
export { version } from '@nakshora/core';

interface BuildInput {
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
interface BuildResult {
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
/**
 * Run a full Nakshora build.
 */
declare function runBuild(input: BuildInput): Promise<BuildResult>;
/**
 * Source map for generated CSS. Every generated line maps to line 1 of a
 * virtual `nakshora:generated` source (or to the input stylesheet when one
 * was spliced); this satisfies tooling that insists on a map and marks the
 * output as generated, without pretending utilities have an author location.
 */
declare function generatedSourceMap(css: string, file: string, inputFile?: string): {
    version: 3;
    file: string;
    sources: string[];
    names: string[];
    mappings: string;
};
/**
 * Human-readable build summary line.
 */
declare function summarize(result: BuildResult, output: string | undefined): string;
/**
 * Collect all file paths a build depends on (for watching).
 */
declare function collectWatchPaths(config: Partial<NakshoraConfig>, input: BuildInput, cwd?: string): Promise<string[]>;

type Level = 'ok' | 'warn' | 'error';
interface Finding {
    level: Level;
    check: string;
    message: string;
    hint?: string;
}
declare function diagnose(cwd?: string, explicitConfig?: string): Promise<{
    findings: Finding[];
    config: Partial<NakshoraConfig> | null;
    configFile: string | null;
}>;
declare function formatFindings(findings: Finding[]): string;

/** Nakshora v1 (static CSS) → v3 class renames. */
declare const V1_RENAMES: Record<string, string>;
/** Tailwind v3 class names that Nakshora spells differently (rare) + deprecated forms. */
declare const TAILWIND_RENAMES: Record<string, string>;
interface MigrateResult {
    text: string;
    changes: {
        from: string;
        to: string;
        count: number;
    }[];
}
/** Rewrite class tokens inside `class`/`className` attributes and string literals. */
declare function migrateSource(text: string, from: 'v1' | 'tailwind'): MigrateResult;
/**
 * Turn a tailwind.config.* into a nakshora.config.js. Tailwind's config shape
 * is accepted as-is by Nakshora (theme, extend, screens, content, safelist,
 * darkMode, plugins, corePlugins, prefix, important); the codemod rewrites
 * the module wrapper, the `require('tailwindcss/...)` imports and notes what
 * it could not translate.
 */
declare function migrateTailwindConfig(source: string): {
    text: string;
    notes: string[];
};
interface MigrateRunOptions {
    cwd: string;
    from: 'v1' | 'tailwind';
    globs: string[];
    write: boolean;
}
declare function runMigrate(o: MigrateRunOptions): Promise<{
    files: {
        file: string;
        changes: MigrateResult['changes'];
    }[];
    config?: {
        from: string;
        to: string;
        notes: string[];
    };
}>;

/**
 * Find the nearest Nakshora config file, walking up from `startDir`.
 */
declare function findConfigFile(startDir?: string): string | null;
/**
 * Load a Nakshora config file of any supported extension.
 * TypeScript configs are supported natively on Node ≥ 22.18
 * (type stripping); on older runtimes use a .js/.mjs/.cjs/.json config.
 */
declare function loadConfigFile(file: string): Promise<Partial<NakshoraConfig>>;
/**
 * Load config from an explicit path, or discover it automatically.
 */
declare function resolveConfig(explicitPath?: string, startDir?: string): Promise<{
    config: Partial<NakshoraConfig>;
    file: string | null;
}>;

declare function resolveContent(content: string | string[] | undefined, cwd?: string): Promise<string[]>;
/**
 * Like `resolveContent` but keeps files and raw strings apart so a
 * `ContentCache` can stamp files by mtime (incremental rebuilds).
 */
declare function resolveSources(content: string | string[] | undefined, cwd?: string): Promise<{
    files: string[];
    raw: string[];
}>;

interface WatcherHandle {
    close(): void;
}
/**
 * Watch directories (recursively) for changes.
 * Uses native recursive fs.watch where available, otherwise polls.
 */
declare function createWatcher(paths: string[], onChange: () => void): WatcherHandle;

export { type BuildInput, type BuildResult, type Finding, type Level, type MigrateResult, type MigrateRunOptions, TAILWIND_RENAMES, V1_RENAMES, type WatcherHandle, collectWatchPaths, createWatcher, diagnose, findConfigFile, formatFindings, generatedSourceMap, loadConfigFile, migrateSource, migrateTailwindConfig, resolveConfig, resolveContent, resolveSources, runBuild, runMigrate, summarize };
