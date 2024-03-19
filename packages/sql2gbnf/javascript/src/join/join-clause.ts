import {
  $,
  _,
} from "gbnf/builder";
import {
  validAlias,
  tableName,
  ws,
} from "../constants.js";
import {
  joinCondition,
} from './join-condition.js';

export const joinClause = _` 
  ${_`
    ${_`
      ${$`LEFT`}
      | ${$`RIGHT`}
      | ${$`FULL`}
    `}
    ${ws}
  `.wrap('?')}
  ${_`
    ${_`
      ${$`INNER`}
      | ${$`OUTER`}
    `}
    ${ws}
  `.wrap('?')}
  ${$`JOIN`} 
  ${ws} 
  ${tableName}
  ${_`${ws} ${validAlias}`.wrap('?')}
  ${ws} 
  ${$`ON`} 
  ${ws} 
  ${joinCondition} 
`;
