#!/usr/bin/env node

import {serverBundler} from './build/bundler/server.bundler';
import {workerBundler} from './build/bundler/worker.bundler';
import {nodeBundler} from './build/bundler/node.bundler';
import {webBundler} from './build/bundler/web.bundler';
import {newComponent} from './generate/component';
import {OPTIONS, ARGS} from './util/params';
import {IOptions} from './build/contract';

const [arg1, arg2, arg3, arg4] = ARGS;

if (arg1 === 'new' && arg2 === 'component') {
    newComponent(arg3, arg4);
} else {
    const bundlers = {
      web: webBundler,
      node: nodeBundler,
      worker: workerBundler,
      server: serverBundler,
    };
    const options = OPTIONS[arg1] as IOptions;
    const bundler = bundlers[options.bundler] || bundlers.node;
    bundler(options);
}
