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
  let entry: IOptions['entry'] = {index: entryPoint};
  if (bundler === 'worker')
    entry = {worker: entryPoint};
  else if (bundler === 'react')
    entry = {main: entryPoint};

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
  const result: [keyof IOptions, string][] = [];

  for (const [option, value] of Object.entries(opt)) {
    switch (option as keyof IOptions) {
      case 'target':
        result.push(['target', value]);
        break;
      case 'entry':
        const value2 = Object
          .entries<string>(value)
          .reduce((acc, [k, v]) => {
            acc[k] = excludeBase(v);
            return acc;
          }, {});
        result.push(['entry', JSON.stringify(value2)]);
        break;
      case 'outputPath':
        result.push(['outputPath', excludeBase(value)]);
        break;
      case 'outputFilename':
        result.push(['outputFilename', valueOrUnset(value)]);
        break;
      case 'assetPath':
        result.push(['assetPath', valueOrUnset(excludeBase(value))]);
        break;
      case 'templatePath':
        result.push(['templatePath', valueOrUnset(excludeBase(value))]);
        break;
      case 'svgLoaderType':
        result.push(['svgLoaderType', value]);
        break;
      case 'host':
        result.push(['host', value]);
        break;
      case 'port':
        result.push(['port', value]);
        break;
      case 'publicPath':
        result.push(['publicPath', value]);
        break;
      case 'mainFields':
        result.push(['mainFields', arrToStr(value)]);
        break;
      default:
        logBundlerErr(`Print unknown option "${option}"`);
        throw '';
    }
  }
  logAction('Bundler options:');
  for (const [option, value] of result)
    logOption(option, value);
  console.log(' ');
}

function valueOrUnset(value: any) {
  return value || '--';
}
