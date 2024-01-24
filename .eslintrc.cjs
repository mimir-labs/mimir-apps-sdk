// Copyright 2021-2023 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

const base = require('@mimirdev/dev/config/eslint.cjs');

module.exports = {
  ...base,
  ignorePatterns: [
    ...base.ignorePatterns,
    'scripts/**/*',
    'utility/wasm-asm/src/index.js',
    'utility/wasm/src/index.js'
  ],
  parserOptions: {
    ...base.parserOptions,
    project: [
      './tsconfig.eslint.json'
    ]
  },
  rules: {
    ...base.rules
  }
};
