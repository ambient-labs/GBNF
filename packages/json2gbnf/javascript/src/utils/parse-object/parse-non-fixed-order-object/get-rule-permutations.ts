import { getAllPermutations, } from '../../get-all-permutations.js';
import type {
  AdditionalProperties,
} from '../../../types.js';
import {
  g,
  GBNFRule,
} from 'gbnf/builder';
import { filterObjectEntry, } from '../filter-object-entry.js';
import type {
  ObjectEntry,
} from '../types.js';
import { getKeysWithAdditionalProperties, } from './get-keys-with-additional-properties.js';

type GetRulePermutations = (
  keys: ObjectEntry[],
  additionalProperties: AdditionalProperties,
  required: string[]
) => (GBNFRule | GBNFRule[])[];

export const getRulePermutations: GetRulePermutations = (
  keys,
  additionalProperties,
  required
) => {
  return getAllPermutations<ObjectEntry>(
    getKeysWithAdditionalProperties(keys, additionalProperties),
    filterObjectEntry,
    required,
  ).map(p => p.map(({ rule, }) => {
    return rule;
  })).map(rules => {
    return rules.length === 1 ? rules : g`${rules}`.join(' "," ');
  });
};
