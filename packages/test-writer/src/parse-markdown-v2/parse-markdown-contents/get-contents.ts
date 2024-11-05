import { TokensList } from "marked";
import { BaseBlock } from "./types.js";
import { getLastBlock } from "./get-last-block.js";

export const getContents = (tokens: TokensList): BaseBlock => {
  // console.log(tokens);
  const contents: BaseBlock = {
    contents: [],
  };
  let currentBlock: BaseBlock = contents;
  for (const token of tokens) {
    if (token.type === 'heading') {
      let depth: number = token.depth;
      currentBlock = contents;
      while (depth > 1) {
        currentBlock = getLastBlock(currentBlock);
        depth--;
      }

      currentBlock.contents.push({
        type: 'heading',
        title: token.text,
        contents: [],
      });
      currentBlock = getLastBlock(currentBlock);
    }
    if (token.type === 'code') {
      const [language, ...definitions] = token.lang.split(' ');
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


