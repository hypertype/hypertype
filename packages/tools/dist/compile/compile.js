"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = void 0;
const ts = __importStar(require("ttypescript"));
const path_1 = require("path");
const rootDir = process.cwd();
function compile(...flags) {
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
exports.compile = compile;
function createProgram(rootNames, options, host, oldProgram, configFileParsingDiagnostics, projectReferences) {
    options.outDir = (0, path_1.resolve)(options.configFilePath, '../dist/esm');
    options.declarationDir = (0, path_1.resolve)(options.configFilePath, '../dist/typings');
    options.baseUrl = (0, path_1.resolve)(options.configFilePath, '../');
    console.log('build', options.configFilePath);
    return ts.createEmitAndSemanticDiagnosticsBuilderProgram(rootNames, options, host, oldProgram, configFileParsingDiagnostics, projectReferences);
}
