import React from "react";
import { htmlSafeProps, getJSON } from "../utils";
import { AllNodeTypes } from "../index.d";

export type optionsType = {
  tagMap?: object;
  excludedTags?: string[];
  allowedTags?: string[];
};

export const toReact = (
  json: AllNodeTypes,
  { tagMap = {}, allowedTags = [], excludedTags = [] }: optionsType = {}
) => {
  const parseNode = (node: AllNodeTypes, i = -1): React.ReactNode => {
    switch (node._type) {
      case "document":
        return React.createElement(
          React.Fragment,
          {},
          node.children.map(parseNode)
        );
      case "text":
        return node.value;
      case "tag": {
        let tag = node.name in tagMap ? tagMap[node.name] : node.name;
        if (!tag) {
          return null;
        }
        if (
          excludedTags &&
          excludedTags.length &&
          excludedTags.find(name => name === node.name)
        ) {
          return null;
        }
        if (
          allowedTags &&
          allowedTags.length &&
          !allowedTags.find(name => name === node.name)
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
      }
      default:
        return null;
    }
  };

  // do the magic
  const _json = getJSON(json);
  if (!json) {
    throw new Error("Invalid json");
  }
  return parseNode(_json as AllNodeTypes);
};
