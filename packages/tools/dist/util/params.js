"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relativeToBase = exports.needStats = exports.needToWatch = exports.needToRun = exports.isProd = exports.ARGS = exports.OVERRIDE_CONFIG = exports.OPTIONS = exports.PKG = exports.OVERRIDE_CONFIG_FILE = exports.PKG_FILE = exports.DIST_DIR = exports.BASE_DIR = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
exports.BASE_DIR = process.cwd();
exports.DIST_DIR = relativeToBase('dist');
exports.PKG_FILE = relativeToBase('package.json');
exports.OVERRIDE_CONFIG_FILE = relativeToBase('webpack.config.js');
exports.PKG = require(exports.PKG_FILE);
exports.OPTIONS = exports.PKG.hypertype;
exports.OVERRIDE_CONFIG = fs_1.existsSync(exports.OVERRIDE_CONFIG_FILE) ? require(exports.OVERRIDE_CONFIG_FILE) : null;
const [nodePath, runFilePath, ...args] = process.argv;
exports.ARGS = args;
exports.isProd = args.filter(a => /--prod/.test(a)).length > 0;
exports.needToRun = args.filter(a => /--run/.test(a)).length > 0;
exports.needToWatch = args.filter(a => /--watch/.test(a)).length > 0;
exports.needStats = args.filter(a => /--stats/.test(a)).length > 0;
function relativeToBase(...paths) {
    return path_1.join(exports.BASE_DIR, ...paths);
}
exports.relativeToBase = relativeToBase;
