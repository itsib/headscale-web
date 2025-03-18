import { createContext } from 'react';
import { getActiveTheme, Theme } from '@app-utils/theme';
import { StorageAsync } from '@app-utils/storage.ts';

export interface IApplicationContext {
  isOffLine: boolean;
  theme: Theme;
  updateTheme: (theme: Theme) => void;
  storage: StorageAsync;
}

export const ApplicationContext = createContext<IApplicationContext>({
  isOffLine: false,
  theme: getActiveTheme(),
  updateTheme: () => {throw new Error('NOT_IMPLEMENTED')},
  storage: {} as StorageAsync,
});