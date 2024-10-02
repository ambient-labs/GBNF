import { serializeError } from "https://cdn.jsdelivr.net/npm/serialize-error/index.js";

export const prepareDataForPosting = (data: unknown[]) => {
  return data.map(d => {
    if (d instanceof Error) {
      // return d.message;
      return serializeError(d);
    }
    return d;
  })
};

