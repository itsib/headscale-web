import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient } from '@tanstack/react-query';
import { PersistedClient, Persister, PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ApplicationProvider } from './context/application/application.provider.tsx';
import { RouterProvider } from 'react-router-dom';
import { ROUTES } from './pages/routes';
import { IndexedDbUtils } from './utils/indexed-db';
import { defaultQueryFn } from './utils/query-fn';
import './i18n';
import 'react-just-ui/theme/minimal.css';
import './index.css'

const IDB_KEY = 'HeadscaleUI';
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
