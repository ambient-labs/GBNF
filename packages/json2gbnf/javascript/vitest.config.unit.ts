import { defineConfig, } from 'vitest/config';

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
      'integration-tests/**/*.test.ts',
    ],
    watchExclude: [
      'tmp/**/*',
    ],
    typecheck: {
      tsconfig: './tsconfig.test.json',
    },
    globals: true,
  },
});
