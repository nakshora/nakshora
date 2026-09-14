// Editor intelligence: the pure LanguageService and the LSP transport
// (`nakshora lsp`), the latter driven end-to-end over stdio with real
// JSON-RPC framing.
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { LanguageService, extractColor } from '../src/language-service';

const CLI = join(__dirname, '../dist/cli.js');
const ls = new LanguageService();
const doc =
  '<div class="flex p-4 p-2 hover:bg-blue-500 md:flexx group text-white neon-btn">\n' +
  '<i className={clsx("grid", cond && "hidden")} />\n' +
  'const s = tw`mt-2 ${x} sm:mt-4`;\n';

describe('LanguageService', () => {
  it('finds class regions in attributes, helper calls and tagged templates', () => {
    expect(ls.regions(doc).map((r) => [r.kind, doc.slice(r.start, r.end)])).toEqual([
      ['attribute', 'flex p-4 p-2 hover:bg-blue-500 md:flexx group text-white neon-btn'],
      ['call', 'grid'],
      ['call', 'hidden'],
      ['call', 'mt-2 ${x} sm:mt-4'],
    ]);
    expect(ls.tokens(doc).map((t) => t.text)).toEqual([
      'flex',
      'p-4',
      'p-2',
      'hover:bg-blue-500',
      'md:flexx',
      'group',
      'text-white',
      'neon-btn',
      'grid',
      'hidden',
      'mt-2',
      'sm:mt-4',
    ]);
    const css = '.btn { @apply px-4 hover:flex; color: red }';
    expect(ls.regions(css, 'css')).toEqual([{ start: 14, end: 29, kind: 'apply' }]);
    expect(ls.regions('<p title="flex">', 'html')).toEqual([]);
    // unterminated attribute (mid-typing) runs to the end of the line
    expect(ls.regions('<p class="fl\n<b>')).toEqual([{ start: 10, end: 12, kind: 'attribute' }]);
  });

  it('completes utilities, variants and components at the caret', () => {
    const at = (needle: string, extra = 0) => doc.indexOf(needle) + extra;
    const flex = ls.complete(doc, at('flex', 2)); // "fl|ex"
    expect(flex.items.some((i) => i.label === 'flex' && i.kind === 'class')).toBe(true);
    expect(flex.items.some((i) => i.label === 'flex-col')).toBe(true);
    expect(flex.items.every((i) => i.start === at('flex') && i.end === at('flex') + 4)).toBe(true);
    const hov = ls.complete(doc, at('hover:', 3)); // "hov|"
    expect(hov.items.filter((i) => i.kind === 'variant').map((i) => i.label)).toEqual(['hover:']);
    const afterVariant = ls.complete(doc, at('hover:', 6)); // "hover:|bg-blue-500"
    expect(afterVariant.items.some((i) => i.label === 'group-hover:')).toBe(true);
    expect(afterVariant.items.some((i) => i.label === 'bg-blue-500')).toBe(true);
    expect(afterVariant.items[0].start).toBe(at('hover:') + 6); // replaces only the segment
    expect(afterVariant.incomplete).toBe(true); // catalog cut at the limit
    const comp = ls.complete(doc, at('neon-btn', 5));
    expect(comp.items.some((i) => i.label === 'neon-btn' && i.kind === 'component')).toBe(true);
    const apply = ls.complete('.a { @apply p- }', 13, 'css');
    expect(apply.items.some((i) => i.label === 'p-4')).toBe(true);
    expect(apply.items.some((i) => i.kind === 'variant')).toBe(false);
    expect(ls.complete('<p>te', 5).items).toEqual([]);
  });

  it('hover shows the compiled CSS, including variants and components', () => {
    const h = ls.hover(doc, doc.indexOf('hover:bg-blue-500') + 8);
    expect(h?.css).toBe(
      '.hover\\:bg-blue-500:hover { --tw-bg-opacity: 1; background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1)); }',
    );
    expect(doc.slice(h!.start, h!.end)).toBe('hover:bg-blue-500');
    expect(ls.hover(doc, doc.indexOf('neon-btn') + 1)?.css).toMatch(
      /^\.neon-btn \{ display: inline-block;/,
    );
    expect(ls.hover(doc, doc.indexOf('md:flexx') + 1)).toBeNull();
    expect(ls.hover(doc, 2)).toBeNull();
  });

  it('diagnostics: unknown variant classes, @apply errors, property conflicts', () => {
    const d = ls.diagnostics(doc);
    expect(d.map((x) => [x.code, doc.slice(x.start, x.end)])).toEqual([
      ['cssConflict', 'p-4'],
      ['cssConflict', 'p-2'],
      ['unknownClass', 'md:flexx'],
    ]);
    expect(d[2].severity).toBe('warning');
    // markers/components are not "unknown"; plain typos in markup are not flagged (could be app classes)
    expect(ls.diagnostics('<a class="group peer neon-btn my-app-class">')).toEqual([]);
    // conflicts are scoped per variant/media: md:p-4 vs p-4 is fine, md:p-4 vs md:p-2 is not
    expect(ls.diagnostics('<a class="p-4 md:p-4 hover:p-2">')).toEqual([]);
    expect(ls.diagnostics('<a class="md:p-4 md:p-2">').map((x) => x.code)).toEqual([
      'cssConflict',
      'cssConflict',
    ]);
    // px-4 and p-4 set different property sets → no conflict; text-red-500 vs text-lg neither
    expect(ls.diagnostics('<a class="px-4 p-4 text-red-500 text-lg">')).toEqual([]);
    const css = ls.diagnostics('.btn { @apply px-4 nope-2 hover:flex; }', 'css');
    expect(css).toEqual([
      expect.objectContaining({ code: 'invalidApply', severity: 'error', start: 19, end: 25 }),
    ]);
  });

  it('colour decorators for colour utilities', () => {
    const c = ls.colors(doc);
    expect(c.map((x) => doc.slice(x.start, x.end))).toEqual(['hover:bg-blue-500', 'text-white']);
    expect(c[0]).toMatchObject({ red: 59 / 255, green: 130 / 255, blue: 246 / 255, alpha: 1 });
    expect(ls.colors('<a class="bg-blue-500/50 bg-transparent p-4">')).toMatchObject([
      { alpha: 0.5 },
      { alpha: 0 },
    ]);
    expect(extractColor('rgb(59 130 246 / var(--tw-bg-opacity, 1))')).toMatchObject({ alpha: 1 });
    expect(extractColor('hsl(0 100% 50%)')).toMatchObject({ red: 1, green: 0, blue: 0 });
    expect(extractColor('1rem')).toBeNull();
    expect(extractColor('currentColor')).toBeNull();
  });

  it('honours the project config (custom colours, disabled variants, plugins)', () => {
    const custom = new LanguageService({
      config: {
        theme: { extend: { colors: { brand: '#123456' } } },
        variants: { hover: false },
        plugins: [
          {
            handler: (api: { addComponents: (c: object) => void }) =>
              api.addComponents({ '.btn-x': { padding: '1px' } }),
          },
        ],
      },
    });
    expect(custom.hover('<a class="bg-brand">', 12)?.css).toContain('rgb(18 52 86');
    expect(custom.diagnostics('<a class="hover:flex">')).toMatchObject([{ code: 'unknownClass' }]);
    expect(custom.hover('<a class="btn-x">', 12)?.css).toBe('.btn-x { padding: 1px; }');
    // plugin components are part of the catalog → completed as classes
    expect(custom.complete('<a class="btn-', 14).items).toContainEqual(
      expect.objectContaining({ label: 'btn-x', kind: 'class' }),
    );
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any -- raw JSON-RPC payloads */
describe('nakshora lsp (stdio)', () => {
  it('initializes, publishes diagnostics, answers completion/hover/colour', async () => {
    const proj = mkdtempSync(join(tmpdir(), 'nakshora-lsp-'));
    writeFileSync(
      join(proj, 'nakshora.config.json'),
      JSON.stringify({ theme: { extend: { colors: { brand: '#ff0000' } } } }),
    );
    const child = spawn(process.execPath, [CLI, 'lsp'], {
      cwd: proj,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const pending = new Map<number, (v: unknown) => void>();
    const notifications: { method: string; params: unknown }[] = [];
    const waiters: { method: string; resolve: (p: unknown) => void }[] = [];
    let buf = Buffer.alloc(0);
    child.stdout.on('data', (chunk: Buffer) => {
      buf = Buffer.concat([buf, chunk]);
      for (;;) {
        const headerEnd = buf.indexOf('\r\n\r\n');
        if (headerEnd === -1) return;
        const len = Number(/Content-Length: (\d+)/.exec(buf.subarray(0, headerEnd).toString())![1]);
        if (buf.length < headerEnd + 4 + len) return;
        const msg = JSON.parse(buf.subarray(headerEnd + 4, headerEnd + 4 + len).toString());
        buf = buf.subarray(headerEnd + 4 + len);
        if (msg.id !== undefined && pending.has(msg.id)) {
          pending.get(msg.id)!(msg.result ?? msg.error);
          pending.delete(msg.id);
        } else if (msg.method) {
          notifications.push(msg);
          const i = waiters.findIndex((w) => w.method === msg.method);
          if (i !== -1) waiters.splice(i, 1)[0].resolve(msg.params);
        }
      }
    });
    const send = (m: object) => {
      const body = JSON.stringify({ jsonrpc: '2.0', ...m });
      child.stdin.write(`Content-Length: ${Buffer.byteLength(body)}\r\n\r\n${body}`);
    };
    let nextId = 1;
    const request = (method: string, params: unknown) =>
      new Promise<any>((resolve) => {
        const id = nextId++;
        pending.set(id, resolve);
        send({ id, method, params });
      });
    const notification = (method: string) =>
      new Promise<any>((resolve) => {
        const n = notifications.find((x) => x.method === method);
        if (n) resolve(n.params);
        else waiters.push({ method, resolve });
      });
    const withTimeout = <T>(p: Promise<T>, what: string) =>
      Promise.race([
        p,
        new Promise<T>((_, rej) => setTimeout(() => rej(new Error(`timeout: ${what}`)), 15000)),
      ]);

    try {
      const init = await withTimeout(
        request('initialize', {
          processId: process.pid,
          rootUri: pathToFileURL(proj).href,
          capabilities: {},
          workspaceFolders: [{ uri: pathToFileURL(proj).href, name: 'p' }],
        }),
        'initialize',
      );
      expect(init.capabilities.completionProvider.triggerCharacters).toContain(':');
      expect(init.capabilities.hoverProvider).toBe(true);
      expect(init.capabilities.colorProvider).toBe(true);
      send({ method: 'initialized', params: {} });
      const uri = pathToFileURL(join(proj, 'index.html')).href;
      const text = '<div class="flex md:flexx bg-brand">';
      send({
        method: 'textDocument/didOpen',
        params: { textDocument: { uri, languageId: 'html', version: 1, text } },
      });
      // the config is loaded asynchronously after `initialized`; wait for the log line, then re-validate
      await withTimeout(notification('window/logMessage'), 'config log');
      send({
        method: 'textDocument/didChange',
        params: { textDocument: { uri, version: 2 }, contentChanges: [{ text }] },
      });
      const diag = await withTimeout(
        new Promise<any>((resolve) => {
          const check = (p: any) =>
            p.diagnostics.length
              ? resolve(p)
              : waiters.push({ method: 'textDocument/publishDiagnostics', resolve: check });
          notification('textDocument/publishDiagnostics').then(check);
        }),
        'diagnostics',
      );
      expect(diag.uri).toBe(uri);
      expect(diag.diagnostics).toEqual([
        expect.objectContaining({
          code: 'unknownClass',
          severity: 2,
          source: 'nakshora',
          range: { start: { line: 0, character: 17 }, end: { line: 0, character: 25 } },
        }),
      ]);
      const hover = await withTimeout(
        request('textDocument/hover', {
          textDocument: { uri },
          position: { line: 0, character: 28 },
        }),
        'hover',
      );
      expect(hover.contents.value).toContain(
        '.bg-brand { --tw-bg-opacity: 1; background-color: rgb(255 0 0',
      );
      const completion = await withTimeout(
        request('textDocument/completion', {
          textDocument: { uri },
          position: { line: 0, character: 16 },
        }),
        'completion',
      );
      const flexCol = completion.items.find((i: any) => i.label === 'flex-col');
      expect(flexCol.textEdit.range).toEqual({
        start: { line: 0, character: 12 },
        end: { line: 0, character: 16 },
      });
      const resolved = await withTimeout(request('completionItem/resolve', flexCol), 'resolve');
      expect(resolved.documentation.value).toContain('.flex-col { flex-direction: column; }');
      const colors = await withTimeout(
        request('textDocument/documentColor', { textDocument: { uri } }),
        'colors',
      );
      expect(colors).toEqual([
        {
          range: { start: { line: 0, character: 26 }, end: { line: 0, character: 34 } },
          color: { red: 1, green: 0, blue: 0, alpha: 1 },
        },
      ]);
      await withTimeout(request('shutdown', null), 'shutdown');
      send({ method: 'exit', params: null });
      const code = await withTimeout(
        new Promise<number | null>((r) => child.on('exit', r)),
        'exit',
      );
      expect(code).toBe(0);
    } finally {
      child.kill();
      rmSync(proj, { recursive: true, force: true });
    }
  }, 30000);
});
