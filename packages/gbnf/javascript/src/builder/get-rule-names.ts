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
  CaseKind,
  Value,
} from "./types.js";

export type RuleNames = (string | RuleNames)[];

export const getRuleNames = (
  values: Value[],
  parser: GrammarBuilder,
  separator?: string,
  { caseKind = 'default', }: { caseKind?: CaseKind, } = {},
): (string | undefined)[] => values.map((
  value,
) => {
  if (Array.isArray(value)) {
    const ruleNames = getRuleNames(value, parser, separator, { caseKind, });
    const rule = g`${joinWith(separator ? separator : ' ', ...ruleNames)}`;
    return rule.addToParser(parser, { caseKind, }, true);
  }
  if (value instanceof GBNFRule) {
    return value.addToParser(parser, { caseKind, }, true);
  }
  if (value !== undefined) {
    return value;
  }
  return undefined;
});
