import { createContext } from 'react';
import { getActiveTheme, Theme } from '@app-utils/theme';
import { NotImplementedError } from '@app-utils/errors';

export interface IApplicationContext {
  theme: Theme;
  updateTheme: (theme: Theme) => void;
}

export const ApplicationContext = createContext<IApplicationContext>({
  theme: getActiveTheme((localStorage.getItem('headscale.theme') as Theme) || 'system'),
  updateTheme: () => {
    throw new NotImplementedError();
  },
});
