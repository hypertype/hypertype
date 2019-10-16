#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const bundle = require('./bundle');
const webBundle = require('./web-bundle');
const nodeBundle = require('./node-bundle');
const workerBundle = require('./worker-bundle');
const serverBundle = require('./server-bundle');
const testBundle = require('./test');

const bundlers = {
    web: webBundle,
    node: nodeBundle,
    worker: workerBundle,
    server: serverBundle
};
const basePath = process.cwd();
const pkg = require(path.join(basePath, './package'));
const options = pkg.hypertype[process.argv[2]];
const bundler = bundlers[options.type] || nodeBundle;
bundler(options);
return;

if (process.argv.filter(t => t === 'web').length) {
    const options = pkg.hypertype.web;
    webBundle(options);
} else if (process.argv.filter(t => t === 'worker').length) {
    const options = pkg.hypertype.worker;
    workerBundle(options);
} else if (process.argv.filter(t => t === 'server').length) {
    const options = pkg.hypertype.server;
    serverBundle(options);
} else if (process.argv.filter(t => t === 'test').length) {
    const options = pkg.hypertype.test;
    testBundle(options);
} else if (process.argv.filter(t => t === 'node').length) {
    const options = pkg.hypertype.node;
    nodeBundle(options);
} else {
    const options = pkg.hypertype.lib;
    bundle(options);
}
