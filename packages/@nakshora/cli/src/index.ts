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
export { version } from '@nakshora/core';
