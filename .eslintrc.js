module.exports = {
  env: {
    browser: true,
    es2020: true
  },
  extends: ['standard-with-typescript', 'eslint:recommended'],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname
  },
  rules: {
    indent: 'off',
    'space-before-function-paren': 'off',
    '@typescript-eslint/space-before-function-paren': 'off'
  }
}
