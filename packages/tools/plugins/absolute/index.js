"use strict";
exports.__esModule = true;
var ts = require("typescript");
var path_1 = require("path");
function visitRequireNode(importNode) {
    if (importNode.expression.kind == ts.SyntaxKind.Identifier &&
        importNode.expression.escapedText == "require") {
        var file = importNode.arguments[0].text;
        if (/\.(less|css|scss|sass)/.test(file)) {
            var currentFileName = importNode.getSourceFile().fileName;
            var absolute = path_1.join(path_1.dirname(currentFileName), file);
            return ts.updateCall(importNode, importNode.expression, undefined, [ts.createStringLiteral(absolute)]);
        }
    }
    return null;
}
// function visitImportNode(importNode: ts.ImportDeclaration) {
//     const file = (importNode.moduleSpecifier as ts.StringLiteral).text;
//     if (!/\.less/.test(file))
//         return importNode as ts.Node;
//     const content = getFileContetn(importNode as ts.Node, file);
//     const name = (importNode.importClause as any).symbol.escapedName;
//     const newNode = ts.createVariableDeclaration(name, undefined, ts.createStringLiteral(content));
//     return ts.createVariableDeclarationList([newNode], ts.NodeFlags.Const) as ts.Node;
// }
var lessToStringTransformer = function (context) {
    var options = context.getCompilerOptions();
    var visitor = function (node) {
        // if (node && node.kind == ts.SyntaxKind.ImportDeclaration) {
        //     return visitImportNode(node as ts.ImportDeclaration);
        // }
        // if (node && ts.isCallExpression(node)) {
        //     var result = visitRequireNode(node);
        //     if (result)
        //         return result;
        // }
        return ts.visitEachChild(node, visitor, context);
    };
    return function (node) { return ts.visitNode(node, visitor); };
};
function default_1(program, pluginOptions) {
    return lessToStringTransformer;
}
exports["default"] = default_1;
