import { useContext } from 'react';
import { Theme } from '@app-utils/theme';
import { ApplicationContext } from '@app-context/application';

export function useTheme(): [Theme, (theme: Theme) => void] {
  const { theme, updateTheme } = useContext(ApplicationContext);

  return [theme, updateTheme];
}