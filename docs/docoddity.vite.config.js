import {
  copyFile,
  mkdir,
  readFile,
} from "fs/promises";
import path from "path";
import toml from 'toml';

import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const NODE_MODULES_DIR = path.resolve(__dirname, './node_modules');
const PYODIDE_PACKAGE_JSON = await readFile(path.resolve(NODE_MODULES_DIR, 'pyodide/package.json'), 'utf-8');
// import { type DocoddityViteConfigArgs } from 'docoddity';

export default async ({
  sourceDir,
  targetDir: buildDir,
  docoddityMode,
}) => {
  // }: DocoddityViteConfigArgs) => {
  const rootDir = path.join(sourceDir, '..');
  const assetPathRoot = '/assets/packages/gbnf/python';
  const assetsFullDirPath = path.join(buildDir, docoddityMode === 'dev' ? 'public' : '', assetPathRoot);
  // console.log('assetsFullDirPath', assetsFullDirPath);
  // const assetsFullDirPath = path.join(buildDir, '..', 'public', assetPathRoot);
  const pythonDir = path.join(rootDir, 'packages/gbnf/python');
  const pyproject = toml.parse(await readFile(path.join(pythonDir, 'pyproject.toml'), 'utf-8'));
  const version = pyproject.project.version;
  const wheelName = `gbnf-${version}-py3-none-any.whl`;
  const copyPythonWheelToAssets = async () => {
    await mkdir(assetsFullDirPath, { recursive: true });
    console.log('made dir', assetsFullDirPath);
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
  }
  return {
    // optimizeDeps: { exclude: ["pyodide"] },
    publicDir: 'public',
    define: {
      'import.meta.env.VITE_GBNF_PYTHON_DEPENDENCIES': JSON.stringify([path.join(assetPathRoot, wheelName)]),
      'import.meta.env.PYODIDE_VERSION': PYODIDE_PACKAGE_JSON.version,
    },
    plugins: [
      {
        name: "bundle-python-gbnf",
        buildStart: copyPythonWheelToAssets,
        generateBundle: copyPythonWheelToAssets,
      },
    ],
  }
};
