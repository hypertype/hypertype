import {join, sep} from 'path';
import {existsSync} from 'fs';

//region File paths

export const BASE_DIR = process.cwd();
export const SRC_DIR = relativeToBase('src');
export const DIST_DIR = relativeToBase('dist');
export const DOTENV_FILE = relativeToBase('.env');
export const PKG_FILE = relativeToBase('package.json');
export const OVERRIDE_CONFIG_FILE = relativeToBase('webpack.config.js');

//endregion


//region Objects/Modules

export const OPTIONS_MAP_FIELD_NAME = 'hypertype';

export const PKG = require(PKG_FILE);
export const OPTIONS_MAP = PKG[OPTIONS_MAP_FIELD_NAME];
export const OVERRIDE_CONFIG = existsSync(OVERRIDE_CONFIG_FILE) ? require(OVERRIDE_CONFIG_FILE) : null;

//endregion


//region Arguments

const [nodePath, runFilePath, ...args] = process.argv;
export const ARGS = args;
export const needToRun = findArg('--run');
export const needToWatch = findArg('--watch');
export const needStats = findArg('--stats');

//endregion


//region Support

export function relativeToBase(...paths: string[]): string {
  return join(BASE_DIR, ...paths)
}

export function excludeBase(value: string): string {
  const unixSeparator = '/';
  const winSeparator = '\\';
  let result = value.replace(BASE_DIR, '');
  if (sep === winSeparator)
    result = result.replaceAll(winSeparator, unixSeparator);
  if (result[0] === unixSeparator)
    result = result.replace(unixSeparator, ''); // without lead separator
  return result;
}

export function findArg(value: string): boolean {
  const regexp = new RegExp(value);
  return ARGS.filter(a => regexp.test(a)).length > 0;
}

export function optionalArgsStr(): string {
  const result = [];
  needToRun && result.push('run');
  needToWatch && result.push('watch');
  needStats && result.push('stats');
  if (result.length)
    return `[${result}]`;
  return '';
}

//endregion
