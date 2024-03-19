export const parseSpace = (src: string, pos: number, newline_ok: boolean): number => {
  while (src[pos] === ' ' || src[pos] === '\t' || src[pos] === '#' ||
    (newline_ok && (src[pos] === '\r' || src[pos] === '\n'))) {
    if (src[pos] === '#') {
      while (src[pos] && src[pos] !== '\r' && src[pos] !== '\n') {
        pos++;
      }
    } else {
      pos++;
    }
  }
  return pos;
};
