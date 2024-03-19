import {
  describe,
  test,
  expect,
} from 'vitest';
// import SQL2GBNF from 'sql2gbnf';
import {
  SQL2GBNF,
} from '../../src/sql2gbnf.js';
import GBNF from 'gbnf';
import { noSchemaTests } from './no-schema-tests/index.js';

describe('No schema', () => {
  test.each(noSchemaTests)('it parses schema to grammar with input "%s"', (initial: string, config: any) => {
    const grammar = SQL2GBNF(undefined, {
      whitespace: 'verbose',
    });
    // console.log(grammar);
    let parser = GBNF(grammar);
    parser = parser.add(initial.split('\\n').join('\n'));
    expect(parser.size).toBeGreaterThan(0);
  });
});
