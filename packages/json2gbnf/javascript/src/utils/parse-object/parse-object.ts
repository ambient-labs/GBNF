import {
  isJSONSchemaObjectWithProperties,
  JSONSchemaObject,
} from '../../types.js';
import {
  GBNFRule,
} from 'gbnf/builder';
import {
  objRule,
} from '../../constants.js';
import { parseObjectPerSchema, } from './parse-object-per-schema.js';
const UNSUPPORTED_PROPERTIES: (keyof JSONSchemaObject)[] = [
  'patternProperties',
  'allOf',
  'unevaluatedProperties',
  'propertyNames',
  'minProperties',
  'maxProperties',
];

export const parseObject = (
  schema: JSONSchemaObject,
  fixedOrder?: boolean,
): GBNFRule => {
  for (const key of UNSUPPORTED_PROPERTIES) {
    if (key in schema) {
      throw new Error(`${key} is not supported`);
    }
  }
  if (isJSONSchemaObjectWithProperties(schema)) {
    return parseObjectPerSchema(schema, fixedOrder);
  }

  return objRule();
};
