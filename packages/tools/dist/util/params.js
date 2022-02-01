"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalArgsStr = exports.findArg = exports.excludeBase = exports.relativeToBase = exports.needStats = exports.needToWatch = exports.needToRun = exports.ARGS = exports.OVERRIDE_CONFIG = exports.OPTIONS_MAP = exports.PKG = exports.OPTIONS_MAP_FIELD_NAME = exports.OVERRIDE_CONFIG_FILE = exports.PKG_FILE = exports.DOTENV_FILE = exports.DIST_DIR = exports.SRC_DIR = exports.BASE_DIR = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
//region File paths
exports.BASE_DIR = process.cwd();
exports.SRC_DIR = relativeToBase('src');
exports.DIST_DIR = relativeToBase('dist');
exports.DOTENV_FILE = relativeToBase('.env');
exports.PKG_FILE = relativeToBase('package.json');
exports.OVERRIDE_CONFIG_FILE = relativeToBase('webpack.config.js');
//endregion
//region Objects/Modules
exports.OPTIONS_MAP_FIELD_NAME = 'hypertype';
exports.PKG = require(exports.PKG_FILE);
exports.OPTIONS_MAP = exports.PKG[exports.OPTIONS_MAP_FIELD_NAME];
exports.OVERRIDE_CONFIG = (0, fs_1.existsSync)(exports.OVERRIDE_CONFIG_FILE) ? require(exports.OVERRIDE_CONFIG_FILE) : null;
//
// if (!OPTIONS_MAP || !Object.keys(OPTIONS_MAP).length) {
//   logBundlerErr(`To run the bundler, specify an object with options in field "${OPTIONS_MAP_FIELD_NAME}" of the file package.json`);
//   throw '';
// }
//endregion
//region Arguments
const [nodePath, runFilePath, ...args] = process.argv;
exports.ARGS = args;
exports.needToRun = findArg('--run');
exports.needToWatch = findArg('--watch');
exports.needStats = findArg('--stats');
//endregion
//region Support
function relativeToBase(...paths) {
    return (0, path_1.join)(exports.BASE_DIR, ...paths);
}
exports.relativeToBase = relativeToBase;
function excludeBase(value) {
    const unixSeparator = '/';
    const winSeparator = '\\';
    let result = value.replace(exports.BASE_DIR, '');
    if (path_1.sep === winSeparator)
        result = result.replaceAll(winSeparator, unixSeparator);
    if (result[0] === unixSeparator)
        result = result.replace(unixSeparator, ''); // without lead separator
    return result;
}
exports.excludeBase = excludeBase;
function findArg(value) {
    const regexp = new RegExp(value);
    return exports.ARGS.filter(a => regexp.test(a)).length > 0;
}
exports.findArg = findArg;
function optionalArgsStr() {
    const result = [];
    exports.needToRun && result.push('run');
    exports.needToWatch && result.push('watch');
    exports.needStats && result.push('stats');
    if (result.length)
        return `[${result}]`;
    return '';
}
exports.optionalArgsStr = optionalArgsStr;
//endregion
