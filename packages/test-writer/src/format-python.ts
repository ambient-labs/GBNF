import { runPythonAsync, } from './pyodide.js';

const buildPythonInput = (code: string): string => {
  const parsedCode = code.split('\"').join('\\"').split('\\n').join('\\\\n');
  return [
    'import black',
    `black.format_str("""${parsedCode}""", mode=black.FileMode())`,
  ].join('\n');
};

export const formatPython = async (code: string): Promise<string> => {
  const result = await runPythonAsync(buildPythonInput(code), [
    'black',
  ]);
  if (typeof result === 'string') {
    return result;
  }
  throw new Error(`Error formatting Python code: ${JSON.stringify(result)}`);
};
