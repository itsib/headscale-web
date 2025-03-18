import { PersistedClient, Persister } from '@tanstack/react-query-persist-client';

export type StorageOperation = 'set' | 'get' | 'remove';

export type StorageCallback = (key: string) => void;

export interface StorageAsync {
  getItem<T>(key: string): Promise<T | undefined>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>
  clear(): Promise<void>;
  subscribe(event: StorageOperation, callback: StorageCallback): () => void;
}

export function createStorage(name: string): StorageAsync {
  if (IDBDStorage.isSupport()) {
    return new IDBDStorage(name);
  } else {
    return new LocalStorage(name);
  }
}

export function createPersister(): Persister {
  const storage = createStorage('query');

  return {
    async removeClient(): Promise<void> {
      return await storage.removeItem('client');
    },
    async restoreClient(): Promise<PersistedClient | undefined> {
      return await storage.getItem<PersistedClient>('client');
    },
    async persistClient(persistClient: PersistedClient): Promise<void> {
      return await storage.setItem('client', persistClient);
    }
  }
}

abstract class BaseStorage implements StorageAsync {

  protected readonly _name: string;

  private readonly _listeners: Map<StorageOperation, StorageCallback[]>;

  constructor(name: string) {
    this._name = name;
    this._listeners = new Map<StorageOperation, StorageCallback[]>();
  }

  abstract setItem<T>(key: string, value: T): Promise<void>;

  abstract getItem<T>(key: string): Promise<T | undefined>;

  abstract removeItem(key: string): Promise<void>;

  abstract clear(): Promise<void>;

  subscribe(event: StorageOperation, callback: StorageCallback): () => void {
    const listeners = this._listeners.get(event) ?? [];
    this._listeners.set(event, [...listeners, callback]);

    return () => {
      const listeners = this._listeners.get(event)!.filter(cb => (cb !== callback));
      this._listeners.set(event, listeners);
    };
  }

  emit(event: StorageOperation, key: string) {
    const listeners = this._listeners.get(event);
    if (!listeners) return;

    for (let i = 0; i < listeners.length; i++) {
      listeners[i](key);
    }
  }
}

class LocalStorage extends BaseStorage implements StorageAsync {

  setItem<T>(key: string, value: T): Promise<void> {
    this.emit('set', key);
    localStorage.setItem(this._prefixedKey(key), JSON.stringify(value));

    return Promise.resolve();
  }

  getItem<T>(key: string): Promise<T | undefined> {
    this.emit('get', key);
    const item = localStorage.getItem(this._prefixedKey(key));
    if (item == null) {
      return Promise.resolve(undefined);
    }

    return Promise.resolve(JSON.parse(item) as T | undefined);
  }

  removeItem(key: string): Promise<void> {
    this.emit('remove', key);
    localStorage.removeItem(this._prefixedKey(key));
    return Promise.resolve();
  }

  clear(): Promise<void> {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        this.emit('remove', key);
      }
    }

    localStorage.clear();
    return Promise.resolve();
  }

  private _prefixedKey(key: string): string {
    return this._name + '-' + key;
  }
}

class IDBDStorage extends BaseStorage implements StorageAsync {
  private readonly _keys = new Set<string>();

  protected static _DATABASE_TABLES = new Set<string>();

  protected static _DATABASE?: Promise<IDBDatabase>;

  protected static _getDatabase(tableName: string, version = 1): Promise<IDBDatabase> {
    IDBDStorage._DATABASE_TABLES.add(tableName);

    if (!IDBDStorage._DATABASE) {
      IDBDStorage._DATABASE = new Promise<IDBDatabase>((resolve, reject) => {
        setTimeout(() => {
          const request = indexedDB.open(`HeadscaleWeb`, version);

          request.onerror = error => reject(new Error((error?.target as any)?.error || 'DATABASE_UNKNOWN_ERROR'));

          request.onsuccess = () => {
            request.result.onclose = () => Reflect.deleteProperty(IDBDStorage, '_DATABASE');

            resolve(request.result);
          };

          request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as any)!.result as IDBDatabase;
            const tableNames = Array.from(IDBDStorage._DATABASE_TABLES);

            for (let i = 0; i < tableNames.length; i++) {
              const tableName = tableNames[i];

              if (db.objectStoreNames.contains(tableName)) {
                db.deleteObjectStore(tableName);
              }

              db.createObjectStore(tableName);
            }
          };
        }, 500)
      });
    }
    return IDBDStorage._DATABASE;
  }

  static isSupport(): boolean {
    return 'IDBDatabase' in window && 'IDBObjectStore' in window && 'IDBTransaction' in window && 'IDBRequest' in window;
  }

  async getItem<T = any>(key: string): Promise<T> {
    this.emit('get', key);
    const store = await this._store('readonly');

    return new Promise<T>((resolve, reject) => {
      const request: IDBRequest<T> = store.get(key);

      request.onsuccess = () => resolve(request.result);

      request.onerror = () => reject(this._formatError(request.error));
    })
  }

  async setItem<T = any>(key: string, value: T): Promise<void> {
    this._keys.add(key);
    this.emit('set', key);
    const store = await this._store('readwrite');

    return new Promise<void>((resolve, reject) => {
      const request = store.put(value, key);
      if (!request.transaction) {
        return reject(new Error(`Transaction "${this._name}" not defined.`));
      }

      request.transaction.oncomplete = () => resolve(undefined);

      request.transaction.onabort = () => reject(this._formatError(request.error));
    });
  }

  async removeItem(key: string): Promise<void> {
    this._keys.delete(key);
    this.emit('remove', key);
    const store = await this._store('readwrite');

    return new Promise<void>((resolve, reject) => {
      const request = store.delete(key);
      if (!request.transaction) {
        return reject(new Error(`Transaction "${this._name}" not defined.`));
      }

      request.transaction.oncomplete = () => resolve(undefined);

      request.transaction.onabort = () => reject(this._formatError(request.error));
    })
  }

  async clear(): Promise<void> {
    const keys = Array.from(this._keys);
    keys.forEach(key => this.emit('remove', key));

    const tables = Array.from(IDBDStorage._DATABASE_TABLES);

    for (let i = 0; i < tables.length; i++) {
      const store = await this._store('readwrite', tables[i]);

      await new Promise<void>((resolve, reject) => {
        const request = store.clear();

        request.onsuccess = () => resolve(undefined);

        request.onerror = () => reject(this._formatError(request.error));
      })

    }
  }

  private async _store(mode: IDBTransactionMode, name = this._name): Promise<IDBObjectStore> {
    const db = await IDBDStorage._getDatabase(name);

    if (!db.objectStoreNames.contains(name)) {
      throw new Error(`No store "${name}" found.`);
    }

    return db.transaction(name, mode).objectStore(name);
  }

  private _formatError(error: any): Error {
    return new Error((error?.target as any)?.error || 'IDB_UNKNOWN_ERROR');
  }
}