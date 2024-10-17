import path from 'path';
import { writeFile as _writeFile } from 'fs/promises';
import { mkdirp } from 'mkdirp';

export const writeFile = async (filePath: string, content: string) => {
  await mkdirp(path.dirname(filePath));
  return _writeFile(filePath, content, 'utf-8');
};
