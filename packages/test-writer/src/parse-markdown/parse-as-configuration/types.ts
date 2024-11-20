
export interface Block {
  code: Record<string, string[]>;
  variables: Record<string, unknown>;
}

export type HeadingBlock = Block & {
  title: string;
  blocks: HeadingBlock[];
};

export interface Configuration extends Block {
  blocks: HeadingBlock[];
}
