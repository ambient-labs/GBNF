import {
  JSONSchemaObjectValueEnum,
} from "../types.js";
import {
  quoteRule,
} from '../constants.js';
import {
  GBNFRule,
  _,
} from 'gbnf/builder';

export const parseEnum = (
  schema: JSONSchemaObjectValueEnum,
): GBNFRule => {
  if (schema.enum.length === 0) {
    throw new Error('Enum must have at least one value');
  }
  return _`${schema.enum.map(value => {
    if (typeof value === 'string') {
      return _`${quoteRule} ${JSON.stringify(value)} ${quoteRule}`;
    }
    return _`"${JSON.stringify(value)}"`;
  })}`.join(' | ');
};
