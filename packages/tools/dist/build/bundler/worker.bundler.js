"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workerBundler = void 0;
const webpack_1 = __importDefault(require("webpack"));
const webpack_config_1 = require("../webpack.config");
const common_1 = require("../util/common");
const run_compiler_1 = require("../run.compiler");
const workerBundler = ({ entryPoint, outputFilename, outputPath }) => {
    const config = webpack_config_1.getConfig(entryPoint, outputFilename || 'worker.js', outputPath);
    const compiler = webpack_1.default({
        ...config,
        entry: {
            worker: common_1.relativeToBase(entryPoint)
        },
        externals: [],
        target: 'webworker',
        output: {
            libraryTarget: 'umd'
        }
    });
    run_compiler_1.runCompiler(compiler);
};
exports.workerBundler = workerBundler;
