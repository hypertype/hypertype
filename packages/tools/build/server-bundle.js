const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const runCompiler = require('./run.compiler');
const getConfig = require('./webpack.config');
const devServer = require('webpack-dev-server');

module.exports = ({html, index, publicPath, port, host, output}) => {
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
            console.log(`listen on ${host}:${port}`)
        });
    }else {
        runCompiler(compiler)
    }
};
