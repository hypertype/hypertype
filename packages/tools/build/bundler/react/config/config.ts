import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import {Configuration} from 'webpack';
import {getBaseConfig} from './base.config';
import {IOptions} from '../../../contract';

export const getDevelopmentConfig = (opt: IOptions): Configuration => ({
  ...getBaseConfig(opt),
  mode: 'development',
  devtool: 'cheap-module-source-map',
  // output: this is the responsibility of WebpackDevServer
  stats: { // https://webpack.js.org/configuration/stats/#stats-options
    builtAt: true,
    version: false,
    assetsSpace: 3,
    modulesSpace: 5,
    chunkModulesSpace: 3,
    errorDetails: true
  }
});

export const getProductionConfig = (opt: IOptions): Configuration => {
  const {outputPath, publicPath} = opt;
  const baseConfig = getBaseConfig(opt);
  return {
    ...baseConfig,
    mode: 'production',
    bail: true,
    output: {
      path: outputPath,
      filename: 'static/js/[name].[contenthash:8].js',
      chunkFilename: 'static/js/[name].[contenthash:8].chunk.js', // https://github.com/webpack/webpack/issues/9297#issuecomment-503061903
      assetModuleFilename: 'static/media/[name].[hash][ext]',
      publicPath
    },
    plugins: [
      ...baseConfig.plugins as any[],
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
      })
    ],
    optimization: {
      minimizer: [
        `...`, // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`)
        new CssMinimizerPlugin()
      ],
      splitChunks: {
        chunks: 'all'
      }
    },
    performance: {
      maxEntrypointSize: 1000 * 1024,
      maxAssetSize: 500 * 1024
    }
  };
};
