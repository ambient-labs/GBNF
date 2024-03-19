import {
  arrRule,
  boolRule,
  nullRule,
  numRule,
  objRule,
  strRule,
} from "../constants.js";
import {
  type GBNFRule,
  _,
} from 'gbnf/builder';
import {
  PrimitiveType,
  type JSONSchemaMultiplePrimitiveTypes,
} from "../types.js";

const PRIMITIVE_TYPES: Record<PrimitiveType, GBNFRule> = {
  string: strRule,
  number: numRule,
  boolean: boolRule,
  'null': nullRule,
  object: objRule(),
  array: arrRule(),
};

export const parsePrimitives = (schema: JSONSchemaMultiplePrimitiveTypes) => {
  // if type is an array, then it must not be a structured data type
  for (const type of schema.type) {
    if (!Object.keys(PRIMITIVE_TYPES).includes(type)) {
      throw new Error(`Unknown type ${type} for schema ${JSON.stringify(schema)}`);
    }
  }
  return _` ${schema.type.map(type => PRIMITIVE_TYPES[type])} `.separate(' | ');
};
