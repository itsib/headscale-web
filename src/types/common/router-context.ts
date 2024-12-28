import { IDBStorageInstance } from '../../utils/idb-storage.ts';
import { StorageTables } from './storage-tables.ts';

export interface RouterContext {
  isAuthorized: boolean;
  storage: IDBStorageInstance<StorageTables>;
}