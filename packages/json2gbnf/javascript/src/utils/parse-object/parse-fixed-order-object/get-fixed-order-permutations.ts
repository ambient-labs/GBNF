import {
  type GBNFRule,
  g,
} from 'gbnf';
import type {
  ObjectEntry,
} from '../types.js';

export const getPermutation = (entries: ObjectEntry[]): GBNFRule => {
  if (entries.length === 0) {
    throw new Error('No entries provided');
  }
  if (entries.length === 1) {
    return entries[0].rule;
  }
  return g`
  ${[entries[0].rule, ...entries.slice(1).map(({ rule, }) => g`"," ${rule}`.wrap('?')),]}
`;
};

export const getFixedOrderPermutations = (keys: ObjectEntry[]) => Array(keys.length).fill(0).map((_, i) => getPermutation(keys.slice(i)));

