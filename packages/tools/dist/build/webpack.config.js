"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const tsconfig_paths_webpack_plugin_1 = __importDefault(require("tsconfig-paths-webpack-plugin"));
const webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const params_1 = require("./util/params");
const common_1 = require("./util/common");
const getConfig = (entryPoint, outputFilename = 'index.js', outputPath = 'dist', target = 'web') => {
    if (params_1.OVERRIDE_CONFIG)
        console.log(`use config override from ${params_1.OVERRIDE_CONFIG_FILE}`);
    const mainEs = 'es6';
    const moduleEs = 'module';
    const mainFields = params_1.isProd ? [mainEs, 'main', moduleEs] : [moduleEs, mainEs, 'main'];
    if (target !== 'node')
        mainFields.unshift('browser');
    return webpack_merge_1.default({
        entry: {
            index: common_1.relativeToBase(entryPoint)
        },
        output: {
            path: common_1.relativeToBase(outputPath, params_1.isProd ? 'prod' : ''),
            filename: outputFilename,
        },
        target,
        node: {
            global: true
        },
        devtool: params_1.isProd ? false : 'source-map',
        mode: params_1.isProd ? 'production' : 'development',
        externals: Object.keys(params_1.PKG.peerDependencies || []),
        resolve: {
            extensions: ['.ts', '.js', '.html', '.json'],
            mainFields,
            plugins: [
                new tsconfig_paths_webpack_plugin_1.default({ mainFields })
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
                    use: [{
                            loader: 'css-loader',
                            options: { esModule: false }
                        }, {
                            loader: 'less-loader'
                        }],
                },
                {
                    test: /\.(html|svg)$/,
                    type: 'asset/source',
                },
                {
                    test: /\.ts/,
                    loader: 'ts-loader'
                },
            ]
        },
        plugins: [
            ...(params_1.needStats ? [new webpack_bundle_analyzer_1.BundleAnalyzerPlugin()] : [])
        ]
    }, params_1.OVERRIDE_CONFIG || {});
};
exports.getConfig = getConfig;
