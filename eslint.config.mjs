// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import jsdoc from 'eslint-plugin-jsdoc';
import tsSortKeys from 'eslint-plugin-typescript-sort-keys';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      'linebreak-style': ['error', 'unix'],
      'max-depth': ['error', 4],
      'object-curly-spacing': ['error', 'always'],
      'prefer-arrow-callback': ['error', { allowUnboundThis: false }],
      'prefer-template': ['error'],
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      'sort-keys': ['error', 'asc'],
      'sort-vars': ['error'],
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
    },
  },

  ...(Array.isArray(jsdoc.configs['flat/recommended-typescript-error'])
    ? jsdoc.configs['flat/recommended-typescript-error']
    : [jsdoc.configs['flat/recommended-typescript-error']]),
  {
    plugins: {
      jsdoc,
    },
    rules: {
      'jsdoc/require-description': [
        'error',
        {
          checkConstructors: false,
          contexts: ['any'],
        },
      ],
      'jsdoc/require-jsdoc': [
        'error',
        {
          checkGetters: false,
          checkSetters: false,
          require: {
            ArrowFunctionExpression: false,
            ClassDeclaration: true,
            ClassExpression: true,
            FunctionDeclaration: true,
            FunctionExpression: true,
            MethodDefinition: true,
          },
        },
      ],
      'jsdoc/require-throws': [
        'error',
        {
          contexts: [
            'ArrowFunctionExpression',
            'ClassDeclaration',
            'ClassExpression',
            'FunctionDeclaration',
            'FunctionExpression',
            'MethodDefinition',
          ],
        },
      ],
    },
  },
  {
    plugins: {
      tsSortKeys,
    },
    rules: {
      'tsSortKeys/interface': [
        'error',
        'asc',
        {
          requiredFirst: true,
        },
      ],
      'tsSortKeys/string-enum': ['error'],
    },
  },
);
