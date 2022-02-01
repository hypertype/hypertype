const ts = require("typescript");
const path = require("path");
const fs = require("fs");
function visitExportNode(exportNode, sourceFile) {
    var _a, _b;
    if (exportNode.typeOnly) {
        console.log('type olnly');
        return;
    }
    const file = (_b = (_a = exportNode.moduleSpecifier) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : exportNode.test;
    if (!file)
        return;
    const sourceFileDir = path.dirname(sourceFile.path);
    const abs = path.resolve(sourceFileDir, file);
    if (/\.(less|css|scss|sass|svg|png|html)$/.test(file)) {
        return ts.updateExportDeclaration(exportNode, exportNode.decorators, exportNode.modifiers, exportNode.exportClause, ts.createStringLiteral(abs), exportNode.typeOnly);
    }
    if (fs.existsSync(abs + '.ts')) {
        return ts.updateExportDeclaration(exportNode, exportNode.decorators, exportNode.modifiers, exportNode.exportClause, ts.createStringLiteral(file + '.js'), exportNode.typeOnly);
    }
    if (fs.existsSync(abs + '/')) {
        const indexFile = './' + path.join(file, 'index.js');
        console.log(sourceFileDir, file, indexFile);
        return ts.updateExportDeclaration(exportNode, exportNode.decorators, exportNode.modifiers, exportNode.exportClause, ts.createStringLiteral(indexFile), exportNode.typeOnly);
    }
}
function visitImportNode(importNode, sourceFile) {
    var _a;
    const file = (_a = importNode.moduleSpecifier) === null || _a === void 0 ? void 0 : _a.text;
    if (!file)
        return;
    const sourceFileDir = path.dirname(sourceFile.path);
    const abs = path.resolve(sourceFileDir, file);
    if (/\.(less|css|scss|sass|svg|png|html)$/.test(file)) {
        return ts.updateImportDeclaration(importNode, importNode.decorators, importNode.modifiers, importNode.importClause, ts.createStringLiteral(abs), importNode.assertClause);
    }
    if (fs.existsSync(abs + '.ts')) {
        return ts.updateImportDeclaration(importNode, importNode.decorators, importNode.modifiers, importNode.importClause, ts.createStringLiteral(file + '.js'), importNode.assertClause);
    }
    if (fs.existsSync(abs + '/')) {
        const indexFile = './' + path.join(file, 'index.js');
        return ts.updateImportDeclaration(importNode, importNode.decorators, importNode.modifiers, importNode.importClause, ts.createStringLiteral(indexFile), importNode.assertClause);
    }
}
function visitRequireNode(importNode, sourceFile) {
    if (!(importNode.expression.kind === ts.SyntaxKind.Identifier &&
        importNode.expression.escapedText === "require")) {
        return;
    }
    const file = importNode.arguments[0].text;
    if (/\.(less|css|scss|sass|svg|png|html)/.test(file)) {
        const sourceFileDir = path.dirname(sourceFile.path);
        const real = path.join(sourceFileDir, file);
        return ts.updateCall(importNode, importNode.expression, undefined, [ts.createStringLiteral(real)]);
    }
}
const lessToStringTransformer = function (context) {
    return (sourceFile) => {
        function visitor(node) {
            // if (node && node.kind == ts.SyntaxKind.ImportDeclaration) {
            //     return visitImportNode(node as ts.ImportDeclaration);
            // }
            if (!node)
                return ts.visitEachChild(node, visitor, context);
            if (ts.isCallExpression(node)) {
                const result = visitRequireNode(node, sourceFile);
                if (result)
                    return result;
            }
            if (ts.isImportDeclaration(node)) {
                const result = visitImportNode(node, sourceFile);
                if (result)
                    return result;
            }
            if (ts.isExportDeclaration(node)) {
                const result = visitExportNode(node, sourceFile);
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
};
//# sourceMappingURL=absolute-plugin.cjs.map