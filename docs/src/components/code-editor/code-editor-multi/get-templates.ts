import type { CodeEditorMulti } from './code-editor-multi.js';
import type { Templates } from './types.js';

export const getTemplates = (el: CodeEditorMulti) => {
  const templates = Array.from(el.querySelectorAll('template'));
  if (templates.length === 0) {
    throw new Error('No templates found. Ensure you have at least one <template> within <code-editor-multi> with a language attribute.');
  }
  return templates.reduce((acc, template) => {
    const language = template.getAttribute('language');
    if (!language) {
      throw new Error('language attribute is required');
    }
    return {
      ...acc,
      [language]: template.innerHTML,
    };
  }, {} as Templates);
}
