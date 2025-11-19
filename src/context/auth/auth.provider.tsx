import { FC, PropsWithChildren } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { AuthContext } from '@app-context/auth/auth.context';
import { ICredentials } from '@app-types';
import { AuthForm } from '@app-components/auth-form/auth-form';
import { useQueryClient } from '@tanstack/react-query';
import { AuthState } from '@app-utils/auth-state.ts';
import { useTranslation } from 'react-i18next';
import { ToastOfflineManager } from '@app-utils/toast-offline-manager.ts';
import './auth.provider.css';

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [prefix, setPrefix] = useState<string>();
  const [base, setBase] = useState<string>();
  const client = useQueryClient();

  const logout = useCallback(async () => {
    AuthState.remove();

    setPrefix(undefined);
    setBase(undefined);
    setIsAuthorized(false);
  }, []);

  const onSuccess = useCallback((values: ICredentials) => {
    AuthState.set(values);

    setPrefix(values.token.split('.')[0]);
    setBase(values.base);
    setIsAuthorized(true);
  }, []);

  // Init authorization
  useEffect(() => {
    const credentials = AuthState.get();
    if (!credentials) return;

    setPrefix(credentials.token.split('.')[0]);
    setBase(credentials.base);
    setIsAuthorized(true);
  }, []);

  // Handle any query error
  useEffect(() => {
    const toastManager = new ToastOfflineManager(document.body, t);
    const queryCache = client.getQueryCache();

    const unsubscribe = queryCache.subscribe((event) => {
      if (event.type === 'updated' && event.action.type === 'error') {
        if (event.action.error.code === 401 || event.action.error.code === -1) {
          setIsAuthorized(false);
        }
      }
    });

    const hidde = toastManager.hidde.bind(toastManager);
    const show = toastManager.show.bind(toastManager);
    window.addEventListener('online', hidde);
    window.addEventListener('offline', show);

    return () => {
      unsubscribe();
      window.removeEventListener('online', hidde);
      window.removeEventListener('offline', show);
    };
  }, [t]);

  return (
    <AuthContext.Provider value={{ isAuthorized: true, logout, prefix, base }}>
      {isAuthorized ? (
        <div className="hidden" />
      ) : (
        <div className="auth-provider-lock inset-0">
          <AuthForm onSuccess={onSuccess} />
        </div>
      )}

      <>{children}</>
    </AuthContext.Provider>
  );
};
