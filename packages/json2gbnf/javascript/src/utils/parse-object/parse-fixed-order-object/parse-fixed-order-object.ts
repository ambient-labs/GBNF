import {
  type GBNFRule,
  g,
} from 'gbnf';
import type {
  ObjectEntry,
} from '../types.js';
import { getFixedOrderPermutations, } from './get-fixed-order-permutations.js';

export const parseFixedOrderObject = (keys: ObjectEntry[]): GBNFRule => {
  const permutations = getFixedOrderPermutations(keys);
  return g`
        "{"
          ${g`${permutations}`.join(' | ').wrap('?')}
        "}"
      `;
};

