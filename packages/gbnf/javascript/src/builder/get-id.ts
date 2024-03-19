export const getID = (i: number): string => (
  (i >= 26 ? getID(((i / 26) >> 0) - 1) : "") +
  "abcdefghijklmnopqrstuvwxyz"[i % 26 >> 0]
);

