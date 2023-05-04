module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': ['error'],
    'no-console': 'off',
    'import/extensions': 0,
    'consistent-return': 'off',
    'no-param-reassign': 'off',
    'object-curly-newline': 'off',
    // 'linebreak-style': 'off',
  },
  globals: {
    describe: true,
    it: true,
    // add other globals here as needed
  },
};
