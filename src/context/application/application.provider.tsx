import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import ApplicationContext from './application.context';
import { getActiveTheme, Theme } from '../../utils/theme.ts';


export const ApplicationProvider: FC<PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getActiveTheme());
  const [authorized, setAuthorized] = useState(!!localStorage.getItem('headscale.url') && !!localStorage.getItem('headscale.token'));

  const updateTheme = useCallback((theme: Theme) => {
    setTheme(theme);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('headscale.token');
    setAuthorized(false);
  }, []);

  const login = useCallback((credentials: { url: string; token: string }) => {
    localStorage.setItem('headscale.url', credentials.url);
    localStorage.setItem('headscale.token', credentials.token);
    setAuthorized(true);
  }, []);

  useEffect(() => {
    if (theme === Theme.Dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme]);

  return (
    <ApplicationContext.Provider
      value={{
        theme,
        updateTheme,
        logout,
        authorized,
        login,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  )
}