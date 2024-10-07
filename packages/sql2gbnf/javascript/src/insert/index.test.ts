import {
  describe,
  test,
  expect,
} from 'vitest';
import {
  insertRule,
} from './index.js';
import {
  g,
} from 'gbnf/builder';
import GBNF from 'gbnf';
import {
  verboseInclude,
} from '../__fixtures__/includes.js';

describe('insert', () => {
  test.each([
    'INSERT',
    'insert',
    'INSERT INTO',
    'insert into',
    'INSERT INTO table',
    'INSERT INTO table(',
    'INSERT INTO table(column1)',
    'INSERT INTO table (column1)',
    'INSERT INTO table ( column1 )',
    'INSERT INTO table ( col1, col2 )',
    'INSERT INTO\\ntable ( col1, col2 )',
    'INSERT INTO\\n\\n\\ntable ( col1, col2 )',
    'INSERT INTO \\n  \\n \\n  table ( col1, col2 )',
    'INSERT INTO \\n\\n\\ntable',
    'INSERT INTO \\n\\n\\ntable (',
    'INSERT INTO \\n\\n\\ntable ( col1, ',
    'INSERT INTO \\n\\n\\ntable ( col1, \\n\\ncol2',
    'INSERT INTO \\n\\n\\ntable ( col1, \\n\\ncol2,  col3 )',
    'INSERT INTO table (col1,col2,col3)',
    'INSERT INTO table (col1,col2,col3) VALUES',
    'INSERT INTO table (col1) VALUES ("foo")',
    'INSERT INTO table (col1) VALUES (\'foo\')',
    'INSERT INTO table (col1) VALUES ( \'foo\'\\n )',
    'INSERT INTO table (col1) VALUES (1)',
    'INSERT INTO table (col1) VALUES (-1.123)',
    'INSERT INTO table (col1) VALUES (TRUE)',
    'INSERT INTO table (col1) VALUES (true)',
    'INSERT INTO table (col1) VALUES (FALSE)',
    'INSERT INTO table (col1) VALUES (false)',
    'INSERT INTO table (col1) VALUES (NULL)',
    'INSERT INTO table (col1) VALUES (null)',
    'INSERT INTO table (col1,col2,col3) VALUES ("a", "b", "c")',
    'INSERT INTO table (col1,col2,col3) VALUES ("a","b","c")',
    'INSERT INTO table (col1,col2,col3) VALUES ("a", \\n\\n"b", \\n\\n"c"\\n\\n)',
    'INSERT INTO table (col1) VALUES (SELECT 1 FROM table)',
    'INSERT INTO table (col1) VALUES ((SELECT 1 FROM table))',
    'INSERT INTO table (col1, col2) VALUES ((SELECT 1 FROM table), (SELECT foo FROM table))',
    'INSERT INTO table (col1, col2) VALUES ( ( SELECT 1 FROM table ), ( SELECT foo FROM table ) )',
    'INSERT INTO table (col1) VALUES (SELECT (SELECT foo FROM bar) FROM table)',
  ])('it parses schema to grammar with input "%s"', (initial) => {
    let parser = GBNF([
      insertRule.toString({
        caseKind: 'any',
        include: verboseInclude,
      }),
    ].join('\n'));
    parser = parser.add(initial.split('\\n').join('\n'));
    expect(parser.size).toBeGreaterThan(0);
  });
});
