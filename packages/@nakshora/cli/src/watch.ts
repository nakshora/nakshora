// Nakshora CLI — dependency-free file watching (recursive with polling fallback)

import { readdirSync, statSync, watch } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

export interface WatcherHandle {
  close(): void;
}

/**
 * Watch directories (recursively) for changes.
 * Uses native recursive fs.watch where available, otherwise polls.
 */
export function createWatcher(paths: string[], onChange: () => void): WatcherHandle {
  const dirs = new Set<string>();
  for (const p of paths) {
    try {
      const abs = resolve(p);
      if (statSync(abs).isDirectory()) dirs.add(abs);
      else dirs.add(dirname(abs));
    } catch {
      // path doesn't exist yet — ignore
    }
  }

  if (dirs.size === 0) {
    return { close() {} };
  }

  const closed = { value: false };
  let timer: NodeJS.Timeout | undefined;
  const watchers: ReturnType<typeof watch>[] = [];
  let usePolling = false;

  for (const dir of dirs) {
    try {
      const w = watch(dir, { recursive: true }, () => {
        if (closed.value) return;
        onChange();
      });
      watchers.push(w);
    } catch {
      usePolling = true;
    }
  }

  if (usePolling) {
    const snapshot = (): Map<string, number> => {
      const map = new Map<string, number>();
      const walk = (dir: string): void => {
        let entries: string[] = [];
        try {
          entries = readdirSync(dir);
        } catch {
          return;
        }
        for (const name of entries) {
          const full = join(dir, name);
          let st;
          try {
            st = statSync(full);
          } catch {
            continue;
          }
          if (st.isDirectory()) {
            if (name !== 'node_modules' && name !== '.git' && name !== 'dist') walk(full);
          } else {
            map.set(full, st.mtimeMs);
          }
        }
      };
      for (const dir of dirs) walk(dir);
      return map;
    };
    let last = snapshot();
    timer = setInterval(() => {
      if (closed.value) return;
      const current = snapshot();
      if (current.size !== last.size) {
        onChange();
        last = current;
        return;
      }
      for (const [file, mtime] of current) {
        if (mtime !== last.get(file)) {
          onChange();
          last = current;
          return;
        }
      }
    }, 400);
    if (typeof timer.unref === 'function') timer.unref();
  }

  return {
    close() {
      closed.value = true;
      if (timer) clearInterval(timer);
      for (const w of watchers) w.close();
    },
  };
}
