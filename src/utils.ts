export const filterNoUndefined = (item: any): boolean => item !== undefined;
export const htmlSafeProps = (props: object): object =>
  Object.keys(props).reduce(
    (obj, key) => ({ ...obj, [key]: props[key] === true ? key : props[key] }),
    {}
  );
export const removeLineBreaks = (str: string): string =>
  str.replace(/\s*(\r\n|\n|\r)\s*/gm, ""); // remove linebreaks and spaces before or after linebreaks

// ensure input is json object
export const getJSON = (json: string | object): object | null => {
  if (typeof json === "object") return json;
  if (typeof json === "string") {
    try {
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }
  return null;
};
