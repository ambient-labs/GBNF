import {
  ws,
  optws,
  nroptws,
} from '../constants.js';
import {
  _,
} from 'gbnf/builder';

export const WS = _`[ \\t\\n\\r]`;
export const include = [
  _`${WS}`.name(ws),
  _`${ws}`.wrap('*').name(optws),
  _`${ws}`.wrap('*').name(nroptws),
];
export const verboseInclude = [
  _`${WS}`.wrap('+').name(ws),
  _`${ws}`.wrap('*').name(optws),
  _`${ws}`.wrap('*').name(nroptws),
]
