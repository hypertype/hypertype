#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const params_1 = require("./util/params");
const contract_1 = require("./build/contract");
const options_1 = require("./util/options");
const server_bundler_1 = require("./build/bundler/server.bundler");
const worker_bundler_1 = require("./build/bundler/worker.bundler");
const common_1 = require("./util/common");
const node_bundler_1 = require("./build/bundler/node.bundler");
const web_bundler_1 = require("./build/bundler/web.bundler");
const log_1 = require("./util/log");
const env_1 = require("./util/env");
const component_1 = require("./generate/component");
const [arg1, arg2, arg3, arg4] = params_1.ARGS;
if (arg1 === 'new' && arg2 === 'component') {
    component_1.newComponent(arg3, arg4);
}
else {
    const runOpt = params_1.OPTIONS_MAP[arg1];
    if (!runOpt) {
        log_1.logBundlerErr(`Can't find options for key "${arg1}". Check it in package.json -> field "${params_1.OPTIONS_MAP_FIELD_NAME}"`);
        throw '';
    }
    if (params_1.findArg('--prod'))
        env_1.prepareEnv('production');
    else if (params_1.findArg('--test'))
        env_1.prepareEnv('test');
    else
        env_1.prepareEnv('development');
    const opt = options_1.normalizeOptions(runOpt);
    if (runOpt.printOptions)
        options_1.printOptions(opt);
    const bundlers = {
        web: web_bundler_1.webBundler,
        node: node_bundler_1.nodeBundler,
        worker: worker_bundler_1.workerBundler,
        server: server_bundler_1.serverBundler,
    };
    const bundler = bundlers[runOpt.bundler];
    if (!bundler) {
        log_1.logBundlerErr(common_1.messageRunOptionErr('bundler', runOpt.bundler, common_1.arrToStr(contract_1.ALL_BUNDLERS)));
        throw '';
    }
    log_1.logAction(`Start bundler "${runOpt.bundler}", ${env_1.runModeInfo().NODE_ENV} ${params_1.optionalArgsStr()}`);
    bundler(opt);
}
