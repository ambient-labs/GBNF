import { runPyodide } from '../pyodide.js';
import { evaluateInput } from './evaluate-input.js';


const isWhitespace = (char: string) => char === ' ' || char === '\t' || char === '\n';
const isQuote = (char: string) => char === '\'' || char === '"';
const getOpeningPortion = (text: string, pointer: number) => {
  if (text[pointer] === '[') {
    return '[';
  }
  if (isQuote(text[pointer])) {
    return getQuoteType(text, pointer);
  }

  throw new Error(`Invalid syntax, expected "[" or opening quotes at ${pointer}: ${text}`);
}

const getQuoteType = (text: string, pointer: number) => {
  if (text[pointer + 1] === text[pointer] && text[pointer + 2] === text[pointer]) {
    return text.slice(pointer, pointer + 3);
  }
  return text[pointer];
};

const getClosingPortion = (openingPortion: string) => {
  if (openingPortion === '[') {
    return ']';
  }
  return openingPortion;
}

const advanceToNextValidCharacter = (text: string, pointer: number) => {
  while (isWhitespace(text[pointer]) && pointer < text.length) {
    pointer++;
  }
  while (text[pointer] === '#' && pointer < text.length) {
    // skip to next new line
    while (text[pointer] !== '\n' && pointer < text.length) {
      pointer++;
    }
    pointer++;

    while (isWhitespace(text[pointer]) && pointer < text.length) {
      pointer++;
    }
  }
  return pointer;
}

export const gatherTestCases = (text: string): string[] => {
  let pointer = 0;

  pointer = advanceToNextValidCharacter(text, pointer);
  const cases: string[] = [];
  while (pointer < text.length) {
    const openingPortion = getOpeningPortion(text, pointer);
    const closingPortion = getClosingPortion(openingPortion);
    let startingPointer = pointer;
    pointer += openingPortion.length;
    let isInQuotes: string | null = null;
    let bracketDepth = 0;
    const shouldContinue = () => {
      if (isInQuotes !== null) {
        return true;
      }
      if (bracketDepth > 0) {
        return true;
      }
      return text.slice(pointer, pointer + closingPortion.length) !== closingPortion;
    }
    while (shouldContinue()) {
      if (pointer >= text.length) {
        throw new Error(`Pointer out of bounds: ${text.slice(startingPointer, pointer)}`);
      }
      if (isQuote(text[pointer]) && isInQuotes === null) {
        isInQuotes = getQuoteType(text, pointer);
        pointer += isInQuotes.length;
      } else if (isQuote(text[pointer]) && isInQuotes !== null && isInQuotes === text.slice(pointer, pointer + isInQuotes.length)) {
        pointer += isInQuotes.length;
        isInQuotes = null;
      } else if (text[pointer] === '[' && isInQuotes === null) {
        bracketDepth++;
        pointer++;
      } else if (text[pointer] === ']' && isInQuotes === null) {
        bracketDepth--;
        pointer++;
      } else {
        pointer++;
      }
      if (bracketDepth < 0) {
        throw new Error(`Unbalanced brackets: ${text.slice(startingPointer, pointer)}`);
      }
    }
    pointer += closingPortion.length;
    const line = text.slice(startingPointer, pointer);
    // console.log('line', line);
    cases.push(line);
    pointer = advanceToNextValidCharacter(text, pointer);
  }
  return cases;

};

export const parseTestCases = async (
  text: string,
  sourceFile = '',
): Promise<unknown[]> => {
  return Promise.all(gatherTestCases(await evaluateInput(text, sourceFile)).map(runPyodide));
};
