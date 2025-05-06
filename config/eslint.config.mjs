import prettier from 'eslint-plugin-prettier';

// eslint.config.mjs
export default [
  {
    files: ['**/*.js'],
    plugins: {
      prettier,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'prettier/prettier': 'error',
    },
  },
];
