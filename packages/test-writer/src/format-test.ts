import type { Language, } from './types.js';
import { formatPython, } from './format-python.js';
import { formatJavascript, } from './format-javascript.js';

export const formatTest = async (language: Language, str: string, testFile: string): Promise<string> => {
  try {
    const formattedTest: string = await (language === 'javascript' ? formatJavascript(str) : formatPython(str));
    return formattedTest;
  } catch (err) {
    console.error(`[formatTest] Error formatting test.\n\nContents:\n\n${str}\n\nError:\n\n${JSON.stringify(err)}`);
    throw new Error(`Error formatting test file: ${testFile}`);
  }
};
