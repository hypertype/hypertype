import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import {Configuration, DefinePlugin} from 'webpack';
import merge from 'webpack-merge';
import {runModeInfo, stringifiedProcessEnv} from '../util/env';
import {needStats, OVERRIDE_CONFIG, PKG} from '../util/params';
import {printConfigOverrideInfo} from '../util/common';
import {logSuccess} from '../util/log';
import {IOptions} from './contract';

export const getConfig = ({target, entry, outputPath, outputFilename, mainFields}: IOptions) => {
  printConfigOverrideInfo();
  const useTs = Object.values(entry).some(x => x.endsWith('.ts') || x.endsWith('.tsx'));
  logSuccess(useTs ? 'bundle typescript' : 'bundle javascript only')
  const {isProduction} = runModeInfo();
  return merge({
    entry,
    output: {
      path: outputPath,
      filename: outputFilename,
    },
    target,
    node: {
      global: true
    },
    devtool: isProduction ? false : 'source-map',
    mode: isProduction ? 'production' : 'development',
    externals: Object.keys(PKG.peerDependencies || []),
    resolve: {
      extensions: ['.ts', '.js', '.html', '.json'],
      mainFields,
      plugins: useTs ? [
        new TsconfigPathsPlugin({mainFields})
      ] : [],
      fallback: {
        crypto: false,
        stream: false,
        module: false
      }
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
          loader: 'ts-loader',
          options: {
            logLevel: 'info',
          }
        },
      ]
    },
    plugins: [
      new DefinePlugin(stringifiedProcessEnv()),
      ...(needStats ? [new BundleAnalyzerPlugin()] : [])
    ]
  } as Configuration, OVERRIDE_CONFIG || {});
};
