import {
  _,
  $,
} from 'gbnf/builder';
import {
  whereClauseInner,
} from './where-clause-inner.js';
import {
  ws,
} from '../constants.js';

export const whereClause = _`
  ${ws}
  ${$`WHERE`}
  ${ws}
  ${_`
    ${$`NOT`}
    ${ws}
  `.wrap('?')}
  ${whereClauseInner}
  ${_`
    ${_` ${ws} ${$`AND`} ${ws} ${whereClauseInner} `}
    | ${_` ${ws} ${$`OR`} ${ws} ${whereClauseInner} `}
  `.wrap('*')}
`;
