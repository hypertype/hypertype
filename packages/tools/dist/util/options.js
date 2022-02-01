"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printOptions = exports.normalizeOptions = void 0;
const path_1 = require("path");
const params_1 = require("./params");
const log_1 = require("./log");
const common_1 = require("./common");
const env_1 = require("./env");
/**
 * We must ensure that:
 *  - all required fields passed;
 *  - all paths are aligned relative to the base directory;
 *  - if there is no parameter value, its default value is used.
 */
const normalizeOptions = ({ bundler, entryPoint, outputPath, outputFilename, assetPath, templatePath, svgLoaderType, host, port, publicPath }) => {
    const { isProduction } = (0, env_1.runModeInfo)();
    let target = 'web';
    if (bundler === 'worker')
        target = 'webworker';
    else if (bundler === 'node')
        target = 'node';
    if (!entryPoint) {
        (0, log_1.logBundlerErr)((0, common_1.messageRunOptionErr)('entryPoint', entryPoint, 'non empty string'));
        throw '';
    }
    entryPoint = (0, params_1.relativeToBase)(entryPoint);
    let entry = { index: entryPoint };
    if (bundler === 'worker')
        entry = { worker: entryPoint };
    outputPath = outputPath ? (0, params_1.relativeToBase)(outputPath) : params_1.DIST_DIR;
    if (isProduction)
        outputPath = (0, path_1.join)(outputPath, 'prod');
    if (!outputFilename) {
        if (bundler === 'worker')
            outputFilename = 'worker.js';
        else
            outputFilename = 'index.js';
    }
    assetPath = assetPath ? (0, params_1.relativeToBase)(assetPath) : params_1.DIST_DIR;
    templatePath = templatePath ? (0, params_1.relativeToBase)(templatePath) : '';
    svgLoaderType = svgLoaderType || 'raw';
    host = host || 'localhost';
    port = port || 3200;
    publicPath = publicPath || '/';
    const mainEs = 'es6';
    const moduleEs = 'module';
    const mainFields = isProduction ? [mainEs, 'main', moduleEs] : [moduleEs, mainEs, 'main'];
    if (target !== 'node')
        mainFields.unshift('browser');
    return {
        target,
        entry,
        outputPath,
        outputFilename,
        assetPath,
        templatePath,
        svgLoaderType,
        host,
        port,
        publicPath,
        mainFields
    };
};
exports.normalizeOptions = normalizeOptions;
function printOptions(opt) {
    const unset = '--';
    const result = {};
    for (let [option, value] of Object.entries(opt)) {
        switch (option) {
            case 'target':
                result[1] = ['target', value];
                break;
            case 'entry':
                const value2 = Object
                    .entries(value)
                    .reduce((acc, [k, v]) => {
                    acc[k] = (0, params_1.excludeBase)(v);
                    return acc;
                }, {});
                result[2] = ['entry', JSON.stringify(value2)];
                break;
            case 'outputPath':
                result[3] = ['outputPath', (0, params_1.excludeBase)(value)];
                break;
            case 'outputFilename':
                result[4] = ['outputFilename', value];
                break;
            case 'assetPath':
                value = value || unset;
                result[5] = ['assetPath', (0, params_1.excludeBase)(value)];
                break;
            case 'templatePath':
                value = value || unset;
                result[6] = ['templatePath', (0, params_1.excludeBase)(value)];
                break;
            case 'svgLoaderType':
                result[7] = ['svgLoaderType', value];
                break;
            case 'host':
                result[8] = ['host', value];
                break;
            case 'port':
                result[9] = ['port', value];
                break;
            case 'publicPath':
                result[10] = ['publicPath', value];
                break;
            case 'mainFields':
                result[11] = ['mainFields', (0, common_1.arrToStr)(value)];
                break;
            default:
                (0, log_1.logBundlerErr)(`Print unknown option "${option}"`);
                throw '';
        }
    }
    (0, log_1.logAction)('Bundler options:');
    for (const [, [option, value]] of Object.entries(result))
        (0, log_1.logOption)(option, value);
    console.log(' ');
}
exports.printOptions = printOptions;
