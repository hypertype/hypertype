import HtmlWebpackPlugin from 'html-webpack-plugin';
import {WebpackPluginInstance} from 'webpack';
import {messageRunOptionErr} from '../../../../util/common';
import {logBundlerErr} from '../../../../util/log';
import {runModeInfo} from '../../../../util/env';


/**
 * HTML Webpack Plugin.
 *  https://github.com/jantimon/html-webpack-plugin#readme
 */
export const htmlWebpackPlugin = (templatePath?: string): WebpackPluginInstance => {
  if (!templatePath) {
    logBundlerErr(messageRunOptionErr('templatePath', templatePath, 'non empty string'));
    throw '';
  }
  return new HtmlWebpackPlugin({
    inject: 'head',
    scriptLoading: 'defer',
    template: templatePath,
    ...getOptions()
  });
};


function getOptions() {
  switch (runModeInfo().NODE_ENV) {
    case 'production':
      return {
        minify: { // https://github.com/jantimon/html-webpack-plugin#minification
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        }
      };
    default:
      return {
        minify: false
      };
  }
}
