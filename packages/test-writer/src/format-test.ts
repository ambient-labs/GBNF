import { format } from 'prettier';
import type { Language } from './types.js';

export const formatTest = (language: Language, str: string) => language === 'javascript' ? format(str, {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  parser: 'typescript',
}) : str;
