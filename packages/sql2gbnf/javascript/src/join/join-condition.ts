import {
  g,
} from "gbnf/builder";
import {
  $,
} from '../string-rule.js';
import {
  whereClauseInner,
} from "../where/where-clause-inner.js";
import {
  ws,
  nroptws,
} from '../constants.js';

const equijoinConditions = g`
  ${whereClauseInner}
  ${g`
    ${ws}
    ${g`
      ${$`AND`}
      | ${$`OR`}
    `}
    ${ws}
    ${whereClauseInner}
  `.wrap('*')}
`;
export const joinCondition = g`
  ${g`
    "("
      ${nroptws}
      ${equijoinConditions}
      ${nroptws}
    ")"
  `}
  | ${equijoinConditions}
`;
