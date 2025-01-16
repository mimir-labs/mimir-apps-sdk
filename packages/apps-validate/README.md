# @mimirdev/apps-validate

validate call for mimir apps.

## Usage

Installation -

```
yarn add @mimirdev/apps-validate
```

Functions can be imported as follows:

```ts
import { checkCall, checkCallAsync } from '@mimirdev/apps-validate';
```

## checkCall

```ts
checkCall(api: ApiPromise, multisigCall: Call | IMethod, expectCall: Call | IMethod): boolean;
```

## checkCallAsync

```ts
checkCallAsync(api: ApiPromise, multisigCall: Call | IMethod, expectCall: Call | IMethod): Promise<boolean>;
```
