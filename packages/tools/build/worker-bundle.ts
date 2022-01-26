import webpack from 'webpack';
import {getConfig} from "./webpack.config";
import {runCompiler} from './run.compiler';

export const workerBundle = ({index, output, target}) => {
  const config = getConfig(index, target || 'worker.js', output, 'worker');
  const compiler = webpack({
    ...config,
    entry: {
      worker: index
    },
    externals: [],
    target: 'webworker',
    output: {
      libraryTarget: 'umd'
    }
  });
  runCompiler(compiler)
};
