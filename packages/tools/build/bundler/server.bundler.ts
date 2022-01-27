import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import {relativeToBase} from '../util/common';
import {getConfig} from "../webpack.config";
import {runCompiler} from '../run.compiler';
import {DIST_DIR, needToRun} from '../util/params';
import {IOptions} from '../contract';

export const serverBundler = ({entryPoint, outputPath, template, host, port, publicPath}: IOptions) => {
  if (!publicPath) publicPath = '';
  if (!host) host = 'localhost';
  if (!port) port = 3200;
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
        base: {
          href: publicPath
        }
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
