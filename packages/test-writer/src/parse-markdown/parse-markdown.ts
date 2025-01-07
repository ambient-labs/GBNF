import { readFile, } from 'fs/promises';
import { marked, } from 'marked';
import { getContents, } from './parse-markdown-contents/index.js';
import { parseAsConfiguration, } from './parse-as-configuration/parse-as-configuration.js';
import { parseConfigurationIntoTestFile, } from './parse-configuration-into-test-file/index.js';
import type { Language, } from '../types.js';

export const parseMarkdown = async (filePath: string, language: Language): Promise<string> => {
  const contents = await readFile(filePath, 'utf-8');
  const tokens = marked.lexer(contents);
  const configuration = await parseAsConfiguration(getContents(tokens));
  return parseConfigurationIntoTestFile(configuration, language);
};
