// Copyright 2023-2025 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Injected, SendRequest } from './types.js';

import Accounts from './Accounts.js';
import Metadata from './Metadata.js';
import Signer from './Signer.js';

export default class implements Injected {
  public readonly accounts: Accounts;

  public readonly metadata: Metadata;

  public readonly signer: Signer;

  constructor(sendRequest: SendRequest) {
    this.accounts = new Accounts(sendRequest);
    this.metadata = new Metadata(sendRequest);
    this.signer = new Signer(sendRequest);

    setInterval(
      (): void => {
        sendRequest('pub(ping)', null).catch((): void => {
          console.error('Extension unavailable, ping failed');
        });
      },
      10_000 + Math.floor(Math.random() * 10_000)
    );
  }
}
