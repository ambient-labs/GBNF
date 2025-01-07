import {
  describe,
  test,
  expect,
  afterEach,
  vi,
} from 'vitest';
import { parseConfigurationIntoTestFile } from './parse-configuration-into-test-file.js';
import { Configuration } from '../parse-as-configuration/index.js';

const makeVariable = (value: unknown, stringify = true) => ({ parsed: stringify ? JSON.stringify(value) : value, block: { language: 'javascript', type: 'code', contents: '', definitions: '' } });

describe('parseConfigurationIntoTestFile', () => {
  describe('single describe block', () => {
    const singleDescribeBlock: Configuration = {
      blocks: [
        {
          title: 'foo',
          code: {
            javascript: ['test(\'foo\', () => { expect(true).toBe(true); });'],
            python: ['def test_foo(self):\n  self.assertTrue(True)'],
          },
          variables: {},
          blocks: [],
        },
      ],
      code: {
        javascript: ['import { test, expect } from \'vitest\';'],
        python: ['from unittest import TestCase, main, expectedFailure'],
      },
      variables: {},
    };

    test('it should parse the configuration into a test file for javascript', () => {
      expect(parseConfigurationIntoTestFile(singleDescribeBlock, 'javascript')).toEqual([
        `import { test, expect } from 'vitest';`,
        '',
        'describe(\'foo\', () => {',
        'test(\'foo\', () => { expect(true).toBe(true); });',
        '});',
      ].join('\n'));
    });

    test('it should parse the configuration into a test file for python', () => {
      expect(parseConfigurationIntoTestFile(singleDescribeBlock, 'python')).toEqual([
        'from unittest import TestCase, main, expectedFailure',
        '',
        'def describe_foo():',
        '  def test_foo(self):',
        '    self.assertTrue(True)',
      ].join('\n'));
    });
  });

  describe('multiple describe blocks', () => {
    const multipleDescribeBlocks: Configuration = {
      blocks: [
        {
          title: 'foo',
          code: {
            javascript: ['test(\'foo\', () => { expect(true).toBe(true); });'],
            python: ['def test_foo(self):\n  self.assertTrue(True)'],
          },
          variables: {},
          blocks: [],
        },
        {
          title: 'bar',
          code: {
            javascript: ['test(\'bar\', () => { expect(true).toBe(true); });'],
            python: ['def test_bar(self):\n  self.assertTrue(True)'],
          },
          variables: {},
          blocks: [],
        },
      ],
      code: {
        javascript: ['import { test, expect } from \'vitest\';'],
        python: ['from unittest import TestCase, main, expectedFailure'],
      },
      variables: {},
    };

    test('it should parse the configuration into a test file for javascript', () => {
      expect(parseConfigurationIntoTestFile(multipleDescribeBlocks, 'javascript')).toEqual([
        `import { test, expect } from 'vitest';`,
        '',
        'describe(\'foo\', () => {',
        'test(\'foo\', () => { expect(true).toBe(true); });',
        '});',
        '',
        'describe(\'bar\', () => {',
        'test(\'bar\', () => { expect(true).toBe(true); });',
        '});',
      ].join('\n'));
    });

    test('it should parse the configuration into a test file for python', () => {
      expect(parseConfigurationIntoTestFile(multipleDescribeBlocks, 'python')).toEqual([
        'from unittest import TestCase, main, expectedFailure',
        '',
        'def describe_foo():',
        '  def test_foo(self):',
        '    self.assertTrue(True)',
        '',
        'def describe_bar():',
        '  def test_bar(self):',
        '    self.assertTrue(True)',
      ].join('\n'));
    });
  });

  describe('nested describe blocks', () => {
    const nestedDescribeBlocks: Configuration = {
      blocks: [
        {
          title: 'foo',
          code: {
            javascript: ['test(\'foo\', () => { expect(true).toBe(true); });'],
            python: ['def test_foo(self):\n  self.assertTrue(True)'],
          },
          variables: {},
          blocks: [
            {
              title: 'bar',
              code: {
                javascript: ['test(\'bar\', () => { expect(true).toBe(true); });'],
                python: ['def test_bar(self):\n  self.assertTrue(True)'],
              },
              variables: {},
              blocks: [],
            },

          ],
        },
      ],
      code: {
        javascript: ['import { test, expect } from \'vitest\';'],
        python: ['from unittest import TestCase, main, expectedFailure'],
      },
      variables: {},
    };

    test('it should parse the configuration into a test file for javascript', () => {
      expect(parseConfigurationIntoTestFile(nestedDescribeBlocks, 'javascript')).toEqual([
        `import { test, expect } from 'vitest';`,
        '',
        'describe(\'foo\', () => {',
        'test(\'foo\', () => { expect(true).toBe(true); });',
        '',
        'describe(\'bar\', () => {',
        'test(\'bar\', () => { expect(true).toBe(true); });',
        '});',
        '});',
      ].join('\n'));
    });

    test('it should parse the configuration into a test file for python', () => {
      expect(parseConfigurationIntoTestFile(nestedDescribeBlocks, 'python')).toEqual([
        'from unittest import TestCase, main, expectedFailure',
        '',
        'def describe_foo():',
        '  def test_foo(self):',
        '    self.assertTrue(True)',
        '',
        '  def describe_bar():',
        '    def test_bar(self):',
        '      self.assertTrue(True)',
      ].join('\n'));
    });
  });

  describe('variables', () => {
    describe('single describe block', () => {
      const singleBlock: Configuration = {
        blocks: [
          {
            title: 'Header',
            code: {
              javascript: ['test(\'some-test\', () => { expect(true).toBe($bar); });'],
              python: ['def test_some_test(self):\n  self.assertTrue($bar)'],
            },
            variables: {
              bar: makeVariable('bar'),
            },
            blocks: [],
          },
        ],
        code: {
          javascript: ['import { test, expect } from \'foo\';'],
          python: ['from foo import TestCase, main, expectedFailure'],
        },
        variables: {
          foo: makeVariable('foo',),
        },
      };

      test('it should parse the configuration into a test file for javascript', () => {
        expect(parseConfigurationIntoTestFile(singleBlock, 'javascript')).toEqual([
          `import { test, expect } from 'foo';`,
          '',
          'describe(\'Header\', () => {',
          'test(\'some-test\', () => { expect(true).toBe("bar"); });',
          '});',
        ].join('\n'));
      });

      test('it should parse the configuration into a test file for python', () => {
        expect(parseConfigurationIntoTestFile(singleBlock, 'python')).toEqual([
          'from foo import TestCase, main, expectedFailure',
          '',
          'def describe_header():',
          '  def test_some_test(self):',
          '    self.assertTrue("bar")',
        ].join('\n'));
      });
    });
  });

  describe('nested describe blocks', () => {
    const singleBlock: Configuration = {
      blocks: [
        {
          title: 'Header',
          code: {},
          variables: {
            bar: makeVariable('bar'),
          },
          blocks: [
            {
              title: 'Nested',
              code: {
                javascript: ['test(\'nested\', () => { console.log($foo); console.log($bar); console.log($baz); });'],
                python: ['def test_nested(self):\n  print($foo)\n  print($bar)\n  print($baz)'],
              },
              variables: {
                baz: makeVariable('baz'),
              },
              blocks: [],
            },
          ],
        },
      ],
      code: {},
      variables: {
        foo: makeVariable('foo'),
      },
    };

    test('it should parse the configuration into a test file for javascript', () => {
      expect(parseConfigurationIntoTestFile(singleBlock, 'javascript')).toEqual([
        'describe(\'Header\', () => {',
        'describe(\'Nested\', () => {',
        'test(\'nested\', () => { console.log("foo"); console.log("bar"); console.log("baz"); });',
        '});',
        '});',
      ].join('\n'));
    });

    test('it should parse the configuration into a test file for python', () => {
      expect(parseConfigurationIntoTestFile(singleBlock, 'python')).toEqual([
        'def describe_header():',
        '  def describe_nested():',
        '    def test_nested(self):',
        '      print("foo")',
        '      print("bar")',
        '      print("baz")',
      ].join('\n'));
    });
  });

  describe('nested describe blocks with overridden variables', () => {
    const singleBlock: Configuration = {
      blocks: [
        {
          title: 'Header',
          code: {
            javascript: ['console.log($foo)'],
            python: ['print($foo)'],
          },
          variables: {
            foo: makeVariable('bar'),
          },
          blocks: [
            {
              title: 'Nested',
              code: {
                javascript: ['console.log($foo)'],
                python: ['print($foo)'],
              },
              variables: {
                foo: makeVariable('baz'),
              },
              blocks: [],
            },
          ],
        },
      ],
      code: {
        javascript: ['console.log($foo)'],
        python: ['print($foo)'],
      },
      variables: {
        foo: makeVariable('foo'),
      },
    };

    test('it should parse the configuration into a test file for javascript', () => {
      expect(parseConfigurationIntoTestFile(singleBlock, 'javascript')).toEqual([
        'console.log("foo")',
        '',
        'describe(\'Header\', () => {',
        'console.log("bar")',
        '',
        'describe(\'Nested\', () => {',
        'console.log("baz")',
        '});',
        '});',
      ].join('\n'));
    });

    test('it should parse the configuration into a test file for python', () => {
      expect(parseConfigurationIntoTestFile(singleBlock, 'python')).toEqual([
        'print("foo")',
        '',
        'def describe_header():',
        '  print("bar")',
        '',
        '  def describe_nested():',
        '    print("baz")',
      ].join('\n'));
    });
  });

  describe('multiple code blocks within describe', () => {
    const singleBlock: Configuration = {
      code: {
        javascript: ['console.log($foo)', 'console.log($bar)'],
        python: ['print($foo)', 'print($bar)'],
      },
      variables: {
        foo: makeVariable('foo'),
        bar: makeVariable('bar-top'),
        baz: makeVariable('baz'),
      },
      blocks: [
        {
          title: 'Header',
          code: {
            javascript: ['console.log($foo)\nconsole.log($bar)'],
            python: ['print($foo)\nprint($bar)'],
          },
          variables: {
            foo: makeVariable('foo2'),
          },
          blocks: [
            {
              title: 'Nested',
              code: {
                javascript: ['console.log($foo)', 'console.log($bar)', 'console.log($baz)'],
                python: ['print($foo)', 'print($bar)', 'print($baz)'],
              },
              variables: {
                foo: makeVariable('foo3'),
              },
              blocks: [],
            },
          ],
        },
      ],
    };

    test('it should parse the configuration into a test file for javascript', () => {
      expect(parseConfigurationIntoTestFile(singleBlock, 'javascript')).toEqual([
        'console.log("foo")',
        'console.log("bar-top")',
        '',
        'describe(\'Header\', () => {',
        'console.log("foo2")',
        'console.log("bar-top")',
        '',
        'describe(\'Nested\', () => {',
        'console.log("foo3")',
        '',
        'console.log("bar-top")',
        '',
        'console.log("baz")',
        '});',
        '});',
      ].join('\n'));
    });

    test('it should parse the configuration into a test file for python', () => {
      expect(parseConfigurationIntoTestFile(singleBlock, 'python')).toEqual([
        'print("foo")',
        'print("bar-top")',
        '',
        'def describe_header():',
        '  print("foo2")',
        '  print("bar-top")',
        '',
        '  def describe_nested():',
        '    print("foo3")',
        '',
        '    print("bar-top")',
        '',
        '    print("baz")',
      ].join('\n'));
    });
  });
});
