import { tokenize, constructTree, TreeConstructor } from "hyntax";
import { removeLineBreaks, filterNoUndefined } from "../utils";
import { AllNodeTypes, DocumentNodeType, TextNodeType } from "../index.d";

export type optionsType = {
  allowedTags?: string[];
  excludedTags?: string[];
};

const creators = {
  document: (node: TreeConstructor.DocumentNode, options: optionsType) =>
    ({
      _type: "document",
      children: getChildren(node.content.children, options)
    } as DocumentNodeType),
  text: (node: TreeConstructor.TextNode) =>
    ({
      _type: "text",
      value: node.content.value.content
    } as TextNodeType),
  tag: (node: TreeConstructor.TagNode, options: optionsType) => {
    let children =
      node.content.children && getChildren(node.content.children, options);
    if (
      options.excludedTags &&
      options.excludedTags.length &&
      options.excludedTags.find(name => name === node.content.name)
    ) {
      return undefined;
    }
    if (
      options.allowedTags &&
      options.allowedTags.length &&
      !options.allowedTags.find(name => name === node.content.name)
    ) {
      return undefined;
    }
    return {
      _type: "tag",
      name: node.content.name,
      ...(node.content.attributes && {
        attributes: node.content.attributes.reduce(
          (obj, attr) => ({
            ...obj,
            ...(!!attr &&
              !!attr.key && {
                [attr.key.content]: attr.value ? attr.value.content : true
              })
          }),
          {}
        )
      }),
      ...(children &&
        children.length && {
          children
        })
    };
  },
  // never return style and script tags
  style: (node: TreeConstructor.StyleNode) => undefined,
  script: (node: TreeConstructor.ScriptNode) => undefined
};

function parseHyntaxTreeNode(
  node: TreeConstructor.AnyNode,
  options: optionsType
) {
  return (
    (creators[node.nodeType] && creators[node.nodeType](node, options)) ||
    undefined
  );
}
function getChildren(
  children: TreeConstructor.AnyNode[],
  options: optionsType
): AllNodeTypes[] {
  return children
    .map(node => parseHyntaxTreeNode(node, options))
    .filter(filterNoUndefined);
}

export const fromHTML = (
  html: string,
  { excludedTags = [], allowedTags = [] }: optionsType = {}
): AllNodeTypes => {
  const { tokens } = tokenize(removeLineBreaks(html.trim()));
  const { ast } = constructTree(tokens);
  return creators.document(ast, { excludedTags, allowedTags });
};
