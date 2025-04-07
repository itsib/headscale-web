import { useCallback, useEffect, useState } from 'preact/hooks';
import { FunctionComponent } from 'preact';
import { ApplicationContext } from './application.context';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { getActiveTheme, Theme } from '@app-utils/theme';
import { useIsFetching,  } from '@tanstack/react-query';
import { ToastFetching } from '@app-components/toast-fetching/toast-fetching.tsx';

export const ApplicationProvider: FunctionComponent = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getActiveTheme());
  const [, setNeedsRefresh] = useState<boolean>(false);
  const isFetching = useIsFetching();

  const updateTheme = useCallback((theme: Theme) => setTheme(theme), []);

  useRegisterSW({
    onNeedRefresh() {
      setNeedsRefresh(true);
    },
    onRegisteredSW(_url: string, _registration?: ServiceWorkerRegistration) {
      if (!_registration) return;

      const serviceWorker = _registration.active;
      if (!serviceWorker) return;

      serviceWorker.addEventListener('message', event => {
        console.log('message', event);
      });

      serviceWorker.addEventListener('upgradeneeded', event => {
        console.log('upgradeneeded', event);
      });

      serviceWorker.addEventListener('error', event => {
        console.error('SW error', event);
      });

      serviceWorker.addEventListener('statechange', event => {
        console.log('statechange', serviceWorker.state, event);
      });
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  // Update theme class name
  useEffect(() => {
    if (theme === Theme.Dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ApplicationContext.Provider value={{ theme, updateTheme }}>
      <ToastFetching isShow={!!isFetching}/>
      {children}
    </ApplicationContext.Provider>
  );
};