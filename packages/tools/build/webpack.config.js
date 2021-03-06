const tsLoader = require("awesome-typescript-loader");
const TsconfigPathsPlugin = tsLoader.TsConfigPathsPlugin;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const merge = require('webpack-merge');

module.exports = (index, filename, output, target) => {
    const prod = process.argv.filter(a => /--prod/.test(a)).length > 0;
    const baseDir = process.cwd();
    const pkg = require(path.join(baseDir, 'package.json'));
    let cfg = {};
    try {
        cfg = require(path.join(baseDir, 'webpack.config.js'));
        console.log(`use config override from ${path.join(baseDir, 'webpack.config.js')}`);
    } catch (e) {
    }
    const mainEs = 'es6';
    const moduleEs = 'module';
    const mainFields = prod ? [mainEs, 'main', moduleEs] : [moduleEs, mainEs, 'main'];
    if (target !== 'node')
      mainFields.unshift('browser');
    return merge({
        entry: {
            index: index,
        },
        output: {
            path: path.join(baseDir, output || "dist", prod ? "prod" : ""),
            filename: (filename || "index.js")
        },
        target: target || 'web',
        node: {
            process: true,
            os: true
        },
        devtool: prod ? false : 'source-map',
        mode: prod ? 'production' : 'development',
        externals: Object.keys(pkg.peerDependencies || []),
        resolve: {
            extensions: ['.ts', '.js', '.html', '.json'],
            mainFields: mainFields,
            plugins: [
                new TsconfigPathsPlugin({
                    mainFields: mainFields,
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
