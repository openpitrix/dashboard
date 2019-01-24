import _, { get, filter, set } from 'lodash';
import day from 'dayjs';
import { t } from 'i18next';
import { saveAs } from 'file-saver';
import FormSerializer from '@lib/form-serializer';

const formatMap = {
  'YYYY/MM/DD': 'YYYY年MM月DD日',
  'YYYY/MM/DD HH:mm:ss': 'YYYY年MM月DD日 HH:mm:ss'
};

export function formatTime(time, format = 'YYYY/MM/DD') {
  time = time || new Date();
  if (getCookie('lang') === 'zh') {
    format = formatMap[format] || format;
  }

  const parsedTs = day(time);
  if (!parsedTs.isValid()) {
    throw Error(`invalid time: ${time}`);
  }
  return parsedTs.format(format);
}

export function getScrollTop() {
  return window.pageYOffset !== undefined
    ? window.pageYOffset
    : (document.documentElement || document.body.parentNode || document.body)
      .scrollTop;
}

export function getScrollBottom() {
  const bodyHeight = document.body.clientHeight;
  const docHeight = document.documentElement.clientHeight;
  return bodyHeight - docHeight - getScrollTop();
}

export function setCookie(name, value, time) {
  let dt;
  if (time instanceof Date) {
    dt = time;
  } else {
    const expires = time ? parseInt(time) : 2 * 24 * 60 * 60 * 1000; // 2 days
    dt = new Date(Date.now() + expires);
  }

  document.cookie = `${name}=${encodeURIComponent(
    value
  )};expires=${dt.toGMTString()};path=/;`;
}

export function getCookie(name) {
  const cookieMap = _.fromPairs(
    document.cookie.split(';').map(item => item.trim().split('='))
  );
  if (cookieMap[name]) {
    return decodeURIComponent(cookieMap[name]);
  }
  return null;
}

export function getPastTime(time) {
  const now = new Date();
  const date = new Date(time);
  const diff = (now.getTime() - date.getTime()) / (60 * 60 * 1000);
  return diff / 24 > 1
    ? `${parseInt(diff / 24)} ${t('days ago')}`
    : `${parseInt(diff)} ${t('hours ago')}`;
}

export const qs2Obj = (str = location.search) => {
  if (str.startsWith('?')) {
    str = str.substring(1);
  }

  return str
    .split('&')
    .filter(Boolean)
    .map(p => p.split('='))
    .reduce(
      (obj, [key, value]) => ({ ...obj, [key]: decodeURIComponent(value) }),
      {}
    );
};

export const obj2Qs = (params = {}) => Object.keys(params)
  .map(k => {
    const name = encodeURIComponent(k);
    if (Array.isArray(params[k])) {
      return params[k]
        .map(val => `${name}[]=${encodeURIComponent(val)}`)
        .join('&');
    }
    return `${name}=${encodeURIComponent(params[k])}`;
  })
  .join('&');

// isomorphic: get session info from server ctx or client cookie
export function getSessInfo(key, store) {
  if (typeof window !== 'undefined') {
    return getCookie(key);
  }
  return typeof store === 'object' ? get(store, key) : null;
}

export function getLoginDate(timestamp = Date.now(), locale = 'zh') {
  const time = day(parseInt(timestamp));
  if (locale === 'en') {
    return `${time.format('MMM DD')} at ${time.format('H:mm:ss A')}`;
  }
  if (locale === 'zh' || locale === 'zh-cn') {
    const am = time.format('a') === 'am' ? '上午' : '下午';
    return `${time.format('M月D日')} ${am} ${time.format('HH:mm:ss')}`;
  }
}

export function getFormData(form) {
  // if browser support FormData, apply it first
  if (window.FormData && FormData.prototype.entries) {
    const data = {};
    const fd = new FormData(form);
    for (const p of fd.entries()) {
      data[p[0]] = p[1];
    }
    return data;
  }
  // polyfill FormData entries
  const serializer = new FormSerializer(form);
  return serializer.toJson();
}

export function getObjName(datas, key, value, name) {
  return get(filter(datas, { [key]: value })[0], name, '');
}

export function getFilterObj(datas, key, value) {
  const result = datas.filter(data => data[key] === value);
  return result[0] || {};
}

export function getStasTotal(obj) {
  let total = 0;
  _.forIn(obj, value => {
    total += value;
  });
  return total;
}

export function getTopTotal(topList) {
  let total = 0;
  for (let i = 0; i < topList.length; i++) {
    total += topList[i].number;
  }
  return total;
}

export function getProgress(progress) {
  let results = [];
  _.forIn(progress, (value, key) => {
    results.push({
      id: key,
      number: value
    });
  });
  results = _.sortBy(results, o => o.number);
  return results.slice(-5).reverse();
}

export function getHistograms(histograms = {}) {
  const nowTime = Date.now();
  const twoWeekDays = [];

  for (let i = 0; i < 14; i++) {
    const time = nowTime - i * 24 * 3600 * 1000;
    const date = new Date(time);
    const dateStr = `${date.getFullYear()}-${`0${date.getMonth() + 1}`.slice(
      -2
    )}-${`0${date.getDate()}`.slice(-2)}`;

    twoWeekDays.unshift({
      date: dateStr,
      number: histograms[dateStr] || 0
    });
  }
  return twoWeekDays;
}

export function flattenObject(obj) {
  const result = {};

  function recurse(cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
      return;
    }
    if (Array.isArray(cur)) {
      cur.forEach((item, index) => recurse(item, `${prop}[${index}]`));
    } else {
      Object.entries(cur).forEach(([key, value]) => {
        key = key.replace(/\./g, '>>>>>>'); // fix key contains '.'
        recurse(value, prop ? `${prop}.${key}` : key);
      });
    }
  }

  recurse(obj, '');
  return result;
}

export function unflattenObject(data) {
  if (Object(data) !== data || Array.isArray(data)) {
    return data;
  }

  const result = {};
  Object.entries(data).forEach(([key, value]) => set(result, key, value));
  return result;
}

export function getYamlList(yamlObj) {
  const results = [];
  _.forIn(yamlObj, (value, key) => {
    results.push({
      name: key,
      value
    });
  });
  return results;
}

// get url param by name
export function getUrlParam(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  const result = window.location.search.substr(1).match(reg);
  if (result !== null) {
    return decodeURIComponent(result[2]);
  }
  return '';
}

// app page status translate maybe different with other pages
const statusTransMap = {
  Active: 'Published',
  Suspended: 'Recalled',
  Suspend: 'Recall',
  active: 'published',
  suspended: 'recalled',
  suspend: 'Recall'
};

export function mappingStatus(status) {
  const lang = getCookie('lang');
  if (lang === 'zh') {
    return statusTransMap[status] || status;
  }
  return status;
}

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * check if app provider is helm, or query string type is helm
 * @param type
 */
export const isHelm = type => ['kubernetes', 'helm', 'k8s'].includes(`${type}`.toLowerCase());

export const makeArray = val => {
  if (!Array.isArray(val)) {
    return [val];
  }
  return val;
};

export const downloadFileFromBase64 = (base64_str = '', filename) => {
  // Convert the Base64 string back to text.
  const byteString = atob(base64_str);

  // Convert that text into a byte array.
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([ia], { type: 'application/tar+gzip' });

  saveAs(blob, `${filename}.tgz`);

  // Alternatively, you could redirect to the blob to open it in the browser.
  // document.location.href = window.URL.createObjectURL(blob);
};
