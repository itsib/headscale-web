import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient } from '@tanstack/react-query';
import { PersistedClient, Persister, PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ApplicationProvider } from './context/application/application.provider.tsx';
import { RouterProvider } from 'react-router-dom';
import { ROUTES } from './pages/routes';
import { IDBStorage } from './utils/idb-storage.ts';
import { defaultQueryFn } from './utils/query-fn';
import './i18n';
import 'react-just-ui/theme/minimal.css';
import './index.css';

const BUILD_ID = import.meta.env.VITE_BUILD_ID;

const storage = IDBStorage.get('HeadscaleUI', 4, { cache: [] });

const persister: Persister = {
  async persistClient(persistClient: PersistedClient): Promise<void> {
    await storage.writeCache('persister', persistClient);
  },
  async restoreClient(): Promise<PersistedClient | undefined> {
    return await storage.readCache('persister')
  },
  async removeClient(): Promise<void> {
    await storage.deleteCache('persister');
  },
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 4,
      retryDelay: 3000,
      queryFn: defaultQueryFn as any,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister, buster: BUILD_ID }}>
      <ApplicationProvider>
        <RouterProvider router={ROUTES} />
      </ApplicationProvider>
    </PersistQueryClientProvider>
  </StrictMode>,
)
