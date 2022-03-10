import {Configuration} from 'webpack';
import {getDevelopmentConfig} from './build/bundler/react/config/config';
import {normalizeOptions, printOptions} from './util/options';
import {IRunOptions} from './build/contract';
import {OPTIONS_MAP} from './util/params';
import {prepareEnv} from './util/env';

export function getReactDevelopmentConfig(optName: string): Configuration {
  prepareEnv('development');
  const runOpt = OPTIONS_MAP[optName] as IRunOptions;
  const opt = normalizeOptions(runOpt);
  printOptions(opt);
  return getDevelopmentConfig(opt);
}
