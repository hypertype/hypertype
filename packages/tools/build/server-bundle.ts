import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import * as path from 'path';
import {getConfig} from "./webpack.config";
import {runCompiler} from './run.compiler';

export const serverBundle = ({html, index, publicPath, port, host, output}) => {
  if (!publicPath) publicPath = '';
  if (!host) host = 'localhost';
  if (!port) port = '3200';
  const baseDir = process.cwd();
  const config = getConfig(index, "index.js", output);
  const compiler = webpack({
    ...config,
    externals: [],
    output: {
      ...config.output,
      publicPath: publicPath
    },
    plugins: [
      new HtmlWebpackPlugin({
        minify: false,
        template: html,
        base: {
          href: publicPath
        }
      }),
      ...config.plugins
    ],
  });
  if (process.argv.indexOf('--run') >= 0) {
    console.log(`starting web server...`);
    const server = new WebpackDevServer(compiler, {
      port: port,
      static: {
        directory: path.join(baseDir, 'dist'),
        publicPath: publicPath,
      },
      historyApiFallback: {
        rewrites: [
          {from: /./, to: `/index.html`},
        ]
      }
    },);
    server.listen(port, host, (err, stats) => {
      console.log(`listen on ${host}:${port}`)
    });
  } else {
    runCompiler(compiler)
  }
};
