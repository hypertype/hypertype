import * as ts from "ttypescript";
import {resolve} from 'path';

const rootDir = process.cwd();

export function compile(...flags) {

    const host = ts.createSolutionBuilderWithWatchHost(ts.sys, createProgram);
    host.useCaseSensitiveFileNames();

    const builderFactory = flags.includes('--watch') ?
        ts.createSolutionBuilderWithWatch :
        ts.createSolutionBuilder;

    const builder = builderFactory(host, [rootDir], {
        incremental: true,
        dry: false
    }, {
        excludeDirectories: ["node_modules", "dist"]
    });
        builder.clean(rootDir);
        builder.build(rootDir);
}

function createProgram(rootNames, options, host, oldProgram, configFileParsingDiagnostics, projectReferences) {
    options.outDir = resolve(options.configFilePath, '../dist/esm');
    options.declarationDir = resolve(options.configFilePath, '../dist/typings');
    options.baseUrl = resolve(options.configFilePath, '../');
    console.log('build', options.configFilePath);
    return ts.createEmitAndSemanticDiagnosticsBuilderProgram(
        rootNames, options, host, oldProgram, configFileParsingDiagnostics, projectReferences
    )
}
