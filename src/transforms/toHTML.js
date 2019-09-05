import { htmlSafeProps, getJSON } from "../utils";
export const toHTML = (
  json,
  { tagMap = {}, excludedTags = [], allowedTags = [] } = {}
) => {
  const parseNode = (node, i = -1) => {
    switch (node.type) {
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
          excludedTags.find(node.content.name)
        ) {
          return "";
        }
        if (
          allowedTags &&
          allowedTags.length &&
          !allowedTags.find(node.content.name)
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
    throw new Error("Invalid json", json);
  }
  return parseNode(_json);
};
