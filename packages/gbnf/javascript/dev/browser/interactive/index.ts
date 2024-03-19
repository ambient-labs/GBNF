import '@vanillawc/wc-monaco-editor';
import GBNF from '../../../src/index.js';
const grammars = import.meta.glob('./grammars/*.gbnf', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const form = document.getElementById('form');
const grammarEditor = document.getElementById('grammar');
const inputEditor = document.getElementById('input');
const output = document.getElementById('output');
const select = document.getElementById('grammar-selector') as HTMLSelectElement;
Object.entries(grammars).forEach(([path, grammarContents]: [string, string]) => {
  const option = document.createElement('option');
  option.value = grammarContents;
  const file = path.split('/').pop().split('.').shift();
  option.innerText = file;
  if (file === 'simple') {
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
  parseGBNF((grammarEditor as any).value, (inputEditor as any).value);
};

const getGrammarParser = (grammarContents: string) => {
  try {
    return GBNF(grammarContents)
  } catch (err) {
    throw new Error(`Failed to create grammar parser from grammar: ${grammarContents}`);
  }
};

const log = (...messages) => {
  console.log(...messages);
  output.innerText += `${messages.map(msg => {
    if (typeof msg === 'object') {
      return JSON.stringify(msg, null, 2);
    }
    return msg;
  }).join(' ')}\n`;
}

const parseGBNF = (grammarContents: string, inputContents: string) => {
  output.innerText = '';
  log('grammar', grammarContents);
  const parser = getGrammarParser(grammarContents.split('\\').join('\\\\'));
  parser.add(inputContents)
  log(`Parsed "${inputContents}" successfully`)
  log([...parser.rules()]);
}

(inputEditor as any).value = '1=1';

parseGBNF((grammarEditor as any).value, (inputEditor as any).value);
