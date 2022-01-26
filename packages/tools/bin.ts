#!/usr/bin/env node

import {OPTIONS, ARGS} from './build/util/params';
import {serverBundle} from './build/server-bundle';
import {workerBundle} from './build/worker-bundle';
import {newComponent} from './generate/component';
import {nodeBundle} from './build/node-bundle';
import {webBundle} from './build/web-bundle';

const [arg1, arg2, arg3, arg4] = ARGS;

if (arg1 === 'new' && arg2 === 'component') {
    newComponent(arg3, arg4);
} else {
    const bundlers = {
      web: webBundle,
      node: nodeBundle,
      worker: workerBundle,
      server: serverBundle,
    };
    const options = OPTIONS[arg1];
    const bundler = bundlers[options.type] || bundlers.node;
    bundler(options);
}
