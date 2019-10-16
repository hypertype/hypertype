const path = require('path');
const webpack = require('webpack');
const runCompiler = require('./run.compiler');
const getConfig = require('./webpack.config');

module.exports = ({index, output}) => {
    const baseDir = process.cwd();
    const config = getConfig(index);
    const compiler = webpack({
        ...config,
        output: {
            ...config.output,
            path: path.join(baseDir, output || 'dist'),
            libraryTarget: 'umd'
        }
    });
    runCompiler(compiler)
};
