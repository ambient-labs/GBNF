import {
  describe,
  it,
  expect,
  vi,
  afterEach,
  test,
} from 'vitest';
import { parseType, } from './parse-type.js';
import {
  type ParseTypeArg,
} from '../types.js';
import GBNF from 'gbnf';
import {
  _,
} from 'gbnf/builder';
import {
  OPT_WS,
  WS
} from '../constants.js';

const ws = _`[ \\t\\n\\r]`.name(WS);
const opt_ws = ws.wrap('?').name(OPT_WS);
const include = [opt_ws];

describe('parseType', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should throw an error if unsupported keys are present for number/integer type', () => {
    const schema = { type: 'number', exclusiveMinimum: 0, };
    expect(() => parseType(schema as ParseTypeArg)).toThrowError('exclusiveMinimum is not supported');
  });

  test.each([
    [{ type: 'string' }, 'foo'],
    [{ type: 'number' }, 123.123],
    [{ type: 'integer' }, 123.0],
    [{ type: 'boolean' }, true],
    [{ type: 'boolean' }, false],
    [{ type: 'null' }, null],
    [{ type: 'array' }, []],
    [{ type: 'array' }, [1, 2, 3]],
    [{ type: 'object' }, {}],
  ])(`it should parse '%s' for '%s'`, (schema, initial) => {
    const rule = parseType(schema as ParseTypeArg);
    expect(() => GBNF([
      rule.compile({
        include,
      }),
      `value ::= [0-9]`,
      `obj ::= "{}"`,
    ].join('\n'), JSON.stringify(initial))).not.toThrow();
  });
});
