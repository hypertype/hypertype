"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCompiler = void 0;
const log_1 = require("../util/log");
const params_1 = require("../util/params");
function runCompiler(compiler) {
    (0, log_1.logAction)(`Compiling to ${compiler.options.output.path}`, false);
    if (params_1.needToWatch) {
        compiler.watch({}, (err, stats) => {
            const info = stats.toJson("minimal");
            if (info.errors.length) {
                (0, log_1.logErr)('Webpack watch stats error:', stats.toString());
                return;
            }
            if (info.warnings.length) {
                (0, log_1.logWarn)('Webpack watch stats warning:', ...info.warnings);
            }
            console.log(stats.toString()); // Done processing
        });
    }
    else {
        compiler.run((err, stats) => {
            if (err || stats.hasErrors()) {
                (0, log_1.logErr)('Webpack stats error:', stats.toString());
            }
            // Done processing
        });
    }
}
exports.runCompiler = runCompiler;
