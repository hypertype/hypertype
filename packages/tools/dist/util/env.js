"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifiedProcessEnv = exports.getEnv = exports.prepareEnv = exports.runModeInfo = void 0;
const dotenv_expand_1 = __importDefault(require("dotenv-expand"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const params_1 = require("./params");
const log_1 = require("./log");
const runModeInfo = () => {
    const NODE_ENV = process.env.NODE_ENV;
    return {
        NODE_ENV,
        isDevelopment: NODE_ENV === 'development',
        isProduction: NODE_ENV === 'production',
        isTest: NODE_ENV === 'test',
    };
};
exports.runModeInfo = runModeInfo;
/**
 * Preparing environment variables:
 *  1) load variables from .env* files into process.env;
 *  2) set process.env.NODE_ENV
 */
function prepareEnv(nodeEnv) {
    /**
     * Prepare a selection of .env* files depending on the startup mode and priority:
     *  https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
     */
    const dotenvFiles = [
        `${params_1.DOTENV_FILE}.${nodeEnv}.local`,
        // Don't include `.env.local` for `test` environment
        // since normally you expect tests to produce the same
        // results for everyone
        nodeEnv !== 'test' && `${params_1.DOTENV_FILE}.local`,
        `${params_1.DOTENV_FILE}.${nodeEnv}`,
        params_1.DOTENV_FILE
    ].filter(Boolean);
    /**
     * Load environment variables from .env* files. Suppress warnings using silent
     * if this file is missing. dotenv will never modify any environment variables
     * that have already been set.  Variable expansion is supported in .env files.
     * https://github.com/motdotla/dotenv
     * https://github.com/motdotla/dotenv-expand
     */
    dotenvFiles.forEach(file => {
        if (fs_1.default.existsSync(file)) {
            (0, dotenv_expand_1.default)(dotenv_1.default.config({
                path: file
            }));
        }
    });
    process.env.NODE_ENV = nodeEnv;
}
exports.prepareEnv = prepareEnv;
function getEnv() {
    if (!(0, exports.runModeInfo)().NODE_ENV) {
        (0, log_1.logBundlerErr)('The NODE_ENV environment variable is required but was not specified.');
        throw '';
    }
    return { ...process.env };
}
exports.getEnv = getEnv;
/**
 * Stringify all values so we can feed into webpack DefinePlugin
 */
const stringifiedProcessEnv = () => ({
    'process.env': Object.entries(getEnv())
        .reduce((acc, [key, value]) => {
        acc[key] = JSON.stringify(value);
        return acc;
    }, {})
});
exports.stringifiedProcessEnv = stringifiedProcessEnv;
