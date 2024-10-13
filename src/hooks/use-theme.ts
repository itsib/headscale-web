import { Theme } from '../utils/theme.ts';
import { useContext } from 'react';
import ApplicationContext from '../context/application/application.context.ts';

export function useTheme(): [Theme, (theme: Theme) => void] {
  const { theme, updateTheme } = useContext(ApplicationContext);

  return [theme, updateTheme];
}