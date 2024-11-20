import path from 'path';
import { writeFile as _writeFile, } from 'fs/promises';
import { mkdirp, } from 'mkdirp';

export const writeFile = async (filePath: string, content: string) => {
  try {
    const dirname = path.dirname(filePath);
    await mkdirp(dirname);
    await _writeFile(filePath, content, 'utf-8');
  } catch (err) {
    console.error(err);
    throw err;
  }
};
