"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testBundler = void 0;
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
const webpack_1 = __importDefault(require("webpack"));
const common_1 = require("../../util/common");
const params_1 = require("../../util/params");
const log_1 = require("../../util/log");
const webpack_config_1 = require("../webpack.config");
const testBundler = (opt) => {
    const config = webpack_config_1.getConfig(opt);
    const { templatePath, host, port, publicPath } = opt;
    if (!templatePath) {
        log_1.logBundlerErr(common_1.messageRunOptionErr('templatePath', templatePath, 'non empty string'));
        throw '';
    }
    const compiler = webpack_1.default({
        ...config,
        externals: [],
        plugins: [
            new html_webpack_plugin_1.default({
                template: params_1.relativeToBase(templatePath),
                base: publicPath
            }),
        ],
    });
    const devServer = new webpack_dev_server_1.default({
        static: {
            directory: params_1.DIST_DIR,
            publicPath,
        },
        port,
        historyApiFallback: {
            rewrites: [
                { from: /.*/, to: `${publicPath}/index.html` },
            ]
        }
    }, compiler);
    common_1.onProcessExit(() => devServer.close());
    devServer.startCallback(() => {
        log_1.logAction(`listen on ${host}:${port}`);
    });
};
exports.testBundler = testBundler;
