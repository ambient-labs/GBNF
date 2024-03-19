import {
  $,
  _,
} from "gbnf/builder";
import {
  FULL_SELECT_QUERY,
} from './keys.js';

export const ws = 'ws';
export const optws = 'opt-ws';
export const nroptws = 'non-recommended-opt-ws';

export const validString = _`[^\'\\"]+`;
export const quote = _`"\\""`;
export const stringWithQuotes = _`
  ${_`
    "'" 
    ${validString} 
    "'"
  `}
  | ${_`
    ${quote} 
    ${validString} 
    ${quote}
  `}
`;
export const validName = _`[a-zA-Z_] [a-zA-Z0-9_]*`;
export const databaseName = _`${validName}`;
export const tableName = _`${_`${databaseName} "." `.wrap('?')} ${validName}`;
export const columnName = _`${_`${tableName} "." `.wrap('?')} ${validName}`;
export const positiveInteger = _`
  [0] 
  | ${_`
    [1-9]
    [0-9]*`
  }
`;

export const number = _`
  ${_`
    "-"? 
    ${_`[0] | [1-9] [0-9]*`.wrap()}
  `.wrap()} 
  ${_`"." [0-9]+`.wrap('?')} 
  ${_`[eE] [-+]? [0-9]+`.wrap('?')} 
`;
export const boolean = _`${$`TRUE`} | ${$`FALSE`}`;
export const validValue = _`${_`${quote} [a-zA-Z] [a-zA-Z0-9_]*`} | ${number} | ${boolean} | "NULL" | "null"`;
export const validAlias = _`[a-zA-Z] [a-zA-Z0-9_]*`;
export const tableWithAlias = _`
  ${tableName}
  ${_`${ws} ${validAlias}`.wrap('?')}
`;

export const equalOps = _`
    "=" 
    | "!=" 
    | ${_`
      ${$`IS`} 
      ${ws} 
      ${_`
        ${$`NOT`} 
        ${ws}
        `.wrap('?')}
      `}
  `;
export const arithmeticOps = _`"+" | "-" | "*" | "/"`;
export const numericOps = _`">" | "<" | ">=" | "<="`;

export const asAlias = _`${$`AS`} ${ws} ${validAlias}`;

export const direction = _` ${ws} ${_`${$`ASC`} | ${$`DESC`}`} `;
export const unit = _` ${$`DAY`} | ${$`MONTH`} | ${$`YEAR`} | ${$`HOUR`} | ${$`MINUTE`} | ${$`SECOND`} `;

export const dateDef = _` "'" [0-9] [0-9] [0-9] [0-9] "-" [0-9] [0-9] "-" [0-9] [0-9] "'" `;

export const columnNames = _`
${columnName}
| ${validValue}
| ${_`
    "(" 
      ${nroptws} 
      ${FULL_SELECT_QUERY}
      ${nroptws} 
    ")"
  `}
| ${_`
    ${_`
      ${$`MIN`} 
      | ${$`MAX`} 
      | ${$`AVG`} 
      | ${$`SUM`}
    `.wrap()}
    "("
      ${nroptws}
      ${_`
        ${$`DISTINCT`} 
        ${ws}
      `.wrap('?')}
      ${columnName}
      ${_`
        ${optws}
        ${arithmeticOps}
        ${optws}
        ${columnName}
        ${optws}
      `.wrap('*')}
      ${nroptws}
    ")"
  `}
| ${_`
    ${$`COUNT`}
    ${nroptws}
    ${$`(`}
    ${nroptws}
    ${_`
      ${$`*`}
      | ${_`
          ${_`
            ${$`DISTINCT`} 
            ${ws}
          `.wrap('?')}
          ${columnName}
          ${_`
            ${optws}
            ${arithmeticOps}
            ${optws}
            ${columnName}
          `.wrap('*')}
      `}
    `}
    ${nroptws}
    ${$`)`}
  `}
`;
