import { runPythonAsync, } from '../../pyodide.js';
import { runJavascript, } from '../../run-javascript.js';
import {
  type CodeBlock,
} from '../parse-markdown-contents/types.js';

export const parseCodeBlockContents = async ({
  contents,
  language,
}: CodeBlock): Promise<unknown> => {
  if (language === 'json') {
    return JSON.parse(contents) as unknown;
  }
  if (language === 'python') {
    return await runPythonAsync(contents);
  }

  return await runJavascript(contents);
};


