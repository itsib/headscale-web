import { createContext } from 'react';
import { getActiveTheme, Theme } from '../../utils/theme.ts';

export interface ApplicationContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export default createContext<ApplicationContext>({
  theme: getActiveTheme(),
  setTheme: () => {throw new Error('NOT_IMPLEMENTED')},
});