import {
  describe,
  test,
  expect,
  afterEach,
  vi,
} from 'vitest';

import { parseMarkdown } from './parse-markdown.js';
import { readFile } from 'fs/promises';
import path from 'path';
import * as _fsPromises from 'fs/promises';
vi.mock('fs/promises', async () => {
  const actual = await vi.importActual<typeof _fsPromises>('fs/promises');
  return {
    ...actual,
    readFile: vi.fn().mockResolvedValue(''),
  };
});


const fixture = await readFile(path.join(__dirname, '__fixtures__/sample-markdown.md'), 'utf-8');

describe('parseMarkdown v2', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should parse a single code block', async () => {
    vi.mocked(readFile).mockResolvedValue([
      '```python',
      'import pytest',
      '```',
    ].join('\n'));
    const filePath = 'test/path';
    expect((await parseMarkdown(filePath, 'python')).trim()).toEqual([
      'import pytest',
    ].join('\n'));
    expect(readFile).toHaveBeenCalledWith(filePath, 'utf-8');
  });

  test('should parse multiple code blocks', async () => {
    vi.mocked(readFile).mockResolvedValue([
      '```python',
      'import pytest',
      '```',
      '```javascript',
      'import { g } from "gbnf";',
      '```',
    ].join('\n'));
    const filePath = 'test/path';
    expect((await parseMarkdown(filePath, 'python')).trim()).toEqual([
      'import pytest',
    ].join('\n'));
  });


  // test('should parse the markdown file', async () => {
  //   vi.mocked(readFile).mockResolvedValue(fixture);
  //   const filePath = 'test/path';
  //   expect(await parseMarkdown(filePath)).toEqual({
  //     filename: filePath,
  //     contents: [],
  //   });
  // });
});
