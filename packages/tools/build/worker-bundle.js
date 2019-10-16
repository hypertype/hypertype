const path = require('path');
const webpack = require('webpack');
const runCompiler = require('./run.compiler');
const getConfig = require('./webpack.config');

module.exports = ({index, output}) => {
    const baseDir = process.cwd();
    const config = getConfig(index);
    const compiler = webpack({
        ...config,
        entry: {
            worker: index
        },
        externals: [],
        target: 'webworker',
        output: {
            path: path.join(baseDir, output || 'dist'),
            libraryTarget: 'umd'
        }
    });
    runCompiler(compiler)
};
