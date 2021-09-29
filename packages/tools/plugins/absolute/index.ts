import * as ts from "typescript";
import {dirname, join} from "path";

function visitRequireNode(importNode: ts.CallExpression) {
  if (importNode.expression.kind == ts.SyntaxKind.Identifier &&
    (importNode.expression as ts.Identifier).escapedText == "require") {
    const file = (importNode.arguments[0] as ts.StringLiteral).text;
    if (/\.(less|css|scss|sass|svg|png|html)/.test(file)) {
      const currentFileName = (importNode as ts.Node).getSourceFile().fileName;
      const absolute = join(dirname(currentFileName), file);
      return ts.updateCall(importNode, importNode.expression, undefined, [ts.createStringLiteral(absolute)]) as ts.Node;
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

const lessToStringTransformer: ts.TransformerFactory<ts.SourceFile> = context => {
  const options = context.getCompilerOptions();
  const visitor: ts.Visitor = (node: ts.Node): ts.VisitResult<ts.Node> => {
    // if (node && node.kind == ts.SyntaxKind.ImportDeclaration) {
    //     return visitImportNode(node as ts.ImportDeclaration);
    // }
    if (node && ts.isCallExpression(node as any)) {
      const result = visitRequireNode(node as ts.CallExpression);
      if (result)
        return result;
    }

    return ts.visitEachChild(node as any, visitor, context);
  };

  return (node: ts.SourceFile) => ts.visitNode<ts.SourceFile>(node as any, visitor);
};
export default function (program?: ts.Program, pluginOptions?: {}) {
  return lessToStringTransformer;
}
