import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import { join } from 'path';
import {onProcessExit, relativeToBase} from '../../util/common';
import {DIST_DIR, needToRun} from '../../util/params';
import {getConfig} from "../webpack.config";
import {runCompiler} from '../run.compiler';
import {IOptions} from '../contract';

export const serverBundler = ({entryPoint, outputPath, template, host, port, publicPath}: IOptions) => {
  publicPath = publicPath || '/';
  host = host || 'localhost';
  port = port || 3200;
  const config = getConfig(entryPoint, "index.js", outputPath);
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
        template: relativeToBase(template),
        base: publicPath
      }),
      ...config.plugins
    ],
  });
  if (needToRun) {
    console.log(`starting web server...`);
    const devServer = new WebpackDevServer({
      port: port,
      static: {
        directory: DIST_DIR,
        publicPath,
      },
      historyApiFallback: {
        rewrites: [
          {from: /./, to: join(publicPath, 'index.html')},
        ]
      }
    }, compiler);
    onProcessExit(() => devServer.close());
    devServer.startCallback(() => {
      console.log(`listen on ${host}:${port}`)
    });
  } else {
    runCompiler(compiler)
  }
};
