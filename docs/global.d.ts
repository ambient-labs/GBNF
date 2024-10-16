declare module '*.css?raw' { const content: string; export default content; }
declare module '*.svg?raw' { const content: string; export default content; }
declare module '*.js?url';
declare module 'gbnf?url';
declare module '*.js?worker';
declare module '*.js?worker&url';

import type * as pyodide from "pyodide";

declare module 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.mjs' {
  export const pyodide: typeof pyodide;
}

declare module 'https://cdn.jsdelivr.net/npm/serialize-error/index.js' {
  export function serializeError(error: any): any;
  export function deserializeError(serializedError: any): any;
}
