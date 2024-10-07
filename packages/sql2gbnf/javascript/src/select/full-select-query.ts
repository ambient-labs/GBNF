import {
  $,
  g,
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

const possibleColumnsWithOver = g` 
${columnNames} 
| ${windowStatement} 
| ${g` 
    ${g`${columnNames} | ${windowStatement}`} 
    ${ws} 
    ${overStatement} `} 
`;
const possibleColsWithAlias = g` 
  ${possibleColumnsWithOver} 
  | ${g`
    ${possibleColumnsWithOver} 
    ${g`
      ${ws} 
      ${asAlias}
    `.wrap('?')
    }`
  }`;
const projection = g`
  ${possibleColsWithAlias} 
  ${g`
    "," 
    ${optws} 
    ${possibleColsWithAlias}
  `.wrap('*')
  }`;


const projectionOrStar = g` ${projection} | "*" `;
const intoClause = g`
  ${$`INTO`} 
  ${ws} 
  ${tableName} 
  ${ws}
`;
const selectlist = g`
  ${g`
    ${g`
      ${projectionOrStar} 
      ${ws} 
      ${intoClause.wrap('?')}
    `}
    | ${g`
        ${intoClause.wrap('?')} 
        ${projectionOrStar} 
        ${ws}
      `}
  `}
  ${$`FROM`}
  ${ws}
  ${tableWithAlias}
  ${g`
    ","
    ${optws}
    ${tableWithAlias}
  `.wrap('*')}
`;
export const fullSelectQuery = g`
  ${$`SELECT`}
  ${ws}
  ${g`${$`DISTINCT`} ${ws}`.wrap('?')}
  ${selectlist}
  ${g`
    ${ws} 
    ${joinClause}
  `.wrap('*')}
  ${g`${whereClause.wrap('?')}`}
  ${g`${groupByClause.wrap('?')}`}
  ${g`${havingClause.wrap('?')}`}
  ${g`${orderByClause.wrap('?')}`}
  ${g`${limitClause.wrap('?')}`}
`.key(FULL_SELECT_QUERY);
