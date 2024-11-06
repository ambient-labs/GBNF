import type { Language } from '../../types.js';
import type { Configuration } from '../parse-as-configuration/index.js';
import { hydrateVariables } from './hydrate-variables.js';
import { parseDescribeBlock } from './parse-describe-block.js';

export const parseConfigurationIntoTestFile = (configuration: Configuration, language: Language): string => {
  const code = configuration.code[language] || [];
  try {
    const pieces = [
      code.length > 0 ? hydrateVariables(code, configuration.variables).join('\n') : undefined,
      configuration.blocks.map(({ title, code, variables, blocks }) => parseDescribeBlock(title, code, {
        ...configuration.variables,
        ...variables,
      },
        blocks,
        language
      )).join('\n\n'),
    ];
    const filteredPieces = pieces.filter(chunk => chunk !== undefined);
    return filteredPieces.join('\n\n').split('\n').map(line => line.trim() === '' ? '' : line).join('\n');
  } catch (err) {
    console.error(`[parseConfigurationIntoTestFile] Error parsing configuration into test file:\n\n${err}`);
    throw err;
  }
};
