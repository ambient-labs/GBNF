export const indentv1 = (
  lines: string | string[],
  indentation?: number,
): string[] => getContents(lines).map(indentLine(indentation));

export const indent = (
  lines: string | string[],
  indentation: number = 1,
  tabSize = 2,
): string[] => getContents(lines).map(indentLine(indentation * tabSize));

const getContents = (lines: string | string[]): string[] => Array.isArray(lines) ? lines : lines.split('\n');

const indentLine = (indentation = 2) => (line: string): string => `${' '.repeat(indentation)}${line}`;
