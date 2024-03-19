import '@vanillawc/wc-monaco-editor';
import { fetchTestCases } from './api.js';

const grammars = import.meta.glob('./grammars/*.gbnf', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const form = document.getElementById('form');
const grammarEditor = document.getElementById('grammar');
const output = document.getElementById('output') as HTMLTextAreaElement;
const select = document.getElementById('grammar-selector') as HTMLSelectElement;
Object.entries(grammars).forEach(([path, grammarContents]: [string, string]) => {
  const option = document.createElement('option');
  option.value = grammarContents;
  const file = path.split('/').pop().split('.').shift();
  option.innerText = file;
  if (file === 'arithmetic') {
    option.selected = true;
    grammarEditor.setAttribute('value', grammarContents);
  }
  // console.log(option)
  select.appendChild(option);
});


select.onchange = () => {
  grammarEditor.setAttribute('value', select.value);
};

form.onsubmit = async (e) => {
  e.preventDefault();
  generateTestCases((grammarEditor as any).value, 64);
};


const log = (obj: string) => {
  output.value = obj;
};

const generateTestCases = async (grammar: string, n: number) => {
  // log(output);
  const prompt = `
  Give ma the sweetest japanese poetry
  `
  const testCases: string[] = [];
  await fetchTestCases(prompt, grammar, ({ parsedChunk, partial }, i) => {
    if (testCases.length <= i) {
      testCases.push('');
    }
    testCases[i] = partial.trim();
    const parsedTestCases = Array.from(new Set(testCases)).sort((a, b) => {
      return a.length - b.length;
    });
    log([
      // `export const grammar = \`\n${grammar}\`;`,
      `${JSON.stringify(parsedTestCases, null, 2)}`
    ].join('\n'));
  }, n);
}

