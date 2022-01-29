import webpack from 'webpack';
import {join} from 'path';
import {DIST_DIR, isProd, PKG} from '../../util/params';
import {relativeToBase} from '../../util/common';
import {IOptions} from '../contract';

export const bundler = ({entryPoint}: IOptions) => {
    const outputPath = join(DIST_DIR, 'bundle');
    webpack({
        entry: {
            index: relativeToBase(entryPoint),
        },
        target: 'node',
        mode: isProd ? 'production' : 'development',
        devtool: isProd ? 'none' : 'source-map',
        externals: Object.keys(PKG.peerDependencies || []),
        output: {
            path: outputPath,
            libraryTarget: 'umd'
        }
    }, (err, stats) => {
        console.warn(`bundle to ${outputPath}`)
        // console.log(stats.toString())
    });
}
