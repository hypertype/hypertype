"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onProcessExit = exports.relativeToBase = void 0;
const path_1 = require("path");
const params_1 = require("./params");
const relativeToBase = (...paths) => path_1.join(params_1.BASE_DIR, ...paths);
exports.relativeToBase = relativeToBase;
function onProcessExit(callback) {
    ['SIGINT', 'SIGTERM'].forEach(signal => {
        process.on(signal, () => {
            callback();
            process.exit();
        });
    });
}
exports.onProcessExit = onProcessExit;
