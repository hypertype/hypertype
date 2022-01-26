#!/usr/bin/env node

import {OPTIONS, ARG1, ARG2, ARG3, ARG4} from './build/util/params';
import {serverBundle} from './build/server-bundle';
import {workerBundle} from './build/worker-bundle';
import {newComponent} from './generate/component';
import {nodeBundle} from './build/node-bundle';
import {webBundle} from './build/web-bundle';


if (ARG1 === 'new' && ARG2 === 'component') {
    newComponent(ARG3, ARG4);
} else {
    const bundlers = {
      web: webBundle,
      node: nodeBundle,
      worker: workerBundle,
      server: serverBundle,
    };
    const options = OPTIONS[ARG1];
    const bundler = bundlers[options.type] || bundlers.node;
    bundler(options);
}
