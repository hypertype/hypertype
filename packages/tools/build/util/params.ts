import {existsSync} from 'fs';
import {join} from 'path';

export const BASE_DIR = process.cwd();
export const PKG_FILE = join(BASE_DIR, 'package.json');
export const OVERRIDE_CONFIG_FILE = join(BASE_DIR, 'webpack.config.js');

export const PKG = require(PKG_FILE);
export const OPTIONS = PKG.hypertype;
export const OVERRIDE_CONFIG = existsSync(OVERRIDE_CONFIG_FILE) ? require(OVERRIDE_CONFIG_FILE) : null;

const [nodePath, thisFilePath, ...args] = process.argv;
const [arg1, arg2, arg3, arg4] = args;
export const ARG1 = arg1;
export const ARG2 = arg2;
export const ARG3 = arg3;
export const ARG4 = arg4;

export const isProd = args.filter(a => /--prod/.test(a)).length > 0;
export const needStats = args.filter(a => /stats/.test(a)).length > 0;
