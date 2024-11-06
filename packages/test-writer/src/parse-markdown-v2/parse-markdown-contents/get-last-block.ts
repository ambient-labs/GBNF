import {
  type Block,
  type BaseBlock,
  type HeadingBlock,
  isCodeBlock,
  isHeadingBlock,
} from './types.js';

export const getLastBlock = (block: Block | BaseBlock): HeadingBlock => {
  if (isCodeBlock(block)) {
    throw new Error('Block is a code block');
  }
  const lastBlock: Block = block.contents[block.contents.length - 1];
  if (!isHeadingBlock(lastBlock)) {
    throw new Error('Block has no heading block');
  }
  return lastBlock;
};
