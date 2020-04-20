const webpack = require('webpack');
const runCompiler = require('./run.compiler');
const getConfig = require('./webpack.config');

module.exports = ({index, output, target}) => {
  const config = getConfig(index, target, output);
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
      libraryTarget: 'umd'
    }
  });
  runCompiler(compiler)
};
