import path from 'path';

export const getTestFilePath = (
  suiteName: string,
  targetDir: string,
) => path.join(targetDir, `${suiteName.replaceAll(/[ _]+/g, '-')}.test.ts`.toLowerCase());
