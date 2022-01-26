import webpack from 'webpack';
import {getConfig} from "../webpack.config";
import {relativeToBase} from '../util/common';
import {runCompiler} from '../run.compiler';
import {IOptions} from '../contract';

export const workerBundler = ({entryPoint, outputFilename, outputPath}: IOptions) => {
  const config = getConfig(entryPoint, outputFilename || 'worker.js', outputPath);
  const compiler = webpack({
    ...config,
    entry: {
      worker: relativeToBase(entryPoint)
    },
    externals: [],
    target: 'webworker',
    output: {
      libraryTarget: 'umd'
    }
  });
  runCompiler(compiler)
};
