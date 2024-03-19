import {
  $,
  _,
} from "gbnf/builder";
import {
  positiveInteger,
  ws,
  optws,
} from '../constants.js';

export const limitClause = _`
  ${ws} 
  ${$`LIMIT`}
  ${_`
    ${optws} 
    ${positiveInteger} 
    ","
  `.wrap('?')}
  ${optws}
  ${positiveInteger}
  ${_`
    ${ws}
    ${$`OFFSET`}
    ${ws}
    ${positiveInteger}
  `.wrap('?')}
`;
