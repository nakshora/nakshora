import { NakshoraConfig } from '@nakshora/core';
export { version } from '@nakshora/core';

interface BuildInput {
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
interface BuildResult {
    css: string;
    classes: number;
    sizeBytes: number;
    minifiedSizeBytes: number;
}
/**
 * Run a full Nakshora build.
 */
declare function runBuild(input: BuildInput): Promise<BuildResult>;
/**
 * Human-readable build summary line.
 */
declare function summarize(result: BuildResult, output: string | undefined): string;
/**
 * Collect all file paths a build depends on (for watching).
 */
declare function collectWatchPaths(config: Partial<NakshoraConfig>, input: BuildInput, cwd?: string): Promise<string[]>;

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

export { type BuildInput, type BuildResult, type WatcherHandle, collectWatchPaths, createWatcher, findConfigFile, loadConfigFile, resolveConfig, resolveContent, resolveSources, runBuild, summarize };
