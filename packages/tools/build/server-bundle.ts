import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import {getConfig} from "./webpack.config";
import {runCompiler} from './run.compiler';
import {DIST_DIR} from './util/params';

export const serverBundle = ({html, index, output, publicPath, port, host}) => {
  if (!publicPath) publicPath = '';
  if (!host) host = 'localhost';
  if (!port) port = '3200';
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
        directory: DIST_DIR,
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
