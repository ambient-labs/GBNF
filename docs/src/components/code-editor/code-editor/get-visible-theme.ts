import type { Mode } from './types.js';
import { DEFAULT_THEMES } from './config.js';
const getThemeForMode = (mode: Mode) => mode === 'dark' ? DEFAULT_THEMES.dark : DEFAULT_THEMES.light;
const getTheme = (theme: string, mode: Mode) => theme === 'Default' ? getThemeForMode(mode) : theme;
export const getVisibleTheme = (
  mode: Mode,
  theme?: string,
  tempTheme?: string,
) => tempTheme ? getTheme(tempTheme, mode) : theme ? getTheme(theme, mode) : getThemeForMode(mode);
