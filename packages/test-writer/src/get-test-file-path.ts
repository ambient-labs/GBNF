import path from 'path';
import type { Language } from './types.js';

const getTSTestFilePath = (
  suiteName: string,
) => `${suiteName.replaceAll(/[ _]+/g, '-')}.test.ts`.toLowerCase();

const getPYTestFilePath = (
  suiteName: string,
) => `${suiteName.replaceAll(/[ _]+/g, '_')}_test.py`.toLowerCase();

export const getTestFilePath = (
  suiteName: string,
  targetDir: string,
  language: Language,
) => path.join(targetDir, language === 'javascript' ? getTSTestFilePath(suiteName) : getPYTestFilePath(suiteName));
