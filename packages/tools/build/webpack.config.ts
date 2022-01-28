import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import merge from 'webpack-merge';
import { Configuration } from 'webpack';
import {isProd, needStats, OVERRIDE_CONFIG, OVERRIDE_CONFIG_FILE, PKG} from './util/params';
import {relativeToBase} from './util/common';

export const getConfig = (entryPoint, outputFilename = 'index.js', outputPath = 'dist', target = 'web') => {
  if (OVERRIDE_CONFIG)
    console.log(`use config override from ${OVERRIDE_CONFIG_FILE}`);
  const mainEs = 'es6';
  const moduleEs = 'module';
  const mainFields = isProd ? [mainEs, 'main', moduleEs] : [moduleEs, mainEs, 'main'];
  if (target !== 'node')
    mainFields.unshift('browser');
  return merge({
    entry: {
      index: relativeToBase(entryPoint)
    },
    output: {
      path: relativeToBase(outputPath, isProd ? 'prod' : ''),
      filename: outputFilename,
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
  } as Configuration, OVERRIDE_CONFIG || {});
};
