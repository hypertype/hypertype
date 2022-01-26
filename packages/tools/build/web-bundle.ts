import webpack from 'webpack';
import {getConfig} from "./webpack.config";
import {runCompiler} from './run.compiler';

export const webBundle = ({index, target, output}) => {
  const config = getConfig(index, target, output);
  const compiler = webpack({
    ...config,
    output: {
      ...config.output,
      libraryTarget: 'umd'
    }
  });
  runCompiler(compiler)
};
