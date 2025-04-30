// Copyright 2023-2025 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Message, MessageTypes, TransportResponseMessage } from '@mimirdev/apps-transports';

import { enable, handleResponse, injectExtension, isValidMessage, sendMessage } from '@mimirdev/apps-sdk';

import { packageInfo } from './packageInfo.js';

export function inject() {
  if (self === parent) {
    return;
  }

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

  injectExtension(enable, {
    name: 'mimir',
    version: packageInfo.version
  });
}

export function isMimirReady(): Promise<string | null> {
  return Promise.race([
    new Promise<string | null>((resolve) => {
      if (self === parent) {
        resolve(null);

        return;
      }

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
}

export { MIMIR_REGEXP } from './consts.js';
