import { defineConfig, } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    include: [
      'tests/integration/**/*.test.ts',
    ],
    exclude: [
      'src/**/*.ts',
    ],
    watchExclude: [
      'tmp/**/*',
    ],
    globals: true,
    typecheck: {
      // tsconfig: './tests/integration/tsconfig.json',
    },
    setupFiles: [
      path.resolve(__dirname, './tests/setup/index.ts'),
    ],
  },
});
