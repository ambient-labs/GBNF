import {
  describe,
  afterEach,
  test,
  expect,
  vi,
} from 'vitest';
import {
  parseObject,
} from './parse-object.js';
import type {
  JSONSchemaObject
} from '../../types.js';
import type * as _parseType from '../parse-type.js';
import * as _types from '../../types.js';
import {
  isJSONSchemaObjectWithProperties,
} from '../../types.js';
import {
  parseObjectPerSchema,
} from './parse-object-per-schema.js';
import * as _parseObjectPerSchema from './parse-object-per-schema.js';
import {
  objRule,
} from '../../constants.js';
import * as _constants from '../../constants.js';

vi.mock('../../constants.js', async () => {
  const actual = await vi.importActual('../../constants.js') as typeof _constants;
  return {
    ...actual,
    objRule: vi.fn(),
  };
});

vi.mock('./parse-object-per-schema.js', async () => {
  const actual = await vi.importActual('./parse-object-per-schema.js') as typeof _parseObjectPerSchema;
  return {
    ...actual,
    parseObjectPerSchema: vi.fn(),
  };
});

vi.mock('../../types.js', async () => {
  const actual = await vi.importActual('../../types.js') as typeof _types;
  return {
    ...actual,
    isJSONSchemaObjectWithProperties: vi.fn(),
  };
});

describe('parseObject', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('should throw an error if an unsupported key is present', () => {
    const schema = { patternProperties: {}, } as JSONSchemaObject;
    expect(() => parseObject(schema)).toThrowError(
      'patternProperties is not supported',
    );
  });

  test('it should parse object per schema', () => {
    vi.mocked(isJSONSchemaObjectWithProperties).mockReturnValue(true);
    const schema = {
      properties: {
        name: {
          type: 'string',
        },
      },
    };
    parseObject(schema as unknown as JSONSchemaObject, false);
    expect(parseObjectPerSchema).toHaveBeenCalledWith(schema, false);

  })

  test('it should return objRule', () => {
    vi.mocked(isJSONSchemaObjectWithProperties).mockReturnValue(false);
    const schema = {} as JSONSchemaObject;
    parseObject(schema);
    expect(objRule).toHaveBeenCalled();
  });
});
