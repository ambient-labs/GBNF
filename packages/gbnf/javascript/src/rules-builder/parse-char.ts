import { GrammarParseError, } from "../utils/errors.js";

export const parseChar = (src: string, pos: number): [number, number] => {
  if (src[pos] === '\\') {
    // if (src.slice(pos, pos + 1) === '\\') {
    switch (src[pos + 1]) {
      case 'x': return [parseInt(src.slice(pos + 2, pos + 4), 16), 4,];
      case 'u': return [parseInt(src.slice(pos + 2, pos + 6), 16), 6,];
      case 'U': return [parseInt(src.slice(pos + 2, pos + 10), 16), 10,];
      case 't': return ['\t'.charCodeAt(0), 2,];
      case 'r': return ['\r'.charCodeAt(0), 2,];
      case 'n': return ['\n'.charCodeAt(0), 2,];

      case '"':
      case '[':
      case ']':
        return [src.charCodeAt(pos + 1), 2,];
      case '\\':
        const codePoint = src.codePointAt(pos + 1);
        if (codePoint === undefined) {
          throw new GrammarParseError(src, pos, "Could not get code point for character");
        }
        return [codePoint, 2,];
      default:
        throw new GrammarParseError(src, pos, `Unknown escape at ${src[pos]}`);
    }
  }

  if (!src[pos]) {
    throw new GrammarParseError(src, pos, "Unexpected end of grammar input, failed to complete parse");
  }
  return [src.charCodeAt(pos), 1,];
};
