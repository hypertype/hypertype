"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onProcessExit = void 0;
function onProcessExit(callback) {
    ['SIGINT', 'SIGTERM'].forEach(signal => {
        process.on(signal, () => {
            callback();
            process.exit();
        });
    });
}
exports.onProcessExit = onProcessExit;
