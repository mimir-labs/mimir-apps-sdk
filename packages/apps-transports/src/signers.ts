// Copyright 2023-2025 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from './types.js';

export interface SignerPayloadJSON {
  /**
   * @description The ss-58 encoded address
   */
  address: string;
  /**
   * @description The id of the asset used to pay fees, in hex
   */
  assetId?: number | object;
  /**
   * @description The checkpoint hash of the block, in hex
   */
  blockHash: HexString;
  /**
   * @description The checkpoint block number, in hex
   */
  blockNumber: HexString;
  /**
   * @description The era for this transaction, in hex
   */
  era: HexString;
  /**
   * @description The genesis hash of the chain, in hex
   */
  genesisHash: HexString;
  /**
   * @description The metadataHash for the CheckMetadataHash SignedExtension, as hex
   */
  metadataHash?: HexString;
  /**
   * @description The encoded method (with arguments) in hex
   */
  method: string;
  /**
   * @description The mode for the CheckMetadataHash SignedExtension, in hex
   */
  mode?: number;
  /**
   * @description The nonce for this transaction, in hex
   */
  nonce: HexString;
  /**
   * @description The current spec version for the runtime
   */
  specVersion: HexString;
  /**
   * @description The tip for this transaction, in hex
   */
  tip: HexString;
  /**
   * @description The current transaction version for the runtime
   */
  transactionVersion: HexString;
  /**
   * @description The applicable signed extensions for this runtime
   */
  signedExtensions: string[];
  /**
   * @description The version of the extrinsic we are dealing with
   */
  version: number;
  /**
   * @description Optional flag that enables the use of the `signedTransaction` field in
   * `singAndSend`, `signAsync`, and `dryRun`.
   */
  withSignedTransaction?: boolean;
}

export interface SignerPayloadRawBase {
  /**
   * @description The hex-encoded data for this request
   */
  data: string;
  /**
   * @description The type of the contained data
   */
  type?: 'bytes' | 'payload';
}

export interface SignerPayloadRaw extends SignerPayloadRawBase {
  /**
   * @description The ss-58 encoded address
   */
  address: string;
  /**
   * @description The type of the contained data
   */
  type: 'bytes' | 'payload';
}

export interface SignerResult {
  /**
   * @description The id for this request
   */
  id: number;
  /**
   * @description The resulting signature in hex
   */
  signature: HexString;
  /**
   * @description The payload constructed by the signer. This allows the
   * inputted signed transaction to bypass `signAndSend` from adding the signature to the payload,
   * and instead broadcasting the transaction directly. There is a small validation layer. Please refer
   * to the implementation for more information. If the inputted signed transaction is not actually signed, it will fail with an error.
   *
   * This will also work for `signAsync`. The new payload will be added to the Extrinsic, and will be sent once the consumer calls `.send()`.
   *
   * NOTE: This is only implemented for `signPayload`, and will only work when the `withSignedTransaction` option is enabled as an option.
   */
  signedTransaction?: HexString | Uint8Array;
}

export interface Signer {
  /**
   * @description signs an extrinsic payload from a serialized form
   */
  signPayload?: (payload: SignerPayloadJSON) => Promise<SignerResult>;
  /**
   * @description signs a raw payload, only the bytes data as supplied
   */
  signRaw?: (raw: SignerPayloadRaw) => Promise<SignerResult>;
}
