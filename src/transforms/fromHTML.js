const { tokenize, constructTree } = require("hyntax");
const { removeLineBreaks, filterNoUndefined } = require("../utils");

/* Returns very simple JSON format, with these node types:
  // document
  {
    type: document
    children: [tag|text]
  }
  // tag
  {
    type: tag,
    name: tagName,
    attributes?: [{key:value}],
    children?: [tag|text]
  }
  // text
  {
    type: text,
    value: string
  }
*/

export const fromHTML = (
  html,
  {
    allowStyle = false,
    allowScript = false,
    excludedTags = [],
    allowedTags = []
  } = {}
) => {
  const { tokens } = tokenize(removeLineBreaks(html.trim()));
  const { ast } = constructTree(tokens);
  const parseNode = node => {
    const getChildren = children =>
      children.map(parseNode).filter(filterNoUndefined);

    switch (node.nodeType) {
      case "document":
        return {
          type: "document",
          children: getChildren(node.content.children)
        };
      case "text":
        return {
          type: node.nodeType,
          value: node.content.value.content
        };
      case "tag": {
        let children =
          node.content.children && getChildren(node.content.children);
        if (
          excludedTags &&
          excludedTags.length &&
          excludedTags.find(node.content.name)
        ) {
          return undefined;
        }
        if (
          allowedTags &&
          allowedTags.length &&
          !allowedTags.find(node.content.name)
        ) {
          return undefined;
        }
        return {
          type: node.nodeType,
          name: node.content.name,
          ...(node.content.attributes && {
            attributes: node.content.attributes.reduce(
              (obj, attr) => ({
                ...obj,
                [attr.key.content]: attr.value ? attr.value.content : true
              }),
              {}
            )
          }),
          ...(children &&
            children.length && {
              children
            })
        };
      }
      default:
        // TODO: implement handeling of script, style and comments
        // comment and doctype is returned as undefined
        return undefined;
    }
  };
  return parseNode(ast);
};
