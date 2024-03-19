import {
  isSchemaConst,
  isSchemaEnum,
  isSchemaMultiplePrimitiveTypes,
} from "../type-guards.js";
import type {
  JSONSchema,
} from "../types.js";
import { parseConst, } from "./parse-const.js";
import {
  GBNFRule,
} from 'gbnf/builder';
import { parseType, } from "./parse-type.js";
import { parseEnum, } from "./parse-enum.js";
import { parsePrimitives, } from "./parse-primitives.js";

export const parse = (
  schema: JSONSchema,
  fixedOrder?: boolean,
): GBNFRule => {
  if (isSchemaMultiplePrimitiveTypes(schema)) {
    return parsePrimitives(schema);
  } else if (isSchemaEnum(schema)) {
    return parseEnum(schema);
  } else if (isSchemaConst(schema)) {
    return parseConst(schema);
  }
  return parseType(schema, fixedOrder);
};
