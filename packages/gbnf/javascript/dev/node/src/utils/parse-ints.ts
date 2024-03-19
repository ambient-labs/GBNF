export const parseInts = (value: string, previous: number[] = []): number[] => previous.concat(parseInt(value, 10));
