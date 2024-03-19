import { pipeline, env, TextGenerationPipeline } from '@xenova/transformers';
import { clearLine, cursorTo, } from 'readline';

env.allowRemoteModels = true;
env.allowLocalModels = false;

const initialize = async (model: string) => pipeline('text-generation', model, {
  progress_callback: (e: any) => {
    if (e?.progress !== undefined) {
      clearLine(process.stdout, 0);
      cursorTo(process.stdout, 0);
      const progress = e.progress.toFixed(2);
      process.stdout.write(`${progress}%`);

      if (e.progress >= 100) {
        clearLine(process.stdout, 0);
        // process.stdout.write("\n"); // end the line
      }
    }
  },
});

const tokenize = (generator: TextGenerationPipeline, prompt: string) => generator.tokenizer(prompt, {
  add_special_tokens: false,
  padding: true,
  truncation: true,
});

const generate = async (generator: TextGenerationPipeline, prompt: string, max_new_tokens = 1) => {
  const [{ input_ids, attention_mask }, tokenizeDuration] = await time(() => tokenize(generator, prompt));
  const [outputTokenIds, generateDuration] = await time(() => generator.model.generate(input_ids, {
    max_new_tokens,
  }, null, {
    inputs_attention_mask: attention_mask
  }));
  const [decoded, decodeDuration] = await time(() => generator.tokenizer.decode(outputTokenIds[0]));
  return [decoded, { tokenizeDuration, generateDuration, decodeDuration }];
};

const time = async (fn: () => (any | Promise<any>)) => {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  return [result, duration];
};

import { Command } from "commander";
const main = async () => {

  const model = 'Xenova/phi-1_5_dev';
  // const model = 'Xenova/starcoderbase-1b';
  const generator = await initialize(model);
  console.log('\n');
  const prompt = "Write the first 3 letters of the alphabet in a JSON array:\n```json\n";
  // const prompt = "Write the first 26 letters of the alphabet in a JSON array:\n```json\n[ 'a',";
  const maxTokens = 20;

  const [decoded, origDurations] = await generate(generator, prompt, maxTokens);
  console.log(origDurations);
  console.log((await tokenize(generator, decoded.slice(prompt.length))).input_ids.size, decoded);

  const durations = [];
  let iterativePrompt = prompt;
  for (let i = 0; i < maxTokens; i++) {
    const [decoded, itDurations] = await generate(generator, iterativePrompt, 1);
    iterativePrompt = decoded;
    durations.push(itDurations);
  }
  const compiledDurations: any = { tokenizeDuration: [], generateDuration: [], decodeDuration: [] };
  durations.forEach(({ tokenizeDuration, generateDuration, decodeDuration }) => {
    compiledDurations['tokenizeDuration'].push(tokenizeDuration);
    compiledDurations['generateDuration'].push(generateDuration);
    compiledDurations['decodeDuration'].push(decodeDuration);
  });

  console.log(`Iterative prompts took ${JSON.stringify({
    tokenizeDuration: compiledDurations['tokenizeDuration'].reduce((sum: number, d: number) => sum + d, 0),
    generateDuration: compiledDurations['generateDuration'].reduce((sum: number, d: number) => sum + d, 0),
    decodeDuration: compiledDurations['decodeDuration'].reduce((sum: number, d: number) => sum + d, 0),

  })}ms`);
  console.log((await tokenize(generator, iterativePrompt.slice(prompt.length))).input_ids.size, iterativePrompt);
  console.log(compiledDurations.generateDuration)
  // console.log(`-------\n${iterativePrompt}\n-------`);
  // console.log(`Full prompt took ${origDurations}ms`);
  // console.log(`Iterative prompts took ${durations.reduce((sum, d) => sum + d, 0)}ms`);
}

/* things I want to test:

- Can the model generate valid JSON output? If not, fuck that model
- Does time scale linearly? That is, does max_tokens: 10 === (max_tokens: 1) * 10?
- If a model is prompted to generate iteratively, with max_tokens:1, can it produce valid JSON as above?

If the answers to the above three are correct, then I should be able to run for the fences.

# Answers

- Xenova/phi-1_5_dev _can_ generate valid output, given a sufficiently good prompt. It also generates extra garbage.
- Iterative: I see a _big_ difference: 6.7s vs 21.9s. I'm not sure this is surmountable.
- Indeed, yes it can!

So: ollama is incredibly faster. I wonder if I should try to target that. But it doesn't support logits processing.
*/

export const registerScript = async (program: Command) => {
  program.command('ml-sandbox')
    .description('Run ML commands directly')
    .action(main);
}
