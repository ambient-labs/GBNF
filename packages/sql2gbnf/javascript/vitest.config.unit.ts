import { defineConfig, } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: [
        'src/**',
        '!src/**/*.test.ts',
      ],
    },
    include: [
      'src/**/*.test.ts',
    ],
    exclude: [
      'tests/**/*',
    ],
    watchExclude: [
      'tmp/**/*',
    ],
    typecheck: {
      tsconfig: './tsconfig.test.json',
    },
    globals: true,
    setupFiles: [
      path.resolve(__dirname, './tests/setup/index.ts'),
    ],
  },
});
