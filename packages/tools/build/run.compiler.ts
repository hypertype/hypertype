import {logAction, logErr, logWarn} from '../util/log';
import {needToWatch} from '../util/params';

export function runCompiler(compiler) {
    logAction(`Compiling to ${compiler.options.output.path}`, false);
    if (needToWatch) {
        compiler.watch({}, (err, stats) => {
            const info = stats.toJson("minimal");
            if (info.errors.length) {
                logErr('Webpack watch stats error:', stats.toString());
                return;
            }
            if (info.warnings.length) {
                logWarn('Webpack watch stats warning:', ...info.warnings);
            }
            console.log(stats.toString({
              builtAt: true,
              version: false,
              colors: true
            })); // Done processing
        })
    } else {
        compiler.run((err, stats) => {
            if (err || stats.hasErrors()) {
                logErr('Webpack stats error:', stats.toString());
            }
            // Done processing
        })
    }
}
