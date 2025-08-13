import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';
import react from 'eslint-plugin-react';

export default [
  {
    ignores: [
      'apps/backend/dist/**',
      'apps/backend/generated/**',
      'apps/frontend/.next/**',
      'node_modules/**',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: [
          './tsconfig.json',
          './apps/backend/tsconfig.json',
          './apps/frontend/tsconfig.json',
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': ts,
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.e2e-spec.ts'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_|^req|^res|^next' }],
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.e2e-spec.ts'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    files: ['apps/frontend/**/*.tsx'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        React: true, // Explicitly add React global
      },
    },
    plugins: {
      react: react,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'react/react-in-jsx-scope': 'off', // Not needed for Next.js 17+
      'react/jsx-uses-react': 'off', // Not needed for Next.js 17+
    },
  },
  {
    files: ['apps/backend/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  prettierConfig,
];
