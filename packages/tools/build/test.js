const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const runCompiler = require('./run.compiler');
const getConfig = require('./webpack.config');
const devServer = require('webpack-dev-server');

module.exports = ({html, index, publicPath, port, host}) => {
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
    const server = new devServer(compiler, {
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