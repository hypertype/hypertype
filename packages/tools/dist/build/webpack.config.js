"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const tsconfig_paths_webpack_plugin_1 = __importDefault(require("tsconfig-paths-webpack-plugin"));
const webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
const webpack_1 = require("webpack");
const webpack_merge_1 = __importDefault(require("webpack-merge"));
const params_1 = require("../util/params");
const env_1 = require("../util/env");
const log_1 = require("../util/log");
const getConfig = ({ target, entry, outputPath, outputFilename, mainFields }) => {
    const { isProduction } = env_1.runModeInfo();
    if (params_1.OVERRIDE_CONFIG)
        log_1.logSuccess('Configuration for override:', params_1.OVERRIDE_CONFIG_FILE);
    return webpack_merge_1.default({
        entry,
        output: {
            path: outputPath,
            filename: outputFilename,
        },
        target,
        node: {
            global: true
        },
        devtool: isProduction ? false : 'source-map',
        mode: isProduction ? 'production' : 'development',
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
                    loader: 'raw-loader',
                },
                {
                    test: /\.ts/,
                    loader: 'ts-loader'
                },
            ]
        },
        plugins: [
            new webpack_1.DefinePlugin(env_1.stringifiedProcessEnv()),
            ...(params_1.needStats ? [new webpack_bundle_analyzer_1.BundleAnalyzerPlugin()] : [])
        ]
    }, params_1.OVERRIDE_CONFIG || {});
};
exports.getConfig = getConfig;
