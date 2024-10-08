import { type GBNFRule } from 'gbnf';
import { expect } from 'vitest';

expect.extend({
  toMatchGBNF(received: GBNFRule | GBNFRule[], expected: GBNFRule | GBNFRule[]) {
    const { isNot } = this;

    if (isNot) {
      throw new Error('Not implemented');
    }

    if (Array.isArray(received)) {
      return expect(received.map(r => r.toString())).toEqual(expected.map(r => r.toString()));
    }

    return expect(received.toString()).toEqual(expected.toString());

  }
});

