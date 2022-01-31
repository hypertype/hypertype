import dotenvExpand from 'dotenv-expand';
import dotenv from 'dotenv';
import fs from 'fs';
import {DOTENV_FILE} from './params';
import {logBundlerErr} from './log';
import {TRunMode} from '../types';

export const runModeInfo = () => {
  const NODE_ENV = process.env.NODE_ENV;
  return {
    NODE_ENV,
    isDevelopment: NODE_ENV === 'development',
    isProduction: NODE_ENV === 'production',
    isTest: NODE_ENV === 'test',
  };
};

/**
 * Preparing environment variables:
 *  1) load variables from .env* files into process.env;
 *  2) set process.env.NODE_ENV
 */
export function prepareEnv(nodeEnv: TRunMode) {
  /**
   * Prepare a selection of .env* files depending on the startup mode and priority:
   *  https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
   */
  const dotenvFiles = [
    `${DOTENV_FILE}.${nodeEnv}.local`,
    // Don't include `.env.local` for `test` environment
    // since normally you expect tests to produce the same
    // results for everyone
    nodeEnv !== 'test' && `${DOTENV_FILE}.local`,
    `${DOTENV_FILE}.${nodeEnv}`,
    DOTENV_FILE
  ].filter(Boolean) as string[];

  /**
   * Load environment variables from .env* files. Suppress warnings using silent
   * if this file is missing. dotenv will never modify any environment variables
   * that have already been set.  Variable expansion is supported in .env files.
   * https://github.com/motdotla/dotenv
   * https://github.com/motdotla/dotenv-expand
   */
  dotenvFiles.forEach(file => {
    if (fs.existsSync(file)) {
      dotenvExpand(
        dotenv.config({
          path: file
        })
      );
    }
  });
  process.env.NODE_ENV = nodeEnv;
}

export function getEnv(): NodeJS.ProcessEnv {
  if (!runModeInfo().NODE_ENV) {
    logBundlerErr('The NODE_ENV environment variable is required but was not specified.');
    throw '';
  }
  return {...process.env};
}

/**
 * Stringify all values so we can feed into webpack DefinePlugin
 */
export const stringifiedProcessEnv = () => ({
  'process.env': Object.entries(getEnv())
    .reduce((acc, [key, value]) => {
      acc[key] = JSON.stringify(value);
      return acc;
    }, {} as any)
});
