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
  let value = re.exec(document.cookie); // watch out document not defined in nodejs
  return value !== null ? unescape(value[1]) : null;
}

export function getPastTime(time) {
  const now = new Date();
  const date = new Date(time);
  const diff = (now.getTime() - date.getTime()) / (60 * 60 * 1000);
  return diff / 24 > 1 ? parseInt(diff / 24) + ' days ago' : parseInt(diff) + ' hours ago';
}

export function getLoginUser() {
  return getCookie('user');
}
