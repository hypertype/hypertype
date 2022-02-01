#!/usr/bin/env node

import {OPTIONS_MAP, ARGS, OPTIONS_MAP_FIELD_NAME, findArg, optionalArgsStr} from './util/params';
import {ALL_BUNDLERS, IRunOptions, TPossibleBundlers} from './build/contract';
import {normalizeOptions, printOptions} from './util/options';
import {serverBundler} from './build/bundler/server.bundler';
import {workerBundler} from './build/bundler/worker.bundler';
import {arrToStr, messageRunOptionErr} from './util/common';
import {nodeBundler} from './build/bundler/node.bundler';
import {webBundler} from './build/bundler/web.bundler';
import {logAction, logBundlerErr} from './util/log';
import {prepareEnv, runModeInfo} from './util/env';
import {newComponent} from './generate/component';
import {compile} from "./compile/compile";

const [arg1, arg2, arg3, arg4] = ARGS;

if (arg1 === 'new' && arg2 === 'component') {
    newComponent(arg3, arg4);
} else if (arg1 === 'compile') {
  compile(...ARGS.slice(1));
} else {
    if (!OPTIONS_MAP || !Object.keys(OPTIONS_MAP).length) {
        logBundlerErr(`To run the bundler, specify an object with options in package.json -> field "${OPTIONS_MAP_FIELD_NAME}"`);
        throw '';
    }
    const runOpt = OPTIONS_MAP[arg1] as IRunOptions;
    if (!runOpt) {
        logBundlerErr(`Can't find options for key "${arg1}". Check it in package.json -> field "${OPTIONS_MAP_FIELD_NAME}"`);
        throw '';
    }

    if (findArg('--prod'))
        prepareEnv('production');
    else if (findArg('--test'))
        prepareEnv('test');
    else
        prepareEnv('development');

    const opt = normalizeOptions(runOpt);
    if (runOpt.printOptions)
        printOptions(opt);

    const bundlers: TPossibleBundlers = {
        web: webBundler,
        node: nodeBundler,
        worker: workerBundler,
        server: serverBundler,
    };
    const bundler = bundlers[runOpt.bundler];
    if (!bundler) {
        logBundlerErr(messageRunOptionErr('bundler', runOpt.bundler, arrToStr(ALL_BUNDLERS as unknown as Array<string>)));
        throw '';
    }
    logAction(`Start bundler "${runOpt.bundler}", ${runModeInfo().NODE_ENV} ${optionalArgsStr()}`);
    bundler(opt);
}
