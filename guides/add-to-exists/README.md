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

## inject sdk to your apps

1. The first step is to check if it is opened within an iframe.
```js
const openInIframe = window !== window.parent;
```
2. The second step is to check if it is opened within Mimir's iframe. We provide a function to check.
```js
import { inject, isMimirReady } from '@mimirdev/apps-inject';

const origin = await isMimirReady;

if (!origin) {
  // nothing to do
}

// check is mimir url
if (origin.startsWith('https://app.mimir.global') || origin.startsWith('https://dev.mimir.global')) {
  // inject to window.injectedWeb3.mimir
  inject();
  // now. you can use polkadot extension functions
}
```

## Retrieve the multisig account.

Mimir has implemented the same interface as [polkadot-js/extension](https://github.com/polkadot-js/extension), allowing you to obtain mutisig accounts just like using other plugin wallets.

**use polkadotjs sdk:**
```js
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

const injected = await web3Enable('your app name');

const accounts = await web3Accounts();
```

## Sign and send transactions.

Since Mimir's account is a multisig account, `extrinsics` signed by Mimir go through at least one layer of `AsMulti` wrapping. Therefore, special handling is required for the original transaction after signing with Mimir.

```js
import { web3FromSource } from '@polkadot/extension-dapp';

const pair = keyring.getPair(address);
const { meta: { accountOffset, addressOffset, isExternal, isHardware, isInjected, isProxied, source } } = pair;

const injected = await web3FromSource(source);

assert(injected, `Unable to find a signer for ${address}`);

const isMimir = injected.name === 'mimir'

let tx = api.tx.balances.transferKeepAlive();

// ⚠️Note that the following logic will only be executed when injected.name === 'mimir'.
if (isMimir) {
    const result: any = await injected.signer.signPayload({
      address: address,
      method: tx.method.toHex()
    } as unknown as any);

    // Retrieve the method returned by Mimir.
    const method = api.registry.createType('Call', result.payload.method);

    // Reconstruct a new tx.
    tx = api.tx[method.section][method.method](...method.args);

    // add signature to tx
    tx.addSignature(result.signer, result.signature, result.payload);
}

tx.send();
```
