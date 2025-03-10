import { useCallback, useEffect, useState } from 'preact/hooks';
import { FunctionComponent } from 'preact';
import { ApplicationContext } from './application.context';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Trans } from 'react-i18next';
import { getActiveTheme, Theme } from '@app-utils/theme';
import { AnimatedShow } from '@app-components/animated-show/animated-show';
import { ImgCompass } from '@app-components/img-compass/img-compass';
import { IDBStorageInstance } from '@app-utils/idb-storage';
import { StorageTables } from '@app-types';

export interface ApplicationProviderProps {
  storage: IDBStorageInstance<StorageTables>;
}

export const ApplicationProvider: FunctionComponent<ApplicationProviderProps> = ({ children, storage }) => {
  const [theme, setTheme] = useState<Theme>(getActiveTheme());
  const [isOffLine, setIsOffLine] = useState<boolean>(!navigator.onLine);
  const [, setNeedsRefresh] = useState<boolean>(false);

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
      <div className="fixed inset-0 bottom-auto h-0 z-30">
        <AnimatedShow show={isOffLine}>
          <div className="toast">
            <ImgCompass className="wait" size={36} />
            <div>
              <Trans i18nKey="error_offline" />
              <span>...</span>
            </div>
          </div>
        </AnimatedShow>
      </div>
      {children}
    </ApplicationContext.Provider>
  )
}