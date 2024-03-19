import { GBNFRule, } from "./gbnf-rule.js";
import { Value, } from "./types.js";

type TemplateTag = {
  (strings: TemplateStringsArray, ...values: Value[]): GBNFRule;
  key(name: string): (strings: TemplateStringsArray, ...values: Value[]) => GBNFRule;
};

export const $: TemplateTag = (strings, ...values) => new GBNFRule(strings, values, { raw: false, });
export const _: TemplateTag = (strings, ...values) => new GBNFRule(strings, values, { raw: true, });

$.key = (name) => (strings, ...values) => {
  return new GBNFRule(strings, values, { raw: false, name, });
};
_.key = (name) => (strings, ...values) => {
  return new GBNFRule(strings, values, { raw: true, name, });
};
