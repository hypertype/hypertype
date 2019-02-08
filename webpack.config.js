const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const join = require('path').join;
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = env => ({
  entry: {
    main: './index.ts',
    // sw: './entry/service-worker.ts',
  },
  output: {
    path: join(__dirname, '../dist'),
    libraryTarget: 'commonjs'
  },
  devtool: env.prod ? false : 'source-map',
  mode: env.prod ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.less/,
        loader: ['css-loader', 'less-loader'],
      },
      {
        test: /\.html$/,
        loader: 'string-loader',
      },
      {
        test: /\.ts/,
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: './configs/tsconfig.json',
        }
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.html', '.json'],
    mainFields: ['main', 'module', 'main'],
    alias: {
      // "@gm/isomorphic-domain": "A:/web/isomorphic/domain",
      // "@gm/isomorphic-core": "A:/web/isomorphic/core",
    }
  },
  externals: nodeExternals({
  }),
  plugins: [
    new BundleAnalyzerPlugin({
        analyzerPort: 9995
    }),
    // new CopyWebpackPlugin([
    //   'assets/'
    // ]),
    // new webpack.DefinePlugin({
    //   Env: {build: +new Date()}
    // })
  ],
  devServer: env.prod ? {} : {
    contentBase: join(__dirname, '../dist'),
    historyApiFallback: true
  }
});
