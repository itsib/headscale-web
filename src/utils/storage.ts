export type StorageOperation = 'set' | 'get' | 'remove';

export type StorageCallback = (key: string) => void;

export interface IStorage {
  getItem<T>(key: string): T | undefined;
  setItem<T>(key: string, value: T): void;
  removeItem(key: string): void;
  clear(): void;
  subscribe(event: StorageOperation, callback: StorageCallback): () => void;
}

export class Storage implements IStorage {
  private readonly _listeners: Map<StorageOperation, StorageCallback[]>;

  private constructor() {
    this._listeners = new Map<StorageOperation, StorageCallback[]>();
  }

  private static _INSTANCE?: Storage;

  static get(): Storage {
    if (!Storage._INSTANCE) {
      Storage._INSTANCE = new Storage();
    }
    return Storage._INSTANCE!;
  }

  setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
    this._emit('set', key);
  }

  getItem<T>(key: string): T | undefined {
    this._emit('get', key);
    const item = localStorage.getItem(key);
    if (item == null) {
      return undefined;
    }

    return JSON.parse(item) as T | undefined;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
    this._emit('remove', key);
  }

  clear(): void {
    const keys: string[] = new Array(localStorage.length);
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        keys[i] = key;
      }
    }

    localStorage.clear();

    keys.forEach((key: string) => this._emit('remove', key));
  }

  subscribe(event: StorageOperation, callback: StorageCallback): () => void {
    const listeners = this._listeners.get(event) ?? [];
    this._listeners.set(event, [...listeners, callback]);

    return () => {
      const listeners = this._listeners.get(event)!.filter((cb) => cb !== callback);
      this._listeners.set(event, listeners);
    };
  }

  private _emit(event: StorageOperation, key: string) {
    const listeners = this._listeners.get(event);
    if (!listeners) return;

    for (let i = 0; i < listeners.length; i++) {
      listeners[i](key);
    }
  }
}
