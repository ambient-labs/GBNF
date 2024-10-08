import { parseArray, } from './parse-array.js';
import { parseObject, } from './parse-object/parse-object.js';
import { parseString, } from './parse-string.js';
import type {
  ParseTypeArg,
} from '../types.js';
import { parseNumber, } from './parse-number.js';
import { isSchemaNumber, isSchemaString, } from '../type-guards.js';
import {
  GBNFRule,
} from 'gbnf/builder';
import {
  boolRule,
  nullRule,
} from '../constants.js';

export const parseType = (
  schema: ParseTypeArg,
  fixedOrder?: boolean
): GBNFRule => {
  const { type, } = schema;
  if (type === 'boolean') {
    return boolRule;
  } else if (type === 'null') {
    return nullRule;
  } else if (isSchemaString(schema)) {
    return parseString(schema);
  } else if (isSchemaNumber(schema)) {
    return parseNumber(schema);
  } else if (type === 'array') {
    return parseArray(schema);
  } else if (type === 'object') {
    return parseObject(schema, fixedOrder);
  }
  throw new Error(`type for schema ${JSON.stringify(schema)} is not supported`);
};
