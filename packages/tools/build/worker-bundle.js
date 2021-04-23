const webpack = require('webpack');
const runCompiler = require('./run.compiler');
const getConfig = require('./webpack.config');

module.exports = ({index, output, target}) => {
  const config = getConfig(index, target || 'worker.js', output, 'worker');
  const compiler = webpack({
    ...config,
    entry: {
      worker: index
    },
    externals: [],
    target: 'webworker',
    output: {
      libraryTarget: 'umd'
    }
  });
  runCompiler(compiler)
};
