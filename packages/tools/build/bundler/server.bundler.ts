import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import { join } from 'path';
import {DIST_DIR, needToRun} from '../util/params';
import {relativeToBase} from '../util/common';
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
    const server = new WebpackDevServer(compiler, {
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
    },);
    server.listen(port, host, (err) => {
      console.log(`listen on ${host}:${port}`)
    });
  } else {
    runCompiler(compiler)
  }
};
