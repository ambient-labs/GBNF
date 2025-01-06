import type { CodeBlock, } from "../parse-markdown-contents/types.js";

export interface Variable {
  parsed: unknown;
  block: CodeBlock;
}

export interface Block {
  code: Record<string, string[]>;
  variables: Record<string, Variable>;
}

export type HeadingBlock = Block & {
  title: string;
  blocks: HeadingBlock[];
};

export interface Configuration extends Block {
  blocks: HeadingBlock[];
}
