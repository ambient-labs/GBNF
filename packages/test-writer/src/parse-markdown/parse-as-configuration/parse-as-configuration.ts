import { runPython, } from '../../pyodide.js';
import { runJavascript, } from '../../run-javascript.js';
import {
  isCodeBlock,
  isHeadingBlock,
  type BaseBlock,
  type CodeBlock,
} from '../parse-markdown-contents/types.js';
import type { Configuration, } from './types.js';

export const parseAsConfiguration = async (contents: BaseBlock): Promise<Configuration> => {
  const configuration: Configuration = {
    code: {},
    variables: {},
    blocks: [],
  };
  const currentBlock = configuration;
  for (const block of contents.contents) {
    if (isCodeBlock(block)) {
      if (block.definitions) {
        configuration.variables[block.definitions] = await parseContents(block);
      } else {
        if (!configuration.code[block.language]) {
          configuration.code[block.language] = [];
        }
        configuration.code[block.language].push(block.contents);
      }
    } else if (isHeadingBlock(block)) {
      currentBlock.blocks.push({
        title: block.title,
        ...(await parseAsConfiguration(block)),
      });
    }
  }
  return configuration;
};

const parseContents = async ({ contents, language, }: CodeBlock): Promise<unknown> => {
  if (language === 'json') {
    return JSON.parse(contents) as unknown;
  }
  if (language === 'python') {
    return await runPython(contents);
  }

  return await runJavascript(contents);
};


