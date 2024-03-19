import { type JSONSchemaNumber, } from "../types.js";
import { intRule, numRule, } from "../constants.js";


const UNSUPPORTED_NUMERIC_PROPERTIES: (keyof JSONSchemaNumber)[] = [
  'exclusiveMinimum',
  'exclusiveMaximum',
  'multipleOf',
  'minimum',
  'maximum',
];

export const parseNumber = (schema: JSONSchemaNumber) => {
  for (const key of UNSUPPORTED_NUMERIC_PROPERTIES) {
    if (schema[key] !== undefined) {
      throw new Error(`${key} is not supported`);
    }
  }
  return schema.type === 'number' ? numRule : intRule;
};
