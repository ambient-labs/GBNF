import config from './vite.config.js';
import { mergeConfig, } from 'vitest/config';
// import dts from 'vite-plugin-dts';

export default mergeConfig(config, {
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['umd',],
      fileName: 'index',
      name: 'JSON2GBNF',
    },
    sourcemap: true,
    target: 'esnext',
    minify: true,
  },
  // plugins: [dts({ rollupTypes: true, }),],
});
