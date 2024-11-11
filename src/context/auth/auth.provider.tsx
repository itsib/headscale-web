import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from './auth.context.ts';
import { ModalAuthorization } from '../../components/modals/modal-authorization/modal-authorization.tsx';
import { noop } from '../../utils/noop.ts';
import { fetchFn, normalizeUrl } from '../../utils/query-fn.ts';
import { Credentials, Node } from '../../types';
import { useLocation, useNavigate } from 'react-router-dom';
import { getStoredCredentials, removeTokenCredentials, setStoredCredentials } from '../../utils/local-storage.ts';

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [credentials, setCredentials] = useState<Partial<Credentials>>(getStoredCredentials());
  const [authenticated, setAuthenticated] = useState(!!credentials.token);

  const { mutateAsync: signIn } = useMutation({
    mutationFn: async (credentials: Credentials) => {
      const url = normalizeUrl(credentials.url, '/api/v1/node');
      return await fetchFn<{ nodes: Node[] }>(url, {}, credentials.token, credentials.tokenType);
    },
    onSuccess: async ({ nodes }, credentials: Credentials) => {
      setStoredCredentials(credentials);
      setCredentials(credentials);

      queryClient.setQueryData(['/api/v1/node'], { nodes })

      setAuthenticated(true);
    },
  });

  const logout = useCallback(() => {
    removeTokenCredentials();
    setAuthenticated(false);
    navigate('/')
  }, []);

  // Restore credentials
  useEffect(() => setAuthenticated(!!credentials.token), [credentials.token]);

  // Handle queries errors
  useEffect(() => {
    const cache = queryClient.getQueryCache();
    cache.subscribe(event => {
      if (event.type === 'updated' && event?.action?.type === 'failed' && event.action?.error?.name === 'UnauthorizedError') {
        const metric = getStoredCredentials('metrics');
        const url = event.query?.queryKey?.[0];
        if (metric && url && metric.url === url) return;

        setAuthenticated(false);
      }
    });
  }, []);

  // Enable/Disable queries
  useEffect(() => {
    const { queries } = queryClient.getDefaultOptions();

    queryClient.invalidateQueries().catch(console.error);
    queryClient.setDefaultOptions({
      queries: {
        ...queries,
        enabled: authenticated,
      },
    });
  }, [authenticated]);

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        signIn,
        logout,
        credentials,
      }}>
      {children}

      <ModalAuthorization
        isOpen={!authenticated && pathname !== '/'}
        credentials={credentials}
        onDismiss={noop}
        onSubmit={(credentials: Credentials) => signIn(credentials)}
      />
    </AuthContext.Provider>
  );
};