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
