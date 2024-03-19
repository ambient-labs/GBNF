import {
  RuleNames,
} from "./get-rule-names.js";

export const flatten = (
  ruleNames: RuleNames,
): string[] => ruleNames.reduce<string[]>((
  acc,
  ruleName,
) => acc.concat(Array.isArray(ruleName) ? flatten(ruleName) : ruleName), []);
