// Nakshora CLI — configuration discovery & loading

import { existsSync, readFileSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import type { NakshoraConfig } from '@nakshora/core';

const CONFIG_FILES = [
  'nakshora.config.ts',
  'nakshora.config.js',
  'nakshora.config.mjs',
  'nakshora.config.cjs',
  'nakshora.config.json',
];

/**
 * Find the nearest Nakshora config file, walking up from `startDir`.
 */
export function findConfigFile(startDir: string = process.cwd()): string | null {
  let dir = resolve(startDir);
  for (let i = 0; i < 5; i++) {
    for (const file of CONFIG_FILES) {
      const candidate = join(dir, file);
      if (existsSync(candidate)) return candidate;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

/**
 * Load a Nakshora config file of any supported extension.
 * TypeScript configs are supported natively on Node ≥ 22.18
 * (type stripping); on older runtimes use a .js/.mjs/.cjs/.json config.
 */
export async function loadConfigFile(file: string): Promise<Partial<NakshoraConfig>> {
  const ext = file.slice(file.lastIndexOf('.'));
  if (ext === '.json') {
    return JSON.parse(readFileSync(file, 'utf-8')) as Partial<NakshoraConfig>;
  }
  try {
    const mod = await import(file);
    const cfg = (mod.default ?? mod) as Partial<NakshoraConfig>;
    return cfg;
  } catch (err) {
    if (ext === '.ts' && (err as Error).message.includes('Unknown file extension')) {
      throw new Error(
        `TypeScript configs require Node >= 22.18 (native type stripping).\n` +
          `You are on Node ${process.version}. Use a .js, .mjs or .json config instead,\n` +
          `or upgrade Node (https://nodejs.org).`,
      );
    }
    throw err;
  }
}

/**
 * Load config from an explicit path, or discover it automatically.
 */
export async function resolveConfig(
  explicitPath?: string,
  startDir?: string,
): Promise<{ config: Partial<NakshoraConfig>; file: string | null }> {
  const file = explicitPath
    ? isAbsolute(explicitPath)
      ? explicitPath
      : resolve(startDir ?? process.cwd(), explicitPath)
    : findConfigFile(startDir);
  if (!file) return { config: {}, file: null };
  if (!existsSync(file)) {
    throw new Error(`Config file not found: ${file}`);
  }
  const config = await loadConfigFile(file);
  return { config, file };
}
