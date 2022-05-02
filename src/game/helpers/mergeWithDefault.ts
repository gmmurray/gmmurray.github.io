export function mergeWithDefault<T>(defaultObject: T, providedObject?: T) {
  if (!providedObject) return defaultObject;

  Object.keys(providedObject).forEach(key => {
    if (providedObject[key] === undefined) {
      delete providedObject[key];
    }
  });

  return {
    ...defaultObject,
    ...providedObject,
  };
}
