import { Command } from "commander";
// import { parseInts } from "../utils/parse-ints.js";
import Coder from 'coder';
// import { Antlr4Parser } from 'coder';

const main = async () => {
  // const coder = new Coder({
  //   model: 'Xenova/phi-1_5_dev',
  //   parser: 'lark',
  // });
  // // const output = await coder.execute('def fibonnacci', {
  // const prompt = 'Write me a JSON array with the first three letters of the alphabet contained:'
  // const output = await coder.execute(prompt, {
  //   maxTokens: 8,
  // });
  // console.log(`|${output}|`)

  const coder = new Coder({
    // model: 'Xenova/gpt2',
    model: 'Xenova/phi-1_5_dev',
    // parser: 'antlr4',
    parser: 'lark',
  });

  const prompt = "Write the first 26 letters of the alphabet in a JSON array:\n```json\n[ 'a',";
  coder.execute(prompt, { maxTokens: 20 });



}

export const registerScript = async (program: Command) => {
  program.command('test-coder')
    .description('Test coder.')
    // // .option('-m, --model-package <string...>', 'model package to use', allModels)
    // .option('-p, --patch-size <number...>', 'patch size', parseInts)
    // .option('-a, --padding <number...>', 'padding', parseInts)
    // .option('-o, --output-directory <string>', 'output directory')
    .action(main);
}
