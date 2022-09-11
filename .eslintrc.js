module.exports = {
  env: {
    jest: true,
    node: true,
  },
  extends: ['airbnb-base', 'airbnb-typescript/base', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['no-only-tests'],
  root: true,
  rules: {
    'import/extensions': 0,
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['off'],
    'no-only-tests/no-only-tests': 'error',
  },
  settings: {
    'import/resolver': 'node',
  },
};

// module.exports = {
//   env: {
//     jest: true,
//     node: true,
//   },
//   extends: [
//     'eslint:recommended',
//     'plugin:@typescript-eslint/eslint-recommended',
//     'plugin:@typescript-eslint/recommended',
//     'airbnb-base',
//   ],
//   parser: '@typescript-eslint/parser',
//   plugins: [
//     '@typescript-eslint',
//   ],
//   root: true,
//   rules: {
//     'no-use-before-define': 0,
//     'import/extensions': [
//       'error',
//       'ignorePackages',
//       {
//         ts: 'never',
//       },
//     ],
//   },
//   settings: {
//     'import/resolver': {
//       typescript: {
//         alwaysTryTypes: true,
//       },
//     },
//   },
// };