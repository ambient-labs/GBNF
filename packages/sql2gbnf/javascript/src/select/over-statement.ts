import {
  GBNFRule,
  g,
} from "gbnf/builder";
import {
  $,
} from '../string-rule.js';
import {
  direction,
  unit,
  positiveInteger,
  columnName,
  ws,
  optws,
} from '../constants.js';

const rangeClause = (modifier: GBNFRule) => g`
  ${g`
    ${$`INTERVAL`}
    ${ws}
    ${g`
      ${g`
        "'" 
        ${positiveInteger} 
        "'" 
        ${ws} 
        ${unit}
      `}
      | ${g`
        "'" 
        ${positiveInteger} 
        "-" 
        ${positiveInteger} 
        "'" 
        ${ws} 
        ${unit} 
        ${ws} 
        ${$`TO`} 
        ${ws} 
        ${unit}
      `}
    `}
    ${g`${ws} ${modifier}`.wrap('?')}
  `}
  | ${g`
      ${$`UNBOUNDED`} 
      ${ws} 
      ${modifier}
    `}
  | ${$`CURRENT ROW`} 
  | ${g`
      ${positiveInteger} 
      ${ws} 
      ${modifier}
    `} `;

const rangeRule = g` ${$`RANGE BETWEEN`} ${ws} ${rangeClause($`PRECEDING`)} ${ws} ${$`AND`} ${ws} ${rangeClause($`FOLLOWING`)} `;

const btwnClause = (modifier: GBNFRule) => g` 
    ${g`${$`UNBOUNDED`} ${ws} ${modifier}`} 
    | ${$`CURRENT ROW`} 
    | ${g`${positiveInteger} ${ws} ${modifier}`}
    `;
const betweenRule = g` ${$`ROWS BETWEEN`} ${ws} ${btwnClause($`PRECEDING`)} ${ws} ${$`AND`} ${ws} ${btwnClause($`FOLLOWING`)} `;

const rangeOrBetween = g`${ws} ${g`${rangeRule} | ${betweenRule}`}`;
const orderStmt = g`${$`ORDER BY`} ${ws} ${columnName} ${direction.wrap('?')}`;
const partitionByStmt = g`${$`PARTITION BY`} ${ws} ${columnName}`;

export const overStatement = g`
  ${$`OVER`} 
  ${optws} 
  "(" 
    ${g`
      ${partitionByStmt}
      | ${orderStmt}
      | ${g`${partitionByStmt} ${ws} ${orderStmt}`}
    `.wrap('?')}
    ${rangeOrBetween.wrap('?')}
  ")"
`;
