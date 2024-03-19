import { Command } from 'commander';

import {
  registerScript as registerScriptTest
} from './commands/test.js';
import {
  registerScript as registerScriptMLSandbox
} from './commands/ml-sandbox.js';

const main = async () => {
  const program = new Command();

  program
    .name("Coder Node Testing");

  await Promise.all([
    registerScriptTest,
    registerScriptMLSandbox,
  ].map(fn => fn(program)));

  await program.parseAsync(process.argv);
};

main();
