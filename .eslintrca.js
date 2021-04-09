module.exports = {
  parserOptions: {
    ecmaVersion: 2017,
  },
  extends: 'google',
  env: {
    node: true,
    es6: false,
  },
  rules: {
    allowArrowFunctions: true,
    'linebreak-style': 0,
  },
};
