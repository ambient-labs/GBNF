import { loadPyodide, } from 'pyodide';
import path from 'path';
import * as url from 'url';

type Pyodide = Awaited<ReturnType<typeof loadPyodide>>;
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const NODE_MODULES_DIR = path.resolve(__dirname, '../node_modules');
const _pyodide: Promise<Pyodide> = loadPyodide({
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
  }
  throw new Error(`Result from Pyodide is not a string: ${JSON.stringify(result)}`);
};

export const runPythonAsync = async (
  code: string,
  dependencies: string[] = [],
): Promise<unknown> => {
  const pyodide = await getPyodide(dependencies);
  const result: unknown = await pyodide.runPythonAsync(code);
  return parseResult(result);
};

export const getRunPython = async () => {
  const pyodide = await _pyodide;
  return (
    code: string,
  ): unknown => {
    const result: unknown = pyodide.runPython(code);
    return parseResult(result);
  };
};

const getPyodide = async (dependencies: string[]) => {
  const pyodide = await _pyodide;
  await pyodide.loadPackage("micropip", {
    messageCallback: () => {
      // Silence the message callback
    },
    errorCallback: (error: unknown) => {
      // Handle errors, if needed
      console.error(error);
    },
  });
  const micropip = pyodide.pyimport("micropip") as Micropip;
  await micropip.install(dependencies);
  return pyodide;
};
