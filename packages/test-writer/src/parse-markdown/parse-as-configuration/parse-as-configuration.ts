import {
  isCodeBlock,
  isHeadingBlock,
  type BaseBlock,
} from '../parse-markdown-contents/types.js';
import { parseCodeBlockContents, } from './parse-code-block-contents.js';
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
        const parsed = await parseCodeBlockContents(block);
        configuration.variables[block.definitions] = parsed;
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
