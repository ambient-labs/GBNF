import { type GBNFRule } from 'gbnf';
import { expect } from 'vitest';

expect.extend({
  toMatchGBNF(received: GBNFRule | GBNFRule[], expected: GBNFRule | GBNFRule[]) {
    const { isNot } = this;

    if (isNot) {
      throw new Error('Not implemented');
    }

    if (Array.isArray(received)) {
      if (!Array.isArray(expected)) {
        throw new Error('Expected must be an array');
      }
      expect(serializeArray(received)).toEqual(serializeArray(expected));
    } else {
      expect(received.toString()).toEqual(expected.toString());
    }

    return {
      message: () => `Good`,
      pass: true,
    };
  }
});

const serializeArray = (arr: GBNFRule[]) => arr.map((r, i) => `${i + 1}. ${r.toString()}`)
