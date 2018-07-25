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

export function imgPlaceholder(size = 24) {
  return `http://via.placeholder.com/${size}x${size}`;
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
  let results = [],
    i = 1;
  _.forIn(progress, (value, key) => {
    if (i > 5) {
      return null;
    }
    results.push({
      id: key,
      number: value
    });
    i++;
  });
  return results;
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
