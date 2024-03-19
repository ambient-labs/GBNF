import { expect } from 'vitest';
import {
  InputParseError,
} from 'gbnf';

expect.extend({
  toThrowInputParseError(fn: () => void, str: string, errorPos?: number) {
    const { isNot } = this;

    if (isNot) {
      return {
        message: () => `"isNot" is not yet implemented`,
        pass: false,
      };
    }

    try {
      fn();
    } catch (err) {
      if (!(err instanceof InputParseError)) {
        return {
          message: () => `Expected to throw an InputParseError, but it threw a different error: ${err}`,
          pass: false,
        };
      }
      if (err.src !== str) {
        return {
          message: () => [
            `Expected to throw an error with the following source:`,
            '',
            str,
            '',
            `But it threw an error with the following source:`,
            '',
            err.src,
          ].join('\n'),
          pass: false,
        };
      }

      if (errorPos !== undefined && err.pos !== errorPos) {
        return {
          message: () => [
            `Expected to throw an error at position ${errorPos}, but it threw an error at position ${err.pos}`,
          ].join('\n'),
          pass: false,
        };
      }

      return {
        message: () => `Everything looks good`,
        pass: true,
      };
    }

    return {
      message: () => `Expected to throw an error, but it did not`,
      pass: false,
    };
  }
});


