import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import {RuleSetRule} from 'webpack';
import {runModeInfo} from '../../../../../util/env';

type TRule = string | RuleSetRule;

export const prepareStyleLoaders = (
  cssLoaderOptions: any
  // preProcessor?: string
): TRule[] => {
  const {isDevelopment, isProduction} = runModeInfo();
  const loaders = [
    isDevelopment && 'style-loader',
    isProduction && MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: cssLoaderOptions
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          // Necessary for external CSS imports to work
          // https://github.com/facebook/create-react-app/issues/2677
          ident: 'postcss',
          config: false,
          plugins: [
            'postcss-flexbugs-fixes',
            [
              'postcss-preset-env',
              {
                autoprefixer: {
                  flexbox: 'no-2009'
                },
                stage: 3
              }
            ],
            // Adds PostCSS Normalize as the reset css with default options,
            // so that it honors browserslist config in package.json
            // which in turn let's users customize the target behavior as per their needs.
            'postcss-normalize'
          ]
        },
        sourceMap: !isProduction
      }
    }
  ].filter(Boolean) as TRule[];
  // if (preProcessor) {
  //   loaders.push(
  //     {
  //       loader: 'resolve-url-loader',
  //       options: {
  //         sourceMap: !isProduction,
  //         root: SRC_DIR,
  //       },
  //     },
  //     {
  //       loader: preProcessor,
  //       options: {
  //         sourceMap: true,
  //       },
  //     }
  //   );
  // }
  return loaders;
};
