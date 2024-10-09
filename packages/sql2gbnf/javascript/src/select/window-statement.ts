import {
  g,
} from "gbnf/builder";
import {
  $,
} from '../string-rule.js';
import {
  positiveInteger,
  columnName,
  optws,
  nroptws,
} from '../constants.js';

const rankRule = g`
  ${g`${[$`RANK`, $`DENSE_RANK`, $`ROW_NUMBER`,]}`.join(' | ')}
  "()"
`;

const leadLagRule = g`
  ${g`${[$`LEAD`, $`LAG`,]}`.join(' | ')}
  "("
    ${nroptws}
    ${columnName}
    ","
    ${optws}
    ${positiveInteger}
    ${g`
      "," 
      ${optws} 
      ${positiveInteger}
    `.wrap('?')}
    ${nroptws}
  ")"
`;

export const windowStatement = g` ${[rankRule, leadLagRule,]} `.join(' | ');
