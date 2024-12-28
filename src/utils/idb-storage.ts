export interface IDBIndexConfig {
  name: string,
  keyPath: string | string[],
  options?: IDBIndexParameters;
}

export type IDBTablesConfig = { [key: string]: IDBIndexConfig[] };

type IDBReadInterface<Tables extends IDBTablesConfig> = {
  [Name in keyof Tables as `read${Capitalize<string & Name>}`]: <T>(key: string) => Promise<T>;
}

type IDBWriteInterface<Tables extends IDBTablesConfig> = {
  [Name in keyof Tables as `write${Capitalize<string & Name>}`]: (key: string, value: any) => Promise<void>;
}

type IDBDeleteInterface<Tables extends IDBTablesConfig> = {
  [Name in keyof Tables as `delete${Capitalize<string & Name>}`]: (key: string) => Promise<void>;
}

export type IDBStorageInstance<Tables extends IDBTablesConfig> = { new(): IDBStorage<IDBTablesConfig> } & IDBReadInterface<Tables> & IDBWriteInterface<Tables> & IDBDeleteInterface<Tables>;

export class IDBStorage<Tables extends IDBTablesConfig> {
  /**
   * IDB Name (app name)
   * @private
   */
  private readonly _name: string;
  /**
   * Database version
   * @private
   */
  private readonly _version: number;

  private readonly _tables: Map<string, IDBIndexConfig[]>;

  private readonly _indexes: Map<string, IDBIndex>;

  private _db?: Promise<IDBDatabase>;

  private static _INSTANCE?: IDBStorageInstance<IDBTablesConfig>;

  static get<Tables extends IDBTablesConfig>(name: string, version: number, tables: Tables): IDBStorageInstance<Tables> {
    if (!IDBStorage._INSTANCE) {
      IDBStorage._INSTANCE = new IDBStorage(name, version, tables) as any;
    }
    return IDBStorage._INSTANCE as IDBStorageInstance<Tables>;
  }

  private constructor(name: string, version: number, tables: Tables) {
    this._name = name;
    this._version = version;
    this._tables = new Map();
    this._indexes = new Map<string, IDBIndex>();

    const names = Object.keys(tables);
    for (let i = 0; i < names.length; i++) {
      const tableName = names[i];
      const indexes = tables[tableName];

      this._tables.set(tableName, indexes);

      const suffix = tableName.at(0)!.toUpperCase() + tableName.slice(1);

      Object.defineProperties(this, {
        [`read${suffix}`]: {
          value: (key: string) => this._read.apply(this, [tableName, key]),
          writable: false,
          configurable: false,
        },
        [`write${suffix}`]: {
          value: (key: string, value: any) => this._write.apply(this, [tableName, key, value]),
          writable: false,
          configurable: false,
        },
        [`delete${suffix}`]: {
          value: (key: string) => this._delete.apply(this, [tableName, key]),
          writable: false,
          configurable: false,
        },
      });
    }
  }

  private _upgrade(event: IDBVersionChangeEvent): void {
    const db = (event.target as any)!.result as IDBDatabase;
    const tableNames = Array.from(this._tables.keys());

    for (let i = 0; i < tableNames.length; i++) {
      const tableName = tableNames[i];
      const indexes = this._tables.get(tableName)!;
      if (db.objectStoreNames.contains(tableName)) {
        db.deleteObjectStore(tableName);
      }

      const storage = db.createObjectStore(tableName);
      for (let j = 0; j < indexes.length; j++) {
        const { name, options, keyPath } = indexes[j];

        const index = storage.createIndex(name, keyPath, options);
        if (this._indexes.has(name)) {
          throw new Error(`Index ${name} already exists`);
        }

        this._indexes.set(name, index);
      }
    }
  }

  private async _database(): Promise<IDBDatabase> {
    if (!this._db) {
      this._db = new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(this._name, this._version);

        request.onerror = error => reject(new Error((error?.target as any)?.error || 'DATABASE_UNKNOWN_ERROR'));

        request.onsuccess = () => {
          request.result.onclose = () => Reflect.deleteProperty(this, '_db');

          resolve(request.result);
        };

        request.onupgradeneeded = event => this._upgrade(event);
      });
    }
    return this._db;
  }

  private async _store(tableName: string, mode: IDBTransactionMode): Promise<IDBObjectStore> {
    const db = await this._database();

    if (!db.objectStoreNames.contains(tableName)) {
      throw new Error(`No store "${tableName}" found.`);
    }

    return db.transaction(tableName, mode).objectStore(tableName);
  }

  private async _read<T = any>(tableName: string, key: string): Promise<T> {
    const store = await this._store(tableName, 'readonly');

    return new Promise<T>((resolve, reject) => {
      const request: IDBRequest<T> = store.get(key);

      request.onsuccess = () => resolve(request.result);

      request.onerror = () => reject(this._formatError(request.error));
    })
  }

  private async _write<T = any>(tableName: string, key: string, value: T): Promise<void> {
    const store = await this._store(tableName, 'readwrite');

    return new Promise<void>((resolve, reject) => {
      const request = store.put(value, key);
      if (!request.transaction) {
        return reject(new Error(`Transaction "${tableName}" not defined.`));
      }

      request.transaction.oncomplete = () => resolve(undefined);

      request.transaction.onabort = () => reject(this._formatError(request.error));
    });
  }

  private async _delete(tableName: string, key: string): Promise<void> {
    const store = await this._store(tableName, 'readwrite');

    return new Promise<void>((resolve, reject) => {
      const request = store.delete(key);
      if (!request.transaction) {
        return reject(new Error(`Transaction "${tableName}" not defined.`));
      }

      request.transaction.oncomplete = () => resolve(undefined);

      request.transaction.onabort = () => reject(this._formatError(request.error));
    })
  }

  async get<T = any>(key: IDBValidKey): Promise<T | undefined> {
    const query = await this._query('');

    return query<T>(async store => store.get(key));
  }

  async _query(table: string) {
    const store = await this._store(table, 'readonly');

    return <T>(callback: (store: IDBObjectStore) => Promise<IDBRequest<T> | IDBTransaction>) => {
      return new Promise<T | undefined>(async (resolve, reject) => {
        const request: IDBRequest<T> | IDBTransaction = await callback(store);

        if (request instanceof IDBTransaction) {
          request.oncomplete = () => resolve(undefined);

          request.onabort = () => reject(this._formatError(request.error));
        } else {
          request.onsuccess = () => resolve(request.result);

          request.onerror = () => reject(this._formatError(request.error));
        }
      });
    };
  }

  private _formatError(error: any): Error {
    return new Error((error?.target as any)?.error || 'IDB_UNKNOWN_ERROR');
  }
}


