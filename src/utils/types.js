const toString = Object.prototype.toString;
const arrayStr = '[object Array]';
const objectStr = '[object Object]';

export function isArray(val) {
  return toString.call(val) === arrayStr;
}

export function isObject(val) {
  return toString.call(val) === objectStr;
}
