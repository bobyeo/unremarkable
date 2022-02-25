module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    semi: 'off',
    'import/extensions': 'off',
    'lines-between-class-members': 'off',
    'import/no-unresolved': 'off',
    'no-unused-expressions': [{ allowShortCircuit: false, allowTernary: true }],
  },
};
