import { get } from 'lodash';

export function getParseDate(text) {
  const date = new Date(text);
  return `${date.getFullYear()}/${`0${date.getMonth() + 1}`.slice(-2)}/${`0${date.getDate()}`.slice(
    -2
  )}`;
}

export function getScrollTop() {
  return window.pageYOffset !== undefined
    ? window.pageYOffset
    : (document.documentElement || document.body.parentNode || document.body).scrollTop;
}

export function getCookie(name) {
  let re = new RegExp(name + '=([^;]+)');
  let value = re.exec(document.cookie);
  return value !== null ? unescape(value[1]) : null;
}

export function getPastTime(time) {
  const now = new Date();
  const date = new Date(time);
  const diff = (now.getTime() - date.getTime()) / (60 * 60 * 1000);
  return diff / 24 > 1 ? parseInt(diff / 24) + ' days ago' : parseInt(diff) + ' hours ago';
}

export function toQueryString(params) {
  return `${Object.keys(params)
    .map(k => {
      const name = encodeURIComponent(k);
      if (Array.isArray(params[k])) {
        return params[k].map(val => `${name}[]=${encodeURIComponent(val)}`).join('&');
      }
      return `${name}=${encodeURIComponent(params[k])}`;
    })
    .join('&')}`;
}

// isomorphic: get session info from server ctx or client cookie
export function getSessInfo(key, store) {
  if (typeof window !== 'undefined') {
    return getCookie(key);
  }
  return typeof store === 'object' ? get(store, key) : null;
}

export function getLoginDate(timestamp) {
  let newDate = new Date();
  if (timestamp) newDate.setTime(timestamp);
  const temp = newDate.toDateString().split(' ');
  return temp[1] + ' ' + temp[2] + ' at ' + newDate.toLocaleTimeString('en-US');
}
