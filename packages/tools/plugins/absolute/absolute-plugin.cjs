const ts = require("typescript");
const path = require("path");
const fs = require("fs");

function visitExportNode(exportNode, sourceFile, options) {
  if (exportNode.typeOnly) {
    console.log('type olnly')
    return;
  }
  const file = exportNode.moduleSpecifier?.text ?? exportNode.test;
  if (!file)
    return;
  const sourceFileDir = path.dirname(sourceFile.path);
  const abs = path.resolve(sourceFileDir, file);
  if (/\.(less|css|scss|sass|svg|png|html)$/.test(file)) {
    const absSource = path.join(options.outDir, path.relative(options.baseUrl, sourceFileDir));
    const relFile = path.relative(absSource, abs).replaceAll(path.sep, '/');
    return ts.updateExportDeclaration(exportNode, exportNode.decorators, exportNode.modifiers, exportNode.exportClause, ts.createStringLiteral(relFile), exportNode.typeOnly);
  }
  if (fs.existsSync(abs + '.ts')) {
    return ts.updateExportDeclaration(exportNode, exportNode.decorators, exportNode.modifiers, exportNode.exportClause, ts.createStringLiteral(file + '.js'), exportNode.typeOnly);
  }
  if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) {
    const indexFile = `${file}/index.js`;
    return ts.updateExportDeclaration(exportNode, exportNode.decorators, exportNode.modifiers, exportNode.exportClause, ts.createStringLiteral(indexFile), exportNode.typeOnly);
  }
}

function visitImportNode(importNode, sourceFile, options) {
  const file = importNode.moduleSpecifier?.text;
  if (!file || !file.startsWith('.'))
    return;
  const sourceFileDir = path.dirname(sourceFile.path);
  const abs = path.resolve(sourceFileDir, file);
  if (/\.(less|css|scss|sass|svg|png|html)$/.test(file)) {
    const absSource = path.join(options.outDir, path.relative(options.baseUrl, sourceFileDir));
    const relFile = path.relative(absSource, abs).replaceAll(path.sep, '/');
    return ts.updateImportDeclaration(importNode, importNode.decorators, importNode.modifiers, importNode.importClause, ts.createStringLiteral(relFile), importNode.assertClause);
  }
  if (fs.existsSync(abs + '.ts')) {
    return ts.updateImportDeclaration(importNode, importNode.decorators, importNode.modifiers, importNode.importClause, ts.createStringLiteral(file + '.js'), importNode.assertClause);
  }
  if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) {
    const indexFile = `${file}/index.js`;
    return ts.updateImportDeclaration(importNode, importNode.decorators, importNode.modifiers, importNode.importClause, ts.createStringLiteral(indexFile), importNode.assertClause);
  }
}

function visitRequireNode(importNode, sourceFile, options) {
  if (!(importNode.expression.kind === ts.SyntaxKind.Identifier &&
    importNode.expression.escapedText === "require")) {
    return;
  }
  const file = importNode.arguments[0].text;
  if (/\.(less|css|scss|sass|svg|png|html)/.test(file)) {
    const sourceFileDir = path.dirname(sourceFile.path);
    const abs = path.join(sourceFileDir, file);
    const absSource = path.join(options.outDir, path.relative(options.baseUrl, sourceFileDir));
    const relFile = path.relative(absSource, abs).replaceAll(path.sep, '/');
    return ts.updateCall(importNode, importNode.expression, undefined, [ts.createStringLiteral(relFile)]);
  }
}

const lessToStringTransformer = function (context) {
  const options = context.getCompilerOptions();
  return (sourceFile) => {
    function visitor(node) {
      // if (node && node.kind == ts.SyntaxKind.ImportDeclaration) {
      //     return visitImportNode(node as ts.ImportDeclaration);
      // }
      if (!node)
        return ts.visitEachChild(node, visitor, context);
      if (ts.isCallExpression(node)) {
        const result = visitRequireNode(node, sourceFile, options);
        if (result)
          return result;
      }
      if (ts.isImportDeclaration(node)) {
        const result = visitImportNode(node, sourceFile, options);
        if (result)
          return result;
      }
      if (ts.isExportDeclaration(node)) {
        const result = visitExportNode(node, sourceFile, options);
        if (result)
          return result;
      }
      return ts.visitEachChild(node, visitor, context);
    }

    return ts.visitEachChild(sourceFile, visitor, context);
  };
};
exports.default = function (program, pluginOptions) {
  return lessToStringTransformer;
}
