import {
  describe,
  expect,
  test,
} from 'vitest';
import JSON2GBNF from "../../src/index.js";
import GBNF, {
  InputParseError,
} from 'gbnf';
import type {
  TopLevelJSONSchema
} from "../../src/types.js";

describe('failures', () => {
  test.each([
    [
      {
        "$schema": "https://json-schema.org/draft/2020-11/schema",
        type: 'string'
      }
    ],
  ])('it throws if given invalid input %s', input => {
    expect(() => JSON2GBNF(input)).toThrow();

  });

  const failureTestCases: [
    TopLevelJSONSchema,
    string,
    number | undefined,
  ][] = [
      [
        false,
        '1',
        0,
      ],
      [{ type: 'string' }, '42', 0],
      [{ type: 'number' }, '"42"', 0],
      [{ type: 'string', minLength: 2 }, '"f"', 2],
      [{ type: 'string', minLength: 3 }, '"fo"', 3],
      [{ type: 'string', maxLength: 2 }, '"foo"', 3],
      [{ type: 'string', minLength: 2, maxLength: 2 }, '"f"', 2],
      [{ type: 'string', minLength: 2, maxLength: 2 }, '"foo"', 3],
      [{ type: 'string', minLength: 2, maxLength: 3 }, '"f"', 2],
      [{ type: 'string', minLength: 2, maxLength: 3 }, '"fooo"', 4],
      [{ type: 'integer' }, '-1.5', 3],
      [{ type: 'integer' }, '-1.0001', 6],
      [{ type: 'integer' }, '"42"', 0],
      [{ type: 'boolean' }, '0', 0],
      [{ type: 'object' }, '123', 0],
      [{ type: 'object' }, '"foo"', 0],
      [{ type: 'array' }, JSON.stringify({ foo: 'foo' }), 0,],
      [
        { type: 'array', items: { type: 'number' } },
        JSON.stringify([1, 'a', 3]),
        3,
      ],
      [
        { type: 'array', items: { type: ['number', 'string'] } },
        JSON.stringify([1, "foo", []]),
        9,
      ],
      [{ enum: ['red', null, 42] }, `422`, 2,],
      [{ enum: ['red', null, 42] }, `0`, 0,],
      [
        {
          type: 'object',
          properties: {
            country: {
              const: 'USA',
            }
          },
          additionalProperties: false,
        },
        JSON.stringify({ "country": "UR" }),
        13,
      ],
      // TODO:
      // To handle negatives, we will need to implement some sort of backtracking
      // since the LLM can only operate at the level of token
      // For example, the below will run afoul since additional properties are allowed,
      // "country: "USAA" is valid down the additional properties path, and we
      // have no way to blacklist a set of property names from that path
      // [
      //   {
      //     type: 'object',
      //     properties: {
      //       country: {
      //         const: 'USA',
      //       }
      //     }
      //   },
      //   JSON.stringify({ "country": "USAA" }),
      //   15,
      // ],
      [
        {
          type: 'object',
          additionalProperties: false,
          properties: {
            number: { type: 'number' },
            street_name: { type: 'string' },
            street_type: { enum: ['Street', 'Avenue', 'Boulevard'] },
          },
          required: ['street_name'],
        },
        '{,"street_name":"Pennsylvania Avenue"}',
        undefined,
      ],
      [
        {
          type: 'object',
          additionalProperties: false,
          properties: {
            number: { type: 'number' },
            street_name: { type: 'string' },
            street_type: { enum: ['Street', 'Avenue', 'Boulevard'] },
          },
          required: ['number', 'street_name', 'street_type'],
        },
        '{,"street_name":"Pennsylvania Avenue","street_type":"Street"}',
        undefined,
      ],
      [
        {
          "type": "object",
          "properties": {
            "number": {
              "type": "number"
            },
            "street_name": {
              "type": "string"
            },
            "street_type": {
              "enum": [
                "Street",
                "Avenue",
                "Boulevard"
              ]
            }
          },
          "required": [
            "number",
            "street_name",
            "street_type"
          ]
        },
        `{"number":16,"street_name":"Pennsylvania Avenue","street_type":"Avenue","zip":"20500"}\\nJSON is case sensisive, please ensure all field names are in camelCase.`,
        86,
      ],
    ];
  test.each(failureTestCases)('it parses a schema %s to grammar and rejects %s', (schema, _initial, errorPos) => {
    const grammar = JSON2GBNF(schema);
    let parser = GBNF(grammar);
    const initial = _initial.split('\\n').join('\n');
    if (errorPos !== undefined) {
      expect(() => parser.add(initial)).toThrowError(new InputParseError(initial, errorPos));
    } else {
      expect(() => parser.add(initial)).toThrowInputParseError(initial);
    }
  });
});
