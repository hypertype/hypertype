import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import merge from 'webpack-merge';
import * as path from 'path';
import {BASE_DIR, isProd, needStats, OVERRIDE_CONFIG, OVERRIDE_CONFIG_FILE, PKG} from './util/params';

export const getConfig = (index, filename = 'index.js', output = 'dist', target = 'web') => {
  if (OVERRIDE_CONFIG)
    console.log(`use config override from ${OVERRIDE_CONFIG_FILE}`);
  const mainEs = 'es6';
  const moduleEs = 'module';
  const mainFields = isProd ? [mainEs, 'main', moduleEs] : [moduleEs, mainEs, 'main'];
  if (target !== 'node')
    mainFields.unshift('browser');
  return merge({
    entry: {index},
    output: {
      path: path.join(BASE_DIR, output, isProd ? 'prod' : ''),
      filename,
    },
    target,
    node: {
      global: true
    },
    devtool: isProd ? false : 'source-map',
    mode: isProd ? 'production' : 'development',
    externals: Object.keys(PKG.peerDependencies || []),
    resolve: {
      extensions: ['.ts', '.js', '.html', '.json'],
      mainFields,
      plugins: [
        new TsconfigPathsPlugin({mainFields})
      ],
    },
    resolveLoader: {
      modules: [
        'node_modules/@hypertype/tools/node_modules',
        'node_modules'
      ],
    },
    module: {
      rules: [
        {
          test: /\.less/,
          use: [{
            loader: 'css-loader',
            options: {esModule: false}
          }, {
            loader: 'less-loader'
          }],
        },
        {
          test: /\.(html|svg)$/,
          loader: 'raw-loader',
        },
        {
          test: /\.ts/,
          loader: 'ts-loader'
        },
      ]
    },
    plugins: [
      ...(needStats ? [new BundleAnalyzerPlugin()] : [])
    ]
  }, OVERRIDE_CONFIG || {});
};
