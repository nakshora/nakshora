// Nakshora dev server — `nakshora dev --serve`.
//
// A dependency-free static server for plain HTML projects (no bundler):
//   • serves `root` (default: cwd) with correct content types
//   • serves the compiled stylesheet at `/<output>` (or `/nakshora.css`)
//     straight from memory, so no file needs to be written
//   • injects a tiny client into every HTML response that listens on
//     `/__nakshora/events` (Server-Sent Events); on a rebuild the
//     stylesheet is hot-swapped (no page reload) and on an HTML change the
//     page reloads
//   • binds to 0.0.0.0 by default so it works behind proxies/containers

import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, relative, resolve, sep } from 'node:path';

export interface DevServerOptions {
  /** directory to serve (default: process.cwd()) */
  root?: string;
  port?: number;
  host?: string;
  /** URL path of the stylesheet (default `/nakshora.css`) */
  cssPath?: string;
  /** initial stylesheet */
  css?: string;
}

export interface DevServer {
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

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
};

export const CLIENT_PATH = '/__nakshora/client.js';
export const EVENTS_PATH = '/__nakshora/events';

/** Browser client (kept dependency-free and tiny). */
export function clientScript(cssPath: string): string {
  return `// nakshora dev client
(function () {
  var css = ${JSON.stringify(cssPath)};
  var es = new EventSource(${JSON.stringify(EVENTS_PATH)});
  es.addEventListener('css', function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    var swapped = false;
    for (var i = 0; i < links.length; i++) {
      var l = links[i];
      var href = l.getAttribute('href') || '';
      if (href.split('?')[0] === css || href.split('?')[0].endsWith(css)) {
        var next = l.cloneNode();
        next.href = css + '?t=' + Date.now();
        next.onload = function () { l.remove(); };
        l.parentNode.insertBefore(next, l.nextSibling);
        swapped = true;
      }
    }
    if (!swapped) location.reload();
  });
  es.addEventListener('reload', function () { location.reload(); });
  es.onerror = function () { setTimeout(function () { location.reload(); }, 1000); es.close(); };
})();
`;
}

export function injectClient(html: string): string {
  const tag = `<script src="${CLIENT_PATH}"></script>`;
  if (html.includes(CLIENT_PATH)) return html;
  const i = html.search(/<\/body\s*>/i);
  if (i !== -1) return `${html.slice(0, i)}${tag}\n${html.slice(i)}`;
  const j = html.search(/<\/html\s*>/i);
  if (j !== -1) return `${html.slice(0, j)}${tag}\n${html.slice(j)}`;
  return `${html}\n${tag}\n`;
}

export function startDevServer(options: DevServerOptions = {}): Promise<DevServer> {
  const root = resolve(options.root ?? process.cwd());
  const host = options.host ?? '0.0.0.0';
  const cssPath = normalizeCssPath(options.cssPath ?? '/nakshora.css');
  let css = options.css ?? '';
  const clients = new Set<ServerResponse>();

  const broadcast = (event: string, data = '{}'): void => {
    for (const res of clients) res.write(`event: ${event}\ndata: ${data}\n\n`);
  };

  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);

    if (pathname === EVENTS_PATH) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      });
      res.write('retry: 1000\n\n');
      clients.add(res);
      req.on('close', () => clients.delete(res));
      return;
    }
    if (pathname === CLIENT_PATH) {
      res.writeHead(200, { 'Content-Type': TYPES['.js'], 'Cache-Control': 'no-cache' });
      res.end(clientScript(cssPath));
      return;
    }
    if (pathname === cssPath) {
      res.writeHead(200, {
        'Content-Type': TYPES['.css'],
        'Cache-Control': 'no-cache',
        'Content-Length': Buffer.byteLength(css),
      });
      res.end(css);
      return;
    }

    // static files, directory → index.html, path-traversal safe
    let file = normalize(join(root, pathname));
    const rel = relative(root, file);
    if (rel.startsWith('..') || rel.startsWith(sep + '..')) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    try {
      if (statSync(file).isDirectory()) file = join(file, 'index.html');
    } catch {
      // fall through to 404 below
    }
    if (!existsSync(file) || !statSync(file).isFile()) {
      res.writeHead(404, { 'Content-Type': TYPES['.txt'] }).end(`Not found: ${pathname}`);
      return;
    }
    const type = TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream';
    if (type.startsWith('text/html')) {
      let html = '';
      createReadStream(file, 'utf-8')
        .on('data', (chunk: string | Buffer) => (html += chunk))
        .on('end', () => {
          const body = injectClient(html);
          res.writeHead(200, {
            'Content-Type': type,
            'Cache-Control': 'no-cache',
            'Content-Length': Buffer.byteLength(body),
          });
          res.end(body);
        })
        .on('error', () => res.writeHead(500).end());
      return;
    }
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
    createReadStream(file).pipe(res);
  });

  return new Promise((resolvePromise, reject) => {
    server.once('error', reject);
    server.listen(options.port ?? 0, host, () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : (options.port ?? 0);
      const shownHost = host === '0.0.0.0' || host === '::' ? 'localhost' : host;
      resolvePromise({
        server,
        port,
        host,
        url: `http://${shownHost}:${port}/`,
        updateCss(next: string) {
          if (next === css) return;
          css = next;
          broadcast('css', JSON.stringify({ bytes: Buffer.byteLength(css) }));
        },
        reload() {
          broadcast('reload');
        },
        clients: () => clients.size,
        close: () =>
          new Promise<void>((done) => {
            for (const c of clients) c.end();
            clients.clear();
            server.close(() => done());
          }),
      });
    });
  });
}

function normalizeCssPath(p: string): string {
  const clean = p.replace(/\\/g, '/').replace(/^\.\//, '');
  return clean.startsWith('/') ? clean : `/${clean}`;
}
