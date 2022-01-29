import {existsSync} from 'fs';
import {join} from 'path';

export const BASE_DIR = process.cwd();
export const DIST_DIR = relativeToBase('dist');
export const PKG_FILE = relativeToBase('package.json');
export const OVERRIDE_CONFIG_FILE = relativeToBase('webpack.config.js');

export const PKG = require(PKG_FILE);
export const OPTIONS = PKG.hypertype;
export const OVERRIDE_CONFIG = existsSync(OVERRIDE_CONFIG_FILE) ? require(OVERRIDE_CONFIG_FILE) : null;

const [nodePath, runFilePath, ...args] = process.argv;
export const ARGS = args;
export const isProd = args.filter(a => /--prod/.test(a)).length > 0;
export const needToRun = args.filter(a => /--run/.test(a)).length > 0;
export const needToWatch = args.filter(a => /--watch/.test(a)).length > 0;
export const needStats = args.filter(a => /--stats/.test(a)).length > 0;


export function relativeToBase(...paths: string[]) {
  return join(BASE_DIR, ...paths)
}
