import {
  createEmitAndSemanticDiagnosticsBuilderProgram,
  createSolutionBuilder,
  createSolutionBuilderWithWatch,
  createSolutionBuilderWithWatchHost,
  sys,
} from "ttypescript";
import {join, resolve} from 'path';
import {CompilerHost} from "typescript";
import {logAction} from "../util/log";

const rootDir = process.cwd();

const formatHost = {
  getCanonicalFileName: path => path,
  getCurrentDirectory: sys.getCurrentDirectory,
  getNewLine: () => sys.newLine,
};

export function compile(...flags) {

  const host = createSolutionBuilderWithWatchHost(sys, createProgram
    // , diagnostic =>
    //   console.log(
    //     'Solution builder: ',
    //     formatDiagnosticsWithColorAndContext([diagnostic], formatHost),
    //   ),
    // diagnostic =>
    //   console.log(
    //     'Solution builder status: ',
    //     formatDiagnosticsWithColorAndContext([diagnostic], formatHost),
    //   ),diagnostic =>
    //   console.log(
    //     'Watch status: ',
    //     formatDiagnosticsWithColorAndContext([diagnostic], formatHost),
    //   )
  );
  host.useCaseSensitiveFileNames();
  const rd = host.readDirectory.bind(host);
  // host.readDirectory = function (path, extensions, exclude, include, depth) {
  //   exclude = exclude.map(s => join(path, s));
  //   include = include.map(s => join(path, s));
  //   return rd(path, extensions, exclude, include, depth);
  // }

  const builderFactory = flags.includes('--watch') ?
    createSolutionBuilderWithWatch :
    createSolutionBuilder;

  const builder = builderFactory(host, [rootDir], {
    incremental: true,
    dry: false,
  }, {
    excludeDirectories: ["node_modules", "dist"],
  });
  builder.clean(rootDir);
  builder.build(rootDir);
}

function createProgram(rootNames, options, host: CompilerHost, oldProgram, configFileParsingDiagnostics, projectReferences) {
  options.outDir = resolve(options.configFilePath, '../dist/esm');
  options.declarationDir = resolve(options.configFilePath, '../dist/typings');
  options.baseUrl = resolve(options.configFilePath, '../');
  logAction(`compile ${options.configFilePath}...`);
  return createEmitAndSemanticDiagnosticsBuilderProgram(
    rootNames, options, host, oldProgram, configFileParsingDiagnostics, projectReferences
  );
}
