import { NakshoraConfig } from '@nakshora/core';
export { version } from '@nakshora/core';
import { Connection } from 'vscode-languageserver/node';
import { Server } from 'node:http';

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
declare function summarize(result: BuildResult, output: string | undefined | 'memory'): string;
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

interface Region {
    /** offset of the first character of the class list */
    start: number;
    /** offset one past the last character */
    end: number;
    kind: 'attribute' | 'apply' | 'call';
}
interface Token {
    text: string;
    start: number;
    end: number;
    region: Region;
}
interface CompletionItem {
    label: string;
    /** `variant` items insert `name:`; `class` items insert the class */
    kind: 'class' | 'variant' | 'component';
    detail?: string;
    /** replacement range for the segment being completed */
    start: number;
    end: number;
}
interface Hover {
    css: string;
    start: number;
    end: number;
}
interface Diagnostic {
    code: 'unknownClass' | 'invalidApply' | 'cssConflict';
    severity: 'error' | 'warning' | 'information';
    message: string;
    start: number;
    end: number;
}
interface ColorInformation {
    start: number;
    end: number;
    /** 0–1 components */
    red: number;
    green: number;
    blue: number;
    alpha: number;
}
interface LanguageServiceOptions {
    config?: Partial<NakshoraConfig>;
    /** extra attribute names treated as class lists (default: class, className, class:list) */
    classAttributes?: string[];
    /** extra call names whose string arguments are class lists */
    classFunctions?: string[];
    /** maximum completion items returned (default 300) */
    completionLimit?: number;
}
declare class LanguageService {
    private generator;
    private catalog;
    private catalogIndex;
    private components;
    private variants;
    private attributes;
    private functions;
    private limit;
    private attributeRe;
    private callRe;
    constructor(options?: LanguageServiceOptions);
    /** Swap the configuration (config file changed). */
    reload(config?: Partial<NakshoraConfig>): void;
    private index;
    /** Class-list regions of a document. `languageId` selects the scanners. */
    regions(text: string, languageId?: string): Region[];
    /** Every class token of every region. */
    tokens(text: string, languageId?: string): Token[];
    /** The token under `offset` (or the empty token at the caret inside a region). */
    tokenAt(text: string, offset: number, languageId?: string): Token | null;
    complete(text: string, offset: number, languageId?: string): {
        items: CompletionItem[];
        incomplete: boolean;
    };
    /** CSS of the candidate under `offset` (null when unknown). */
    hover(text: string, offset: number, languageId?: string): Hover | null;
    compile(candidate: string): string;
    diagnostics(text: string, languageId?: string): Diagnostic[];
    colors(text: string, languageId?: string): ColorInformation[];
    private isComponent;
}
/** First colour in a CSS value, as 0–1 rgba (null when none / currentColor). */
declare function extractColor(value: string): {
    red: number;
    green: number;
    blue: number;
    alpha: number;
} | null;

interface LspOptions {
    /** explicit config path (else discovered from the workspace root) */
    config?: string;
    connection?: Connection;
}
declare function startLanguageServer(options?: LspOptions): Connection;

interface DevServerOptions {
    /** directory to serve (default: process.cwd()) */
    root?: string;
    port?: number;
    host?: string;
    /** URL path of the stylesheet (default `/nakshora.css`) */
    cssPath?: string;
    /** initial stylesheet */
    css?: string;
}
interface DevServer {
    server: Server;
    port: number;
    host: string;
    url: string;
    /** publish a new stylesheet — connected clients hot-swap it */
    updateCss(css: string): void;
    /** ask connected clients to reload the page */
    reload(): void;
    /** number of connected clients */
    clients(): number;
    close(): Promise<void>;
}
declare const CLIENT_PATH = "/__nakshora/client.js";
declare const EVENTS_PATH = "/__nakshora/events";
/** Browser client (kept dependency-free and tiny). */
declare function clientScript(cssPath: string): string;
declare function injectClient(html: string): string;
declare function startDevServer(options?: DevServerOptions): Promise<DevServer>;

export { type BuildInput, type BuildResult, CLIENT_PATH, type ColorInformation, type CompletionItem, type DevServer, type DevServerOptions, type Diagnostic, EVENTS_PATH, type Finding, type Hover, LanguageService, type LanguageServiceOptions, type Level, type LspOptions, type MigrateResult, type MigrateRunOptions, type Region, TAILWIND_RENAMES, type Token, V1_RENAMES, type WatcherHandle, clientScript, collectWatchPaths, createWatcher, diagnose, extractColor, findConfigFile, formatFindings, generatedSourceMap, injectClient, loadConfigFile, migrateSource, migrateTailwindConfig, resolveConfig, resolveContent, resolveSources, runBuild, runMigrate, startDevServer, startLanguageServer, summarize };
