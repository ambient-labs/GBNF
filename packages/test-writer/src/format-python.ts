import { runPython } from './pyodide.js';

export const formatPython = (code: string) => runPython([
  'import black',
  `black.format_str("""${code}""", mode=black.FileMode())`,
].join('\n'), ['black']);
