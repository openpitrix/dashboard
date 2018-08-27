/*
 @see: http://marionebl.github.io/commitlint/#/reference-rules

 Level [0..2]: 0 disables the rule. For 1 it will be considered a warning for 2 an error.
 Applicable always|never: never inverts the rule.
 Value: value to use for this rule.

 ```
 <type>[optional scope]: <description>

 [optional body]

 [optional footer]
 ```
 */

const SUBJECT_MAX_LEN = 50;
const BODY_MAX_LEN = 72;
const FOOTER_MAX_LEN = 72;

// todo: missing rules like: `body-leading-case`, `footer-leading-case`

module.exports = {
  rules: {
    // subject
    'subject-case': [
      2,
      'always',
      [
        // 'lower-case', // default
        'sentence-case' // Sentence case
      ]
    ],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'], // never end with period
    'subject-max-length': [2, 'always', SUBJECT_MAX_LEN],

    // type
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      // todo: need discuss
      ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test']
    ],

    // scope
    'scope-empty': [1, 'never'],
    'scope-case': [2, 'always', 'lower-case'], // value same as `type-case`

    // body
    'body-leading-blank': [2, 'always'],
    'body-max-length': [2, 'always', BODY_MAX_LEN],

    // footer
    'footer-leading-blank': [1, 'always'],
    'footer-max-length': [2, 'always', FOOTER_MAX_LEN],
    'references-empty': [1, 'never']
  }
};
