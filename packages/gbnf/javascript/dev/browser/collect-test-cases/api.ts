import { parseStream } from './parse-stream.js';
import { LlamaCPPResponse } from './types.js';

const endpoint = import.meta.env.VITE_LLAMACPP_ENDPOINT_URL;
const parseChunk = (chunk: string): string => chunk.match(/(data:|error:)?(.*)/).pop() || '';
const parse = (chunk: string) => JSON.parse(chunk);
const buildResponse = (response: string[]): LlamaCPPResponse => {
  if (response.length === 0) {
    throw new Error('No response from llama.cpp');
  }
  const chunks = response.map(r => parse(r));
  return chunks.slice(1).reduce<LlamaCPPResponse>((obj, r) => ({
    ...obj,
    ...r,
    content: (obj.content || '') + r.content,
  }), chunks[0]);
};


export const fetchLlamaCPP = async (prompt: string, {
  callback: _callback,
  grammar,
  n_predict,
  temperature,
}: {
  callback?: ({ partial: string, parsedChunk: LlamaCPPResponse }) => void;
  grammar?: string;
  n_predict: number;
  temperature: number;
}): Promise<LlamaCPPResponse> => {
  let partial = '';
  const callback = (chunk: string) => {
    if (_callback) {
      try {
        const parsedChunk = parse(chunk);
        if (parsedChunk.code) {
          console.error(parsedChunk);
          throw new Error(chunk);
        }
        partial += parsedChunk.content;
        _callback({ partial, parsedChunk, });
      } catch (err) {
        console.error(err);
      }
    }
  };
  const opts: {
    prompt: string;
    stream: true;
    grammar?: string;
    n_predict: number;
    temperature: number;
  } = {
    n_predict,
    prompt,
    stream: true,
    temperature,
  };
  if (grammar) {
    opts.grammar = grammar;
  }
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', },
    body: JSON.stringify(opts),
  });
  const stream = await parseStream(response, parseChunk, callback);
  return buildResponse(stream);
};

// const getPromptForGrammar = async (grammar: string): Promise<string> => {
//   const prompt = `
//   I want you to write a prompt for yourself. The prompt should prompt you to output an arithmetic formula.
//   `;
//   const response = await fetchLlamaCPP(prompt, {
//     callback: () => console.log('.'),
//   });
//   return response.content;
// };

// const MAX_TOKENS = 128;

type Callback = (opts: { partial: string; parsedChunk: LlamaCPPResponse; }, i: number) => void;
export const fetchTestCases = async (prompt: string, grammar: string, callback: Callback, n: number) => {
  // const prompt = await getPromptForGrammar(grammar);
  // console.log(prompt)
  for (let i = 0; i < n; i++) {
    await fetchLlamaCPP(prompt, {
      grammar,
      callback: (obj) => callback(obj, i),
      temperature: Math.random(),
      n_predict: i + 1,
    });
  }
}
