import type {
  JSONSchemaObject,
} from '../../../types.js';
import {
  g,
  GBNFRule,
} from 'gbnf/builder';
import type {
  ObjectEntry,
} from '../types.js';
import { getRulePermutations, } from './get-rule-permutations.js';

export const parseNonFixedOrderObject = ({ additionalProperties = true, required = [], }: JSONSchemaObject, keys: ObjectEntry[]): GBNFRule => {
  const rulePermutations = getRulePermutations(keys, additionalProperties, required);

  const r = g`
      "{"
        ${rulePermutations.length === 1 ? rulePermutations[0] : g`${rulePermutations}`.join(' | ')}
      "}"
    `;
  // console.log(r);
  return r;
};

