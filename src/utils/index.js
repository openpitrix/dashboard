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
