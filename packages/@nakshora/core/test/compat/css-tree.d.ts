declare module 'css-tree' {
  export interface CssNode {
    type: string;
    [key: string]: unknown;
  }
  export interface Declaration extends CssNode {
    property: string;
    value: CssNode;
  }
  export interface Rule extends CssNode {
    prelude: CssNode;
  }
  export function parse(
    css: string,
    options?: {
      positions?: boolean;
      onParseError?: (err: {
        message: string;
        line: number;
        column: number;
        offset: number;
      }) => void;
    },
  ): CssNode;
  export function generate(node: CssNode): string;
  export function walk(
    ast: CssNode,
    options:
      | {
          visit?: string; // eslint-disable-next-line @typescript-eslint/no-explicit-any
          enter: (node: any) => void;
        }
      | ((node: CssNode) => void),
  ): void;
  export const lexer: {
    matchDeclaration(node: Declaration): { error: { name: string; message: string } | null };
    matchProperty(prop: string, value: string): { error: { name: string; message: string } | null };
  };
}
