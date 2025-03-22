import { useCallback, useEffect, useState } from 'preact/hooks';
import { FunctionComponent } from 'preact';
import { ApplicationContext } from './application.context';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { getActiveTheme, Theme } from '@app-utils/theme';
import { StorageAsync } from '@app-utils/storage';
import { ToastOffline } from '@app-components/toast-offline/toast-offline';
import { useIsFetching } from '@tanstack/react-query';
import { ToastFetching } from '@app-components/toast-fetching';

export interface ApplicationProviderProps {
  storage: StorageAsync;
}

export const ApplicationProvider: FunctionComponent<ApplicationProviderProps> = ({ children, storage }) => {
  const [theme, setTheme] = useState<Theme>(getActiveTheme());
  const [isOffLine, setIsOffLine] = useState<boolean>(!navigator.onLine);
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
        console.log('message', event)
      });

      serviceWorker.addEventListener('upgradeneeded', event => {
        console.log('upgradeneeded', event)
      });

      serviceWorker.addEventListener('error', event => {
        console.error('SW error', event)
      });

      serviceWorker.addEventListener('statechange', event => {
        console.log('statechange', serviceWorker.state, event)
      });
    },
    onRegisterError(error) {
      console.error('SW registration error', error)
    },
  });

  // Update theme class name
  useEffect(() => {
    if (theme === Theme.Dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme]);

  // Watch online/offline state
  useEffect(() => {
    const onLine = () => setIsOffLine(false);
    const offLine = () => setIsOffLine(true);
    window.addEventListener('online', onLine);
    window.addEventListener('offline', offLine);

    return () => {
      window.addEventListener('online', onLine);
      window.addEventListener('offline', offLine);
    };
  }, []);

  return (
    <ApplicationContext.Provider value={{ theme, updateTheme, isOffLine, storage }}>
      <ToastOffline isShow={isOffLine} />
      <ToastFetching isShow={!!isFetching} />

      {children}
    </ApplicationContext.Provider>
  )
}