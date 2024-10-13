import type { Mode } from "./types.js";

export const getHTML = () => document.getElementsByTagName('html')[0];
const getDataTheme = () => getHTML().getAttribute('data-theme');
export const getHTMLMode = (): Mode => getDataTheme() === 'dark' ? 'dark' : 'light';
