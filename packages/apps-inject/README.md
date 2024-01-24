# @mimirdev/apps-inject

Inject the Mimir Wallet into the `window.injectedWeb3` of apps.

## Usage

Installation -

```
yarn add @mimirdev/apps-inject
```

Functions can be imported as follows:

```js
import { inject, isMimirReady } from '@mimirdev/apps-inject';
```

```js
isMimirReady.then(origin => {
  if (!origin) {
    // not open in mimir

    return;
  }
  // check is "https://app.mimir.global" or "https://dev.mimir.global"
  if (origin.startsWith('https://app.mimir.global') || origin.startsWith('https://dev.mimir.global')) {
    inject();
    // now. you can use polkadot extension functions
  }
})
```
