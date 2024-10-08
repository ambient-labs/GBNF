import { GBNFRule, } from "./gbnf-rule.js";
import {
  StringGBNFRule,
} from './string-gbnf-rule.js';
import { Value, } from "./types.js";

type TemplateTag<GBNFRuleType extends GBNFRule> = {
  (strings: TemplateStringsArray, ...values: Value[]): GBNFRuleType;
  key(name: string): (strings: TemplateStringsArray, ...values: Value[]) => GBNFRuleType;
};

export const $: TemplateTag<StringGBNFRule> = (strings, ...values) => new StringGBNFRule(strings, values);
export const g: TemplateTag<GBNFRule> = (strings, ...values) => new GBNFRule(strings, values);

$.key = (key) => (strings, ...values) => {
  return new StringGBNFRule(strings, values, { key: key, });
};
g.key = (name) => (strings, ...values) => {
  return new GBNFRule(strings, values, { key: name, });
};
