declare function serialize(
  html: string,
  options?: serializeOptionsType
): DocumentNodeType;
declare function toHTML(
  nodes: DocumentNodeType,
  options?: deserializeOptionsType
): string;
declare function toReact(
  nodes: DocumentNodeType,
  options?: deserializeOptionsType
): React.ReactNode;

// various options
export type serializeOptionsType = {
  allowedTags?: string[];
  excludedTags?: string[];
};
export type deserializeOptionsType = {
  tagMap?: object;
  excludedTags?: string[];
  allowedTags?: string[];
};

// node types
export type DocumentNodeType = {
  _type: "document";
  children: ElementNodeTypes[];
};
export type TagNodeType = {
  _type: "tag";
  name: string;
  children?: ElementNodeTypes[];
  attributes?: TagAttributeType[];
};
export type TextNodeType = {
  _type: "text";
  value: string;
};
export type TagAttributeType = {
  key: string;
  value: string;
};

export type ElementNodeTypes = TagNodeType | TextNodeType;
export type AllNodeTypes = DocumentNodeType | TagNodeType | TextNodeType;
