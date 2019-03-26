// object utils
import { isArray, isObject } from './types';

export const sortObjByKeys = (obj = {}) => {
  if (isArray(obj)) {
    return obj.map(o => sortObjByKeys(o));
  }

  if (isObject(obj)) {
    const ret = {};
    Object.keys(obj)
      .sort()
      .forEach(k => {
        ret[k] = obj[k];
      });
    return ret;
  }
};

export const compareObj = (obj, compare) => JSON.stringify(sortObjByKeys(obj)) === JSON.stringify(sortObjByKeys(compare));
