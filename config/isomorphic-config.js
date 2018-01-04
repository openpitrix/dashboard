const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');

module.exports = {
  assets:
  {
    styleModules:
    {
      extensions: ['scss'],

      filter(module, regex, options, log) {
        if (options.development) {
          return WebpackIsomorphicToolsPlugin.styleLoaderFilter(module, regex, options, log);
        }
        return regex.test(module.name);
      },

      path(module, options, log) {
        if (options.development) {
          return WebpackIsomorphicToolsPlugin.styleLoaderPathExtractor(module, options, log);
        }
        return module.name;
      },

      parser(module, options, log) {
        if (options.development) {
          return WebpackIsomorphicToolsPlugin.cssModulesLoaderParser(module, options, log);
        }

        return module.source;
      },
    },
  },
};
