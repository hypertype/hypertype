const lessToStringTransformer = require("../../plugins/absolute").default;

const path = require('path');
const ts  = require('typescript');

const filePath = path.resolve("./test.ts");

const program = ts.createProgram([filePath], {});
const checker = program.getTypeChecker();
const source = program.getSourceFile(filePath);
const printer = ts.createPrinter();

// Run source file through our transformer
const transform = lessToStringTransformer(program, {});
const result = ts.transform(source, [transform]);
console.log(printer.printFile(result.transformed[0]));
