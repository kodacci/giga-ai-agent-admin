import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginReactQuery from '@tanstack/eslint-plugin-query'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['eslint.config.mjs', 'dist/*']
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]
  },
  {
    files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}
  },
  {
    languageOptions: { globals: globals.browser }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    rules: pluginReactHooks.configs.recommended.rules,
    ignores: ['*.test.tsx'],
  },
  ...pluginReactQuery.configs['flat/recommended'],
  prettierRecommended,
  {
    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { args: 'after-used', argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'error',
      curly: 'error',
      'prefer-const': 'error',
      '@typescript-eslint/prefer-readonly': 'error'
    },
  },
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]
