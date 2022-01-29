import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import {onProcessExit, relativeToBase} from '../../util/common';
import {getConfig} from "../webpack.config";
import {DIST_DIR} from '../../util/params';
import {IOptions} from '../contract';

export const testBundler = ({entryPoint, template, host, port, publicPath}: IOptions) => {
    const config = getConfig(entryPoint);
    const compiler = webpack({
        ...config,
        externals: [],
        plugins: [
            new HtmlWebpackPlugin({
                template: relativeToBase(template),
                base: publicPath
            }),
        ],
    });
    const devServer = new WebpackDevServer({
        static: {
          directory: DIST_DIR,
          publicPath,
        },
        port: port,
        historyApiFallback: {
            rewrites: [
                {from: /.*/, to: `${publicPath}/index.html`},
            ]
        }
    }, compiler);
    onProcessExit(() => devServer.close());
    devServer.startCallback(() => {
      console.log(`listen on ${host}:${port}`)
    });
};
