import {
  describe,
  test,
  expect,
  vi,
  afterEach,
} from 'vitest';
import type * as _typeGuards from '../../type-guards.js';
import {
  isSchemaConst,
  isSchemaEnum,
} from '../../type-guards.js';
import { getPropertiesValue } from './get-properties-value.js';
import {
  parseConst,
} from '../parse-const.js';
import type * as _parseConst from '../parse-const.js';
import {
  parseEnum,
} from '../parse-enum.js';
import type * as _parseEnum from '../parse-enum.js';
import {
  parseType,
} from '../parse-type.js';
import type * as _parseType from '../parse-type.js';
import { JSONSchemaString } from '../../types.js';

vi.mock('../parse-type.js', async () => {
  const actual = await vi.importActual('../parse-type.js') as typeof _parseType;
  return {
    ...actual,
    parseType: vi.fn(),
  };
});

vi.mock('../parse-enum.js', async () => {
  const actual = await vi.importActual('../parse-enum.js') as typeof _parseEnum;
  return {
    ...actual,
    parseEnum: vi.fn(),
  };
});

vi.mock('../parse-const.js', async () => {
  const actual = await vi.importActual('../parse-const.js') as typeof _parseConst;
  return {
    ...actual,
    parseConst: vi.fn(),
  };
});

vi.mock('../../type-guards.js', async () => {
  const actual = await vi.importActual('../../type-guards.js') as typeof _typeGuards;
  return {
    ...actual,
    isSchemaConst: vi.fn(),
    isSchemaEnum: vi.fn(),
  };
});

describe('getPropertiesValue', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('should return the correct GBNFRule for a const value', () => {
    vi.mocked(isSchemaConst).mockReturnValue(true);
    const value = { const: 'test' };
    getPropertiesValue(value);
    expect(parseConst).toHaveBeenCalledWith(value);
  });

  test('should return the correct GBNFRule for an enum value', () => {
    vi.mocked(isSchemaEnum).mockReturnValue(true);
    const value = { enum: ['test'] };
    getPropertiesValue(value);
    expect(parseEnum).toHaveBeenCalledWith(value);
  });

  test('should return the correct GBNFRule for a type value', () => {
    const value = { type: 'string' } as JSONSchemaString;
    getPropertiesValue(value);
    expect(parseType).toHaveBeenCalledWith(value);
  });
});
