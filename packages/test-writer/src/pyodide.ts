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

const parseResult = (result: unknown): unknown => {
  if (typeof result === 'string') {
    return result;
  }
  if (hasToJs(result)) {
    return result.toJs();
    // console.log('3');

    //   const jsResult: unknown = result.toJs();
    // try {
    //   console.log('4');
    //   if (typeof jsResult === 'string') {
    //     console.log('5');
    //     return jsResult;
    //   }
    //   console.log('6', typeof jsResult, jsResult);
    // } catch (err) {
    //   console.log('5');
    //   throw new Error(`Error when calling .toJS() for result ${JSON.stringify(result)}: ${JSON.stringify(err)}`);
    // }
  }
  throw new Error(`Result from Pyodide is not a string: ${JSON.stringify(result)}`);
};

export const runPython = async (
  code: string,
  dependencies: string[] = [],
): Promise<unknown> => {
  const pyodide = await getPyodide(dependencies);
  const result: unknown = await pyodide.runPythonAsync(code);
  return parseResult(result);
};

const getPyodide = async (dependencies: string[]) => {
  const pyodide = await _pyodide;
  await pyodide.loadPackage("micropip", { messageCallback: () => { }, errorCallback: () => { }, });
  const micropip = pyodide.pyimport("micropip") as Micropip;
  await micropip.install(dependencies);
  return pyodide;
};
