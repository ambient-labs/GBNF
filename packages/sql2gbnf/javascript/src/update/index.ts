import {
  $,
  _,
} from "gbnf/builder";
import {
  columnName,
  optws,
  tableWithAlias,
  ws,
  nroptws,
  stringWithQuotes,
  number,
  boolean,
  arithmeticOps,
} from "../constants.js";
import {
  whereClause,
} from "../where/where-clause.js";
import {
  joinClause,
} from "../join/join-clause.js";
import {
  FULL_SELECT_QUERY,
} from '../keys.js';

const numberRule = _`
  ${number}
  ${_`
    ${optws}
    ${arithmeticOps}
    ${optws}
    ${number}
  `.wrap('*')}
`;

export const validUpdateValue = _`${stringWithQuotes} | ${numberRule} | ${boolean} | "NULL" | "null"`;

const setStatement = _`
  ${columnName}
  ${optws}
  "="
  ${optws}
  ${_`
    ${validUpdateValue}
    | ${columnName}
    | ${_`
      "(" 
        ${nroptws} 
        ${FULL_SELECT_QUERY}
        ${nroptws} 
      ")"
    `}
  `}
`;

export const updateRule = _`
  ${$`UPDATE`}
  ${ws}
  ${tableWithAlias}

  ${_`
    ${ws} 
    ${joinClause}
  `.wrap('*')}
  ${ws}
  ${$`SET`}
  ${ws}
  ${setStatement}
  ${_`
    ${nroptws}
    ","
    ${optws}
    ${setStatement}
  `.wrap('*')}
  ${whereClause.wrap('?')}
`;
