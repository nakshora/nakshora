// Nakshora CLI — library entry (importable build pipeline)

export { runBuild, summarize, collectWatchPaths, generatedSourceMap } from './build';
export { diagnose, formatFindings } from './doctor';
export type { Finding, Level } from './doctor';
export {
  migrateSource,
  migrateTailwindConfig,
  runMigrate,
  V1_RENAMES,
  TAILWIND_RENAMES,
} from './migrate';
export type { MigrateResult, MigrateRunOptions } from './migrate';
export type { BuildInput, BuildResult } from './build';
export { findConfigFile, loadConfigFile, resolveConfig } from './config-loader';
export { resolveContent, resolveSources } from './content';
export { createWatcher } from './watch';
export type { WatcherHandle } from './watch';
export { LanguageService, extractColor } from './language-service';
export type {
  Region,
  Token,
  CompletionItem,
  Hover,
  Diagnostic,
  ColorInformation,
  LanguageServiceOptions,
} from './language-service';
export { startLanguageServer } from './language-server';
export { startDevServer, injectClient, clientScript, CLIENT_PATH, EVENTS_PATH } from './serve';
export type { DevServer, DevServerOptions } from './serve';
export type { LspOptions } from './language-server';
export { version } from '@nakshora/core';
