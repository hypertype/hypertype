"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.logBundlerErr = exports.logOption = exports.logAction = exports.logSuccess = exports.logWarn = exports.logErr = void 0;
// import color from 'chalk'; // все отображается без заданных цветов, если запускать через lerna
const colors_1 = __importDefault(require("colors"));
function logErr(title, ...message) {
    log({ type: 'error', title, message });
}
exports.logErr = logErr;
function logWarn(title, ...message) {
    log({ type: 'warning', title, message });
}
exports.logWarn = logWarn;
function logSuccess(title, ...message) {
    log({ type: 'success', title, message });
}
exports.logSuccess = logSuccess;
function logAction(title, asLine = true) {
    log({ type: 'action', title, asLine });
}
exports.logAction = logAction;
function logOption(option, value) {
    log({ type: 'success', title: option, message: value, asLine: true });
}
exports.logOption = logOption;
function logBundlerErr(...message) {
    logErr('Bundler:', ...message);
}
exports.logBundlerErr = logBundlerErr;
function log({ type, title, message, asLine }) {
    if (message)
        message = Array.isArray(message) ? message.join(' ') : message;
    switch (type) {
        case 'error':
            title = title && colors_1.default.black.bgRed(title);
            message = message && colors_1.default.red(message);
            break;
        case 'warning':
            title = title && colors_1.default.black.bgYellow(title);
            message = message && colors_1.default.black(message);
            break;
        case 'success':
            title = title && colors_1.default.black.bgGreen(title);
            message = message && colors_1.default.green(message);
            break;
        case 'action':
            title = title && colors_1.default.black.bgCyan(title);
            message = message && colors_1.default.black(message);
            break;
        default:
            logBundlerErr(`Unknown message type "${type}"`);
            throw '';
    }
    if (asLine) {
        if (title)
            console.log(title, message || '');
        else if (message)
            console.log(message);
    }
    else {
        if (title)
            console.log(title);
        if (message)
            console.log(message);
        console.log(' '); // empty line after message
    }
}
exports.log = log;
