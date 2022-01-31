import {join} from 'path';
import {DIST_DIR, excludeBase, relativeToBase} from './params';
import {logAction, logBundlerErr, logOption} from './log';
import {IOptions, IRunOptions} from '../build/contract';
import {arrToStr, messageRunOptionErr} from './common';
import {runModeInfo} from './env';

/**
 * We must ensure that:
 *  - all required fields passed;
 *  - all paths are aligned relative to the base directory;
 *  - if there is no parameter value, its default value is used.
 */
export const normalizeOptions = (
  {
    bundler,
    entryPoint, outputPath, outputFilename,
    assetPath, templatePath,
    svgLoaderType,
    host, port, publicPath
  }: IRunOptions
): IOptions => {
  const {isProduction} = runModeInfo();

  let target: IOptions['target'] = 'web';
  if (bundler === 'worker')
    target = 'webworker';
  else if (bundler === 'node')
    target = 'node';

  if (!entryPoint) {
    logBundlerErr(messageRunOptionErr('entryPoint', entryPoint, 'non empty string'));
    throw '';
  }
  entryPoint = relativeToBase(entryPoint);
  let entry: { [key in string]: string } = {index: entryPoint};
  if (bundler === 'worker')
    entry = {worker: entryPoint};

  outputPath = outputPath ? relativeToBase(outputPath) : DIST_DIR;
  if (isProduction)
    outputPath = join(outputPath, 'prod');

  if (!outputFilename) {
    if (bundler === 'worker')
      outputFilename = 'worker.js';
    else
      outputFilename = 'index.js';
  }

  assetPath = assetPath ? relativeToBase(assetPath) : DIST_DIR;
  templatePath = templatePath ? relativeToBase(templatePath) : '';
  svgLoaderType = svgLoaderType || 'raw';
  host = host || 'localhost';
  port = port || 3200;
  publicPath = publicPath || '/';

  const mainEs = 'es6';
  const moduleEs = 'module';
  const mainFields = isProduction ? [mainEs, 'main', moduleEs] : [moduleEs, mainEs, 'main'];
  if (target !== 'node')
    mainFields.unshift('browser');

  return {
    target,
    entry,
    outputPath,
    outputFilename,
    assetPath,
    templatePath,
    svgLoaderType,
    host,
    port,
    publicPath,
    mainFields
  }
}

export function printOptions(opt: IOptions): void {
  const unset = '--';
  const result: { [key: number]: [keyof IOptions, string] } = {};

  for (let [option, value] of Object.entries(opt)) {
    switch (option as keyof IOptions) {
      case 'target':
        result[1] = ['target', value];
        break;
      case 'entry':
        const value2 = Object
          .entries<string>(value)
          .reduce<{ [key in string]: string }>((acc, [k, v]) => {
            acc[k] = excludeBase(v);
            return acc;
          }, {});
        result[2] = ['entry', JSON.stringify(value2)];
        break;
      case 'outputPath':
        result[3] = ['outputPath', excludeBase(value)];
        break;
      case 'outputFilename':
        result[4] = ['outputFilename', value];
        break;
      case 'assetPath':
        value = value || unset;
        result[5] = ['assetPath', excludeBase(value)];
        break;
      case 'templatePath':
        value = value || unset;
        result[6] = ['templatePath', excludeBase(value)];
        break;
      case 'svgLoaderType':
        result[7] = ['svgLoaderType', value];
        break;
      case 'host':
        result[8] = ['host', value];
        break;
      case 'port':
        result[9] = ['port', value];
        break;
      case 'publicPath':
        result[10] = ['publicPath', value];
        break;
      case 'mainFields':
        result[11] = ['mainFields', arrToStr(value)];
        break;
      default:
        logBundlerErr(`Print unknown option "${option}"`);
        throw '';
    }
  }
  logAction('Bundler options:');
  for (const [, [option, value]] of Object.entries(result))
    logOption(option, value);
  console.log(' ');
}
