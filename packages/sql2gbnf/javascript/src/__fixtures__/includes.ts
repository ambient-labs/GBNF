import {
  ws,
  optws,
  nroptws,
} from '../constants.js';
import {
  _,
} from 'gbnf/builder';

export const WS = g`[ \\t\\n\\r]`;
export const include = [
  g`${WS}`.key(ws),
  g`${ws}`.wrap('*').key(optws),
  g`${ws}`.wrap('*').key(nroptws),
];
export const verboseInclude = [
  g`${WS}`.wrap('+').key(ws),
  g`${ws}`.wrap('*').key(optws),
  g`${ws}`.wrap('*').key(nroptws),
]
