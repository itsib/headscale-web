import js from '@eslint/js'
import globals from 'globals'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'dev-dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      '@typescript-eslint/no-namespace': ['off'],
      '@typescript-eslint/no-explicit-any': ['off'],
      'react-refresh/only-export-components': ['off'],
      'no-async-promise-executor': ['off'],
      '@typescript-eslint/no-empty-object-type': ['warn', { allowInterfaces: 'always' }],
    },
  },
)
