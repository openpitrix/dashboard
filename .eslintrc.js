// http://eslint.org/docs/user-guide/configuring
const reactVersion = require('./package.json').dependencies.react;

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      modules: true,
      /*
        prevent:
        ``
        Parsing error: Using the export keyword between a decorator and a class is not allowed.
        Please use `export @dec class` instead.
        ``
       */
      legacyDecorators: true
    }
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    commonjs: true,
    jest: true
  },
  globals: {
    HOSTNAME: true,
    PORT: true
  },
  settings: {
    react: {
      // fix Warning: React version not specified in eslint-plugin-react settings
      // see: https://github.com/yannickcr/eslint-plugin-react/issues/1955
      version: reactVersion
    }
  },
  extends: [
    'airbnb-base',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/warnings'
  ],
  plugins: [
    // 'react'
  ],
  // add your custom rules here
  rules: {
    // basic
    quotes: [
      'error',
      'single',
      {
        allowTemplateLiterals: true,
        avoidEscape: true
      }
    ],
    'prefer-destructuring': 'off',
    'no-restricted-globals': 'warn',
    'no-unexpected-multiline': 'off',
    'no-useless-constructor': 'warn',
    'max-nested-callbacks': ['error', 3],
    'no-multi-assign': 'warn',

    // allow paren-less arrow functions
    'arrow-parens': 'off',

    // import
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/no-dynamic-require': 'warn',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'import/first': 'warn',
    'import/no-duplicates': 'error',

    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'global-require': 'off',
    'no-console': 'off',
    'dot-notation': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'no-unused-expressions': 'off',
    'no-mixed-operators': 'off',
    'no-return-await': 'off',
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
    camelcase: 'off',
    'max-len': [
      'warn',
      {
        code: 100,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
        ignoreTrailingComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignorePattern:
          "^(\\s*[a-zA-Z_]+: '[^']+'[,;]*)|(.*gettext.*)|(.*interpolate.*)|(.*require.*)|(.*_\\.template.*)$"
      }
    ],
    'no-eval': 'warn',
    'no-plusplus': 'off',
    'no-empty': 'off',
    'no-empty-function': 'off',
    'func-names': 'off',
    'consistent-return': 'off',
    'class-methods-use-this': 'off',
    'no-use-before-define': 'off',
    'comma-dangle': 'off',
    'no-unused-vars': 'warn',
    radix: 'off',
    'one-var': 'off',
    'prefer-const': 'warn',
    'no-return-assign': 'warn',

    // react
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/prop-types': 'off', // fixme: off => warn
    'react/sort-comp': 'warn',
    'react/sort-prop-types': 'warn',
    'react/display-name': 'off',
    'react/no-string-refs': 'warn',
    'react/no-find-dom-node': 'warn',
    'react/no-unescaped-entities': ['error', { forbid: ['>', '}'] }]
  }
};
