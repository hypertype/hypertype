"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeBundler = void 0;
const webpack_1 = __importDefault(require("webpack"));
const webpack_config_1 = require("../webpack.config");
const run_compiler_1 = require("../run.compiler");
const nodeBundler = ({ entryPoint, outputFilename, outputPath }) => {
    const config = webpack_config_1.getConfig(entryPoint, outputFilename, outputPath, 'node');
    const compiler = webpack_1.default({
        ...config,
        node: {
            __dirname: false,
        },
        output: {
            ...config.output,
            devtoolModuleFilenameTemplate: '[absolute-resource-path]',
            libraryTarget: 'umd'
        }
    });
    run_compiler_1.runCompiler(compiler);
};
exports.nodeBundler = nodeBundler;
