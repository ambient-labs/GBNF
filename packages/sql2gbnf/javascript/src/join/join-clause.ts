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

export const joinClause = g` 
  ${g`
    ${g`
      ${$`LEFT`}
      | ${$`RIGHT`}
      | ${$`FULL`}
    `}
    ${ws}
  `.wrap('?')}
  ${g`
    ${g`
      ${$`INNER`}
      | ${$`OUTER`}
    `}
    ${ws}
  `.wrap('?')}
  ${$`JOIN`} 
  ${ws} 
  ${tableName}
  ${g`${ws} ${validAlias}`.wrap('?')}
  ${ws} 
  ${$`ON`} 
  ${ws} 
  ${joinCondition} 
`;
