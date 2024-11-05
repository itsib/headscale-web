import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from './auth.context.ts';
import { ModalAuthorization } from '../../components/modals/modal-authorization/modal-authorization.tsx';
import { noop } from '../../utils/noop.ts';
import { fetchFn } from '../../utils/query-fn.ts';
import { Credentials, Node } from '../../types';
import { normalizeUrl } from '../../utils/normalize-url.ts';
import { useLocation, useNavigate } from 'react-router-dom';

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [baseUrl, setBaseUrl] = useState<string>();
  const [token, setToken] = useState<string>();
  const [metricsUrl, setMetricsUrl] = useState<string>();
  const [authenticated, setAuthenticated] = useState(true);

  const { mutateAsync: signIn } = useMutation({
    mutationFn: async (credentials: Credentials) => {
      const url = normalizeUrl(credentials.baseUrl, '/api/v1/node');
      return await fetchFn<{ nodes: Node[] }>(url, {}, credentials.token);
    },
    onSuccess: async ({ nodes }, credentials: Credentials) => {
      localStorage.setItem('headscale.token', credentials.token);
      localStorage.setItem('headscale.url', credentials.baseUrl);
      localStorage.setItem('headscale.metric-url', credentials.metricsUrl || '');

      setToken(credentials.token);
      setBaseUrl(credentials.baseUrl);
      setMetricsUrl(credentials.metricsUrl);

      queryClient.setQueryData(['/api/v1/node'], { nodes })

      setAuthenticated(true);
    },
  });

  const setMetricUrl = useCallback((metricsUrl: string) => {
    localStorage.setItem('headscale.metric-url', metricsUrl);
    setMetricsUrl(metricsUrl);
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('headscale.token');
    setAuthenticated(false);
    navigate('/')
  }, []);

  // Restore credentials
  useEffect(() => {
    const token = localStorage.getItem('headscale.token');
    const baseUrl = localStorage.getItem('headscale.url');
    const metricsUrl = localStorage.getItem('headscale.metric-url');

    if (token) setToken(token);
    if (baseUrl) setBaseUrl(baseUrl);
    if (metricsUrl) setMetricsUrl(metricsUrl);

    setAuthenticated(!!token && !!baseUrl);
  }, []);

  // Handle queries errors
  useEffect(() => {
    const cache = queryClient.getQueryCache();
    cache.subscribe(event => {
      if (event.type === 'updated' && event?.action?.type === 'failed' && event.action?.error?.name === 'UnauthorizedError') {
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
        setMetricUrl,
        baseUrl,
        metricsUrl,
        token,
      }}>
      {children}

      <ModalAuthorization
        isOpen={!authenticated && pathname !== '/'}
        baseUrl={baseUrl}
        token={token}
        metricsUrl={metricsUrl}
        onDismiss={noop}
        onSubmit={(credentials: Credentials) => signIn(credentials)}
      />
    </AuthContext.Provider>
  );
};