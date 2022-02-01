"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverBundler = void 0;
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
const webpack_1 = __importDefault(require("webpack"));
const path_1 = require("path");
const common_1 = require("../../util/common");
const log_1 = require("../../util/log");
const webpack_config_1 = require("../webpack.config");
const params_1 = require("../../util/params");
const run_compiler_1 = require("../run.compiler");
const serverBundler = (opt) => {
    const config = (0, webpack_config_1.getConfig)(opt);
    const { publicPath, assetPath, templatePath, host, port } = opt;
    if (!templatePath) {
        (0, log_1.logBundlerErr)((0, common_1.messageRunOptionErr)('templatePath', templatePath, 'non empty string'));
        throw '';
    }
    const compiler = (0, webpack_1.default)({
        ...config,
        externals: [],
        output: {
            ...config.output,
            publicPath
        },
        plugins: [
            new html_webpack_plugin_1.default({
                minify: false,
                template: templatePath,
                base: publicPath
            }),
            ...config.plugins
        ],
    });
    if (params_1.needToRun) {
        (0, log_1.logAction)(`starting web server...`, false);
        const devServer = new webpack_dev_server_1.default({
            port,
            static: {
                directory: assetPath,
                publicPath,
            },
            historyApiFallback: {
                rewrites: [
                    { from: /./, to: (0, path_1.join)(publicPath, 'index.html') },
                ]
            }
        }, compiler);
        (0, common_1.onProcessExit)(() => devServer.close());
        devServer.startCallback(() => {
            (0, log_1.logAction)(`listen on ${host}:${port}`);
        });
    }
    else {
        (0, run_compiler_1.runCompiler)(compiler);
    }
};
exports.serverBundler = serverBundler;
