# add to existing apps

To integrate the apps with Mimir, it needs to be opened within Mimir's built-in web page (iframe) and requires the use of Mimir's injected library to inject Mimir's account. Therefore, for the apps, Mimir's multisig account can be used in the same way as the accounts in the extension wallet, such as [polkadot-js/extension](https://github.com/polkadot-js/extension).

## Introduction

Integrating your application with Mimir requires it to be opened within Mimir's built-in web page (iframe) and utilize Mimir's injected library to access Mimir's account. This integration allows your application to use Mimir's multisig account similarly to accounts in the extension wallet, such as [polkadot-js/extension](https://github.com/polkadot-js/extension).

## Installation

To integrate Mimir into your application, install the necessary packages using either `yarn`, `pnpm` or `npm`:

### Using Yarn
```shell
yarn add @mimirdev/apps-inject
```

### Using NPM
```shell
npm install @mimirdev/apps-inject
```

### Using PNPM
```shell
pnpm add @mimirdev/apps-inject
```

## Integration For PAPI

### 1. Inject SDK into Your Application

Substrate-based wallets inject an object into `window.injectedWeb3` for interaction. Mimir follows this approach but uses an iframe, so direct injection into the window object isn't possible. Instead, use the provided npm package for injection.

#### Check if Opened in an Iframe
First, determine if the application is opened within an iframe:
```js
const openInIframe = window !== window.parent;
```

#### Check if Opened in Mimir's Iframe
Use the following function to check if the application is opened within Mimir's iframe:
```js
import { inject, isMimirReady, MIMIR_REGEXP } from '@mimirdev/apps-inject';

const origin = await isMimirReady();

if (!origin) {
  // Not opened in Mimir
  return;
}

// Verify if the URL matches Mimir's pattern
if (MIMIR_REGEXP.test(origin)) {
  // Inject Mimir into window.injectedWeb3
  inject();
  // Now you can use polkadot extension functions
}
```

### 2. Retrieve the pjs-signer

You can easily get the polkadotSigner from the extension, similar to how it's done in the [PAPI documentation](https://papi.how/signers#from-a-browser-extension)

```js
import {
  getInjectedExtensions,
  connectInjectedExtension,
} from "polkadot-api/pjs-signer"

// Connect to an extension
const selectedExtension: InjectedExtension = await connectInjectedExtension('mimir')

// Get accounts registered in the extension
const accounts: InjectedPolkadotAccount[] = selectedExtension.getAccounts()

// The signer for each account is in the `polkadotSigner` property of `InjectedPolkadotAccount`
const polkadotSigner = accounts[0].polkadotSigner
```

### 3. Sign and Send Transactions

Once you have the polkadotSigner, you can use it to sign and send transactions. Here's an example using PAPI (version >= 0.9.1):

> **Note**: For PAPI versions below 0.9.1, Mimir cannot be used to send transactions. Please upgrade to PAPI version 0.9.1 or higher to use Mimir's transaction signing capabilities. Also, please read [this PR](https://github.com/polkadot-js/api/pull/5920) for important changes to the transaction signing process.

Here's an example using PAPI version 0.9.1 or higher:


```js
import { createClient } from "polkadot-api"
import { wnd } from "@polkadot-api/descriptors"
import { chainSpec } from "polkadot-api/chains/westend2"
import { getSmProvider } from "polkadot-api/sm-provider"
import { start } from "polkadot-api/smoldot"

// create the client with smoldot
const smoldot = start()
const client = createClient(getSmProvider(smoldot.addChain({ chainSpec })))

// get the safely typed API
const api = client.getTypedApi(wnd)

// create the transaction sending some assets
const transfer = api.tx.Balances.transfer_allow_death({
  dest: 'dest address',
  value: 12345n,
})

// sign and submit the transaction while looking at the
transfer.signAndSubmit(polkadotSigner);
```

## Integration For PolkadotJs

Follow these steps to integrate your application with Mimir:

### 1. Inject SDK into Your Application

Substrate-based wallets inject an object into `window.injectedWeb3` for interaction. Mimir follows this approach but uses an iframe, so direct injection into the window object isn't possible. Instead, use the provided npm package for injection.

#### Check if Opened in an Iframe
First, determine if the application is opened within an iframe:
```js
const openInIframe = window !== window.parent;
```

#### Check if Opened in Mimir's Iframe
Use the following function to check if the application is opened within Mimir's iframe:
```js
import { inject, isMimirReady, MIMIR_REGEXP } from '@mimirdev/apps-inject';

const origin = await isMimirReady();

if (!origin) {
  // Not opened in Mimir
  return;
}

// Verify if the URL matches Mimir's pattern
if (MIMIR_REGEXP.test(origin)) {
  // Inject Mimir into window.injectedWeb3
  inject();
  // Now you can use polkadot extension functions
}
```

### 2. Retrieve the Multisig Account

Mimir implements the same interface as [polkadot-js/extension](https://github.com/polkadot-js/extension), allowing you to obtain multisig accounts similarly to other plugin wallets.

#### Example Code
Use the following code snippet to obtain the multisig account:
```js
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

const injected = await web3Enable('your app name');
const accounts = await web3Accounts();
```

### 3. Sign and Send Transactions

To send a `transferKeepAlive` transaction using Mimir's multisig account, follow these steps:

#### Example Code (for @polkadot/api >= v15.0.1)
```js
import { web3FromSource } from '@polkadot/extension-dapp';
import { checkCallAsync } from '@mimirdev/apps-sdk';

// ... existing code ...

const injected = await web3FromSource(source);

assert(injected, `Unable to find a signer for ${address}`);

const isMimir = injected.name === 'mimir'

let tx = api.tx.balances.transferKeepAlive();

// ⚠️Note withSignedTransaction is required
tx.signAndSend(injected.signer, { signer: injected.signer, withSignedTransaction: true }, (results) => {
  console.log(results);
});
```

**Important:** Please be aware that the following approach is not compatible with Mimir integration, as `polkadotjs` maintains the original extrinsic structure during the `signAsync` process rather than replacing it with the multisig-wrapped version:
```js
await tx.signAsync(injected.signer, { signer: injected.signer, withSignedTransaction: true })
await tx.send
```

#### Example Code (for @polkadot/api < v15.0.1)
```js
import { web3FromSource } from '@polkadot/extension-dapp';
import { checkCallAsync } from '@mimirdev/apps-validate';

// ... existing code ...

const injected = await web3FromSource(source);

assert(injected, `Unable to find a signer for ${address}`);

const isMimir = injected.name === 'mimir'

let tx = api.tx.balances.transferKeepAlive();

// ⚠️Note that the following logic will only be executed when injected.name === 'mimir'.
if (isMimir) {
  const result = await injected.signer.signPayload({
    address: address,
    method: tx.method.toHex(),
    genesisHash: api.genesisHash.toHex()
  });

  // Retrieve the method returned by Mimir.
  const method = api.registry.createType('Call', result.payload.method);

  // check the original transaction's call, after being wrapped by `AsMulti`, is matches the tx call
  // `address` is get from mimir wallet
  // ⚠️Note: this is not required if you trust mimir
  if (!(await checkCallAsync(api, method, result.payload.address, tx.method, address))) {
    throw new Error('not safe tx');
  }

  // Reconstruct a new tx.
  tx = api.tx[method.section][method.method](...method.args);

  // add signature to tx
  tx.addSignature(result.signer, result.signature, result.payload);
}

tx.send();
```

### Security Considerations

Ensure that transactions are verified for safety. Mimir wraps transactions in `AsMulti`, so it's crucial to confirm that the wrapped transaction matches the expected transaction. Mimir's code is open source, ensuring transparency and security.
