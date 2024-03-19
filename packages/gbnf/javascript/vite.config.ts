import { defineConfig, } from 'vitest/config';

export default defineConfig({
  build: {
    emptyOutDir: false,
  },
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**']
    },
    include: ['./src/**/*.test.ts', './test/**/*.test.ts',],
    exclude: ['./dev/**/*',],
    globals: true,
    // ts
    typecheck: {
      tsconfig: './tsconfig.test.json',
    },
  },
});
