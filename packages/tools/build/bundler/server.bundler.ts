import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import {join} from 'path';
import {messageRunOptionErr, onProcessExit} from '../../util/common';
import {logAction, logBundlerErr} from '../../util/log';
import {getConfig} from '../webpack.config';
import {needToRun} from '../../util/params';
import {runCompiler} from '../run.compiler';
import {IOptions} from '../contract';

export const serverBundler = (opt: IOptions) => {
  const config = getConfig(opt);
  const {publicPath, assetPath, templatePath, host, port} = opt;
  if (!templatePath) {
    logBundlerErr(messageRunOptionErr('templatePath', templatePath, 'non empty string'));
    throw '';
  }
  const compiler = webpack({
    ...config,
    externals: [],
    output: {
      ...config.output,
      publicPath
    },
    plugins: [
      new HtmlWebpackPlugin({
        minify: false,
        template: templatePath,
        base: publicPath
      }),
      ...config.plugins
    ],
  });
  if (needToRun) {
    logAction(`starting web server...`, false);
    const devServer = new WebpackDevServer({
      port,
      static: {
        directory: assetPath,
        publicPath,
      },
      historyApiFallback: {
        rewrites: [
          {from: /./, to: join(publicPath, 'index.html')},
        ]
      }
    }, compiler as any);
    onProcessExit(() => devServer.close());
    devServer.startCallback(() => {
      logAction(`listen on ${host}:${port}`);
    });
  } else {
    runCompiler(compiler)
  }
};
