import { glob as globPromise, } from 'node:fs/promises';

export const glob = async (dir: string): Promise<string[]> => Array.fromAsync(globPromise(dir));
