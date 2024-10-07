import {
  vi,
  describe,
  test,
  expect,
  afterEach,
  beforeEach,
} from 'vitest';
import { parseObjectPerSchema, } from './parse-object-per-schema.js';
import { getPropertyKeysFromSchema } from './get-property-keys-from-schema.js';
import * as _getPropertyKeysFromSchema from './get-property-keys-from-schema.js';
import { JSONSchemaObjectWithProperties } from '../../types.js';
import { parseFixedOrderObject } from './parse-fixed-order-object/parse-fixed-order-object.js';
import * as _parseFixedOrderObject from './parse-fixed-order-object/parse-fixed-order-object.js';
import { parseNonFixedOrderObject } from './parse-non-fixed-order-object/parse-non-fixed-order-object.js';
import * as _parseNonFixedOrderObject from './parse-non-fixed-order-object/parse-non-fixed-order-object.js';

vi.mock('./get-property-keys-from-schema.js', async () => {
  const actual = await vi.importActual('./get-property-keys-from-schema.js') as typeof _getPropertyKeysFromSchema;
  return {
    ...actual,
    getPropertyKeysFromSchema: vi.fn(),
  };
});

vi.mock('./parse-fixed-order-object/parse-fixed-order-object.js', async () => {
  const actual = await vi.importActual('./parse-fixed-order-object/parse-fixed-order-object.js') as typeof _parseFixedOrderObject;
  return {
    ...actual,
    parseFixedOrderObject: vi.fn(),
  };;
});

vi.mock('./parse-non-fixed-order-object/parse-non-fixed-order-object.js', async () => {
  const actual = await vi.importActual('./parse-non-fixed-order-object/parse-non-fixed-order-object.js') as typeof _parseNonFixedOrderObject;
  return {
    ...actual,
    parseNonFixedOrderObject: vi.fn(),
  };
});

describe('parseObjectPerSchema', () => {
  beforeEach(() => {
    vi.mocked(getPropertyKeysFromSchema).mockReturnValue([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should call fixed order parser if fixed order is true', () => {
    const schema = {
      properties: {
        foo: { type: 'string' },
      },
    };
    parseObjectPerSchema(schema as unknown as JSONSchemaObjectWithProperties, true);
    expect(parseNonFixedOrderObject).not.toHaveBeenCalled();
    expect(parseFixedOrderObject).toHaveBeenCalled();
  });

  test('should not call fixed order parser if fixed order is false', () => {
    const schema = {
      properties: {
        foo: { type: 'string' },
      },
    };
    parseObjectPerSchema(schema as unknown as JSONSchemaObjectWithProperties, false);
    expect(parseFixedOrderObject).not.toHaveBeenCalled();
    expect(parseNonFixedOrderObject).toHaveBeenCalled();
  });
});
