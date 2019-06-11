const fs = require('fs');
const wp = require('@cypress/webpack-preprocessor');

module.exports = on => {
  on('file:preprocessor', wp());
  on('task', {
    isFixtureExisted(filePath) {
      return fs.existsSync(filePath);
    }
  });
};
