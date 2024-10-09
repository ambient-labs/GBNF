import {
  joinWith,
} from './join.js';
import {
  GBNFRule,
} from "./gbnf-rule.js";
import {
  GrammarBuilder,
} from "./grammar-builder.js";
import {
  g,
} from './template-tags.js';
import {
  type ToStringArgs,
  type Value,
} from "./types.js";

export type RuleNames = (string | RuleNames)[];

export const getRuleNames = (
  parser: GrammarBuilder,
  values: Value[],
  separator?: string,
  args: ToStringArgs = {},
): (string | undefined)[] => values.map((
  value,
) => {
  if (Array.isArray(value)) {
    const ruleNames = getRuleNames(parser, value, separator, args);
    const rule = g`${joinWith(separator ? separator : ' ', ...ruleNames)}`;
    return rule.addToParser(parser, args, true);
  }
  if (value instanceof GBNFRule) {
    return value.addToParser(parser, args, true);
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return `${value}`;
  }
  return undefined;
});
