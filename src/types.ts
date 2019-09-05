export type DocumentNodeType = {
  type: "document";
  children: ElementNodeTypes[];
};
export type TagNodeType = {
  type: "tag";
  name: string;
  children?: ElementNodeTypes[];
  attributes?: TagAttributeType[];
};
export type TextNodeType = {
  type: "text";
  value: string;
};
export type TagAttributeType = {
  key: string;
  value: string;
};

export type ElementNodeTypes = TagNodeType | TextNodeType;
export type AllNodeTypes = DocumentNodeType | TagNodeType | TextNodeType;
