# @mimirdev/apps-inject

Inject the Mimir Wallet into the `window.injectedWeb3` of apps.

## Usage

Installation -

```
yarn add @mimirdev/apps-inject
```

Functions can be imported as follows:

```js
import { inject, isMimirReady, MIMIR_REGEXP } from '@mimirdev/apps-inject';
```

```js
isMimirReady().then(origin => {
  if (!origin) {
    // not open in mimir

    return;
  }
  // check is "https://app.mimir.global" or "https://dev.mimir.global"
  if (MIMIR_REGEXP.test(origin)) {
    // inject to window.injectedWeb3.mimir
    inject();
    // now. you can use polkadot extension functions
  }
})
```
