import { isPointInRange } from './is-point-in-range.js';

describe('isPointInRange', () => {
  test.each([
    [96, false, [97, 122]],
    [97, true, [97, 122]],
    [98, true, [97, 122]],
    [122, true, [97, 122]],
    [123, false, [97, 122]],
  ])('it checks if point `%i` is %b range `%s`', (point, expectation, range) => {
    expect(isPointInRange(point, range)).toEqual(expectation);
  });
});
