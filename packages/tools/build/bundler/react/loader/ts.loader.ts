import {RuleSetRule} from 'webpack';
import {relativeToBase} from '../../../../util/params';
import {runModeInfo} from '../../../../util/env';

/**
 * TypeScript loader.
 *  https://github.com/TypeStrong/ts-loader#table-of-contents
 *
 * Порядок применения настроек для tsc:
 *  1) если в проекте найден файл tsconfig.json, то берутся настройки из него. Иначе используются default настройки tsc;
 *  2) затем они дополняются, либо переопределяются настройками из поля "options".
 */
export const tsLoader = (test: RuleSetRule['test'] = /\.(tsx|ts|js|jsx)$/): RuleSetRule => ({
  test,
  loader: 'ts-loader',
  exclude: /node_modules/,
  options: {
    logLevel: 'info',
    compilerOptions: getCompilerOptions()
  }
});

function getCompilerOptions() {
  switch (runModeInfo().NODE_ENV) {
    case 'development':
    case 'test':
      return {
        sourceMap: true,
        declaration: true,
        declarationMap: true
      };
    case 'production':
      return {
        sourceMap: false,
        declaration: false,
        declarationMap: false
      };
    default:
      return {
        outDir: relativeToBase('!UNRECOGNIZED_RUN_MODE')
      };
  }
}
