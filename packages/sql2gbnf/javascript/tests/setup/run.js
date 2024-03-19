import { createVitest } from 'vitest/node';
import { parseCLI } from 'vitest/node'

import * as url from 'url';
import path from 'path';
import fs from 'fs';

const noWrite = process.argv.pop();

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const COVERAGE_DIR = path.resolve(__dirname, '../coverage-tests');
const COVERAGE_PATH = path.resolve(COVERAGE_DIR, '.coverage.json');
const { threshold } = JSON.parse(fs.readFileSync(COVERAGE_PATH, 'utf-8'));

const { filter, options } = parseCLI(`vitest --config ${path.resolve(__dirname, '../../vitest.config.coverage.ts',)} run`)
// console.log(options)

const vitest = await createVitest('test', {
  ...options,
  watch: false,
})
await vitest.start(filter, {
  watch: false,
});

await vitest?.close();

const files = vitest.state.getFiles();
let total = 0;
let success = 0;
for (const file of files) {
  for (const suite of file.tasks) {
    for (const { result } of suite.tasks) {
      total += 1;
      if (result.state !== 'fail') {
        success += 1;
      }
    }
  }
}
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
await wait(100); // finish logging to screen from vitest
const percentage = (success / total);
if (percentage < threshold) {
  console.error(`Not enough tests passed (${(percentage * 100).toFixed(2)}%), threshold is: ${(threshold * 100).toFixed(2)}%`);
  process.exit(1);
} else {
  console.error(`Enough tests passed (${(percentage * 100).toFixed(2)}%), threshold is: ${(threshold * 100).toFixed(2)}%`);
  if (noWrite !== '--no-write') {
    fs.writeFileSync(COVERAGE_PATH, JSON.stringify({
      threshold: percentage,
    }), 'utf-8');
  }
  process.exit(0);
}
