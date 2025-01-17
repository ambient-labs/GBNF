import type { Language, } from '../../types.js';
import { Variable, } from '../parse-as-configuration/types.js';

export const hydrateVariables = (
  lines: string | string[],
  variables: Record<string, Variable>,
  targetLanguage: Language = 'javascript',
): string[] => {
  return ([] as string[]).concat(lines).map((line) => {
    const regex = /\$(\w+)/g;
    return line.replace(regex, (match, variable) => {
      if (!(variable in variables)) {
        throw new Error(`No variable found for ${variable}`);
      }
      if (typeof variable !== 'string') {
        throw new Error(`Variable ${variable} is not a string`);
      }
      const value = variables[variable].parsed;
      if (typeof value === 'string') {
        return value;
      }
      if (typeof value === 'boolean') {
        return value ? 'true' : 'false';
      }
      if (value === null) {
        return 'null';
      }
      if (value === undefined) {
        return 'undefined';
      }
      if (typeof value === 'number') {
        return value.toString();
      }
      if (Array.isArray(value) || typeof value === 'object') {
        if (targetLanguage === 'python') {
          const contents = variables[variable].block.contents;
          // log('contents before', contents);
          const transformedContents = contents;
          // const transformedContents = runPython([
          //   `import json`,
          //   `json.dumps(${contents})`,
          // ].join('\n'));
          // log('contents after', transformedContents);
          if (typeof transformedContents !== 'string') {
            throw new Error('Contents is not a string');
          }
          return transformedContents;
        }
        return JSON.stringify(value);
      }
      throw new Error(`Variable ${variable} is not a string, it is ${typeof variables[variable]}`);
    });
  });
};
