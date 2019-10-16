const path = require('path');
const webpack = require('webpack');
const runCompiler = require('./run.compiler');
const getConfig = require('./webpack.config');

module.exports = ({index, output, target}) => {
    const baseDir = process.cwd();
    const config = getConfig(index,target);
    const compiler = webpack({
        ...config,
        target: 'node',
        node: {
            __dirname: false,
            dns: 'empty',
            net: 'empty',
            btoa: true
        },
        output: {
            ...config.output,
            devtoolModuleFilenameTemplate: '[absolute-resource-path]',
            path: path.join(baseDir, output || 'dist'),
            libraryTarget: 'umd'
        }
    });
    runCompiler(compiler)
};
