import {
  GBNFRule,
  _,
} from "gbnf/builder";
import { JSONSchemaString, } from "../types.js";
import {
  charRule,
  quoteRule,
  strRule,
} from "../constants.js";

export const parseString = (schema: JSONSchemaString): GBNFRule => {
  const { format, pattern, minLength, maxLength, } = schema;
  if (pattern !== undefined) {
    throw new Error('pattern is not supported');
  }
  if (format !== undefined) {
    throw new Error('format is not supported');
  }


  if (minLength && maxLength) {
    if (minLength > maxLength) {
      throw new Error('minLength must be less than or equal to maxLength');
    }
    const minChars = Array<GBNFRule>(minLength).fill(charRule);
    const maxChars = Array<GBNFRule>(maxLength - minLength).fill(charRule.wrap('?'));
    return _`
      ${quoteRule}
      ${[...minChars, ...maxChars,]}
      ${quoteRule}
    `;
  } else if (minLength) {
    return _`
      ${quoteRule}
      ${Array(minLength - 1).fill(charRule)}
      ${charRule.wrap('+')}
      ${quoteRule}
    `;
  } else if (maxLength) {
    const rule = _`
      ${quoteRule}
      ${Array(maxLength).fill(charRule.wrap('?'))}
      ${quoteRule}
    `;
    return rule;
  }
  return strRule;
};
