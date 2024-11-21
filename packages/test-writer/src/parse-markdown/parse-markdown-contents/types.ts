export interface CodeBlock {
  language: string;
  type: string;
  contents: string;
  definitions: string;
}

export interface HeadingBlock {
  type: 'heading';
  title: string;
  contents: Block[];
}

export interface BaseBlock {
  contents: Block[];
}

export type Block = CodeBlock | HeadingBlock;

export const isHeadingBlock = (block: Block | BaseBlock): block is HeadingBlock => 'type' in block && block.type === 'heading';
// const isBaseBlock = (block: Block | BaseBlock): block is BaseBlock => 'contents' in block;
export const isCodeBlock = (block: Block | BaseBlock): block is CodeBlock => 'type' in block && block.type === 'code';
