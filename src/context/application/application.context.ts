import { createContext } from 'react';
import { getActiveTheme, Theme } from '../../utils/theme.ts';

export interface ApplicationContext {
  theme: Theme;
  updateTheme: (theme: Theme) => void;
}

export default createContext<ApplicationContext>({
  theme: getActiveTheme(),
  updateTheme: () => {throw new Error('NOT_IMPLEMENTED')},
});