// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      modules: true
    }
  },
  env: {
    es6: true,
    commonjs: true,
    browser: true,
    jest: true
  },
  extends: [
    'airbnb-base',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings'
  ],
  plugins: ['react'],
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,

    // import
    'import/no-extraneous-dependencies': [2, { devDependencies: true }],
    'import/no-dynamic-require': 1,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'import/prefer-default-export': 0,
    'import/first': 1,

    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'global-require': 0,
    'no-console': 0,
    'dot-notation': 0,
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    'no-unused-expressions': 0,
    'no-mixed-operators': 0,
    'no-return-await': 0,
    'no-restricted-syntax': 0,
    'no-await-in-loop': 0,
    camelcase: 0,
    'max-len': [
      1,
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
    'no-eval': 1,
    'no-plusplus': 0,
    'no-empty': 0,
    'no-empty-function': 0,
    'func-names': 0,
    'consistent-return': 0,
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2,
    'class-methods-use-this': 0,
    'no-use-before-define': 0,
    'comma-dangle': 0,
    'no-unused-vars': 1,
    'react/prop-types': 1,
    'react/sort-comp': 2,
    'react/sort-prop-types': 1,
    'react/display-name': 0,
    radix: 0,
    'one-var': 1,
    'prefer-const': 1
  }
};
