import type { Language, } from './types.js';

export const writeImports = (language: Language, imports: string) => {
  if (language === 'javascript') {
    return [
      `import { expect, describe, test } from 'vitest'`,
      imports,
    ].filter(Boolean).map(line => line.endsWith(';') ? line : `${line};`).join('\n');
  }

  return [
    imports,
  ].filter(Boolean).join('\n');
};
