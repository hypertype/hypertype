import webpack from 'webpack';
import {getConfig} from "../webpack.config";
import {runCompiler} from '../run.compiler';
import {IOptions} from '../contract';

export const webBundler = ({entryPoint, outputFilename, outputPath}: IOptions) => {
  const config = getConfig(entryPoint, outputFilename, outputPath);
  const compiler = webpack({
    ...config,
    output: {
      ...config.output,
      libraryTarget: 'umd'
    }
  });
  runCompiler(compiler)
};
