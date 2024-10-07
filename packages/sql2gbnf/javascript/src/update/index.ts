import {
  $,
  g,
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

const numberRule = g`
  ${number}
  ${g`
    ${optws}
    ${arithmeticOps}
    ${optws}
    ${number}
  `.wrap('*')}
`;

export const validUpdateValue = g`${stringWithQuotes} | ${numberRule} | ${boolean} | "NULL" | "null"`;

const setStatement = g`
  ${columnName}
  ${optws}
  "="
  ${optws}
  ${g`
    ${validUpdateValue}
    | ${columnName}
    | ${g`
      "(" 
        ${nroptws} 
        ${FULL_SELECT_QUERY}
        ${nroptws} 
      ")"
    `}
  `}
`;

export const updateRule = g`
  ${$`UPDATE`}
  ${ws}
  ${tableWithAlias}

  ${g`
    ${ws} 
    ${joinClause}
  `.wrap('*')}
  ${ws}
  ${$`SET`}
  ${ws}
  ${setStatement}
  ${g`
    ${nroptws}
    ","
    ${optws}
    ${setStatement}
  `.wrap('*')}
  ${whereClause.wrap('?')}
`;
