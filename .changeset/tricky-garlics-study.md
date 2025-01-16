---
"@mimirdev/apps-inject": major
"@mimirdev/apps-sdk": major
"@mimirdev/apps-transports": major
"@mimirdev/apps-validate": major
---

Remove polkadotjs dependencies for better compatibility and reduce bundle size. This is a breaking change that:

- Removes @polkadot/api dependency
- Removes @polkadot/util-crypto dependency
- Simplifies the core functionality
- Reduces package size
- Improves compatibility with different environments
