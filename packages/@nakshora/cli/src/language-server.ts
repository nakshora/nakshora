// Nakshora language server (LSP over stdio) — `nakshora lsp`.
//
// A thin transport around `LanguageService`: completion, hover, diagnostics,
// document colours. The config is discovered from the workspace root (or
// the `nakshora.config` initialization option) and reloaded when it changes.
// Any LSP client works (VS Code, Neovim, Zed, Helix); see docs/EDITORS.md.

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import {
  createConnection,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind,
  CompletionItemKind,
  DiagnosticSeverity,
  MarkupKind,
  type InitializeParams,
  type InitializeResult,
  type Connection,
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { LanguageService } from './language-service';
import { resolveConfig } from './config-loader';

export interface LspOptions {
  /** explicit config path (else discovered from the workspace root) */
  config?: string;
  connection?: Connection;
}

const KIND = {
  class: CompletionItemKind.Constant,
  variant: CompletionItemKind.Module,
  component: CompletionItemKind.Class,
} as const;
const SEVERITY = {
  error: DiagnosticSeverity.Error,
  warning: DiagnosticSeverity.Warning,
  information: DiagnosticSeverity.Information,
} as const;

export function startLanguageServer(options: LspOptions = {}): Connection {
  const connection =
    options.connection ?? createConnection(ProposedFeatures.all, process.stdin, process.stdout);
  const documents = new TextDocuments(TextDocument);
  let service = new LanguageService();
  let rootDir = process.cwd();
  let configFile: string | null = null;

  async function loadConfig(): Promise<void> {
    try {
      const resolved = await resolveConfig(options.config, rootDir);
      configFile = resolved.file;
      service.reload(resolved.config);
      connection.console.log(`nakshora: config ${configFile ?? '(defaults)'}`);
    } catch (err) {
      connection.console.error(`nakshora: config error — ${(err as Error).message}`);
      service = new LanguageService();
    }
    for (const doc of documents.all()) validate(doc);
  }

  function validate(doc: TextDocument): void {
    const diagnostics = service.diagnostics(doc.getText(), doc.languageId).map((d) => ({
      range: { start: doc.positionAt(d.start), end: doc.positionAt(d.end) },
      severity: SEVERITY[d.severity],
      code: d.code,
      source: 'nakshora',
      message: d.message,
    }));
    void connection.sendDiagnostics({ uri: doc.uri, diagnostics });
  }

  connection.onInitialize((params: InitializeParams): InitializeResult => {
    const root = params.workspaceFolders?.[0]?.uri ?? params.rootUri;
    if (root) rootDir = fileURLToPath(root);
    const init = params.initializationOptions as { config?: string } | undefined;
    if (init?.config && !options.config) options.config = init.config;
    return {
      capabilities: {
        textDocumentSync: TextDocumentSyncKind.Incremental,
        completionProvider: { triggerCharacters: [':', '-', '"', "'", ' ', '['] },
        hoverProvider: true,
        colorProvider: true,
      },
      serverInfo: { name: 'nakshora-language-server' },
    };
  });
  connection.onInitialized(() => void loadConfig());

  connection.onDidChangeWatchedFiles((e) => {
    if (e.changes.some((c) => /nakshora\.config\.\w+$/.test(c.uri))) void loadConfig();
  });
  documents.onDidChangeContent((e) => {
    if (configFile && fileURLToPath(e.document.uri) === configFile) return;
    validate(e.document);
  });
  documents.onDidSave((e) => {
    const path = fileURLToPath(e.document.uri);
    if (
      path === configFile ||
      (!configFile && dirname(path) === rootDir && /nakshora\.config\./.test(path))
    )
      void loadConfig();
  });
  documents.onDidClose(
    (e) => void connection.sendDiagnostics({ uri: e.document.uri, diagnostics: [] }),
  );

  connection.onCompletion((params) => {
    const doc = documents.get(params.textDocument.uri);
    if (!doc) return null;
    const { items, incomplete } = service.complete(
      doc.getText(),
      doc.offsetAt(params.position),
      doc.languageId,
    );
    return {
      isIncomplete: incomplete,
      items: items.map((item, i) => ({
        label: item.label,
        kind: KIND[item.kind],
        detail: item.detail,
        sortText: String(i).padStart(5, '0'),
        textEdit: {
          range: { start: doc.positionAt(item.start), end: doc.positionAt(item.end) },
          newText: item.label,
        },
        command:
          item.kind === 'variant'
            ? { title: 'suggest', command: 'editor.action.triggerSuggest' }
            : undefined,
      })),
    };
  });
  connection.onCompletionResolve((item) => {
    if (item.kind === KIND.class || item.kind === KIND.component) {
      const css = service.compile(item.label);
      if (css)
        item.documentation = { kind: MarkupKind.Markdown, value: '```css\n' + css + '\n```' };
    }
    return item;
  });

  connection.onHover((params) => {
    const doc = documents.get(params.textDocument.uri);
    if (!doc) return null;
    const h = service.hover(doc.getText(), doc.offsetAt(params.position), doc.languageId);
    if (!h) return null;
    return {
      contents: { kind: MarkupKind.Markdown, value: '```css\n' + h.css + '\n```' },
      range: { start: doc.positionAt(h.start), end: doc.positionAt(h.end) },
    };
  });

  connection.onDocumentColor((params) => {
    const doc = documents.get(params.textDocument.uri);
    if (!doc) return [];
    return service.colors(doc.getText(), doc.languageId).map((c) => ({
      range: { start: doc.positionAt(c.start), end: doc.positionAt(c.end) },
      color: { red: c.red, green: c.green, blue: c.blue, alpha: c.alpha },
    }));
  });
  connection.onColorPresentation(() => []);

  documents.listen(connection);
  connection.listen();
  return connection;
}
