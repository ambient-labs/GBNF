import { join, } from './join.js';

export function* buildGrammar(
  entries: IterableIterator<[string, string]>,
): IterableIterator<string> {
  for (const [rule, key,] of entries) {
    if (key === '') {
      throw new Error(`Key cannot be an empty string (Rule: ${rule})`);
    }

    // if (rule === '') {
    //   throw new Error(`Rule cannot be an empty string (Key: ${key})`);
    // }
    yield join(
      key,
      '::=',
      rule || '""',
    );
  }
};
