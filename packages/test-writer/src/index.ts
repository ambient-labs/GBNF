#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync, } from 'fs';
import * as url from 'url';
import path from 'path';
import chokidar from 'chokidar';
import { prepareTest, prepareTests } from './prepare-tests.js';
import { rimraf } from 'rimraf';
import { glob } from './glob.js';
import { throttle } from './throttle.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const packageJSONPath = path.resolve(__dirname, '../package.json');
const { name, version, description, } = JSON.parse(readFileSync(packageJSONPath, 'utf-8')) as { name: string, version: string, description: string, };

const program = new Command();

program
  .name(name)
  .description(description)
  .version(version)
  // .allowUnknownOption()
  .option('-w, --watch', 'Watch for changes', false)
  .option('-d, --targetDir <targetDir>', 'The directory to write tests to', './integration-tests/.tmp')
  .option('-t, --testDir <testDir>', 'The directory to watch for tests', './');

// Parse the command-line arguments
program.parse(process.argv);

// Extract the custom options
const { testDir, targetDir, watch } = program.opts();

// const targetDir = path.resolve('./integration-tests/.tmp');

const removeAnyUnwantedFiles = async (targetDir: string, keepFiles: string[]) => {
  const allFiles: string[] = await glob(path.join(targetDir, '**/*'));
  const unwantedFiles = allFiles.filter(file => !keepFiles.includes(file));
  await rimraf(unwantedFiles);
};

const writeAllTests = async (testDir: string, targetDir: string) => {
  const start = performance.now();
  const tests = await prepareTests(testDir, targetDir);
  await removeAnyUnwantedFiles(targetDir, tests);
  return {
    duration: performance.now() - start,
    tests,
  };
};

if (watch) {
  console.info(`watching for changes: ${testDir}`);
  const watcher = chokidar.watch(testDir, {
    persistent: true,
    ignored: (path, stats) => !!(stats?.isFile() && !path.endsWith('.md')), // only watch markdown files
  });

  const writeFile = throttle(async (path: string) => {
    // TODO: This is a hack, we blow everything away and rewrite all tests
    const { duration, tests } = await writeAllTests(testDir, targetDir);
    const numberOfTests = tests.length;
    console.info(`wrote ${numberOfTests} test${numberOfTests === 1 ? '' : 's'} in ${duration.toFixed(2)}ms`);
  }, 5);

  watcher
    .on('add', writeFile)
    .on('change', writeFile)
    .on('unlink', async path => {
      console.log(`unlink: ${path}`);
      // TODO: This is a hack, we blow everything away and rewrite all tests
      console.info(`rewriting all tests, because there was a delete`);
      await writeAllTests(testDir, targetDir);
    });
} else {
  const { duration, tests } = await writeAllTests(testDir, targetDir);
  const numberOfTests = tests.length;
  console.info(`wrote ${numberOfTests} test${numberOfTests === 1 ? '' : 's'} in ${duration.toFixed(2)}ms`);
}
