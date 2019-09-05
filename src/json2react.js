// mock
const React = require("react");
const { htmlSafeProps, getJSON } = require("./utils");

const toReact = (
  json,
  { tagMap = {}, excludedTags = [], allowedTags = [] } = {}
) => {
  const parseNode = (node, i = -1) => {
    switch (node.type) {
      case "document":
        return React.createElement(
          React.Fragment,
          {},
          node.children.map(parseNode)
        );
      case "text":
        return node.value;
      case "tag":
        let tag = node.name in tagMap ? tagMap[node.name] : node.name;
        if (!tag) {
          return null;
        }
        if (
          excludedTags &&
          excludedTags.length &&
          excludedTags.find(node.content.name)
        ) {
          return null;
        }
        if (
          allowedTags &&
          allowedTags.length &&
          !allowedTags.find(node.content.name)
        ) {
          return null;
        }
        let props = {
          ...(!!node.attributes && typeof tag === "string"
            ? htmlSafeProps(node.attributes)
            : node.attributes),
          ...(i > -1 && { key: i }) // yes, it's dirty.. but that's just the way it'll be for now..
        };
        return React.createElement(
          tag,
          props,
          node.children ? node.children.map(parseNode) : null
        );
      default:
        return null;
    }
  };

  // do the magic
  const _json = getJSON(json);
  if (!json) {
    throw new Error("Invalid json", json);
  }
  return parseNode(_json);
};

module.exports = {
  toReact
};
