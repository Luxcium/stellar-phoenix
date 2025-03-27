import js from '@eslint/js';
import * as tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  ...tseslint.config({
    files: ['src/**/*.ts'], // , do not include 'tests/**/*.ts' for the time being.
    languageOptions: {
      parser: tseslint.parser,
      sourceType: 'module',
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
    plugins: {
      '@stylistic': stylistic,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      '@stylistic/indent': ['error', 2],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-redeclare': 'off',
    },
  }),
];
