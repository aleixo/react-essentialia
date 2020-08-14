export const merge = (
  primaryObject: object,
  secondaryObject: object
): object => {
  return Object.keys(primaryObject).reduce((acc, key) => {
    return {
      ...acc,
      [key]: secondaryObject[key] ? secondaryObject[key] : primaryObject[key],
    };
  }, {});
};

export const byString = (obj, path) => {
  var properties = path.split(".");
  console.log("PROPERTIES", properties, obj);
  return properties.reduce((prev, curr) => prev && prev[curr], obj);
};
