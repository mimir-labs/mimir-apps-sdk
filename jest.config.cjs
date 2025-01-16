// Copyright 2021-2023 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

const config = require('@mimirdev/dev/config/jest.cjs');

module.exports = Object.assign({}, config, {
  moduleNameMapper: {
    '@mimirdev/apps-inject(.*)$': '<rootDir>/packages/apps-inject/src/$1',
    '@mimirdev/apps-sdk(.*)$': '<rootDir>/packages/apps-sdk/src/$1',
    '@mimirdev/apps-transports(.*)$': '<rootDir>/packages/apps-transports/src/$1',
    '@mimirdev/apps-validate(.*)$': '<rootDir>/packages/apps-validate/src/$1',
  },
  testTimeout: 30000
});
