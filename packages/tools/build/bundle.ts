import webpack from 'webpack';
import {join} from 'path';
import {BASE_DIR, DIST_DIR, isProd, PKG} from './util/params';

export const bundle = ({index}) => {
    const outputPath = join(DIST_DIR, 'bundle');
    webpack({
        entry: {
            index: join(BASE_DIR, index),
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
