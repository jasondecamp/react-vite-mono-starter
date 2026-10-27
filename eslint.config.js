import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import storybook from 'eslint-plugin-storybook'
import { defineConfig, globalIgnores } from 'eslint/config'

// One config for every package in the monorepo. Scope package-specific rules with `files`.
export default defineConfig([
  globalIgnores(['**/dist', '**/storybook-static', '**/coverage']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    // Component modules should only export components, so Fast Refresh (HMR) keeps state.
    files: ['packages/{app,ui}/src/**/*.jsx'],
    ignores: ['**/*.stories.jsx', '**/*.test.jsx'],
    extends: [reactRefresh.configs.vite],
  },
  {
    // Config files run in Node.
    files: ['*.config.js', 'packages/*/*.config.js', 'packages/*/.storybook/*.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
  storybook.configs['flat/recommended'],
])
