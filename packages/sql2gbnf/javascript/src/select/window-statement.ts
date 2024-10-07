import {
  $,
  _,
} from "gbnf/builder";
import {
  positiveInteger,
  columnName,
  optws,
  nroptws,
} from '../constants.js';

const rankRule = _`
  ${_`${[$`RANK`, $`DENSE_RANK`, $`ROW_NUMBER`,]}`.join(' | ')}
  "()"
`;

const leadLagRule = _`
  ${_`${[$`LEAD`, $`LAG`,]}`.join(' | ')}
  "("
    ${nroptws}
    ${columnName}
    ","
    ${optws}
    ${positiveInteger}
    ${_`
      "," 
      ${optws} 
      ${positiveInteger}
    `.wrap('?')}
    ${nroptws}
  ")"
`;

export const windowStatement = _` ${[rankRule, leadLagRule,]} `.join(' | ');
