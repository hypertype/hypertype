import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackDevServer from 'webpack-dev-server';
import webpack, { Compiler } from 'webpack';
import {messageRunOptionErr, onProcessExit} from '../../util/common';
import {DIST_DIR, relativeToBase} from '../../util/params';
import {logAction, logBundlerErr} from '../../util/log';
import {getConfig} from "../webpack.config";
import {IOptions} from '../contract';

export const testBundler = (opt: IOptions) => {
    const config = getConfig(opt);
    const {templatePath, host, port, publicPath} = opt;
    if (!templatePath) {
      logBundlerErr(messageRunOptionErr('templatePath', templatePath, 'non empty string'));
      throw '';
    }
    const compiler = webpack({
        ...config,
        externals: [],
        plugins: [
            new HtmlWebpackPlugin({
                template: relativeToBase(templatePath),
                base: publicPath
            }),
        ],
    });
    const devServer = new WebpackDevServer({
        static: {
          directory: DIST_DIR,
          publicPath,
        },
        port,
        historyApiFallback: {
            rewrites: [
                {from: /.*/, to: `${publicPath}/index.html`},
            ]
        }
    }, compiler as any);
    onProcessExit(() => devServer.close());
    devServer.startCallback(() => {
      logAction(`listen on ${host}:${port}`);
    });
};
