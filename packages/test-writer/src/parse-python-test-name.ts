export const parsePythonTestName = (testName: string): string => testName.replaceAll(/[ -]+/g, '_').toLowerCase();
