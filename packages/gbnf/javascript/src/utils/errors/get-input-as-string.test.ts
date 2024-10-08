import { describe, test, expect } from 'vitest';
import { getInputAsString } from './get-input-as-string';

describe('getInputAsString', () => {
  test.each([
    ['hello', 'hello'],
    [[104, 101, 108, 108, 111], 'hello'],
    [104, 'h'],
    [0x1F600, '😀'],
    [[0x1F600, 0x1F601], '😀😁'],
  ])('it correctly converts %s to string', (input, expected) => {
    const result = getInputAsString(input);
    expect(result).toEqual(expected);
  });
});
