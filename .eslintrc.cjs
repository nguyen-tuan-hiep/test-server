module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'import/extensions': 0,
    'consistent-return': 0,
    // 'object-curly-spacing': 'off',
    'object-curly-newline': 'off',
    'no-console': 'off',
    'no-param-reassign': 'off',
  },
  globals: {
    describe: true,

    it: true, // add other globals here as needed
  },
};
