import { createContext } from 'react';
import { getActiveTheme, Theme } from '../../utils/theme.ts';
import { IDBStorageInstance } from '../../utils/idb-storage.ts';
import { StorageTables } from '../../types';

export interface ApplicationContext {
  isOffLine: boolean;
  isAuthorized: boolean;
  setIsAuthorized: (isOffLine: boolean) => void,
  theme: Theme;
  updateTheme: (theme: Theme) => void;
  storage: IDBStorageInstance<StorageTables>;
}

export default createContext<ApplicationContext>({
  isOffLine: false,
  isAuthorized: false,
  setIsAuthorized: () => {throw new Error('NOT_IMPLEMENTED')},
  theme: getActiveTheme(),
  updateTheme: () => {throw new Error('NOT_IMPLEMENTED')},
  storage: {} as IDBStorageInstance<StorageTables>,
});