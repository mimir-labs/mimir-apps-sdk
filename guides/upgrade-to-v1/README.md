# Update from v0.x to v1


Please ensure update mimir-sdk to `@mimirdev/apps-inject@1.0.1` `@mimirdev/apps-sdk@1.0.1`

**Replace the `checkCall` function to `checkCallAsync`**

```diff
- import { checkCall } from './checkCall';
+ import { checkCallAsync } from './checkCall';


- if (!checkCall(api, method, tx.method)) {
+ if (!(await checkCallAsync(api, method, result.payload.address as string, tx.method, address))) {
  throw new Error('not an safe method')
}
```
