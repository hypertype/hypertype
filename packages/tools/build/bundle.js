const path = require('path');
const webpack = require('webpack');

module.exports = ({index}) => {
    const basePath = process.cwd();
    const pkg = require(path.join(basePath, './package'));
    const outputPath = path.join(basePath, 'dist/bundle');
    const prod = process.argv.filter(a => /--prod/.test(a)).length;

    webpack({
        entry: {
            index: path.join(basePath, index),
        },
        target: 'node',
        mode: prod ? 'production' : 'development',
        devtool: prod ? 'none' : 'source-map',
        externals: Object.keys(pkg.peerDependencies || []),
        output: {
            path: outputPath,
            libraryTarget: 'umd'
        }
    }, (err, stats) => {
        console.warn(`bundle to ${outputPath}`)
        // console.log(stats.toString())
    });
}
