const path = require('path');
const webpack = require('webpack');
const runCompiler = require('./run.compiler');
const getConfig = require('./webpack.config');

module.exports = ({index, target, output}) => {
  const baseDir = process.cwd();
  const config = getConfig(index, output, target);
  const compiler = webpack({
    ...config,
    output: {
      ...config.output,
      libraryTarget: 'umd'
    }
  });
  runCompiler(compiler)
};
