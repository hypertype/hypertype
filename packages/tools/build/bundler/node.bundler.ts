import webpack from 'webpack';
import {getConfig} from '../webpack.config';
import {runCompiler} from '../run.compiler';
import {IOptions} from '../contract';

export const nodeBundler = ({entryPoint, outputFilename, outputPath}: IOptions) => {
  const config = getConfig(entryPoint, outputFilename, outputPath, 'node');
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
