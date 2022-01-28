#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_bundler_1 = require("./build/bundler/server.bundler");
const worker_bundler_1 = require("./build/bundler/worker.bundler");
const node_bundler_1 = require("./build/bundler/node.bundler");
const web_bundler_1 = require("./build/bundler/web.bundler");
const component_1 = require("./generate/component");
const params_1 = require("./build/util/params");
const [arg1, arg2, arg3, arg4] = params_1.ARGS;
if (arg1 === 'new' && arg2 === 'component') {
    component_1.newComponent(arg3, arg4);
}
else {
    const bundlers = {
        web: web_bundler_1.webBundler,
        node: node_bundler_1.nodeBundler,
        worker: worker_bundler_1.workerBundler,
        server: server_bundler_1.serverBundler,
    };
    const options = params_1.OPTIONS[arg1];
    const bundler = bundlers[options.bundler] || bundlers.node;
    bundler(options);
}
