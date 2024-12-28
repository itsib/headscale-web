import { IDBIndexConfig, IDBTablesConfig } from '../../utils/idb-storage.ts';

export interface StorageTables extends IDBTablesConfig {
  cache: IDBIndexConfig[];
  appStore: IDBIndexConfig[];
}