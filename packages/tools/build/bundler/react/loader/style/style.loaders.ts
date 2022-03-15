import {RuleSetRule} from 'webpack';
import {prepareStyleLoaders} from './prepare-style.loaders';
import {runModeInfo} from '../../../../../util/env';

const cssModuleRegex = /\.module\.css$/;
// const sassRegex = /\.(scss|sass)$/;
// const sassModuleRegex = /\.module\.(scss|sass)$/;

export function styleLoaders(): RuleSetRule[] {
  const {isProduction} = runModeInfo();
  return [
    // "postcss" loader applies autoprefixer to our CSS.
    // "css" loader resolves paths in CSS and adds assets as dependencies.
    // "style" loader turns CSS into JS modules that inject <style> tags.
    // In production, we use MiniCSSExtractPlugin to extract that CSS
    // to a file, but in development "style" loader enables hot editing
    // of CSS.
    // By default we support CSS Modules with the extension .module.css
    {
      test: /\.css$/,
      exclude: cssModuleRegex,
      use: prepareStyleLoaders({
        importLoaders: 1,
        sourceMap: !isProduction,
        modules: {
          mode: 'icss'
        }
      }),
      // Don't consider CSS imports dead code even if the
      // containing package claims to have no side effects.
      // Remove this when webpack adds a warning or an error for this.
      // See https://github.com/webpack/webpack/issues/6571
      sideEffects: true
    },
    // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
    // using the extension .module.css
    {
      test: cssModuleRegex,
      use: prepareStyleLoaders({
        importLoaders: 1,
        sourceMap: !isProduction,
        modules: {
          // https://github.com/webpack-contrib/css-loader#localidentname
          localIdentName: '[folder]_[local]-[hash:base64:5]'
        }
      })
    }
    // {
    //     test: /\.less$/,
    //     use: prepareStyleLoaders({
    //           importLoaders: 3,
    //           sourceMap: !isProduction,
    //           modules: {
    //               mode: 'icss'
    //           }
    //       },
    //       'less-loader')
    // }
  ];
}
