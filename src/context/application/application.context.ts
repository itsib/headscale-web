import { createContext } from 'react';
import { getActiveTheme, Theme } from '@app-utils/theme';
import { NotImplementedError } from '@app-utils/errors';

export interface IApplicationContext {
  theme: Theme;
  updateTheme: (theme: Theme) => void;
}

export const ApplicationContext = createContext<IApplicationContext>({
  theme: getActiveTheme(),
  updateTheme: () => {throw new NotImplementedError()},
});