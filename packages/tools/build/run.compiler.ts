import {logAction, logErr, logWarn} from '../util/log';
import {needToWatch} from '../util/params';

const statsOpt = {
  preset: 'minimal',
  builtAt: true,
  version: false,
  colors: true,
  warnings: false,
};

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
            console.log(stats.toString(statsOpt)); // Done processing
        })
    } else {
        compiler.run((err, stats) => {
            if (err || stats.hasErrors()) {
                logErr('Webpack stats error:', stats.toString());
            }
            console.log(stats.toString(statsOpt)); // Done processing
        })
    }
}
