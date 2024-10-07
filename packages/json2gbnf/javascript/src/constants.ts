import {
  type GBNFRule,
  _,
} from "gbnf/builder";

export const WS = 'ws';
export const OPT_WS = 'opt-ws';
export const NR_OPT_WS = 'non-rec-opt-ws';
export const VALUE = 'value';

const baseNumRule = _`"-"? ${_`[0-9] | ([1-9] [0-9]*)`}`.name('base-num');
export const quoteRule = _`"\\""`.name('quote');
export const numRule = _`
  ${baseNumRule} 
  ${_`
    "." 
    [0-9]+
  `.wrap('?')} 
  ${_`
    [eE] 
    [-+]? 
    [0-9]+
  `.wrap('?')}
`.name('number');
export const intRule = _`
  ${baseNumRule} 
  ${_`
    "." 
    [0]+
  `.wrap('?')}
`.name('integer');
export const boolRule = _`
  "true" 
  | "false"
`.name('boolean');
export const nullRule = _`"null"`.name('null');
export const charRule = _`[^"']`;
// export const char = _`[^"'\\n\\r\\t]`;
export const strRule = _`
  ${quoteRule} 
  ${charRule.wrap('*')} 
  ${quoteRule}
  `.name('string');
export const arrRule = (value: GBNFRule | string = VALUE) => _`
  "[" 
  ${_`
    ${value}
    ${_`
      "," 
      ${OPT_WS}
      ${value}
    `.wrap('*')}
  `.wrap('?')}
  "]" 
`.name('array');
export const objRule = (value: GBNFRule | string = VALUE) => {
  const propertyKeyPair = _`
      ${strRule}
    ":" 
    ${OPT_WS}
    ${value}
  `;
  return _`
  "{" 
  ${_`
    ${propertyKeyPair}
    ${_`
      "," 
      ${OPT_WS}
      ${propertyKeyPair}
    `.wrap('*')
      }`.wrap('?')} 
  "}"
`.name('object');
};

export const value = _`
  ${numRule} | ${boolRule} | ${nullRule} | ${strRule} | ${arrRule()} | ${objRule()}
`.name(VALUE);

