// `nakshora dev --serve`: static server + in-memory stylesheet + SSE hot-swap.
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { startDevServer, injectClient, clientScript, CLIENT_PATH, EVENTS_PATH } from '../src/serve';

const CLI = join(__dirname, '../dist/cli.js');
let root: string;

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), 'nakshora-serve-'));
  mkdirSync(join(root, 'sub'));
  writeFileSync(join(root, 'index.html'), '<html><body><a class="flex">x</a></body></html>');
  writeFileSync(join(root, 'sub/page.htm'), '<p class="p-4">no body tag');
  writeFileSync(join(root, 'app.js'), 'console.log(1)');
  writeFileSync(join(root, 'nakshora.config.json'), JSON.stringify({ content: ['./**/*.html'] }));
});
afterAll(() => rmSync(root, { recursive: true, force: true }));

function sse(url: string): Promise<{ events: string[]; close: () => void }> {
  return new Promise((resolve, reject) => {
    const ac = new AbortController();
    const events: string[] = [];
    fetch(url, { signal: ac.signal })
      .then(async (res) => {
        resolve({ events, close: () => ac.abort() });
        const reader = res.body!.getReader();
        const dec = new TextDecoder();
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          for (const m of dec.decode(value).matchAll(/event: (\w+)/g)) events.push(m[1]);
        }
      })
      .catch((e) => (e.name === 'AbortError' ? undefined : reject(e)));
  });
}
const until = async (fn: () => boolean, ms = 5000) => {
  const t0 = Date.now();
  while (!fn()) {
    if (Date.now() - t0 > ms) throw new Error('timeout');
    await new Promise((r) => setTimeout(r, 25));
  }
};

describe('injectClient', () => {
  it('adds the client before </body>, else </html>, else appends; idempotent', () => {
    const tag = `<script src="${CLIENT_PATH}"></script>`;
    expect(injectClient('<body><p>x</p></body>')).toBe(`<body><p>x</p>${tag}\n</body>`);
    expect(injectClient('<html><p>x</p></HTML>')).toBe(`<html><p>x</p>${tag}\n</HTML>`);
    expect(injectClient('<p>x</p>')).toBe(`<p>x</p>\n${tag}\n`);
    expect(injectClient(injectClient('<body></body>'))).toBe(injectClient('<body></body>'));
    expect(clientScript('/out.css')).toContain('"/out.css"');
    expect(clientScript('/out.css')).toContain(EVENTS_PATH);
  });
});

describe('startDevServer', () => {
  it('serves files, the in-memory stylesheet and pushes css/reload events', async () => {
    const srv = await startDevServer({
      root,
      port: 0,
      host: '127.0.0.1',
      css: '.flex{display:flex}',
      cssPath: 'styles/out.css',
    });
    try {
      expect(srv.url).toMatch(/^http:\/\/127\.0\.0\.1:\d+\/$/);
      const html = await fetch(srv.url).then((r) => r.text());
      expect(html).toBe(
        `<html><body><a class="flex">x</a><script src="${CLIENT_PATH}"></script>\n</body></html>`,
      );
      const sub = await fetch(`${srv.url}sub/page.htm`);
      expect(sub.headers.get('content-type')).toBe('text/html; charset=utf-8');
      expect(await sub.text()).toContain(CLIENT_PATH);
      const js = await fetch(`${srv.url}app.js`);
      expect(js.headers.get('content-type')).toBe('text/javascript; charset=utf-8');
      expect(await js.text()).toBe('console.log(1)');
      const css = await fetch(`${srv.url}styles/out.css`);
      expect(css.headers.get('content-type')).toBe('text/css; charset=utf-8');
      expect(await css.text()).toBe('.flex{display:flex}');
      expect((await fetch(`${srv.url}nope.css`)).status).toBe(404);
      expect((await fetch(`${srv.url}..%2F..%2Fetc%2Fpasswd`)).status).toBe(403);
      const client = await fetch(`${srv.url}${CLIENT_PATH.slice(1)}`).then((r) => r.text());
      expect(client).toContain('"/styles/out.css"');

      const stream = await sse(`${srv.url}${EVENTS_PATH.slice(1)}`);
      await until(() => srv.clients() === 1);
      srv.updateCss('.grid{display:grid}');
      srv.updateCss('.grid{display:grid}'); // identical → no event
      srv.reload();
      await until(() => stream.events.length === 2);
      expect(stream.events).toEqual(['css', 'reload']);
      expect(await fetch(`${srv.url}styles/out.css`).then((r) => r.text())).toBe(
        '.grid{display:grid}',
      );
      stream.close();
      await until(() => srv.clients() === 0);
    } finally {
      await srv.close();
    }
  });
});

describe('nakshora dev --serve', () => {
  it('builds, serves, hot-swaps CSS on a class change and reloads on a no-CSS change', async () => {
    const proj = mkdtempSync(join(tmpdir(), 'nakshora-dev-'));
    writeFileSync(
      join(proj, 'index.html'),
      '<html><body><a class="flex p-4">x</a><link rel="stylesheet" href="/nakshora.css"></body></html>',
    );
    writeFileSync(join(proj, 'nakshora.config.json'), JSON.stringify({ content: ['./*.html'] }));
    const port = 3900 + Math.floor(Math.random() * 100);
    const child = spawn(
      process.execPath,
      [CLI, 'dev', '--serve', '--port', String(port), '--host', '127.0.0.1'],
      {
        cwd: proj,
        env: { ...process.env, NAKSHORA_CLI: '1', FORCE_COLOR: '0' },
      },
    );
    let log = '';
    let out = '';
    child.stderr.on('data', (d) => (log += d));
    child.stdout.on('data', (d) => (out += d));
    const url = `http://127.0.0.1:${port}/`;
    try {
      await until(() => log.includes('Watching'), 15000);
      expect(log).toContain(`➜ dev server ${url}`);
      expect(log).toMatch(/✔ \d+ classes · [\d.]+ KB in memory/);
      expect(out).toBe(''); // nothing dumped to stdout while serving
      const css1 = await fetch(`${url}nakshora.css`).then((r) => r.text());
      expect(css1).toContain('.flex { display: flex; }');
      expect(css1).not.toContain('.grid');
      const stream = await sse(`${url}${EVENTS_PATH.slice(1)}`);
      await new Promise((r) => setTimeout(r, 300));
      writeFileSync(
        join(proj, 'index.html'),
        '<html><body><a class="grid p-4">x</a><link rel="stylesheet" href="/nakshora.css"></body></html>',
      );
      await until(() => stream.events.includes('css'), 10000);
      const css2 = await fetch(`${url}nakshora.css`).then((r) => r.text());
      expect(css2).toContain('.grid { display: grid; }');
      expect(css2).not.toContain('.flex {');
      writeFileSync(
        join(proj, 'index.html'),
        '<html><body><a class="grid p-4">y</a><link rel="stylesheet" href="/nakshora.css"></body></html>',
      );
      await until(() => stream.events.includes('reload'), 10000);
      expect(out).toBe('');
      stream.close();
    } finally {
      child.kill('SIGTERM');
      await new Promise((r) => child.on('exit', r));
      rmSync(proj, { recursive: true, force: true });
    }
  }, 40000);
});
