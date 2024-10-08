import {
  g,
} from "gbnf/builder";
import { joinClause, } from "../join/join-clause.js";
import {
  $,
} from '../string-rule.js';
import {
  tableWithAlias,
  ws,
} from "../constants.js";
import {
  whereClause,
} from '../where/where-clause.js';
import { orderByClause, } from "../order/order-by-clause.js";
import { limitClause, } from "../limit/index.js";

export const deleteRule = g`
  ${$`DELETE`}
  ${ws}
  ${$`FROM`}
  ${ws}
  ${tableWithAlias}
  ${g`
    ${ws}
    ${$`USING`} 
    ${ws} 
    ${tableWithAlias}
  `.wrap('?')}
  ${g`
    ${ws}
    ${joinClause}
  `.wrap('?')}
  ${whereClause.wrap('?')}
  ${orderByClause.wrap('?')}
  ${limitClause.wrap('?')}
  ${ws}
`;
