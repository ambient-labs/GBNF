#!/usr/bin/env node

import { Command, } from 'commander';
import { readFileSync, } from 'fs';
import * as url from 'url';
import path from 'path';
import chokidar from 'chokidar';
import { throttle, } from './throttle.js';
import { writeAllTests, } from './write-all-tests.js';
import { isLanguage, isTestFiles, Language, } from './types.js';
import { rimraf, } from 'rimraf';
import { log, } from './log.js';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const packageJSONPath = path.resolve(__dirname, '../package.json');
const { name, version, description, } = JSON.parse(readFileSync(packageJSONPath, 'utf-8')) as { name: string, version: string, description: string, };

const program = new Command();

const parseOpts = (testFiles: unknown, {
  testDir,
  targetDir: _targetDir,
  watch,
  language,
  keepTargetDir,
}: Record<string, unknown>): {
  testDir: string;
  targetDir: string;
  watch?: boolean;
  language: Language;
  testFiles: string[];
  keepTargetDir: boolean;
} => {
  if (typeof _targetDir !== 'string') {
    throw new Error(`Target directory is not a string: ${JSON.stringify(_targetDir)}`);
  }
  if (typeof testDir !== 'string') {
    throw new Error(`Test directory is not a string: ${JSON.stringify(testDir)}`);
  }
  if (!isLanguage(language)) {
    throw new Error(`Language "${JSON.stringify(language)}" is not supported. Only javascript and python are supported.`);
  }
  if (!isTestFiles(testFiles)) {
    throw new Error(`Test files is not an array: ${JSON.stringify(testFiles)}`);
  }
  if (watch !== undefined && typeof watch !== 'boolean') {
    throw new Error(`Watch is not a boolean: ${JSON.stringify(watch)}`);
  }
  if (keepTargetDir !== undefined && typeof keepTargetDir !== 'boolean') {
    throw new Error(`Keep target directory is not a boolean: ${JSON.stringify(keepTargetDir)}`);
  }

  return {
    testDir,
    targetDir: path.resolve(_targetDir),
    watch,
    language,
    testFiles,
    keepTargetDir: keepTargetDir || false,
  };
};

program
  .name(name)
  .description(description)
  .version(version)
  // .allowUnknownOption()
  .option('-w, --watch', 'Watch for changes', false)
  .option('-l, --language <language>', 'The language to write tests for')
  .option('-d, --targetDir <targetDir>', 'The directory to write tests to', './integration-tests/.tmp')
  .option('-t, --testDir <testDir>', 'The directory to watch for tests', './')
  .option('-k, --keepTargetDir', 'Avoid removing target directory', false)
  .argument('[testFiles...]', 'List of test files to run').action(async (_testFiles, options) => {
    const {
      testDir,
      targetDir,
      watch,
      language,
      testFiles,
      keepTargetDir,
    } = parseOpts(_testFiles as unknown[], options as Record<string, unknown>);

    if (!keepTargetDir) {
      await rimraf(targetDir);
    }

    if (watch) {
      log(`watching for changes: ${testDir}`);
      const watcher = chokidar.watch(testDir, {
        persistent: true,
        ignored: (path, stats) => !!(stats?.isFile() && !path.endsWith('.md')), // only watch markdown files
      });

      const writeFile = () => {
        throttle(async (
          // _path: string,
        ) => {
          // TODO: This is a hack, we blow everything away and rewrite all tests
          try {
            const { duration, tests, } = await writeAllTests(
              testDir,
              targetDir,
              language,
              testFiles,
            );
            const numberOfTests = tests.length;
            log('wrote:', tests);
            log(`wrote ${numberOfTests} test${numberOfTests === 1 ? '' : 's'} in ${duration.toFixed(2)}ms`);
          } catch (err: unknown) {
            console.error(`Error writing all tests:\n\n${JSON.stringify(err)}`);
            throw err;
          }
        }, 5);
      };

      const unlink = async (path: string) => {
        log(`unlink: ${path}`);
        // TODO: This is a hack, we blow everything away and rewrite all tests
        log(`rewriting all tests, because there was a delete`);
        try {
          const { tests, duration, } = await writeAllTests(testDir, targetDir, language, testFiles);
          const numberOfTests = tests.length;
          log('wrote:', tests);
          log(`wrote ${numberOfTests} test${numberOfTests === 1 ? '' : 's'} in ${duration.toFixed(2)}ms`);
        } catch (err: unknown) {
          console.error(`Error Writing all tests:\n\n${JSON.stringify(err)}`);
        }
      };

      watcher
        .on('add', writeFile)
        .on('change', writeFile)
        .on('unlink', path => {
          if (typeof path !== 'string') {
            throw new Error(`unlink: ${JSON.stringify(path)} is not a string`);
          }
          void unlink(path);
        });
    } else {
      const { duration, tests, errors, } = await writeAllTests(testDir, targetDir, language, testFiles);
      const numberOfTests = tests.length;
      log('wrote:', tests);
      log(`wrote ${numberOfTests} test${numberOfTests === 1 ? '' : 's'} in ${duration.toFixed(2)}ms`);
      if (errors.length > 0) {
        errors.forEach(error => console.error(error));
        process.exit(1);
      }
    }
  });


// Parse the command-line arguments
program.parse(process.argv);

