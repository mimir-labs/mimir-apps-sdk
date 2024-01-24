// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { MessageTypes, TransportResponseMessage } from '@polkadot/extension-base/background/types';
import type { Message } from '@polkadot/extension-base/types';

import { enable, handleResponse, injectExtension, isValidMessage } from '@mimirdev/apps-sdk';
import { sendMessage } from '@mimirdev/apps-sdk/sendMessage';

import { packageInfo } from './packageInfo';

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

export function inject() {
  injectExtension(enable, {
    name: 'mimir',
    version: packageInfo.version
  });
}

export const isMimirReady: Promise<null | string> = Promise.race([
  new Promise<string>((resolve) => {
    const listener = (message: Message): void => {
      if (isValidMessage(message)) {
        resolve(message.origin);
        window.removeEventListener('message', listener);
      }
    };

    window.addEventListener('message', listener);
    sendMessage('pub(ping)', null);
  }),
  new Promise<null>((resolve) => setTimeout(() => resolve(null), 300))
]);
