import {copyFileSync, existsSync, lstatSync, mkdirSync, readdirSync, rmSync} from 'fs';
import {join} from 'path';
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

export function copySync(
  src: string,
  dest: string,
  allowedToCopyFilter?: (srcPath: string) => boolean
): void {
  if (!existsSync(src) || allowedToCopyFilter && !allowedToCopyFilter(src))
    return;
  if (isDirectory(src)) {
    if (!existsSync(dest))
      mkdirSync(dest);
    let files = readdirSync(src);
    if (allowedToCopyFilter)
      files = files.filter(allowedToCopyFilter);
    files.forEach(item => {
      copySync(
        join(src, item),
        join(dest, item),
        allowedToCopyFilter
      );
    });
  } else
    copyFileSync(src, dest);
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
