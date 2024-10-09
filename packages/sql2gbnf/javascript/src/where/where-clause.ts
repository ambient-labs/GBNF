import {
  g,
} from 'gbnf/builder';
import {
  $,
} from '../string-rule.js';
import {
  whereClauseInner,
} from './where-clause-inner.js';
import {
  ws,
} from '../constants.js';

export const whereClause = g`
  ${ws}
  ${$`WHERE`}
  ${ws}
  ${g`
    ${$`NOT`}
    ${ws}
  `.wrap('?')}
  ${whereClauseInner}
  ${g`
    ${g` ${ws} ${$`AND`} ${ws} ${whereClauseInner} `}
    | ${g` ${ws} ${$`OR`} ${ws} ${whereClauseInner} `}
  `.wrap('*')}
`;
