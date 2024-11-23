import { format, } from 'prettier';

export const formatJavascript = (str: string): Promise<string> => format(str, {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  parser: 'typescript',
});
