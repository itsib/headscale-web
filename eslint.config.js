import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'dev-dist', 'src/route-tree.gen.ts'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-namespace': ['off'],
      '@typescript-eslint/no-explicit-any': ['off'],
      'react-refresh/only-export-components': ['off'],
      'no-async-promise-executor': ['off'],
      'no-useless-escape': ['off'],
      '@typescript-eslint/no-empty-object-type': ['warn', { allowInterfaces: 'always' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  }
);
