# @mimirdev/papi-signer

A Polkadot API (PAPI) signer implementation for Mimir Wallet that provides signing capabilities and account management functionality.

## Installation

```bash
# Using yarn
yarn add @mimirdev/papi-signer

# Using npm
npm install @mimirdev/papi-signer
```

## Dependencies

This package has the following peer dependencies:

- `@polkadot-api/polkadot-signer`
- `@polkadot-api/substrate-bindings`
- `@polkadot-api/utils`

Make sure to install these dependencies in your project.

## Usage

```typescript
import { MimirPAPISigner } from '@mimirdev/papi-signer';

// Create a new instance of MimirPAPISigner
const signer = new MimirPAPISigner();

// Example: Enable the signer for a specific origin
const enableSigner = async () => {
  const { result, authorizedAccounts } = await signer.enable('your-dapp-origin');
  console.log('Signer enabled:', result);
  console.log('Authorized accounts:', authorizedAccounts);
};

// Example: Get available accounts
const getAccounts = async () => {
  const accounts = await signer.getAccounts();
  console.log('Available accounts:', accounts);
};

// Example: Subscribe to account changes
const subscribeToAccounts = () => {
  const unsubscribe = signer.subscribeAccounts((accounts) => {
    console.log('Accounts updated:', accounts);
  });

  // Call unsubscribe() when you want to stop listening to account changes
};

// Example: Get Polkadot signer for a specific address
const getPolkadotSigner = (address: string) => {
  const polkadotSigner = signer.getPolkadotSigner(address);
  return polkadotSigner;
};
```

## API Reference

### MimirPAPISigner Class

#### `enable(origin: string): Promise<{ result: boolean; authorizedAccounts: string[] }>`
Enables the signer for a specific origin/dapp.

#### `getAccounts(): Promise<InjectedAccount[]>`
Returns a list of available accounts.

#### `subscribeAccounts(cb: (accounts: InjectedAccount[]) => void): () => void`
Subscribes to account changes. Returns an unsubscribe function.

#### `getMetadata(): Promise<InjectedMetadataKnown[]>`
Returns the known metadata list.

#### `provideMetadata(definition: MetadataDef): Promise<boolean>`
Provides metadata for the signer.

#### `getPolkadotSigner(address: string): PolkadotSigner`
Returns a Polkadot signer instance for the specified address with the following methods:
- `publicKey`: The public key of the account
- `signBytes(data: Uint8Array): Promise<Uint8Array>`
- `signTx(callData: Uint8Array, signedExtensions: Record<string, {...}>): Promise<Uint8Array>`

## Types

```typescript
interface InjectedAccount {
  address: string;
  // ... other account properties
}
```

## License

Apache-2.0
