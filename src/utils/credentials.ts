import { Credentials, TokenType } from '../types';
import { UnauthorizedError } from './errors.ts';
import { StorageAsync } from '@app-utils/storage.ts';

export async function getCredentials(storage: StorageAsync): Promise<Credentials> {
  const [base, token, tokenType] = await Promise.all([
    storage.getItem<string>('main-url'),
    storage.getItem<string>('main-token'),
    storage.getItem<TokenType>('main-token-type'),
  ]);

  if (!base || !token || !tokenType) {
    throw new UnauthorizedError();
  }

  return { base, token, tokenType };
}

export async function setCredentials(storage: StorageAsync, args: Credentials): Promise<void> {
  if (args.base) await storage.setItem('main-url', args.base);
  if (args.token) await storage.setItem('main-token', args.token);
  if (args.tokenType) await storage.setItem('main-token-type', args.tokenType);
}

export async function removeCredentials(storage: StorageAsync): Promise<void> {
  await storage.removeItem('main-url');
  await storage.removeItem('main-token');
  await storage.removeItem('main-token-type');
}