"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanDir = exports.copySync = exports.onProcessExit = exports.arrToStr = exports.messageRunOptionErr = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const messageRunOptionErr = (optionField, value, expected) => `Incorrect "${optionField}" option field value: "${value}". Possible value(s): ${expected}`;
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
    if (!fs_1.existsSync(src) || allowedToCopyFilter && !allowedToCopyFilter(src))
        return;
    if (isDirectory(src)) {
        if (!fs_1.existsSync(dest))
            fs_1.mkdirSync(dest);
        let files = fs_1.readdirSync(src);
        if (allowedToCopyFilter)
            files = files.filter(allowedToCopyFilter);
        files.forEach(item => {
            copySync(path_1.join(src, item), path_1.join(dest, item), allowedToCopyFilter);
        });
    }
    else
        fs_1.copyFileSync(src, dest);
}
exports.copySync = copySync;
function cleanDir(dir) {
    if (!fs_1.existsSync(dir) || !isDirectory(dir))
        return;
    fs_1.readdirSync(dir)
        .map(item => path_1.join(dir, item))
        .forEach(file => fs_1.rmSync(file, {
        recursive: isDirectory(file),
        force: true
    }));
}
exports.cleanDir = cleanDir;
function isDirectory(file) {
    return fs_1.lstatSync(file).isDirectory();
}
