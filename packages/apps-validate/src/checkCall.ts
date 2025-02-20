// Copyright 2023-2025 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type {} from '@polkadot/api-augment/substrate';
import type { AccountId, Address, Call } from '@polkadot/types/interfaces';
import type { IMethod } from '@polkadot/types/types';

import { sendMessage } from '@mimirdev/apps-sdk';

import { addressEq, encodeMultiAddress } from '@polkadot/util-crypto';

function findFinalCall(api: ApiPromise, call: Call | IMethod): Call | IMethod {
  if (api.tx.multisig.asMulti.is(call)) {
    return findFinalCall(api, api.registry.createType('Call', call.args[3]));
  } else if (api.tx.multisig.asMultiThreshold1?.is(call)) {
    return findFinalCall(api, call.args[1]);
  } else if (api.tx.proxy?.proxy?.is(call)) {
    return findFinalCall(api, call.args[2]);
  } else {
    return call;
  }
}

/**
 * @deprecated Use checkCallAsync for up to date integration with mimir
 */
export function checkCall(api: ApiPromise, multisigCall: Call | IMethod, expectCall: Call | IMethod): boolean {
  const finalCall = findFinalCall(api, multisigCall);

  if (!finalCall.hash.eq(expectCall.hash)) {
    const meta = api.registry.findMetaCall(finalCall.callIndex);
    const expectMeta = api.registry.findMetaCall(finalCall.callIndex);

    console.warn(
      `the final call found in multisigCall is (${meta.section}.${meta.method}), which does not match the expected call(${expectMeta.section}.${expectMeta.method}).`
    );

    return false;
  } else {
    return true;
  }
}

export async function checkCallAsync(
  api: ApiPromise,
  call: Call | IMethod,
  address: string | Uint8Array | AccountId | Address,
  expectCall: Call | IMethod,
  expectAccount: string | Uint8Array | AccountId | Address
): Promise<boolean> {
  if (call.toHex() === expectCall.toHex() && addressEq(address.toString(), expectAccount.toString())) {
    return true;
  }

  if (api.tx.multisig.asMulti.is(call)) {
    const nextCall = api.registry.createType('Call', call.args[3]);
    const nextAddress = encodeMultiAddress([address.toString(), ...call.args[1]], call.args[0]);

    return checkCallAsync(api, nextCall, nextAddress, expectCall, expectAccount);
  } else if (api.tx.multisig.approveAsMulti.is(call)) {
    const hash = call.args[3];

    const data = await sendMessage('pub(call.get)', hash.toHex());

    const nextCall = api.createType('Call', data);

    if (nextCall.hash.toHex() !== hash.toHex()) {
      throw new Error('approveAsMulti call hash not match original call hash');
    }

    const nextAddress = encodeMultiAddress([address.toString(), ...call.args[1]], call.args[0]);

    return checkCallAsync(api, nextCall, nextAddress, expectCall, expectAccount);
  } else if (api.tx.multisig.asMultiThreshold1.is(call)) {
    const nextCall = api.registry.createType('Call', call.args[1]);
    const nextAddress = encodeMultiAddress([address.toString(), ...call.args[0]], 1);

    return checkCallAsync(api, nextCall, nextAddress, expectCall, expectAccount);
  } else if (api.tx.proxy?.proxy?.is(call)) {
    const nextCall = api.registry.createType('Call', call.args[2]);
    const nextAddress = call.args[0].toString();

    return checkCallAsync(api, nextCall, nextAddress, expectCall, expectAccount);
  } else if (api.tx.proxy?.announce?.is(call)) {
    const hash = call.args[1];
    const nextAddress = call.args[0].toString();

    const data = await sendMessage('pub(call.get)', hash.toHex());

    const nextCall = api.createType('Call', data);

    if (nextCall.hash.toHex() !== hash.toHex()) {
      throw new Error('announce call hash not match original call hash');
    }

    return checkCallAsync(api, nextCall, nextAddress, expectCall, expectAccount);
  } else {
    return false;
  }
}
