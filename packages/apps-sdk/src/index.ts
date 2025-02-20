// Copyright 2023-2025 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Message } from '@mimirdev/apps-transports';

import Injected from './Injected/index.js';
import { MESSAGE_ORIGIN_WALLET } from './defaults.js';
import { handleResponse, sendMessage } from './sendMessage.js';

interface InjectedExtensionInfo {
  name: string;
  version: string;
}

type InjectOptions = InjectedExtensionInfo;
interface InjectedWindowProvider {
  enable: (origin: string) => Promise<Injected>;
  version: string;
}

interface InjectedWindow {
  injectedWeb3: Record<string, InjectedWindowProvider>;
}

// It is recommended to always use the function below to shield the extension and dapp from
// any future changes. The exposed interface will manage access between the 2 environments,
// be it via window (current), postMessage (under consideration) or any other mechanism
export function injectExtension(enable: (origin: string) => Promise<Injected>, { name, version }: InjectOptions): void {
  // small helper with the typescript types, just cast window
  const windowInject = window as unknown as InjectedWindow;

  // don't clobber the existing object, we will add it (or create as needed)
  windowInject.injectedWeb3 = windowInject.injectedWeb3 || {};

  // add our enable function
  windowInject.injectedWeb3[name] = {
    enable: (origin: string): Promise<Injected> => enable(origin),
    version
  };
}

export async function enable(origin: string): Promise<Injected> {
  await sendMessage('pub(authorize.tab)', { origin });

  return new Injected(sendMessage);
}

export function isValidMessage({ data, source }: Message, allowedOrigins: RegExp[] | null = null): boolean {
  const emptyOrMalformed = !data;
  const sentFromParentEl = source === parent;

  let validOrigin = true;

  if (Array.isArray(allowedOrigins)) {
    validOrigin = allowedOrigins.find((regExp) => regExp.test(origin)) !== undefined;
  }

  return !emptyOrMalformed && sentFromParentEl && validOrigin && data.origin === MESSAGE_ORIGIN_WALLET;
}

export { handleResponse, sendMessage };
