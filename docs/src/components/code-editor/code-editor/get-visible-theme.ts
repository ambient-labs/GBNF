import type { Mode } from './types.js';
const getThemeForMode = (mode: Mode) => mode === 'dark' ? 'seti' : 'solarized';
const getTheme = (theme: string, mode: Mode) => theme === 'Default' ? getThemeForMode(mode) : theme;
export const getVisibleTheme = (
  mode: Mode,
  theme?: string,
  tempTheme?: string,
) => tempTheme ? getTheme(tempTheme, mode) : theme ? getTheme(theme, mode) : getThemeForMode(mode);
