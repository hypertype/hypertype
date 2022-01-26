import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import * as path from 'path';
import {getConfig} from "./webpack.config";

export const testBundle = ({html, index, publicPath, port, host}) => {
    const baseDir = process.cwd();
    const config = getConfig(index);
    const compiler = webpack({
        ...config,
        externals: [],
        plugins: [
            new HtmlWebpackPlugin({
                template: html,
                base: {
                    href: publicPath
                }
            }),
        ],
    });
    // if (process.argv.indexOf('run') >= 0) {
    const server = new WebpackDevServer(compiler, {
        contentBase: path.join(baseDir, 'dist'),
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
