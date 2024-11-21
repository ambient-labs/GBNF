import type { Language, } from './types.js';
import { formatPython, } from './format-python.js';
import { formatJavascript, } from './format-javascript.js';

export const formatTest = async (language: Language, str: string, testFile: string): Promise<string> => {
  try {
    return await (language === 'javascript' ? formatJavascript(str) : formatPython(str));
  } catch (err) {
    console.error([
      `[formatTest] Error formatting test. Contents:`,
      str,
      'Error:',
      err instanceof Error ? err.message : JSON.stringify(err),
    ].join('\n\n'));
    throw new Error(`Error formatting test file: ${testFile}`);
  }
};
