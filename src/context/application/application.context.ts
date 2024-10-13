import { createContext } from 'react';
import { getActiveTheme, Theme } from '../../utils/theme.ts';

export interface ApplicationContext {
  theme: Theme;
  updateTheme: (theme: Theme) => void;
  logout: () => void;
  login: (credentials: { url: string; token: string }) => void;
  authorized: boolean;
}

export default createContext<ApplicationContext>({
  theme: getActiveTheme(),
  updateTheme: () => {throw new Error('NOT_IMPLEMENTED')},
  logout: () => {throw new Error('NOT_IMPLEMENTED')},
  login: () => {throw new Error('NOT_IMPLEMENTED')},
  authorized: false,
});