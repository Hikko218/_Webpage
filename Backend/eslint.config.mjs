// eslint.config.mjs (Config ESM)
import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    files: ['**/*.{js,cjs}'],
    plugins: { js },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.browser,
        process: 'readonly',
        __dirname: 'readonly',
      },
    },
    rules: {
      // Optional: Own Rules
    },
  },
];





