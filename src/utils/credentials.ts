import { IDBStorageInstance } from './idb-storage.ts';
import { Credentials, StorageTables, TokenType } from '../types';
import { UnauthorizedError } from './errors.ts';

export async function getCredentials(storage: IDBStorageInstance<StorageTables>, component: 'main' | 'metric'): Promise<Credentials> {
  const [base, token, tokenType] = await Promise.all([
    storage.readAppStore<string>(`${component}-url`),
    storage.readAppStore<string>(`${component}-token`),
    storage.readAppStore<TokenType>(`${component}-token-type`),
  ]);

  if (component === 'main' && (!base || !token || !tokenType)) {
    throw new UnauthorizedError();
  }

  return { base, token, tokenType };
}

export async function setCredentials(storage: IDBStorageInstance<StorageTables>, args: Credentials & { component: 'main' | 'metric'} ): Promise<void> {
  if (args.base) await storage.writeAppStore(`${args.component}-url`, args.base);
  if (args.token) await storage.writeAppStore(`${args.component}-token`, args.token);
  if (args.tokenType) await storage.writeAppStore(`${args.component}-token-type`, args.tokenType);
}

export async function removeCredentials(storage: IDBStorageInstance<StorageTables>, component: 'main' | 'metric' ): Promise<void> {
  await storage.deleteAppStore(`${component}-url`);
  await storage.deleteAppStore(`${component}-token`);
  await storage.deleteAppStore(`${component}-token-type`);
}