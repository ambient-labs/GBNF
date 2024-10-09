import {
  GBNFRule,
} from './gbnf-rule.js';
export type Value = string | GBNFRule | undefined | (string | GBNFRule | undefined)[];

export interface Frontmatter {
  raw?: boolean;
}

export type CaseKind = 'lower' | 'upper' | 'any' | 'default';

export const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');

export interface ToStringArgs {
  include?: GBNFRule[];
}

export type TemplateTag<GBNFRuleType extends GBNFRule> = {
  (strings: TemplateStringsArray, ...values: Value[]): GBNFRuleType;
  // key(name: string): (strings: TemplateStringsArray, ...values: Value[]) => GBNFRuleType;
  // wrap(wrapped: string): (strings: TemplateStringsArray, ...values: Value[]) => GBNFRuleType;
  key(name: string): TemplateTag<GBNFRuleType>;
  wrap(wrapped: string): TemplateTag<GBNFRuleType>;
  opts: Record<string, unknown>;
};
