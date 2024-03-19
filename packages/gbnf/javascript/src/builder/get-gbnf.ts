import {
  joinWith,
} from './join.js';
import {
  isWhitespace as _isWhitespace,
} from "./is-whitespace.js";

const reduceGBNF = (strings: string[], ruleNames: (undefined | string)[]): string[] => {
  const gbnf: string[] = [];
  for (let i = 0; i < strings.length; i++) {
    gbnf.push(strings[i]);
    const ruleName = ruleNames[i];
    if (ruleName !== undefined) {
      gbnf.push(ruleName);
    }
  }
  return gbnf;
};

const isWhitespace = (str: string, pos: number) => {
  if (str[pos] === '\\') {
    if (str[pos] + str[pos + 1] === '\\n') {
      return 2;
    }
  } else if (str[pos] === 'n') {
    if (str[pos - 1] + str[pos] === '\\n') {
      return 2;
    }
  } else {
    if (_isWhitespace(str[pos])) {
      return 1;
    }
  }
  return 0;
};

function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export const getGBNF = (
  ruleNames: (undefined | string)[],
  strings: string[],
  {
    wrapped,
    separator = '',
    raw,
  }: {
    raw: boolean;
    wrapped?: string,
    separator?: string,
  }
) => {
  const reducedGBNF = reduceGBNF(strings, ruleNames).filter(nonNullable);

  const partsToJoin = reducedGBNF.map((part, partIndex) => {
    const isFirst = partIndex === 0;
    const isLast = partIndex === reducedGBNF.length - 1;
    if (!isFirst && !isLast) {
      return part;
    }
    let startIndex = 0;
    let endIndex = part.length;
    if (isFirst) {
      let amount = isWhitespace(part, startIndex);
      while (startIndex < part.length && amount !== 0) {
        startIndex += amount;
        amount = isWhitespace(part, startIndex);
      }
    }

    if (isLast) {
      let amount = isWhitespace(part, endIndex - 1);
      while (endIndex >= 0 && amount !== 0) {
        endIndex -= amount;
        amount = isWhitespace(part, endIndex - 1);
      }
    }
    return part.slice(startIndex, endIndex);
  });
  const gbnf = joinWith(
    raw ? `${separator}` : separator ? ` ${separator} ` : ' ',
    ...partsToJoin,
  );

  if (wrapped !== undefined) {
    return `(${gbnf})${wrapped}`;
  }
  return gbnf;
};

