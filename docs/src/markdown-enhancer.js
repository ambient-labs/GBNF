
// `createHighlighter` is async, it initializes the internal and
// loads the themes and languages specified.
// import type { MarkdownEnhancerFn } from 'docoddity';
// const markdownEnhancer: MarkdownEnhancerFn = (md) => {
const markdownEnhancer = async (md) => {
  const { createHighlighter } = await import('shiki');
  const yaml = await import('js-yaml');
  const { readFileSync } = await import('fs');
  const path = await import('path');
  // const loadedLanguages = new Set();
  const SUPPORTED_LANGUAGES = [
    'javascript',
    'typescript',
    'python',
  ];
  const HIGHLIGHTER_LANGUAGES = [
    'sql',
    'javascript',
    'typescript',
    'bash',
    'python',
    'html',
  ];
  const highlighter = await createHighlighter({
    themes: ['github-dark', 'github-dark-default', 'catppuccin-latte', 'nord'],
    // themes: ['nord'],
    langs: HIGHLIGHTER_LANGUAGES,
  });
  // Custom renderer for code blocks
  md.renderer.rules.fence = function (tokens, idx, options, { filepath }, self) {
    const token = tokens[idx];
    const code = token.content.trim();
    const language = token.info.trim();

    if (language === 'multiple') {
      const contents = yaml.load(code);
      const fileDirectory = path.dirname(filepath);
      return `<code-editor-multi autorun>
        ${Object.entries(contents).map(([language, code]) => {
        try {
          const filepath = path.join(fileDirectory, code);
          const codeContents = readFileSync(filepath, 'utf8').trim();
          return `  <template language="${language}">${md.utils.escapeHtml(codeContents)}</template>`
        } catch (err) {
          console.error(err);
        }
        return ``;
      }).join('\n')}
      </code-editor-multi>`;
    }
    if (SUPPORTED_LANGUAGES.includes(language)) {
      // console.log('rendering code-editor for ', language);
      return `<code-editor autorun language="${language}">${md.utils.escapeHtml(code)}</code-editor>`;
    }

    if (language === 'gbnf') {
      const html = highlighter.codeToHtml(code, {
        lang: language === 'gbnf' ? 'text' : language,
        // theme: 'nord',
        // theme: 'catppuccin-latte',
        themes: {
          light: 'catppuccin-latte',
          dark: 'github-dark',
        },
      })
      return `<copy-to-clipboard>${html}</copy-to-clipboard>`;
      // return `<copy-to-clipboard><pre><code>${md.utils.escapeHtml(code)}</code></pre></copy-to-clipboard>`;
    }
    // console.log('rendering highlighter for ', language);
    const html = highlighter.codeToHtml(code, {
      lang: language,
      // theme: 'nord',
      // theme: 'catppuccin-latte',
      themes: {
        light: 'catppuccin-latte',
        dark: 'github-dark',
      },
      colorReplacements: {
        'github-dark': {
          '#24292e': '#151818'
        },
      }
    })
    // console.log(html);
    return `<copy-to-clipboard>${html}</copy-to-clipboard>`;
    // return `<copy-to-clipboard><pre><code>${md.utils.escapeHtml(code)}</code></pre></copy-to-clipboard>`;
  };

  return () => {
    highlighter.dispose();
  }
}

export default markdownEnhancer;
