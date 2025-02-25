import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { AuthContext } from '@app-context/auth/auth.context';
import { useStorage } from '@app-hooks/use-storage.ts';
import { Credentials, TokenType } from '@app-types';
import { useCallback } from 'react';
import { AuthForm } from '@app-components/auth-form/auth-form.tsx';
import { fetchFn } from '@app-utils/query-fn.ts';
import { joinUrl } from '@app-utils/join-url.ts';
import { removeCredentials, setCredentials } from '@app-utils/credentials.ts';

export const AuthProvider: FunctionComponent = ({ children }) =>  {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [prefix, setPrefix] = useState<string>();
  const [base, setBase] = useState<string>();
  const storage = useStorage();

  const logout = useCallback(async () => {
    await removeCredentials(storage);
    setPrefix(undefined);
    setBase(undefined);
    setIsAuthorized(false);
  }, [storage]);

  async function submit(values: Credentials) {
    await fetchFn(joinUrl(values.base, '/api/v1/node'), { method: 'GET' }, values.token, values.tokenType);

    await setCredentials(storage, { ...values });
    setPrefix(values.token.split('.')[0]);
    setBase(values.base);
    setIsAuthorized(true);
  }

  // Init authorization
  useEffect(() => {
    async function init() {
      const [base, token, tokenType] = await Promise.all([
        storage.readAppStore<string>('main-url'),
        storage.readAppStore<string>('main-token'),
        storage.readAppStore<TokenType>('main-token-type'),
      ]);
      setIsAuthorized(!!base && !!token && !!tokenType);

      if (token) setPrefix(token.split('.')[0]);
      if (base) setBase(base);
    }

    init().catch(console.error);
  }, [storage]);

  return (
    <AuthContext.Provider value={{ isAuthorized: !!isAuthorized, logout, prefix, base }}>
      {isAuthorized === null ? null : isAuthorized ? children : (
        <div className="container">
          <div className="w-full h-[80vh] min-h-[max(80vh, 700px)] flex items-start justify-center">
            <AuthForm submit={submit} />
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};