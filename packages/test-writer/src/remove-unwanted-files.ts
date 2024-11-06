import path from 'path';
import { rimraf } from 'rimraf';
import { glob } from './glob.js';
import { stat } from 'fs/promises';

export const removeUnwantedFiles = async (targetDir: string, keepFiles: string[]) => {
  const allFiles: string[] = await glob(path.join(targetDir, '**/*'));
  const unwantedFiles: string[] = (await Promise.all(allFiles.map(async file => {
    return !keepFiles.includes(file) && (await stat(file)).isFile() ? file : null;
  }))).filter(Boolean) as string[];
  if (unwantedFiles.length > 0) {
    console.log('removing:', unwantedFiles);
    await rimraf(unwantedFiles);
  }
};

