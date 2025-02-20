// Copyright 2023-2025 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {
  InjectedAccount,
  InjectedMetadataKnown,
  Message,
  MessageTypes,
  MetadataDef,
  SignerPayloadJSON,
  TransportResponseMessage
} from '@mimirdev/apps-transports';
import type { PolkadotSigner } from '@polkadot-api/polkadot-signer';

import { handleResponse, isValidMessage, sendMessage } from '@mimirdev/apps-sdk';

import { AccountId } from '@polkadot-api/substrate-bindings';
import { fromHex, toHex } from '@polkadot-api/utils';

const accountIdEnc = AccountId().enc;

const getPublicKey = (address: string) => (address.startsWith('0x') ? fromHex(address) : accountIdEnc(address));

export class MimirPAPISigner {
  constructor() {
    // setup a response listener (events created by the loader for parent responses)
    window.addEventListener('message', (message: Message): void => {
      if (isValidMessage(message)) {
        const { data } = message;

        if (data.id) {
          handleResponse(data as TransportResponseMessage<MessageTypes>);
        } else {
          console.error('Missing id for response.');
        }
      }
    });
  }

  public async enable(origin: string): Promise<{ result: boolean; authorizedAccounts: string[] }> {
    return sendMessage('pub(authorize.tab)', { origin });
  }

  public async getAccounts(): Promise<InjectedAccount[]> {
    return sendMessage('pub(accounts.list)', {});
  }

  public subscribeAccounts(cb: (accounts: InjectedAccount[]) => void): () => void {
    let id: string | null = null;

    sendMessage('pub(accounts.subscribe)', null, cb)
      .then((subId): void => {
        id = subId;
      })
      .catch(console.error);

    return (): void => {
      id && sendMessage('pub(accounts.unsubscribe)', { id }).catch(console.error);
    };
  }

  public async getMetadata(): Promise<InjectedMetadataKnown[]> {
    return sendMessage('pub(metadata.list)');
  }

  public async provideMetadata(definition: MetadataDef): Promise<boolean> {
    return sendMessage('pub(metadata.provide)', definition);
  }

  public getPolkadotSigner(address: string): PolkadotSigner {
    const signBytes = (data: Uint8Array) =>
      sendMessage('pub(bytes.sign)', {
        address,
        data: toHex(data),
        type: 'bytes'
      }).then(({ signature }) => fromHex(signature));
    const publicKey = getPublicKey(address);

    const signTx = async (
      callData: Uint8Array,
      signedExtensions: Record<
        string,
        {
          identifier: string;
          value: Uint8Array;
          additionalSigned: Uint8Array;
        }
      >
    ) => {
      const genesisExtension = Object.values(signedExtensions).find(({ identifier }) => identifier === 'CheckGenesis');

      if (!genesisExtension) throw new Error('Missing CheckGenesis signed-extension');

      const { signedTransaction } = await sendMessage('pub(extrinsic.sign)', {
        address: address,
        method: toHex(callData),
        genesisHash: toHex(genesisExtension.additionalSigned) as `0x${string}`,
        withSignedTransaction: true
      } as SignerPayloadJSON);

      if (!signedTransaction) throw new Error('Missing signed transaction');

      return fromHex(signedTransaction);
    };

    return { publicKey, signTx, signBytes };
  }
}
