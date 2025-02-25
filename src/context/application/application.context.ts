import { createContext } from 'react';
import { getActiveTheme, Theme } from '@app-utils/theme';
import { IDBStorageInstance } from '@app-utils/idb-storage';
import { StorageTables } from '@app-types';

export interface IApplicationContext {
  isOffLine: boolean;
  theme: Theme;
  updateTheme: (theme: Theme) => void;
  storage: IDBStorageInstance<StorageTables>;
}

export const ApplicationContext = createContext<IApplicationContext>({
  isOffLine: false,
  theme: getActiveTheme(),
  updateTheme: () => {throw new Error('NOT_IMPLEMENTED')},
  storage: {} as IDBStorageInstance<StorageTables>,
});