// Copyright 2023-2025 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from './types.js';

export interface MetadataDefBase {
  chain: string;
  genesisHash: HexString;
  icon: string;
  ss58Format: number;
  chainType?: 'substrate' | 'ethereum';
}

export type ExtTypes = Record<string, string>;
export interface ExtInfo {
  extrinsic: ExtTypes;
  payload: ExtTypes;
}
export type ExtDef = Record<string, ExtInfo>;

export interface MetadataDef extends MetadataDefBase {
  color?: string;
  specVersion: number;
  tokenDecimals: number;
  tokenSymbol: string;
  types: Record<string, Record<string, string> | string>;
  metaCalls?: string;
  userExtensions?: ExtDef;
}
export interface InjectedMetadataKnown {
  genesisHash: string;
  specVersion: number;
}

export interface InjectedMetadata {
  get: () => Promise<InjectedMetadataKnown[]>;
  provide: (definition: MetadataDef) => Promise<boolean>;
}
