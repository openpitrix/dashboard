const fs = require('fs');
const path = require('path');
const wp = require('@cypress/webpack-preprocessor');

module.exports = on => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  // const options = {
  //   webpackOptions: require('../../webpack.dev.js'),
  // };
  on('file:preprocessor', wp());
  on('task', {
    existsFixture(filePath) {
      if (!filePath.startsWith('cypress/fixtures/')) {
        filePath = `cypress/fixtures/${filePath}`;
      }
      if (path.extname(filePath) !== '.json') {
        filePath += '.json';
      }
      return fs.existsSync(filePath);
    }
  });
};
