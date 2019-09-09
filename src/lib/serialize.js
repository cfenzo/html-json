import { tokenize, constructTree } from "hyntax";
import { removeLineBreaks, filterNoUndefined } from "../utils";

const creators = {
  document: (node, options) => ({
    _type: "document",
    children: getChildren(node.content.children, options)
  }),
  text: node => ({
    _type: "text",
    value: node.content.value.content
  }),
  tag: (node, options) => {
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
  style: node => undefined,
  script: node => undefined
};

function parseHyntaxTreeNode(node, options) {
  return (
    (creators[node.nodeType] && creators[node.nodeType](node, options)) ||
    undefined
  );
}
function getChildren(children, options) {
  return children
    .map(node => parseHyntaxTreeNode(node, options))
    .filter(filterNoUndefined);
}

export const serialize = (
  html,
  { excludedTags = [], allowedTags = [] } = {}
) => {
  const { tokens } = tokenize(removeLineBreaks(html.trim()));
  const { ast } = constructTree(tokens);
  return creators.document(ast, { excludedTags, allowedTags });
};
