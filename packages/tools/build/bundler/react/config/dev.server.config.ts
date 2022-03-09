import {Configuration} from 'webpack-dev-server';
import {IOptions} from '../../../contract';

export const getDevServerConfig = ({host, port, assetPath, publicPath}: IOptions): Configuration => ({
  // open: true,
  host,
  port,
  https: false,
  allowedHosts: 'all',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*'
  },
  compress: true,
  static: {
    directory: assetPath,
    publicPath
  },
  client: {
    overlay: {errors: true, warnings: false}
    // webSocketURL: { hostname: undefined, pathname: undefined, port: undefined },
  },
  historyApiFallback: {disableDotRule: true, index: '/'}
  // devMiddleware: { publicPath: '' },
  // proxy: undefined,
  // onBeforeSetupMiddleware: [Function: onBeforeSetupMiddleware],
  // onAfterSetupMiddleware: [Function: onAfterSetupMiddleware],
});

