import {
  $,
  g,
} from "gbnf/builder";
import {
  FULL_SELECT_QUERY,
} from './keys.js';

export const ws = 'ws';
export const optws = 'opt-ws';
export const nroptws = 'non-recommended-opt-ws';

export const validString = g`[^\'\\"]+`;
export const quote = g`"\\""`;
export const stringWithQuotes = g`
  ${g`
    "'" 
    ${validString} 
    "'"
  `}
  | ${g`
    ${quote} 
    ${validString} 
    ${quote}
  `}
`;
export const validName = g`[a-zA-Z_] [a-zA-Z0-9_]*`;
export const databaseName = g`${validName}`;
export const tableName = g`${g`${databaseName} "." `.wrap('?')} ${validName}`;
export const columnName = g`${g`${tableName} "." `.wrap('?')} ${validName}`;
export const positiveInteger = g`
  [0] 
  | ${g`
    [1-9]
    [0-9]*`
  }
`;

export const number = g`
  ${g`
    "-"? 
    ${g`[0] | [1-9] [0-9]*`.wrap()}
  `.wrap()} 
  ${g`"." [0-9]+`.wrap('?')} 
  ${g`[eE] [-+]? [0-9]+`.wrap('?')} 
`;
export const boolean = g`${$`TRUE`} | ${$`FALSE`}`;
export const validValue = g`${g`${quote} [a-zA-Z] [a-zA-Z0-9_]*`} | ${number} | ${boolean} | "NULL" | "null"`;
export const validAlias = g`[a-zA-Z] [a-zA-Z0-9_]*`;
export const tableWithAlias = g`
  ${tableName}
  ${g`${ws} ${validAlias}`.wrap('?')}
`;

export const equalOps = g`
    "=" 
    | "!=" 
    | ${g`
      ${$`IS`} 
      ${ws} 
      ${g`
        ${$`NOT`} 
        ${ws}
        `.wrap('?')}
      `}
  `;
export const arithmeticOps = g`"+" | "-" | "*" | "/"`;
export const numericOps = g`">" | "<" | ">=" | "<="`;

export const asAlias = g`${$`AS`} ${ws} ${validAlias}`;

export const direction = g` ${ws} ${g`${$`ASC`} | ${$`DESC`}`} `;
export const unit = g` ${$`DAY`} | ${$`MONTH`} | ${$`YEAR`} | ${$`HOUR`} | ${$`MINUTE`} | ${$`SECOND`} `;

export const dateDef = g` "'" [0-9] [0-9] [0-9] [0-9] "-" [0-9] [0-9] "-" [0-9] [0-9] "'" `;

export const columnNames = g`
${columnName}
| ${validValue}
| ${g`
    "(" 
      ${nroptws} 
      ${FULL_SELECT_QUERY}
      ${nroptws} 
    ")"
  `}
| ${g`
    ${g`
      ${$`MIN`} 
      | ${$`MAX`} 
      | ${$`AVG`} 
      | ${$`SUM`}
    `.wrap()}
    "("
      ${nroptws}
      ${g`
        ${$`DISTINCT`} 
        ${ws}
      `.wrap('?')}
      ${columnName}
      ${g`
        ${optws}
        ${arithmeticOps}
        ${optws}
        ${columnName}
        ${optws}
      `.wrap('*')}
      ${nroptws}
    ")"
  `}
| ${g`
    ${$`COUNT`}
    ${nroptws}
    ${$`(`}
    ${nroptws}
    ${g`
      ${$`*`}
      | ${g`
          ${g`
            ${$`DISTINCT`} 
            ${ws}
          `.wrap('?')}
          ${columnName}
          ${g`
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
