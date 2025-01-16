import { IDBStorageInstance } from './idb-storage.ts';
import { Credentials, StorageTables, TokenType } from '../types';
import { UnauthorizedError } from './errors.ts';

export async function getCredentials(storage: IDBStorageInstance<StorageTables>): Promise<Credentials> {
  const [base, token, tokenType] = await Promise.all([
    storage.readAppStore<string>('main-url'),
    storage.readAppStore<string>('main-token'),
    storage.readAppStore<TokenType>('main-token-type'),
  ]);

  if (!base || !token || !tokenType) {
    throw new UnauthorizedError();
  }

  return { base, token, tokenType };
}

export async function setCredentials(storage: IDBStorageInstance<StorageTables>, args: Credentials): Promise<void> {
  if (args.base) await storage.writeAppStore('main-url', args.base);
  if (args.token) await storage.writeAppStore('main-token', args.token);
  if (args.tokenType) await storage.writeAppStore('main-token-type', args.tokenType);
}

export async function removeCredentials(storage: IDBStorageInstance<StorageTables>): Promise<void> {
  await storage.deleteAppStore('main-url');
  await storage.deleteAppStore('main-token');
  await storage.deleteAppStore('main-token-type');
}