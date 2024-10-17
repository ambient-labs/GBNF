import { loadPyodide } from 'pyodide';
import path from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const NODE_MODULES_DIR = path.resolve(__dirname, '../node_modules');
const _pyodide = loadPyodide({
  indexURL: path.resolve(NODE_MODULES_DIR, 'pyodide'),
});

export const runPyodide = async (code: string) => {
  const pyodide = await _pyodide;
  const result = await pyodide.runPythonAsync(code);
  // console.log('result', result);
  if (result) {
    if (typeof result === 'string') {
      // console.log('result', result);
      return result;
    }
    try {
      return result.toJs();
    } catch (error) {
      console.error('Error converting result', result, error);
      throw error;
    }
  } else {
    throw new Error(`No result from Pyodide for code: ${code}`);
  }
}
