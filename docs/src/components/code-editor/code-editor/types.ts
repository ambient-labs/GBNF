export type Mode = 'dark' | 'light';
export const isMode = (value: string): value is Mode => ['dark', 'light'].includes(value);

export type SupportedLanguage = 'javascript' | 'python';
export const isSupportedLanguage = (value: string): value is SupportedLanguage => ['javascript', 'python'].includes(value);
