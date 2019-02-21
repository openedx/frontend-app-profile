import set from 'lodash.set';

export function unflattenAndTransformKeys(obj, transformer) {
  const newObj = {};

  Object.entries(obj).forEach(([key, value]) => {
    set(newObj, key.split('.').map(transformer), value);
  });

  return newObj;
}

export function flattenAndTransformKeys(srcObj, transformer = key => key) {
  const flatten = (obj, prevKeys = []) => (Object.entries(obj).reduce((acc, [key, value]) => {
    const tKey = transformer(key);
    const keys = prevKeys.concat(tKey);

    if (value && typeof value === 'object') {
      Object.assign(acc, flatten(value, keys));
    } else {
      acc[keys.join('.')] = value;
    }

    return acc;
  }, {}));

  return flatten(srcObj);
}
