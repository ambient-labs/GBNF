// vitest --config ./vitest.config.integration.ts run
import { Command, } from "commander";
// import {
//   build,
// } from "../lib/build.js";

export const registerScript = (program: Command) => program.command('run')
  .description('Build Docoddity Site')
  .option('-s, --sourceDir <string>', 'Input directory', './')
  .option('-b, --buildDir <string>', 'Internal build directory')
  .option('-t, --targetDir <string>', 'Output directory', './build')
  .option('-v, --viteConfig <string>', 'Optional vite config')
  .action(() => {
    console.log('run');
  });
