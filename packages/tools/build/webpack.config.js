const tsLoader = require("awesome-typescript-loader");
const TsconfigPathsPlugin = tsLoader.TsConfigPathsPlugin;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const merge = require('webpack-merge');

module.exports = (index, target, output) => {
    const prod = process.argv.filter(a => /--prod/.test(a)).length;
    const baseDir = process.cwd();
    const pkg = require(path.join(baseDir, 'package.json'));
    let cfg = {};
    try {
        cfg = require(path.join(baseDir, 'webpack.config.js'));
        console.log(`use config override from ${path.join(baseDir, 'webpack.config.js')}`);
    } catch (e) {
    }
    const mainEs = /es5/.test(target) ? 'es5' : 'es6';
    const moduleEs = /es5/.test(target) ? 'module' : 'module-es6';
    return merge({
        entry: {
            index: index,
        },
        output: {
            path: path.join(baseDir, output || "dist"),
            filename: (target || "index.js")
        },
        target: 'web',
        node: {
            process: true,
            os: true
        },
        devtool: prod ? false : 'source-map',
        mode: prod ? 'production' : 'development',
        externals: Object.keys(pkg.peerDependencies || []),
        resolve: {
            extensions: ['.ts', '.js', '.html', '.json'],
            mainFields: prod ? [mainEs, 'main', moduleEs] : [moduleEs, mainEs, 'main'],
            plugins: prod ? [] : [
                new TsconfigPathsPlugin({
                    mainFields: prod ? [mainEs, 'main', moduleEs] : [moduleEs, mainEs, 'main'],
                })
            ],
        },
        resolveLoader: {
            modules: [
                'node_modules/@hypertype/tools/node_modules',
                'node_modules'
            ],
        },
        module: {
            rules: [
                {
                    test: /\.less/,
                    loader: [('css-loader'), ('less-loader')],
                },
                {
                    test: /\.html$/,
                    loader: 'string-loader',
                },
                {
                    test: /\.ts/,
                    loader: 'awesome-typescript-loader'
                },
            ]
        },
        plugins: [
            ...(process.argv.filter(d => /stats/.test(d)).length ? [new BundleAnalyzerPlugin()] : [])
        ]
    }, cfg);
};
