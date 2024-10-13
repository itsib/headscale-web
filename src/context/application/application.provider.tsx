import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import ApplicationContext from './application.context';
import { getActiveTheme, Theme } from '../../utils/theme.ts';


export const ApplicationProvider: FC<PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getActiveTheme());

  const setThemeCallback = useCallback((theme: Theme) => {
    setTheme(theme);
  }, []);

  useEffect(() => {
    if (theme === Theme.Dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme]);

  return (
    <ApplicationContext.Provider value={{ theme, setTheme: setThemeCallback }}>
      {children}
    </ApplicationContext.Provider>
  )
}