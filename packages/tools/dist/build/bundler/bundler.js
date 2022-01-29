"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundler = void 0;
const webpack_1 = __importDefault(require("webpack"));
const path_1 = require("path");
const params_1 = require("../../util/params");
const common_1 = require("../../util/common");
const bundler = ({ entryPoint }) => {
    const outputPath = path_1.join(params_1.DIST_DIR, 'bundle');
    webpack_1.default({
        entry: {
            index: common_1.relativeToBase(entryPoint),
        },
        target: 'node',
        mode: params_1.isProd ? 'production' : 'development',
        devtool: params_1.isProd ? 'none' : 'source-map',
        externals: Object.keys(params_1.PKG.peerDependencies || []),
        output: {
            path: outputPath,
            libraryTarget: 'umd'
        }
    }, (err, stats) => {
        console.warn(`bundle to ${outputPath}`);
        // console.log(stats.toString())
    });
};
exports.bundler = bundler;
