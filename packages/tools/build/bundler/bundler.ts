import webpack from 'webpack';
import {join} from 'path';
import {DIST_DIR, PKG} from '../../util/params';
import {runModeInfo} from '../../util/env';
import {IOptions} from '../contract';

export const bundler = (opt: IOptions) => {
  const {isProduction} = runModeInfo();
    const outputPath = join(DIST_DIR, 'bundle');
    webpack({
        // entry: {
        //     index: relativeToBase(entryPoint),
        // },
        target: 'node',
        mode: isProduction ? 'production' : 'development',
        devtool: isProduction ? 'none' : 'source-map',
        externals: Object.keys(PKG.peerDependencies || []),
        output: {
            path: outputPath,
            libraryTarget: 'umd'
        }
    }, (err, stats) => {
        console.warn(`bundle to ${outputPath}`)
    });
}
