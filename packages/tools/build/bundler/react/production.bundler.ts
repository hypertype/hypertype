import {existsSync} from 'fs';
import webpack from 'webpack';
import {callbackWebpack, cleanDir, copySync} from '../../../util/common';
import {getProductionConfig} from './config/config';
import {logAction} from '../../../util/log';
import {IOptions} from '../../contract';

export function productionReactBundler(opt: IOptions): void {
  const {outputPath, assetPath, templatePath} = opt;

  logAction('Preparing the output directory...', false);
  if (existsSync(outputPath))
    cleanDir(outputPath);
  if (assetPath)
    copySync(assetPath, outputPath, srcPath => srcPath !== templatePath);

  webpack(getProductionConfig(opt), callbackWebpack);

  logAction('Creating an optimized production build...');
}
