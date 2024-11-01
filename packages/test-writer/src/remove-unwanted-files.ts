import path from 'path';
import { rimraf } from 'rimraf';
import { glob } from './glob.js';

export const removeUnwantedFiles = async (targetDir: string, keepFiles: string[]) => {
  const allFiles: string[] = await glob(path.join(targetDir, '**/*'));
  const unwantedFiles = allFiles.filter(file => !keepFiles.includes(file));
  await rimraf(unwantedFiles);
};

