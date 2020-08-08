export const merge = (
  primaryObject: object,
  secondaryObject: object,
): object => {
  return Object.keys(primaryObject).reduce((acc, key) => {
    return {
      ...acc,
      [key]: secondaryObject[key] ? secondaryObject[key] : primaryObject[key],
    };
  }, {});
};
