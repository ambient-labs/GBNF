import path from 'path';
import vm from 'vm';
import {
  readFile as readFile
} from 'fs/promises';
import { glob } from '../glob.js';

export const evaluateInput = async (input: string, sourceFile: string) => {
  let result = '';
  let parts = input.split(/<% |%>/);

  for (let i = 0; i < parts.length; i++) {
    let part = parts[i].trim();
    if (part) {
      if (i % 2 === 0) {
        // This is a regular string part
        result += part;
      } else {
        // This is a code part
        try {
          const dirname = path.dirname(sourceFile);
          let context = vm.createContext({
            readFile: (filepath: string) => readFile(path.join(dirname, filepath), 'utf-8'),
            glob: (globPattern: string) => glob(path.join(dirname, globPattern)),
          });
          let code = `(async () => { ${part.trim()} })();`;
          let module = await vm.runInContext(code, context);
          result += module;
        } catch (error) {
          console.error(`Error evaluating code: ${part}`, error);
          result += 'Error';
        }
      }
    }
  }

  return result;
}
