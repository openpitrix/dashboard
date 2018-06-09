// For IE 11
if (typeof window !== 'undefined' && !window.Promise) {
  window.Promise = require('promise-polyfill');
}
