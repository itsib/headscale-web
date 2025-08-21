import { useCallback, useEffect, useState } from 'preact/hooks';
import { FunctionComponent } from 'preact';
import { ApplicationContext } from './application.context';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { getActiveTheme, Theme } from '@app-utils/theme';

export const ApplicationProvider: FunctionComponent = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem('headscale.theme') as Theme) || 'system'
  );
  const [, setNeedsRefresh] = useState<boolean>(false);

  const updateTheme = useCallback((theme: Theme) => {
    setTheme(theme);
    localStorage.setItem('headscale.theme', theme);
  }, []);

  const applyTheme = useCallback((theme: Exclude<Theme, 'system'>) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useRegisterSW({
    onNeedRefresh() {
      setNeedsRefresh(true);
    },
    onRegisteredSW(_url: string, _registration?: ServiceWorkerRegistration) {
      if (!_registration) return;

      const serviceWorker = _registration.active;
      if (!serviceWorker) return;

      serviceWorker.addEventListener('message', (event) => {
        console.log('message', event);
      });

      serviceWorker.addEventListener('upgradeneeded', (event) => {
        console.log('upgradeneeded', event);
      });

      serviceWorker.addEventListener('error', (event) => {
        console.error('SW error', event);
      });

      serviceWorker.addEventListener('statechange', (event) => {
        console.log('statechange', serviceWorker.state, event);
      });
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  useEffect(() => {
    if (typeof window === 'undefined' || theme !== 'system') return;

    const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function onThemeChange({ matches }: MediaQueryListEvent) {
      applyTheme(matches ? 'dark' : ('light' as Exclude<Theme, 'system'>));
    }

    try {
      // Chrome & Firefox
      darkMediaQuery.addEventListener('change', onThemeChange);

      return () => {
        darkMediaQuery.removeEventListener('change', onThemeChange);
      };
    } catch {
      // Safari < 14
      darkMediaQuery.addListener(onThemeChange);

      return () => {
        darkMediaQuery.removeListener(onThemeChange);
      };
    }
  }, [theme]);

  // Update theme class name
  useEffect(() => applyTheme(getActiveTheme(theme)), [theme]);

  return (
    <ApplicationContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ApplicationContext.Provider>
  );
};
