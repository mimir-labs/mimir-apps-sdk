[![Logo](./assets/logo.svg)](https://app.mimir.global/)

[![mimir-apps-sdk](https://img.shields.io/badge/mimir-sdk-cornflowerblue?style=flat-square)](./packages/apps-sdk)
[![mimir-apps-inject](https://img.shields.io/badge/mimir-inject-deeppink?style=flat-square)](./packages/apps-inject)
[![license](https://img.shields.io/badge/License-Apache%202.0-blue?logo=apache&style=flat-square)](./LICENSE)

# mimir-apps-sdk

This SDK enables seamless integration between third-party applications and Mimir Wallet (https://app.mimir.global/).

The SDK maintains high compatibility with [polkadot-js/extension](https://github.com/polkadot-js/extension) methods, making it straightforward to integrate into existing applications.

## Introduction

The Mimir Apps SDK provides a robust solution for integrating third-party applications with the Mimir Wallet. It offers high compatibility with the `polkadot-js/extension`, allowing developers to leverage existing methods and seamlessly integrate with Mimir's multisig features.

## Installation

To install the SDK, you can use either `yarn` or `npm`:

### Using Yarn
```shell
yarn add @mimirdev/apps-inject @mimirdev/apps-sdk
```

### Using NPM
```shell
npm install @mimirdev/apps-inject @mimirdev/apps-sdk
```

## Usage

### Injecting the SDK
To inject the SDK into your application, ensure it is opened within Mimir's iframe. Use the following code snippet:

```js
import { inject, isMimirReady, MIMIR_REGEXP } from '@mimirdev/apps-inject';

const origin = await isMimirReady();

if (MIMIR_REGEXP.test(origin)) {
  inject();
  // Now you can use polkadot extension functions
}
```

## Security Considerations

When using Mimir's multisig feature, ensure that transactions are verified for safety. Mimir wraps transactions in `AsMulti`, so it's crucial to confirm that the wrapped transaction matches the expected transaction. Mimir's code is open source, ensuring transparency and security.

## Overview

| Package | Stable | Beta | Size |
|---------|--------|------|------|
|  [`@mimirdev/apps-sdk`](packages/apps-sdk) | [![npm](https://img.shields.io/npm/v/@mimirdev/apps-sdk)](https://www.npmjs.com/package/@mimirdev/apps-sdk) | [![beta](https://img.shields.io/npm/v/@mimirdev/apps-sdk/beta)](https://www.npmjs.com/package/@mimirdev/apps-sdk) | [![minzip](https://img.shields.io/bundlephobia/minzip/@mimirdev/apps-sdk)](https://bundlephobia.com/result?p=@mimirdev/apps-sdk) |
|  [`@mimirdev/apps-inject`](packages/apps-inject) | [![npm](https://img.shields.io/npm/v/@mimirdev/apps-inject)](https://www.npmjs.com/package/@mimirdev/apps-inject) | [![beta](https://img.shields.io/npm/v/@mimirdev/apps-inject/beta)](https://www.npmjs.com/package/@mimirdev/apps-inject) | [![minzip](https://img.shields.io/bundlephobia/minzip/@mimirdev/apps-inject)](https://bundlephobia.com/result?p=@mimirdev/apps-inject) |

## Contributing

Please refer to our [CONTRIBUTING.md](./CONTRIBUTING.md) guide.

## Getting Started

- [Integrating Mimir SDK into Existing Applications](./guides/add-to-exists)
- [Upgrading to Version v1 for up to date integration with mimir](./guides/upgrade-to-v1)
