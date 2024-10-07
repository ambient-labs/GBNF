import {
  vi,
  describe,
  test,
  expect,
  afterEach,
} from 'vitest';
import { getFixedOrderPermutations } from './get-fixed-order-permutations.js';
import * as _getFixedOrderPermutations from './get-fixed-order-permutations.js';
import { parseFixedOrderObject } from './parse-fixed-order-object.js';
import { g } from 'gbnf';

vi.mock('./get-fixed-order-permutations.js', async () => {
  const actual = await vi.importActual('./get-fixed-order-permutations.js') as typeof import('./get-fixed-order-permutations.js');
  return {
    ...actual,
    getFixedOrderPermutations: vi.fn(actual.getFixedOrderPermutations),
  };
});


describe('parseFixedOrderObject', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('it should parse a fixed order object if permutations are empty', () => {
    vi.mocked(getFixedOrderPermutations).mockReturnValue([
    ]);
    const result = parseFixedOrderObject([]);
    expect(result).toMatchGBNF(g`"{" ${g`${g`""`}`.wrap('?')} "}"`);
  });

  test('it should parse a fixed order object if permutations is a single item array', () => {
    vi.mocked(getFixedOrderPermutations).mockReturnValue([
      g`"foo"`,
    ]);
    const result = parseFixedOrderObject([]);
    expect(result).toMatchGBNF(g`"{" ${g`${g`${g`"foo"`}`}`.wrap('?')} "}"`);
  });

});


