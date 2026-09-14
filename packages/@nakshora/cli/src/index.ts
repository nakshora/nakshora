// Nakshora CLI — library entry (importable build pipeline)

export { runBuild, summarize, collectWatchPaths } from './build';
export type { BuildInput, BuildResult } from './build';
export { findConfigFile, loadConfigFile, resolveConfig } from './config-loader';
export { resolveContent, resolveSources } from './content';
export { createWatcher } from './watch';
export type { WatcherHandle } from './watch';
export { version } from '@nakshora/core';
