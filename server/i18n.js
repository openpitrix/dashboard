// const path=require('path');
const i18n = require('i18next');
// const Backend=require('i18next-node-fs-backend');
const baseConf = require('../config/i18n.config');

i18n
  // .use(Backend)
  .init(
    Object.assign({}, baseConf, {
      // backend: {
      //   jsonIndent: 2,
      //   loadPath: path.resolve('./src/locales/{{lng}}/{{ns}}.json'),
      //   // addPath: path.resolve('./src/locales/{{lng}}/{{ns}}.missing.json')
      // }
    })
  );

module.exports = i18n;
