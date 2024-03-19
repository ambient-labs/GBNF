import {
  $,
  _,
} from "gbnf/builder";
import {
  whereClauseInner,
} from "../where/where-clause-inner.js";
import {
  ws,
  nroptws,
} from '../constants.js';

const equijoinConditions = _`
  ${whereClauseInner}
  ${_`
    ${ws}
    ${_`
      ${$`AND`}
      | ${$`OR`}
    `}
    ${ws}
    ${whereClauseInner}
  `.wrap('*')}
`;
export const joinCondition = _`
  ${_`
    "("
      ${nroptws}
      ${equijoinConditions}
      ${nroptws}
    ")"
  `}
  | ${equijoinConditions}
`;
