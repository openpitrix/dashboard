const fs = require('fs');
const wp = require('@cypress/webpack-preprocessor');

module.exports = on => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  // const options = {
  //   webpackOptions: require('../../webpack.dev.js'),
  // };
  on('file:preprocessor', wp());
  on('task', {
    isFixtureExisted(filePath) {
      return fs.existsSync(filePath);
    }
  });
};
