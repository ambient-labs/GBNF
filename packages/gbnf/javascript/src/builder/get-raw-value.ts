import { isWhitespace, } from "./is-whitespace.js";

export const getRawValue = (value: string, inQuote = false): {
  str: string;
  inQuote: boolean;
} => {
  let str = '';
  let i = 0;
  while (i < value.length) {
    if (value[i] === '"' && (i >= 0 && value[i - 1] !== '\\')) {
      inQuote = !inQuote;
    }
    if (inQuote) {
      if (value[i] === '\n') {
        str += '\\n';
      } else {
        str += value[i];
      }
    } else if (!isWhitespace(value[i]) || !isWhitespace(str[str.length - 1])) {
      if (value[i] === '\n') {
        str += ' ';
      } else {
        str += value[i];
      }
    }
    i += 1;
  }
  return { str, inQuote, };
};
