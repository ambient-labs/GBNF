import { join, joinWith } from './join.js';

describe('join', () => {
  it('should join the values with a space', () => {
    const result = join(1, 'two', true, null, undefined, false, 'three');
    expect(result).toBe('1 two true three');
  });

  it('should return an empty string when no values are provided', () => {
    const result = join();
    expect(result).toBe('');
  });

  it('should handle empty strings correctly', () => {
    const result = join('', 'one', '', 'two', '');
    expect(result).toBe('one two');
  });
});

describe('joinWith', () => {
  it('should join the values with the specified joiner', () => {
    const result = joinWith(', ', 1, 'two', true, null, undefined, false, 'three');
    expect(result).toBe('1, two, true, three');
  });

  it('should return an empty string when no values are provided', () => {
    const result = joinWith(', ');
    expect(result).toBe('');
  });

  it('should handle empty strings correctly', () => {
    const result = joinWith(', ', '', 'one', '', 'two', '');
    expect(result).toBe('one, two');
  });

  it('should handle empty joiner correctly', () => {
    const result = joinWith('', 1, 'two', true);
    expect(result).toBe('1twotrue');
  });

  it('should handle null and undefined values correctly', () => {
    const result = joinWith(', ', null, undefined, 'one', null, 'two', undefined);
    expect(result).toBe('one, two');
  });

  it('should handle boolean values correctly', () => {
    const result = joinWith(' - ', true, false, true, false);
    expect(result).toBe('true - true');
  });
});
