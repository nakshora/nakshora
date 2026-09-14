// tailwind-defaults.ts is generated from the pinned tailwindcss dev
// dependency. This keeps the file and the generator honest: the script must
// reproduce the committed file byte-for-byte.
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { expect, it } from 'vitest';

it('scripts/sync-tailwind-theme.mjs --check reproduces src/tailwind-defaults.ts', () => {
  const root = join(__dirname, '../../../..');
  const r = spawnSync(process.execPath, ['scripts/sync-tailwind-theme.mjs', '--check'], {
    cwd: root,
    encoding: 'utf-8',
  });
  expect(r.stderr).toBe('');
  expect(r.status).toBe(0);
  expect(r.stdout).toContain('in sync with tailwindcss@3.4.19');
});
