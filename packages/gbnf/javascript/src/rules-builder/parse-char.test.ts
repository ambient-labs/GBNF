import { parseChar } from "./parse-char";

describe('parseChar', () => {
  test.each([
    [
      'escaped 8-bit unicode char',
      'a',
      'a'.charCodeAt(0),
    ],
    [
      'escaped 8-bit unicode char',
      '9',
      '9'.charCodeAt(0),
    ],
  ])('parses char `%s`', (_key, char, codePoint) => {
    const grammar = `root ::= "${char}" "foo"`;
    expect(parseChar(grammar, `root ::= "`.length)).toEqual([codePoint, 1]);
  });

  test.each([
    [
      'escaped 8-bit unicode char',
      '\\x2A',
      '\x2A'.charCodeAt(0),
      4,
    ],
    [
      'escaped 16-bit unicode char',
      '\\u006F',
      '\u006F'.charCodeAt(0),
      6,
    ],
    [
      'escaped 32-bit unicode char',
      "\\U0001F4A9",
      128169,
      10,
    ],
    [
      'escaped tab char',
      "\\t",
      '\t'.charCodeAt(0),
      2,
    ],
    [
      'escaped new line char',
      "\\n",
      '\n'.charCodeAt(0),
      2,
    ],
    [
      'escaped \r char',
      "\\r",
      '\r'.charCodeAt(0),
      2,
    ],
    [
      'escaped quote char',
      "\\\"",
      '"'.charCodeAt(0),
      2,
    ],
    [
      'escaped [ char',
      "\\[",
      '['.charCodeAt(0),
      2,
    ],
    [
      'escaped ] char',
      "\\]",
      ']'.charCodeAt(0),
      2,
    ],
    [
      'escaped \\ char',
      "\\\\",
      '\\'.codePointAt(0),
      2,
    ],
  ])('parses %s `%s`', (key, escapedChar, codePoint, incPos) => {
    const grammar = `root ::= "${escapedChar}" "foo"`;
    expect(parseChar(grammar, `root ::= "`.length)).toEqual([codePoint, incPos]);
  });

  test('it throws on invalid input', () => {
    expect(() => parseChar('', 0)).toThrow();
    expect(() => parseChar('a', 1)).toThrow();
  });
});
