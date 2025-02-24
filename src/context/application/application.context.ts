import { createContext } from 'react';
import { getActiveTheme, Theme } from '@app-utils/theme';
import { IDBStorageInstance } from '@app-utils/idb-storage';
import { StorageTables } from '@app-types';

export interface ApplicationContext {
  isOffLine: boolean;
  isAuthorized: boolean;
  setIsAuthorized: (isOffLine: boolean) => void,
  theme: Theme;
  updateTheme: (theme: Theme) => void;
  storage: IDBStorageInstance<StorageTables>;
}

export const ApplicationContext = createContext<ApplicationContext>({
  isOffLine: false,
  isAuthorized: false,
  setIsAuthorized: () => {throw new Error('NOT_IMPLEMENTED')},
  theme: getActiveTheme(),
  updateTheme: () => {throw new Error('NOT_IMPLEMENTED')},
  storage: {} as IDBStorageInstance<StorageTables>,
});