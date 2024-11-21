import { loadPyodide, } from 'pyodide';
import path from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const NODE_MODULES_DIR = path.resolve(__dirname, '../node_modules');
const _pyodide = loadPyodide({
  indexURL: path.resolve(NODE_MODULES_DIR, 'pyodide'),
});

type PyodideResult = { toJs: () => unknown };
type Micropip = { install: (dependencies: string[]) => Promise<void>; };
const hasToJs = (result: unknown): result is PyodideResult => !!result && typeof result === 'object' && 'toJs' in result;

const parseResult = (result: unknown): string => {
  if (typeof result === 'string') {
    return result;
  }
  if (hasToJs(result)) {
    const jsResult: unknown = result.toJs();
    if (typeof jsResult === 'string') {
      return jsResult;
    }
  }
  throw new Error(`Result from Pyodide is not a string: ${JSON.stringify(result)}`);
};

export const runPython = async (
  code: string,
  dependencies: string[] = [],
): Promise<string> => {
  const pyodide = await getPyodide(dependencies);
  let result: unknown;
  try {
    result = await pyodide.runPythonAsync(code);
    return parseResult(result);
  } catch (error) {
    console.error('Error converting result', result, error);
    throw error;
  }
};

const getPyodide = async (dependencies: string[]) => {
  const pyodide = await _pyodide;
  await pyodide.loadPackage("micropip", { messageCallback: () => { }, errorCallback: () => { }, });
  const micropip = pyodide.pyimport("micropip") as Micropip;
  await micropip.install(dependencies);
  return pyodide;
};
