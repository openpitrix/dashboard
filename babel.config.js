module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
          browsers: ['> 1%', 'last 2 versions', 'not ie < 9']
        }
      }
    ],
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          lib: './lib'
        }
      }
    ],
    'lodash',
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true
      }
    ],
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: true
      }
    ],
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-export-default-from'
  ],
  // let babel guess commonjs module, dont treat it as esm
  // see: https://github.com/webpack/webpack/issues/4039
  sourceType: 'unambiguous',
  env: {
    production: {
      plugins: [
        [
          'transform-react-remove-prop-types',
          {
            removeImport: true,
            ignoreFilenames: ['node_modules']
          }
        ]
      ]
    },
    test: {
      plugins: ['dynamic-import-node']
    }
  }
};
