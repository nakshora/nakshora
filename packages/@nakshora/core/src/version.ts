// Single source of truth for the package version: the runtime `version` export,
// the CSS banners and the AI corpus all read it. It is rewritten from the
// published packages' package.json by `scripts/sync-version.mjs` (run by
// `pnpm release:version`), and `core/test/version.test.ts` asserts it equals
// every package.json in the workspace.
export const version = '3.0.0';
