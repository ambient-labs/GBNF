import { glob as globPromise } from 'node:fs/promises';
import path from 'path';

export const glob = async (dir: string): Promise<string[]> => Array.fromAsync(globPromise(dir));
