import { defineConfig, } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'src/**/*.test.ts',
    ],
    watchExclude: [
      'tmp/**/*',
    ],
    globals: true,
  },
});
