import {
  $,
  _,
} from "gbnf/builder";
import { joinClause, } from "../join/join-clause.js";
import {
  tableWithAlias,
  ws,
} from "../constants.js";
import {
  whereClause,
} from '../where/where-clause.js';
import { orderByClause, } from "../order/order-by-clause.js";
import { limitClause, } from "../limit/index.js";

export const deleteRule = _`
  ${$`DELETE`}
  ${ws}
  ${$`FROM`}
  ${ws}
  ${tableWithAlias}
  ${_`
    ${ws}
    ${$`USING`} 
    ${ws} 
    ${tableWithAlias}
  `.wrap('?')}
  ${_`
    ${ws}
    ${joinClause}
  `.wrap('?')}
  ${whereClause.wrap('?')}
  ${orderByClause.wrap('?')}
  ${limitClause.wrap('?')}
  ${ws}
`;
