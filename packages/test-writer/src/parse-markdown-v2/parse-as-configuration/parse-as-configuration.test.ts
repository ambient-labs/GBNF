import {
  describe,
  test,
  expect,
  afterEach,
  vi,
} from 'vitest';
import { parseAsConfiguration } from './parse-as-configuration.js';

describe('parseAsConfiguration', () => {
  test.only('should parse code blocks into code', async () => {
    expect(await parseAsConfiguration({
      contents: [
        {
          type: 'code',
          language: 'python',
          contents: 'foo = "bar"',
          definitions: '',
        },
        {
          type: 'code',
          language: 'javascript',
          contents: 'foo = "bar"',
          definitions: '',
        },
      ],
    })).toEqual({
      code: {
        python: ['foo = "bar"'],
        javascript: ['foo = "bar"'],
      },
      variables: {},
      blocks: [],
    });
  });

  test('should parse code blocks into variables', async () => {
    expect(await parseAsConfiguration({
      contents: [
        {
          type: 'code',
          language: 'python',
          contents: 'foo = "bar"',
          definitions: '',
        },
        {
          type: 'code',
          language: 'javascript',
          contents: 'foo = "bar"',
          definitions: '',
        },
        {
          type: 'code',
          language: 'json',
          contents: '[]',
          definitions: 'foo',
        },
        {
          type: 'code',
          language: 'python',
          contents: '"bar123"',
          definitions: 'bar',
        },
        {
          type: 'code',
          language: 'javascript',
          contents: '"baz123"',
          definitions: 'baz',
        },
      ],
    })).toEqual({
      code: {
        python: ['foo = "bar"'],
        javascript: ['foo = "bar"'],
      },
      variables: {
        foo: [],
        bar: 'bar123',
        baz: 'baz123',
      },
      blocks: [],
    });
  });

  test('should parse heading blocks', async () => {
    expect(await parseAsConfiguration({
      contents: [
        {
          type: 'heading',
          title: 'foo',
          contents: [],
        },
      ],
    })).toEqual({
      code: {},
      variables: {},
      blocks: [
        {
          title: 'foo',
          code: {},
          variables: {},
          blocks: [],
        },
      ],
    });
  });

  test('it should parse multiple heading blocks', async () => {
    expect(await parseAsConfiguration({
      contents: [
        {
          type: 'heading',
          title: 'foo',
          contents: [],
        },
        {
          type: 'heading',
          title: 'bar',
          contents: [],
        },
      ],
    })).toEqual({
      code: {},
      variables: {},
      blocks: [
        { title: 'foo', code: {}, variables: {}, blocks: [] },
        { title: 'bar', code: {}, variables: {}, blocks: [] },
      ],
    });
  });

  test('it should parse nested heading blocks', async () => {
    expect(await parseAsConfiguration({
      contents: [
        {
          type: 'heading',
          title: 'foo',
          contents: [
            {
              type: 'heading',
              title: 'bar',
              contents: [],
            },
          ],
        },
      ],
    })).toEqual({
      code: {},
      variables: {},
      blocks: [
        { title: 'foo', code: {}, variables: {}, blocks: [{ title: 'bar', code: {}, variables: {}, blocks: [] }] },
      ],
    });
  });

  test('it should parse heading blocks with code blocks and variables', async () => {
    expect(await parseAsConfiguration({
      contents: [
        {
          type: 'heading',
          title: 'foo',
          contents: [
            {
              type: 'code',
              language: 'python',
              contents: 'foo = "bar"',
              definitions: '',
            },
            {
              type: 'code',
              language: 'json',
              contents: '[]',
              definitions: 'foo',
            },
          ],
        },
      ],
    })).toEqual({
      code: {},
      variables: {},
      blocks: [
        { title: 'foo', code: { python: 'foo = "bar"' }, variables: { foo: [] }, blocks: [] },
      ],
    });
  });
});
