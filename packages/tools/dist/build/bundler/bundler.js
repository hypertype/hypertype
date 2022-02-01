"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundler = void 0;
const webpack_1 = __importDefault(require("webpack"));
const path_1 = require("path");
const params_1 = require("../../util/params");
const env_1 = require("../../util/env");
const bundler = (opt) => {
    const { isProduction } = (0, env_1.runModeInfo)();
    const outputPath = (0, path_1.join)(params_1.DIST_DIR, 'bundle');
    (0, webpack_1.default)({
        // entry: {
        //     index: relativeToBase(entryPoint),
        // },
        target: 'node',
        mode: isProduction ? 'production' : 'development',
        devtool: isProduction ? 'none' : 'source-map',
        externals: Object.keys(params_1.PKG.peerDependencies || []),
        output: {
            path: outputPath,
            libraryTarget: 'umd'
        }
    }, (err, stats) => {
        console.warn(`bundle to ${outputPath}`);
    });
};
exports.bundler = bundler;
