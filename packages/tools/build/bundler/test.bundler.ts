import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import {relativeToBase} from '../util/common';
import {getConfig} from "../webpack.config";
import {DIST_DIR} from '../util/params';
import {IOptions} from '../contract';

export const testBundler = ({entryPoint, template, host, port, publicPath}: IOptions) => {
    const config = getConfig(entryPoint);
    const compiler = webpack({
        ...config,
        externals: [],
        plugins: [
            new HtmlWebpackPlugin({
                template: relativeToBase(template),
                base: {
                    href: publicPath
                }
            }),
        ],
    });
    // if (process.argv.indexOf('run') >= 0) {
    const server = new WebpackDevServer(compiler, {
        contentBase: DIST_DIR,
        port: port,
        publicPath: publicPath,
        historyApiFallback: {
            rewrites: [
                {from: /.*/, to: `${publicPath}/index.html`},
            ]
        }
    },);
    server.listen(port, host, (err, stats) => {
    });
    // }else {
    //     runCompiler(compiler)
    // }
};
