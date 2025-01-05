import { indent, } from '../../indent.js';
import { parsePythonTestName, } from '../../parse-python-test-name.js';
import type { Language, } from '../../types.js';
import type { Configuration, } from '../parse-as-configuration/index.js';
import { Block, Variable, } from '../parse-as-configuration/types.js';
import { hydrateVariables, } from './hydrate-variables.js';

const getDescribeBlock = (title: string, language: Language, contents: string[]): string[] => {
  if (language === 'javascript') {
    return [
      `describe(\'${title}\', () => {`,
      ...contents,
      '});',
    ];
  }
  return [
    `def describe_${parsePythonTestName(title)}():`,
    ...indent(contents),
  ];
};

export const parseDescribeBlock = async (
  title: string,
  code: Block['code'],
  variables: Record<string, Variable>,
  blocks: Configuration['blocks'],
  language: Language,
  indentation = 0,
): Promise<string> => {
  const origCode = flatten(code[language] || []).join('\n');
  const otherCode = indent(await Promise.all(blocks.map((block) => parseDescribeBlock(block.title, block.code, {
    ...variables,
    ...block.variables,
  }, block.blocks, language, indentation + 1))), 0).join('\n');
  const describeBlock = getDescribeBlock(title, language, flatten([
    origCode,
    otherCode,
  ]));
  return (await hydrateVariables(describeBlock, variables, language)).join('\n');
};

const flatten = (chunks: (string | undefined)[], includeEmpty = true): string[] => {
  const filteredChunks = chunks.filter(chunk => {
    return chunk !== undefined && chunk !== '';
  }) as string[];
  return filteredChunks.reduce((acc, chunk, i) => {
    if (i === filteredChunks.length - 1 || !includeEmpty) {
      return [...acc, ...chunk.split('\n'),];
    }
    return [...acc, ...chunk.split('\n'), '',];
  }, [] as string[]);
};
