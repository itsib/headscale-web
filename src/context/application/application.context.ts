import { createContext } from 'react';
import { getActiveTheme, Theme } from '@app-utils/theme';
import { StorageAsync } from '@app-utils/storage';
import { NotImplementedError } from '@app-utils/errors';

export interface IApplicationContext {
  isOffLine: boolean;
  theme: Theme;
  updateTheme: (theme: Theme) => void;
  storage: StorageAsync;
}

export const ApplicationContext = createContext<IApplicationContext>({
  isOffLine: false,
  theme: getActiveTheme(),
  updateTheme: () => {throw new NotImplementedError()},
  storage: {} as StorageAsync,
});