"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCompiler = void 0;
const params_1 = require("./util/params");
function runCompiler(compiler) {
    console.log(`compiling to ${compiler.options.output.path}`);
    if (params_1.needToWatch) {
        compiler.watch({}, (err, stats) => {
            const info = stats.toJson("minimal");
            if (info.errors.length) {
                console.error(stats.toString("minimal"));
                return;
                // Handle errors here
            }
            if (info.warnings.length) {
                console.warn(...info.warnings);
            }
            console.log(stats.toString());
            // Done processing
        });
    }
    else {
        compiler.run((err, stats) => {
            if (err || stats.hasErrors()) {
                console.log(stats.toString());
                // Handle errors here
            }
            // Done processing
        });
    }
}
exports.runCompiler = runCompiler;
