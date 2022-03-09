import {copyFileSync, existsSync, lstatSync, mkdirSync, readdirSync, rmSync} from 'fs';
import {basename, extname, join} from 'path';
import {OVERRIDE_CONFIG, OVERRIDE_CONFIG_FILE} from './params';
import {logErr, logSuccess, logWarn} from './log';
import {IRunOptions} from '../build/contract';

export const messageRunOptionErr = (optionField: keyof IRunOptions, value: any, expected: any): string =>
  `Incorrect value of the "${optionField}" option field: "${value}". Possible value(s): ${expected}`;

/**
 * ['hello', 'world', 123] => '"hello", "world", "123"'
 */
export const arrToStr = (arr: string[]): string => arr.map(x => `"${x}"`).join(', ');

export function onProcessExit(callback: () => void): void {
  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
      callback();
      process.exit();
    });
  });
}


//region File system

export function copySync(
  src: string, // absolute path From where copy
  dst: string, // absolute path To copy
  allowedToCopyFilter?: (srcFileName: string) => boolean
): void {
  if (!existsSync(src))
    return;
  if (isDirectory(src)) {
    if (!existsSync(dst))
      mkdirSync(dst);
    if (!isDirectory(dst)) {
      logErr('Copy sync:', `Can't copy src dir "${src}" to dst file "${dst}"`);
      throw '';
    }
    let fileNames = readdirSync(src);
    if (allowedToCopyFilter)
      fileNames = fileNames.filter(allowedToCopyFilter);
    fileNames.forEach(fileName => {
      copySync(
        join(src, fileName),
        join(dst, fileName),
        allowedToCopyFilter
      );
    });
  } else {
    const dstExt = extname(dst);
    if (extname(src) !== dstExt) {
      if (!dstExt && !existsSync(dst)) {
        logWarn('Copy sync:', `I will assume that dst "${dst}" is a directory`);
        mkdirSync(dst);
      } else
        logWarn('Copy sync:', `Different extensions for src file "${src}" and dst file "${dst}"`);
    }
    if (existsSync(dst) && isDirectory(dst))
      dst = join(dst, basename(src));
    copyFileSync(src, dst);
  }
}

export function cleanDir(dir: string): void {
  if (!existsSync(dir) || !isDirectory(dir))
    return;
  readdirSync(dir)
    .map(item => join(dir, item))
    .forEach(file =>
      rmSync(file, {
        recursive: isDirectory(file),
        force: true
      })
    );
}

function isDirectory(file: string): boolean {
  return lstatSync(file).isDirectory();
}

//endregion File system


export function printConfigOverrideInfo(): void {
  if (OVERRIDE_CONFIG)
    logSuccess('Configuration for override:', OVERRIDE_CONFIG_FILE);
}
