import {
  JSONSchemaObjectValueEnum,
} from "../types.js";
import {
  quoteRule,
} from '../constants.js';
import {
  GBNFRule,
  g,
} from 'gbnf/builder';

export const parseEnum = (
  schema: JSONSchemaObjectValueEnum,
): GBNFRule => {
  if (schema.enum.length === 0) {
    throw new Error('Enum must have at least one value');
  }
  return g`${schema.enum.map(value => {
    if (typeof value === 'string') {
      return g`${quoteRule} ${JSON.stringify(value)} ${quoteRule}`;
    }
    return g`"${JSON.stringify(value)}"`;
  })}`.join(' | ');
};
