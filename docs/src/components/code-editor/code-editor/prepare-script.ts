import gbnfJavascriptURL from 'gbnf?url';
import { findAllImportsInScript } from '../worker/find-all-imports-in-script.js';
const IMPORT_MAP: Record<string, string> = {
  'gbnf': `${window.location.origin}${gbnfJavascriptURL}`,
};

export const prepareScript = (script: string = '') => {
  for (const { source, importName } of findAllImportsInScript(script)) {
    if (IMPORT_MAP[importName]) {
      script = script.replace(source, source.replace(importName, IMPORT_MAP[importName]));
    }
  }
  return script;
}
