import { TokensList, } from "marked";
import { BaseBlock, } from "./types.js";
import { getLastBlock, } from "./get-last-block.js";

export const getContents = (tokens: TokensList): BaseBlock => {
  const contents: BaseBlock = {
    contents: [],
  };
  let currentBlock: BaseBlock = contents;
  for (const token of tokens) {
    if (token.type === 'heading') {
      if (typeof token.depth !== 'number') {
        throw new Error('heading depth is not a number');
      }
      let depth: number = token.depth;
      currentBlock = contents;
      while (depth > 1) {
        currentBlock = getLastBlock(currentBlock);
        depth--;
      }

      if (typeof token.text !== 'string') {
        throw new Error('heading title is not a string');
      }

      currentBlock.contents.push({
        type: 'heading',
        title: token.text,
        contents: [],
      });
      currentBlock = getLastBlock(currentBlock);
    }
    if (token.type === 'code') {
      if (typeof token.lang !== 'string') {
        throw new Error('code language is not a string');
      }
      const [language, ...definitions] = token.lang.split(' ');
      if (typeof token.text !== 'string') {
        throw new Error('code contents is not a string');
      }
      currentBlock.contents.push({
        language,
        definitions: definitions.join(' '),
        type: 'code',
        contents: token.text,
      });
    }
  }
  return contents;
};


