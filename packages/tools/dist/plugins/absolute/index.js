"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts = __importStar(require("typescript"));
const path_1 = require("path");
function visitRequireNode(importNode) {
    if (importNode.expression.kind == ts.SyntaxKind.Identifier &&
        importNode.expression.escapedText == "require") {
        const file = importNode.arguments[0].text;
        if (/\.(less|css|scss|sass|svg|png|html)/.test(file)) {
            const currentFileName = importNode.getSourceFile().fileName;
            const absolute = path_1.join(path_1.dirname(currentFileName), file);
            return ts.updateCall(importNode, importNode.expression, undefined, [ts.createStringLiteral(absolute)]);
        }
    }
    return null;
}
// function visitImportNode(importNode: ts.ImportDeclaration) {
//     const file = (importNode.moduleSpecifier as ts.StringLiteral).text;
//     if (!/\.less/.test(file))
//         return importNode as ts.Node;
//     const content = getFileContent(importNode as ts.Node, file);
//     const name = (importNode.importClause as any).symbol.escapedName;
//     const newNode = ts.createVariableDeclaration(name, undefined, ts.createStringLiteral(content));
//     return ts.createVariableDeclarationList([newNode], ts.NodeFlags.Const) as ts.Node;
// }
const lessToStringTransformer = context => {
    const options = context.getCompilerOptions();
    const visitor = (node) => {
        // if (node && node.kind == ts.SyntaxKind.ImportDeclaration) {
        //     return visitImportNode(node as ts.ImportDeclaration);
        // }
        if (node && ts.isCallExpression(node)) {
            const result = visitRequireNode(node);
            if (result)
                return result;
        }
        return ts.visitEachChild(node, visitor, context);
    };
    return (node) => ts.visitNode(node, visitor);
};
function default_1(program, pluginOptions) {
    return lessToStringTransformer;
}
exports.default = default_1;
