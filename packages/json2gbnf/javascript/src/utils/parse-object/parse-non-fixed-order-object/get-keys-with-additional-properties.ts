import type {
  AdditionalProperties,
} from '../../../types.js';
import {
  g,
} from 'gbnf/builder';
import {
  strRule,
  value,
} from '../../../constants.js';
import type {
  ObjectEntry,
} from '../types.js';

export const anyObjectEntry = g` ${strRule} ":" ${value} `;
export const getKeysWithAdditionalProperties = (keys: ObjectEntry[], additionalProperties: AdditionalProperties): ObjectEntry[] => {
  if (additionalProperties) {
    return [
      ...keys,
      {
        rule: g` ${anyObjectEntry} ${g`"," ${anyObjectEntry}`.wrap('*')}`.wrap('?'),
      },
    ];
  }
  return keys;
};
