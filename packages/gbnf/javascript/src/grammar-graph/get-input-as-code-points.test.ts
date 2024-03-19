import { getInputAsCodePoints, } from './get-input-as-code-points.js';

describe('getInputAsCodePoints', () => {
  test('it returns code points for string', () => {
    expect(getInputAsCodePoints('abc')).toEqual([97, 98, 99]);
  });

  test('it returns code points for number', () => {
    expect(getInputAsCodePoints(99)).toEqual([99]);
  });

  test('it returns code points for array of number', () => {
    expect(getInputAsCodePoints([99, 100, 101])).toEqual([99, 100, 101]);
  });
});
