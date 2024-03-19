import { parseSpace } from './parse-space.js';

describe('parseSpace function', () => {
  it('should return the input string when no whitespace or comments are present', () => {
    const input = 'abcdefghijk';
    const pos = parseSpace(input, 0, true);
    expect(input.slice(pos)).toBe(input);
  });

  it('should skip leading spaces and tabs', () => {
    const input = '   \t   abcdefghijk';
    const expected = 'abcdefghijk';
    const pos = parseSpace(input, 0, true);
    expect(input.slice(pos)).toBe(expected);
  });

  it('should skip leading newline characters when newline_ok is true', () => {
    const input = '\n\n\r\n\r\nabcdefghijk';
    const expected = 'abcdefghijk';
    const pos = parseSpace(input, 0, true);
    expect(input.slice(pos)).toBe(expected);
  });

  it('should not skip leading newline characters when newline_ok is false', () => {
    const input = '\n\n\r\n\r\nabcdefghijk';
    const expected = '\n\n\r\n\r\nabcdefghijk';
    const pos = parseSpace(input, 0, false);
    expect(input.slice(pos)).toBe(expected);
  });

  it('should skip comments and leading spaces', () => {
    const input = '  # This is a comment\n\t   abcdefghijk';
    const expected = 'abcdefghijk';
    const pos = parseSpace(input, 0, true);
    expect(input.slice(pos)).toBe(expected);
  });

  it('should skip comments and leading newline characters when newline_ok is true', () => {
    const input = '\n\n # This is a comment\n\r\n\r\nabcdefghijk';
    const expected = 'abcdefghijk';
    const pos = parseSpace(input, 0, true);
    expect(input.slice(pos)).toBe(expected);
  });

  it('should skip comments and leading newline characters when newline_ok is false', () => {
    const input = '\n\n # This is a comment\n\r\n\r\nabcdefghijk';
    const expected = '\n\n # This is a comment\n\r\n\r\nabcdefghijk';
    const pos = parseSpace(input, 0, false);
    expect(input.slice(pos)).toBe(expected);
  });

  it('should return an empty string if the input is all whitespace and comments', () => {
    const input = '  \t# Comment\n# Another comment\n\n';
    const expected = '';
    const pos = parseSpace(input, 0, true);
    expect(input.slice(pos)).toBe(expected);
  });

  it('should return an empty string for an empty input string', () => {
    const input = '';
    const expected = '';
    const pos = parseSpace(input, 0, true);
    expect(input.slice(pos)).toBe(expected);
  });
});
