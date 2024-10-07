import {
  GBNFRule,
  _,
} from 'gbnf/builder';
import type {
  JSONSchemaArray,
  PrimitiveType,
} from '../types.js';
import {
  isSchemaArrayWithBooleanItemsType,
  isSchemaArrayWithoutItems,
} from '../type-guards.js';
import {
  arrRule,
  boolRule,
  nullRule,
  numRule,
  objRule,
  strRule,
} from '../constants.js';

const UNSUPPORTED_PROPERTIES: (keyof JSONSchemaArray)[] = [
  'prefixItems',
  'unevaluatedItems',
  'contains',
  'minContains',
  'maxContains',
  'minItems',
  'maxItems',
  'uniqueItems',
];

export const parseArray = (
  schema: JSONSchemaArray,
): GBNFRule => {
  for (const key of UNSUPPORTED_PROPERTIES) {
    if (schema[key] !== undefined) {
      throw new Error(`${key} is not supported`);
    }
  }
  if (isSchemaArrayWithBooleanItemsType(schema)) {
    throw new Error('boolean items is not supported, because prefixItems is not supported');
  }
  if (isSchemaArrayWithoutItems(schema)) {
    return arrRule();
  }
  const types = ([] as PrimitiveType[]).concat(schema.items.type);
  const possibleValue = g`${types.map((type) => ({
    string: strRule,
    number: numRule,
    array: arrRule(),
    boolean: boolRule,
    'null': nullRule,
    object: objRule(),
  }[type]))}`.join('|');
  return arrRule(possibleValue);
};
