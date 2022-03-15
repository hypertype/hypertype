import {RuleSetRule} from 'webpack';
import {arrToStr, messageRunOptionErr} from '../../../../util/common';
import {ALL_SVG_LOADERS, TSvgLoader} from '../../../contract';
import {logBundlerErr} from '../../../../util/log';
import {assetLoader} from './asset.loader';

const svgRegex = /\.svg$/;

/**
 * How to use SVGs in React
 *  https://blog.logrocket.com/how-to-use-svgs-in-react/
 */
export const svgLoader = (type: TSvgLoader): RuleSetRule => {
  switch (type) {
    case 'react-component':
      return svgAsReactComponent();
    case 'raw':
      return assetLoader(svgRegex, 'asset/source');
    default:
      logBundlerErr(messageRunOptionErr('svgLoaderType', type, arrToStr(ALL_SVG_LOADERS as unknown as Array<string>)));
      throw '';
  }
};

function svgAsReactComponent(): RuleSetRule {
  return {
    test: svgRegex,
    use: [
      {
        loader: '@svgr/webpack',
        options: {
          prettier: false,
          svgo: false,
          svgoConfig: {
            plugins: [{removeViewBox: false}]
          },
          titleProp: true,
          ref: true
        }
      }
      // {
      //   loader: 'file-loader',
      //   options: {
      //     name: 'static/media/[name].[hash].[ext]',
      //   },
      // },
    ],
    issuer: {
      and: [/\.(tsx|ts|js|jsx)$/]
    }
  }
}
