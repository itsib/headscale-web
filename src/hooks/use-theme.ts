import { Theme } from '../utils/theme.ts';
import { useContext } from 'react';
import ApplicationContext from '../context/application/application.context.ts';

export function useTheme(): [Theme, (theme: Theme) => void] {
  const { theme, setTheme } = useContext(ApplicationContext);

  return [theme, setTheme];
}