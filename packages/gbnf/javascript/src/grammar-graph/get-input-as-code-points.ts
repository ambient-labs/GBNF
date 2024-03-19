import type { ValidInput, } from "./types.js";

export const getInputAsCodePoints = (src: ValidInput): number[] => {
  if (typeof src !== 'string') {
    return Array.isArray(src) ? src : [src,];
  }

  return src.split('').map((char) => {
    const codePoint = char.codePointAt(0);
    if (codePoint === undefined) {
      throw new Error(`Could not get code point for character: ${char}`);
    }
    return codePoint;
  });
};
