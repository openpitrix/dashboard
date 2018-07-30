const fs = require('fs');
const path = require('path');

function WriteHash() {}

WriteHash.prototype.apply = function(compiler) {
  // webpack v4: compiler.hooks[stage].tap
  // webpack v3: compiler.plugin([stage])
  compiler.hooks.done.tap('WriteHashPlugin', function(stats) {
    const buildHash = stats.hash;
    const outputFile = path.resolve(compiler.options.output.path, 'build-hash.json');

    console.log(`\nwrite build ${buildHash} to file: ${outputFile}`);
    fs.writeFileSync(outputFile, JSON.stringify({ hash: buildHash }, null, 2), 'utf8');
  });
};

module.exports = WriteHash;
