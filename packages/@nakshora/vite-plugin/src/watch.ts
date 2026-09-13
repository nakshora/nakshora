// Nakshora Vite plugin — dependency-free file watching (recursive with polling fallback)

import { readdirSync, statSync, watch } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

export interface WatcherHandle {
  close(): void;
}

export function createWatcher(paths: string[], onChange: () => void): WatcherHandle {
  const dirs = new Set<string>();
  for (const p of paths) {
    try {
      const abs = resolve(p);
      if (statSync(abs).isDirectory()) dirs.add(abs);
      else dirs.add(dirname(abs));
    } catch {
      // path doesn't exist yet
    }
  }
  if (dirs.size === 0) return { close() {} };

  const closed = { value: false };
  let timer: NodeJS.Timeout | undefined;
  const watchers: ReturnType<typeof watch>[] = [];
  let usePolling = false;

  for (const dir of dirs) {
    try {
      const w = watch(dir, { recursive: true }, () => {
        if (!closed.value) onChange();
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
          if (name === 'node_modules' || name === '.git' || name === 'dist') continue;
          const full = join(dir, name);
          let st;
          try {
            st = statSync(full);
          } catch {
            continue;
          }
          if (st.isDirectory()) walk(full);
          else map.set(full, st.mtimeMs);
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
    timer.unref?.();
  }

  return {
    close() {
      closed.value = true;
      if (timer) clearInterval(timer);
      for (const w of watchers) w.close();
    },
  };
}
