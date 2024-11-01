#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync, } from 'fs';
import * as url from 'url';
import path from 'path';
import chokidar from 'chokidar';
import { throttle } from './throttle.js';
import { writeAllTests } from './write-all-tests.js';
import { isLanguage } from './types.js';

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
  .option('-l, --language <language>', 'The language to write tests for')
  .option('-d, --targetDir <targetDir>', 'The directory to write tests to', './integration-tests/.tmp')
  .option('-t, --testDir <testDir>', 'The directory to watch for tests', './');

// Parse the command-line arguments
program.parse(process.argv);

// Extract the custom options
const { testDir, targetDir, watch, language } = program.opts();
if (!isLanguage(language)) {
  throw new Error(`Unsupported language: ${language}. Only javascript and python are supported.`);
}

// const targetDir = path.resolve('./integration-tests/.tmp');


if (watch) {
  console.info(`watching for changes: ${testDir}`);
  const watcher = chokidar.watch(testDir, {
    persistent: true,
    ignored: (path, stats) => !!(stats?.isFile() && !path.endsWith('.md')), // only watch markdown files
  });

  const writeFile = throttle(async (path: string) => {
    // TODO: This is a hack, we blow everything away and rewrite all tests
    const { duration, tests } = await writeAllTests(testDir, targetDir, language);
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
      await writeAllTests(testDir, targetDir, language);
    });
} else {
  const { duration, tests } = await writeAllTests(testDir, targetDir, language);
  const numberOfTests = tests.length;
  console.info(`wrote ${numberOfTests} test${numberOfTests === 1 ? '' : 's'} in ${duration.toFixed(2)}ms`);
}
