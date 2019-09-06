import { htmlSafeProps, getJSON } from "../utils";
import { AllNodeTypes, deserializeOptionsType } from "../index.d";

export const toHTML = (
  json: object | string,
  {
    tagMap = {},
    allowedTags = [],
    excludedTags = []
  }: deserializeOptionsType = {}
) => {
  const parseNode = (node: AllNodeTypes, i = -1): string => {
    switch (node._type) {
      case "document":
        return node.children.map(parseNode).join("");
      case "text":
        return node.value;
      case "tag": {
        let tag = node.name in tagMap ? tagMap[node.name] : node.name;
        if (!tag) {
          return "";
        }
        if (
          excludedTags &&
          excludedTags.length &&
          excludedTags.find(name => name === node.name)
        ) {
          return "";
        }
        if (
          allowedTags &&
          allowedTags.length &&
          !allowedTags.find(name => name === node.name)
        ) {
          return "";
        }
        let props = !!node.attributes && htmlSafeProps(node.attributes);
        return `<${tag} ${!!props &&
          Object.keys(props)
            .map(key => `${key}="${props[key]}"`)
            .join(" ")} ${
          node.children
            ? `>${node.children.map(parseNode).join("")}</${tag}>`
            : "/>"
        }`;
      }
      default:
        return "";
    }
  };

  // do the magic
  const _json = getJSON(json);
  if (!json) {
    throw new Error("Invalid json");
  }
  return parseNode(_json as AllNodeTypes);
};
