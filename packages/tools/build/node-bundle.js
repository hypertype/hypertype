const webpack = require('webpack');
const runCompiler = require('./run.compiler');
const getConfig = require('./webpack.config');

module.exports = ({index, output, target}) => {
  const config = getConfig(index, target, output, 'node');
  const compiler = webpack({
    ...config,
    node: {
      __dirname: false,
      dns: 'empty',
      net: 'empty',
      btoa: true
    },
    output: {
      ...config.output,
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
      libraryTarget: 'umd'
    }
  });
  runCompiler(compiler)
};
