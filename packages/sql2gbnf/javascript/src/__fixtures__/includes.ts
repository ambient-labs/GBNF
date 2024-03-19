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
  _`${WS}`.key(ws),
  _`${ws}`.wrap('*').key(optws),
  _`${ws}`.wrap('*').key(nroptws),
];
export const verboseInclude = [
  _`${WS}`.wrap('+').key(ws),
  _`${ws}`.wrap('*').key(optws),
  _`${ws}`.wrap('*').key(nroptws),
]
