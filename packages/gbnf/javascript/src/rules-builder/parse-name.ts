import { GrammarParseError, } from "../utils/errors.js";

export const PARSE_NAME_ERROR = 'Failed to find a valid name';
export const GET_INVALID_CHAR_ERROR = (char: string) => `Invalid character "${char}" when parsing name, only lowercase letters and hyphens are allowed.`;

const isValidChar = (char: string) => /[a-zA-Z-]/.test(char);
const isInvalidNextChar = (char: string) => /[_0-9]/.test(char);

export const parseName = (grammar: string, pos: number): string => {
  let name = '';
  while (pos < grammar.length && (isValidChar(grammar[pos]))) {
    name += grammar[pos];
    pos++;
  }
  if (!name) {
    throw new GrammarParseError(grammar, pos, PARSE_NAME_ERROR);
  }
  if (pos < grammar.length && isInvalidNextChar(grammar[pos])) {
    throw new GrammarParseError(grammar, pos, GET_INVALID_CHAR_ERROR(grammar[pos]));
  }
  return name;
};
