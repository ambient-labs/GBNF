import {
  vi,
  describe,
  expect,
  test,
  afterEach,
} from 'vitest';
import {
  JSON2GBNF,
} from "./json2gbnf.js";
import GBNF from 'gbnf';
import { hasDollarSchemaProp } from './type-guards.js';
import type * as _types from './types.js';
import { parse } from './utils/parse.js';
import type * as _parse from './utils/parse.js';
import { _ } from 'gbnf/builder';

vi.mock('./utils/parse.js', async () => {
  const actual = await vi.importActual('./utils/parse.js') as typeof _parse;
  return {
    ...actual,
    parse: vi.fn(),
  };
});

vi.mock('./type-guards.js', async () => {
  const actual = await vi.importActual('./type-guards.js') as typeof _types;
  return {
    ...actual,
    hasDollarSchemaProp: vi.fn().mockReturnValue(false),
  };
});

describe('JSON2GBNF', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('it returns blank grammar if passed false', () => {
    expect(JSON2GBNF(false)).toEqual(_`""`.toString());
  });

  test('it throws an error if schema is an object with an unsupported schema version', () => {
    vi.mocked(hasDollarSchemaProp).mockReturnValue(true);
    const schema = 'https://json-schema.org/draft/2020-11/schema';
    expect(() => JSON2GBNF({
      $schema: schema,
    })).toThrow(`Unsupported schema version: ${schema}`);
  });

  test.each([
    true,
    null,
    {},
  ])('it adds root rule if passed %s', (arg) => {
    const grammar = JSON2GBNF(arg);
    const parseState = GBNF(grammar);
    for (const str of [
      "foo",
      1,
      true,
      false,
      null,
      { foo: 'foo' },
      [1, 2, 3],
    ]) {
      // all of these should be ok
      parseState.add(JSON.stringify(str));
    }
  });

  test.each([
    undefined,
    {
      type: 'string',
    }
  ])('it calls parse with schema "%s"', (schema) => {
    vi.mocked(parse).mockReturnValue(_`""`);
    GBNF(JSON2GBNF(schema));
    expect(parse).toHaveBeenCalledTimes(1);
  });
});
