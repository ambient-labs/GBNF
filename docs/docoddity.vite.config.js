import { copyFile, mkdir, readFile } from "fs/promises";
import path from "path";
import toml from 'toml';
// import { type DocoddityViteConfigArgs } from 'docoddity';

export default async ({
  sourceDir,
  targetDir: buildDir,
}) => {
  // }: DocoddityViteConfigArgs) => {
  const rootDir = path.join(sourceDir, '..');
  const assetPathRoot = '/assets/packages/gbnf/python';
  const assetsFullDirPath = path.join(buildDir, assetPathRoot);
  // const assetsFullDirPath = path.join(buildDir, '..', 'public', assetPathRoot);
  const pythonDir = path.join(rootDir, 'packages/gbnf/python');
  const pyproject = toml.parse(await readFile(path.join(pythonDir, 'pyproject.toml'), 'utf-8'));
  const version = pyproject.project.version;
  const wheelName = `gbnf-${version}-py3-none-any.whl`;
  return {
    // optimizeDeps: { exclude: ["pyodide"] },
    publicDir: 'public',
    define: {
      'import.meta.env.VITE_GBNF_PYTHON_DEPENDENCIES': JSON.stringify([path.join(assetPathRoot, wheelName)]),
    },
    plugins: [
      {
        name: "bundle-python-gbnf",
        generateBundle: async () => {
          await mkdir(assetsFullDirPath, { recursive: true });
          // import.meta.env.VITE_GBNF_PYTHON_DEPENDENCIES = [
          //   `${assetPath}/gbnf-${version}-py3-none-any.whl`,
          // ];
          console.log(`Copying gbnf-${version}-py3-none-any.whl to ${assetsFullDirPath}`);
          await copyFile(
            path.resolve(pythonDir, 'dist', wheelName),
            path.join(assetsFullDirPath, wheelName),
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
  }
};
