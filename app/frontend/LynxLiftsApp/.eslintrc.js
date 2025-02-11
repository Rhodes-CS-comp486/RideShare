module.exports = {
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  env: {
    browser: true,
    node: true,
    es6: true
  },
};
