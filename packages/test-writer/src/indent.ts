export const indent = (
  lines: string | string[],
  indentation?: number,
): string[] => getContents(lines).map(indentLine(indentation));

const getContents = (lines: string | string[]): string[] => Array.isArray(lines) ? lines : lines.split('\n');

const indentLine = (indentation = 2) => (line: string): string => `${' '.repeat(indentation)}${line}`;
