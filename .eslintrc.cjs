module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    'import/extensions': 0,
    'consistent-return': 'off',
    'no-param-reassign': 'off',
    'object-curly-newline': 'off',
    'max-len': 'off',
  },
  globals: {
    describe: true,
    it: true,
    // add other globals here as needed
  },
};
