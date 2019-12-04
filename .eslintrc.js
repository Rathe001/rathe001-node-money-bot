module.exports = {
  env: {
    browser: true,
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src', './'],
      },
    },
    react: {
      version: 'latest',
    },
  },    
  extends: ['airbnb', 'prettier', 'prettier/react'],
  parser: 'babel-eslint',
  plugins: ['prettier', 'sort-destructure-keys', 'sort-keys-fix'],
  rules: {
    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'import/extensions': 'off',
    'no-nested-ternary': ['error'],
    'react/destructuring-assignment': 'off',
    'import/no-named-as-default': 'off',
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'all',
        singleQuote: true,
        printWidth: 100,
      },
    ],
    'sort-destructure-keys/sort-destructure-keys': 2,
    'sort-keys-fix/sort-keys-fix': 2,
  },
  overrides: [
    {
      files: ['.spec.jsx', '.spec.js'],
      env: { jest: true },
    },
    {
      files: ['.storybook/**', '*/stories/*'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'react/jsx-filename-extension': 0,
      },
    },
  ],
};