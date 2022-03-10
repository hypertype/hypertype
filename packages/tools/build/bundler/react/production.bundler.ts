import {existsSync} from 'fs';
import webpack from 'webpack';
import {callbackWebpack, cleanDir, copySync, messageRunOptionErr} from '../../../util/common';
import {logAction, logBundlerErr} from '../../../util/log';
import {getProductionConfig} from './config/config';
import {IOptions} from '../../contract';

export function productionReactBundler(opt: IOptions): void {
  const {outputPath, assetPath, templatePath} = opt;

  logAction('Preparing the output directory...', false);
  if (existsSync(outputPath))
    cleanDir(outputPath);

  if (assetPath) {
    if (assetPath === outputPath) {
      logBundlerErr(messageRunOptionErr('assetPath', assetPath, 'must be different from outputPath'));
      throw '';
    }
    copySync(assetPath, outputPath, srcPath => srcPath !== templatePath);
  }

  webpack(getProductionConfig(opt), callbackWebpack);

  logAction('Creating an optimized production build...');
}
