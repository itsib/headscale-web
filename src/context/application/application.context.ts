import { createContext } from 'react';
import { getActiveTheme, Theme } from '../../utils/theme.ts';

export interface ApplicationContext {
  isOffLine: boolean;
  theme: Theme;
  updateTheme: (theme: Theme) => void;
}

export default createContext<ApplicationContext>({
  isOffLine: false,
  theme: getActiveTheme(),
  updateTheme: () => {throw new Error('NOT_IMPLEMENTED')},
});