import {
  $,
  _,
} from "gbnf/builder";
import {
  ws,
  optws,
  tableWithAlias,
  tableName,
  asAlias,
  columnNames,
} from "../constants.js";
import {
  orderByClause,
} from "../order/order-by-clause.js";
import {
  limitClause,
} from "../limit/index.js";
import {
  joinClause,
} from "../join/join-clause.js";
import {
  whereClause,
} from "../where/where-clause.js";
import {
  groupByClause,
} from '../group/index.js';
import {
  havingClause,
} from '../having/index.js';
import { overStatement, } from "./over-statement.js";
import { windowStatement, } from "./window-statement.js";
import {
} from "../constants.js";
import { FULL_SELECT_QUERY, } from "../keys.js";

const possibleColumnsWithOver = _` 
${columnNames} 
| ${windowStatement} 
| ${_` 
    ${_`${columnNames} | ${windowStatement}`} 
    ${ws} 
    ${overStatement} `} 
`;
const possibleColsWithAlias = _` 
  ${possibleColumnsWithOver} 
  | ${_`
    ${possibleColumnsWithOver} 
    ${_`
      ${ws} 
      ${asAlias}
    `.wrap('?')
    }`
  }`;
const projection = _`
  ${possibleColsWithAlias} 
  ${_`
    "," 
    ${optws} 
    ${possibleColsWithAlias}
  `.wrap('*')
  }`;


const projectionOrStar = _` ${projection} | "*" `;
const intoClause = _`
  ${$`INTO`} 
  ${ws} 
  ${tableName} 
  ${ws}
`;
const selectlist = _`
  ${_`
    ${_`
      ${projectionOrStar} 
      ${ws} 
      ${intoClause.wrap('?')}
    `}
    | ${_`
        ${intoClause.wrap('?')} 
        ${projectionOrStar} 
        ${ws}
      `}
  `}
  ${$`FROM`}
  ${ws}
  ${tableWithAlias}
  ${_`
    ","
    ${optws}
    ${tableWithAlias}
  `.wrap('*')}
`;
export const fullSelectQuery = _`
  ${$`SELECT`}
  ${ws}
  ${_`${$`DISTINCT`} ${ws}`.wrap('?')}
  ${selectlist}
  ${_`
    ${ws} 
    ${joinClause}
  `.wrap('*')}
  ${_`${whereClause.wrap('?')}`}
  ${_`${groupByClause.wrap('?')}`}
  ${_`${havingClause.wrap('?')}`}
  ${_`${orderByClause.wrap('?')}`}
  ${_`${limitClause.wrap('?')}`}
`.key(FULL_SELECT_QUERY);
