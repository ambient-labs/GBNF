import path from 'path';
import type { Language } from './types.js';

const getTSTestFilePath = (
  suiteName: string,
) => `${suiteName.replaceAll(/[ _]+/g, '-')}.test.ts`;

const getPYTestFilePath = (
  suiteName: string,
) => `${suiteName.replaceAll(/[ _]+/g, '_')}_test.py`;

export const getTestFilePath = (
  suiteName: string,
  language: Language,
) => language === 'javascript' ? getTSTestFilePath(suiteName) : getPYTestFilePath(suiteName);
