// Copyright 2021-2023 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

const config = require('@mimirdev/dev/config/jest.cjs');

module.exports = Object.assign({}, config, {
  moduleNameMapper: {
    '@mimirdev/cross(.*)$': '<rootDir>/utility/cross/src/node',
    '@mimirdev/crypto(.*)$': '<rootDir>/utility/crypto/src/$1',
    '@mimirdev/keyring(.*)$': '<rootDir>/utility/keyring/src/$1',
    '@mimirdev/miden(.*)$': '<rootDir>/utility/miden/src/$1',
    '@mimirdev/wasm-asm(.*)$': '<rootDir>/utility/wasm-asm/src/$1',
    '@mimirdev/wasm-bridge(.*)$': '<rootDir>/utility/wasm-bridge/src/$1',
    '@mimirdev/wasm(.*)$': '<rootDir>/utility/wasm/src/$1',
    '@mimirdev/ctype(.*)$': '<rootDir>/protocol/ctype/src/$1',
    '@mimirdev/did-resolver(.*)$': '<rootDir>/protocol/did-resolver/src/$1',
    '@mimirdev/did(.*)$': '<rootDir>/protocol/did/src/$1',
    '@mimirdev/vc(.*)$': '<rootDir>/protocol/vc/src/$1',
    '@mimirdev/message(.*)$': '<rootDir>/packages/message/src/$1',
    '@mimirdev/verify(.*)$': '<rootDir>/packages/verify/src/$1',
    'test-support(.*)$': '<rootDir>/test-support/src/$1'
  },
  testTimeout: 30000
});
