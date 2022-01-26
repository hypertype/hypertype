import webpack from 'webpack';
import {getConfig} from './webpack.config';
import {runCompiler} from './run.compiler';

export const nodeBundle = ({index, output, target}) => {
  const config = getConfig(index, target, output, 'node');
  const compiler = webpack({
    ...config,
    node: {
      __dirname: false,
      dns: 'empty',
      net: 'empty',
      btoa: true
    },
    output: {
      ...config.output,
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
      libraryTarget: 'umd'
    }
  });
  runCompiler(compiler)
};
