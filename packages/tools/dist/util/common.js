"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanDir = exports.copySync = exports.onProcessExit = exports.arrToStr = exports.messageRunOptionErr = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const messageRunOptionErr = (optionField, value, expected) => `Incorrect value of the "${optionField}" option field: "${value}". Possible value(s): ${expected}`;
exports.messageRunOptionErr = messageRunOptionErr;
/**
 * ['hello', 'world', 123] => '"hello", "world", "123"'
 */
const arrToStr = (arr) => arr.map(x => `"${x}"`).join(', ');
exports.arrToStr = arrToStr;
function onProcessExit(callback) {
    ['SIGINT', 'SIGTERM'].forEach(signal => {
        process.on(signal, () => {
            callback();
            process.exit();
        });
    });
}
exports.onProcessExit = onProcessExit;
function copySync(src, dest, allowedToCopyFilter) {
    if (!(0, fs_1.existsSync)(src) || allowedToCopyFilter && !allowedToCopyFilter(src))
        return;
    if (isDirectory(src)) {
        if (!(0, fs_1.existsSync)(dest))
            (0, fs_1.mkdirSync)(dest);
        let files = (0, fs_1.readdirSync)(src);
        if (allowedToCopyFilter)
            files = files.filter(allowedToCopyFilter);
        files.forEach(item => {
            copySync((0, path_1.join)(src, item), (0, path_1.join)(dest, item), allowedToCopyFilter);
        });
    }
    else
        (0, fs_1.copyFileSync)(src, dest);
}
exports.copySync = copySync;
function cleanDir(dir) {
    if (!(0, fs_1.existsSync)(dir) || !isDirectory(dir))
        return;
    (0, fs_1.readdirSync)(dir)
        .map(item => (0, path_1.join)(dir, item))
        .forEach(file => (0, fs_1.rmSync)(file, {
        recursive: isDirectory(file),
        force: true
    }));
}
exports.cleanDir = cleanDir;
function isDirectory(file) {
    return (0, fs_1.lstatSync)(file).isDirectory();
}
