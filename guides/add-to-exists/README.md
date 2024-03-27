# add to existing apps

To integrate the apps with Mimir, it needs to be opened within Mimir's built-in web page (iframe) and requires the use of Mimir's injected library to inject Mimir's account. Therefore, for the apps, Mimir's multisig account can be used in the same way as the accounts in the extension wallet, such as [polkadot-js/extension](https://github.com/polkadot-js/extension).

## Install

use yarn

```shell
yarn add @mimirdev/apps-inject @mimirdev/apps-sdk
```

use npm

```shell
npm install @mimirdev/apps-inject @mimirdev/apps-sdk
```

## Introduction

Firstly, if apps want to integrate with Mimir's multisig feature, they must understand how apps interact with Mimir.

To address this issue, we've adopted a similar approach to Safe Wallet. Apps need to run within Mimir's iframe, and communication between them uses the postMessage API.

Next, we'll complete the integration of apps with Mimir in three steps:


## 1. inject sdk to your apps

As we all know, all Substrate-based wallets inject an object into `window.injectedWeb3`, apps use to interact with the wallet. Mimir follows the same approach. However, due to iframe restrictions, we cannot directly inject objects into the window object. Therefore, we provide an npm package for injection. First, it needs to be determined if the app is opened within an iframe. If it's opened within Mimir's iframe, the inject method can be called to inject the `mimir` object into `window.injectedWeb3`.

1. The first step is to check if it is opened within an iframe.
```js
const openInIframe = window !== window.parent;
```
1. The second step is to check if it is opened within Mimir's iframe. We provide a function to check.
```js
import { inject, isMimirReady, MIMIR_REGEXP } from '@mimirdev/apps-inject';

const origin = await isMimirReady();

if (!origin) {
  // nothing to do
}

// check is mimir url
if (MIMIR_REGEXP.test(origin)) {
  // inject to window.injectedWeb3.mimir
  inject();
  // now. you can use polkadot extension functions
}
```

## 2. Retrieve the multisig account

Mimir has implemented the same interface as [polkadot-js/extension](https://github.com/polkadot-js/extension), allowing you to obtain mutisig accounts just like using other plugin wallets.

Below is a code snippet demonstrating how to obtain the multisig account using polkadot/extension-dapp.

**use polkadotjs sdk:**
```js
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

const injected = await web3Enable('your app name');

const accounts = await web3Accounts();
```

## 3. Sign and send transactions

The following code snippet demonstrates how to send a `transferKeepAlive` transaction using Mimir's multisig account. Apps pass the constructed Call to Mimir in hex string format. Mimir then reconstruct the transaction, which is wrapped in a new transaction by `AsMulti`. Therefore, apps need to use the transaction and signature returned by Mimir to construct a new transaction, and then send it to the chain.

**It's important to note that transactions sent by Mimir are wrapped in `AsMulti`, so apps need to consider security implications. It's crucial to verify if the latest transaction returned by Mimir is reliable. In other words, whether the original transaction, after being wrapped by `AsMulti`, matches the expected transaction of apps.**

**mimir will never tamper with transactions, and all code is open source.**

```js
import { web3FromSource } from '@polkadot/extension-dapp';
import { checkCall } from '@mimirdev/apps-sdk';

const pair = keyring.getPair(address);
const { meta: { accountOffset, addressOffset, isExternal, isHardware, isInjected, isProxied, source } } = pair;

const injected = await web3FromSource(source);

assert(injected, `Unable to find a signer for ${address}`);

const isMimir = injected.name === 'mimir'

let tx = api.tx.balances.transferKeepAlive();

// ⚠️Note that the following logic will only be executed when injected.name === 'mimir'.
if (isMimir) {
    // send to mimir
    const result: any = await injected.signer.signPayload({
      address: address,
      method: tx.method.toHex(),
      genesisHash: api.genesisHash.toHex() // must provide genesisHash
    } as unknown as any);

    // Retrieve the method returned by Mimir.
    const method = api.registry.createType('Call', result.payload.method);

    // check the original transaction's call, after being wrapped by `AsMulti`, is matches the tx call
    if (!checkCall(api, method, tx.method)) {
      throw new Error('not an safe method')
    }

    // Reconstruct a new tx.
    tx = api.tx[method.section][method.method](...method.args);

    // add signature to tx
    tx.addSignature(result.signer, result.signature, result.payload);
}

tx.send();
```
