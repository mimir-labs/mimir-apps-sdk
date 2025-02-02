// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InjectedMetadata, InjectedMetadataKnown, MetadataDef } from '@mimirdev/apps-transports';
import type { SendRequest } from './types';

// External to class, this.# is not private enough (yet)
let sendRequest: SendRequest;

export default class Metadata implements InjectedMetadata {
  constructor(_sendRequest: SendRequest) {
    sendRequest = _sendRequest;
  }

  public get(): Promise<InjectedMetadataKnown[]> {
    return sendRequest('pub(metadata.list)');
  }

  public provide(definition: MetadataDef): Promise<boolean> {
    return sendRequest('pub(metadata.provide)', definition);
  }
}
