import _, { get, filter, set } from 'lodash';
import day from 'dayjs';

export function formatTime(ts, format = 'YYYY/MM/DD') {
  const parsedTs = day(ts);
  if (!parsedTs.isValid()) {
    throw Error('invalid time: ', ts);
  }
  return parsedTs.format(format);
}

export function getScrollTop() {
  return window.pageYOffset !== undefined
    ? window.pageYOffset
    : (document.documentElement || document.body.parentNode || document.body).scrollTop;
}

export function getScrollBottom() {
  const bodyHeight = document.body.clientHeight;
  const docHeight = document.documentElement.clientHeight;
  return bodyHeight - docHeight - getScrollTop();
}

export function setCookie(name, value, time) {
  const expires = time ? time : 2 * 24 * 60 * 60 * 1000;
  const exp = new Date();
  exp.setTime(exp.getTime() + expires);
  document.cookie =
    name + '=' + encodeURIComponent(value) + ';expires=' + exp.toGMTString() + ';path=/;';
}

export function getCookie(name) {
  let re = new RegExp(name + '=([^;]+)');
  let value = re.exec(document.cookie);
  return value !== null ? decodeURIComponent(value[1]) : null;
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

export function getLoginDate(timestamp = Date.now(), locale = 'en') {
  let ts = day(parseInt(timestamp));
  if (locale === 'en') {
    return `${ts.format('MMM DD')} at ${ts.format('H:mm:ss A')}`;
  }
  if (locale === 'zh' || locale === 'zh-cn') {
    let am = ts.format('a') === 'am' ? '上午' : '下午';
    return `${ts.format('M月D日')} ${am} ${ts.format('HH:mm:ss')}`;
  }
}

export function getFormData(form) {
  const data = {};
  const fd = new FormData(form);
  for (let p of fd.entries()) {
    data[p[0]] = p[1];
  }

  return data;
}

export function getObjName(datas, key, value, name) {
  return get(filter(datas, { [key]: value })[0], name, '');
}
export function getFilterObjs(datas, key, value) {
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
  results = _.sortBy(results, function(o) {
    return o.number;
  });
  return results.slice(-5).reverse();
}

export function getHistograms(histograms) {
  let now = new Date();
  let nowTime = now.getTime();
  let time,
    date,
    dateStr,
    number = 0,
    twoWeekDays = [];
  for (let i = 0; i < 14; i++) {
    number = 0;
    time = nowTime - i * 24 * 3600 * 1000;
    date = new Date(time);
    dateStr = `${date.getFullYear()}-${`0${date.getMonth() + 1}`.slice(
      -2
    )}-${`0${date.getDate()}`.slice(-2)}`;
    _.forIn(histograms, (value, key) => {
      if (dateStr === key) {
        number = value;
      }
    });
    twoWeekDays.push({
      date: dateStr,
      number: number
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
        key = key.replace(/\./g, '>>>>>>'); //fix key contains '.'
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
  let results = [];
  _.forIn(yamlObj, (value, key) => {
    results.push({
      name: key,
      value: value
    });
  });
  return results;
}

// get url param by name
export function getUrlParam(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  const result = window.location.search.substr(1).match(reg);
  if (result !== null) {
    return decodeURIComponent(result[2]);
  } else {
    return '';
  }
}

// app page status translate maybe different with other pages
const statusTransMap = {
  Active: 'Published',
  Suspended: 'Recalled',
  active: 'published',
  suspended: 'recalled'
};

export function mappingStatus(status) {
  const lang = getCookie('lang');
  if (lang === 'zh') {
    return statusTransMap[status] || status;
  }
  return status;
}
