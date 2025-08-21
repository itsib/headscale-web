import { ICredentials, TokenType } from '@app-types';
import { Storage } from '@app-utils/storage.ts';

export const AuthState = {
  get(): ICredentials | null {
    const storage = Storage.get();
    const base = storage.getItem<string>('main-url');
    const token = storage.getItem<string>('main-token');
    const tokenType = storage.getItem<TokenType>('main-token-type');

    if (base && token && tokenType) {
      return { base, token, tokenType };
    }
    return null;
  },
  getPartial(): Partial<ICredentials> {
    const storage = Storage.get();
    const base = storage.getItem<string>('main-url');
    const token = storage.getItem<string>('main-token');
    const tokenType = storage.getItem<TokenType>('main-token-type');

    return { base, token, tokenType };
  },
  set(values: ICredentials): void {
    const storage = Storage.get();
    storage.setItem('main-url', values.base);
    storage.setItem('main-token', values.token);
    storage.setItem('main-token-type', values.tokenType);
  },
  remove(): void {
    const storage = Storage.get();
    storage.removeItem('main-url');
    storage.removeItem('main-token');
    storage.removeItem('main-token-type');
  },
};
