// For IE 11
if (typeof Promise === 'undefined') {
  global.Promise = require('promise-polyfill');
}
