import {
  isEmptyObject,
  hasDollarSchemaProp,
} from './type-guards.js';
import {
  type JSONSchema,
  type JSON2GBNFOpts,
} from './types.js';
import {
  parse,
} from './utils/parse.js';
import {
  g,
} from 'gbnf/builder';
import {
  NR_OPT_WS,
  OPT_WS,
  WS,
  value,
} from './constants.js';

const DEFAULT_SCHEMA = {
  type: 'object',
};

export function JSON2GBNF<T extends JSONSchema>(
  // eslint-disable-next-line @typescript-eslint/ban-types
  schema: {} | null | T | boolean = DEFAULT_SCHEMA,
  {
    fixedOrder,
    whitespace = 'default',
  }: JSON2GBNFOpts = {},
): string {
  if (schema === false) {
    // https://json-schema.org/understanding-json-schema/basics
    // false will always be invalid
    return g`""`.toString();
  }
  if (hasDollarSchemaProp(schema) && schema['$schema'] !== 'https://json-schema.org/draft/2020-12/schema') {
    throw new Error(`Unsupported schema version: ${schema['$schema']}`);
  }

  const ws = g`[ \\t\\n\\r]`.key(WS);
  const optionalWhitespace = g`${whitespace === 'default' ? ws.wrap('?').key(OPT_WS) : whitespace === 'succinct' ? g`""`.key(OPT_WS) : ws.wrap('*').key(OPT_WS)}`;
  const nonRecommendedOptionalWhitespace = g`${whitespace === 'verbose' ? ws.wrap('*') : undefined}`.key(NR_OPT_WS);

  const include = [
    ws,
    optionalWhitespace,
    nonRecommendedOptionalWhitespace,
  ];

  if (schema === true || schema === null || isEmptyObject(schema)) {
    return g`${value}`.toString({ include, });
  }

  return parse(
    schema,
    fixedOrder,
  ).toString({
    include: [
      ...include,
      value,
    ],
  });
};
