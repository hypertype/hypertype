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
const params_1 = require("../util/params");
const common_1 = require("../util/common");
const webpack_config_1 = require("../webpack.config");
const run_compiler_1 = require("../run.compiler");
const serverBundler = ({ entryPoint, outputPath, template, host, port, publicPath }) => {
    publicPath = publicPath || '/';
    host = host || 'localhost';
    port = port || 3200;
    const config = webpack_config_1.getConfig(entryPoint, "index.js", outputPath);
    const compiler = webpack_1.default({
        ...config,
        externals: [],
        output: {
            ...config.output,
            publicPath
        },
        plugins: [
            new html_webpack_plugin_1.default({
                minify: false,
                template: common_1.relativeToBase(template),
                base: publicPath
            }),
            ...config.plugins
        ],
    });
    if (params_1.needToRun) {
        console.log(`starting web server...`);
        const server = new webpack_dev_server_1.default(compiler, {
            port: port,
            static: {
                directory: params_1.DIST_DIR,
                publicPath,
            },
            historyApiFallback: {
                rewrites: [
                    { from: /./, to: path_1.join(publicPath, 'index.html') },
                ]
            }
        });
        server.listen(port, host, (err) => {
            console.log(`listen on ${host}:${port}`);
        });
    }
    else {
        run_compiler_1.runCompiler(compiler);
    }
};
exports.serverBundler = serverBundler;
