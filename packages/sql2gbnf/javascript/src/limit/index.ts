import {
  $,
  _,
} from "gbnf/builder";
import {
  positiveInteger,
  ws,
  optws,
} from '../constants.js';

export const limitClause = g`
  ${ws} 
  ${$`LIMIT`}
  ${g`
    ${optws} 
    ${positiveInteger} 
    ","
  `.wrap('?')}
  ${optws}
  ${positiveInteger}
  ${g`
    ${ws}
    ${$`OFFSET`}
    ${ws}
    ${positiveInteger}
  `.wrap('?')}
`;
