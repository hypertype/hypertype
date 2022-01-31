import webpack from 'webpack';
import {getConfig} from '../webpack.config';
import {runCompiler} from '../run.compiler';
import {IOptions} from '../contract';

export const workerBundler = (opt: IOptions) => {
  const config = getConfig(opt);
  const compiler = webpack({
    ...config,
    externals: [],
    output: {
      libraryTarget: 'umd'
    }
  });
  runCompiler(compiler)
};
