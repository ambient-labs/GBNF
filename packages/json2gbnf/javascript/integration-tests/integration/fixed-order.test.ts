import {
  describe,
  expect,
  test,
} from 'vitest';
import JSON2GBNF, {
  JSONSchema
} from "../../src/index.js";
import GBNF, {
  InputParseError,
} from 'gbnf';
import type {
  TopLevelJSONSchema
} from "../../src/types.js";

describe('fixed order', () => {
  test.each([
    `{`,
    `{"number":1600,`,
    `{"number":1600,"street_name":"Pennsylvania",`,
    `{"number":1600,"street_name":"Pennsylvania","street_type":`,
    `{"number":1600,"street_name":"Pennsylvania","street_type":"`,
    `{"number":1600,"street_name":"Pennsylvania","street_type":"Avenue"`,
    `{"number":1600,"street_name":"Pennsylvania","street_type":"Avenue","country":"`,
    `{"number":1600,"street_name":"Pennsylvania","street_type":"Avenue","country":"USA"`,
  ])(`it handles fixed order for '%s'`, input => {
    const grammar = JSON2GBNF({
      type: 'object',
      additionalProperties: false,
      properties: {
        number: { type: 'number' },
        street_name: { type: 'string' },
        street_type: { enum: ['Street', 'Avenue', 'Boulevard'] },
        country: { const: 'USA', }
      },
    }, {
      fixedOrder: true,
    }, true);
    // console.log(grammar);

    expect(() => GBNF(grammar, input)).not.toThrow();
  });
});
