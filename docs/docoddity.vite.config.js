import { copyFile, mkdir, readFile } from "fs/promises";
import path from "path";
import toml from 'toml';

export default ({
  sourceDir,
  buildDir,
}) => ({
  // optimizeDeps: { exclude: ["pyodide"] },
  plugins: [
    {
      name: "bundle-python-gbnf",
      generateBundle: async () => {
        const rootDir = path.join(sourceDir, '..');
        const assetsDir = path.join(buildDir, "assets");
        await mkdir(assetsDir, { recursive: true });
        const pythonDir = path.join(rootDir, 'packages/gbnf/python');
        const pyproject = toml.parse(await readFile(path.join(pythonDir, 'pyproject.toml'), 'utf-8'));
        const version = pyproject.project.version;
        await copyFile(
          path.resolve(pythonDir, `dist/gbnf-${version}-py3-none-any.whl`),
          path.join(assetsDir, `gbnf-${version}-py3-none-any.whl`),
        );
        // const files = [

        //   "pyodide-lock.json",
        //   "pyodide.asm.js",
        //   "pyodide.asm.wasm",
        //   "python_stdlib.zip",
        // ];
        // for (const file of files) {
        //   await copyFile(
        //     join("node_modules/pyodide", file),
        //     join(assetsDir, file),
        //   );
        // }
      },
    },
  ],
});
