import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient } from '@tanstack/react-query';
import { PersistedClient, Persister, PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { RouterProvider } from 'react-router-dom';
import { ROUTES } from './pages/routes';
import { IndexedDbUtils } from './utils/indexed-db';
import { defaultQueryFn } from './utils/query-fn';
import './i18n';
import 'react-just-ui/theme/minimal.css';
import './index.css'
import { ApplicationProvider } from './context/application/application.provider.tsx';

// export const API_URL_USER = '/api/v1/user';
// export const API_URL_NODE = '/api/v1/node';
// export const API_URL_MACHINE = '/api/v1/machine';
// export const API_URL_ROUTES = '/api/v1/routes';
// export const API_URL_APIKEY = '/api/v1/apikey';
// export const API_URL_PREAUTHKEY = '/api/v1/preauthkey';
// export const API_URL_DEBUG = '/api/v1/debug';

const IDB_KEY = 'MemeBotApp';
const QUERY_CLIENT_STORAGE: Persister = {
  persistClient: async (client: PersistedClient) => {
    await IndexedDbUtils.set(IDB_KEY, client);
  },
  restoreClient: async () => {
    return await IndexedDbUtils.get<PersistedClient>(IDB_KEY);
  },
  removeClient: async () => {
    await IndexedDbUtils.del(IDB_KEY);
  },
};

const QUERY_CLIENT = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'online', // 'offlineFirst',
      gcTime: 86400_000, // 24 hours ms
      retry: 3,
      retryDelay: 3000,
      meta: {
        accessToken: null,
      },
      queryFn: defaultQueryFn as any,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider client={QUERY_CLIENT} persistOptions={{ persister: QUERY_CLIENT_STORAGE }}>
      <ApplicationProvider>
        <RouterProvider router={ROUTES} />
      </ApplicationProvider>
    </PersistQueryClientProvider>
  </StrictMode>,
)
