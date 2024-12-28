import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient } from '@tanstack/react-query';
import { PersistedClient, Persister, PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ApplicationProvider } from './context/application/application.provider.tsx';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { IDBStorage } from './utils/idb-storage.ts';
import { getDefaultQueryFn } from './utils/query-fn';
import { routeTree } from './route-tree.gen';
import './i18n';
import 'react-just-ui/theme/minimal.css';
import './index.css';
import { StorageTables } from './types';
import { IDB_VERSION } from './config.ts';

const BUILD_ID = import.meta.env.VITE_BUILD_ID;

const storage = IDBStorage.get<StorageTables>('HeadscaleUI', IDB_VERSION, { cache: [], appStore: [] });

const router = createRouter({
  routeTree,
  defaultSsr: false,
  defaultPreload: 'intent',
  context: {
    isAuthorized: false,
    storage,
  },
});

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
      queryFn: getDefaultQueryFn(storage) as any,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister, buster: BUILD_ID }}>
      <ApplicationProvider storage={storage}>
        {({ isAuthorized }) => <RouterProvider router={router} context={{ isAuthorized, storage }} />}
      </ApplicationProvider>
    </PersistQueryClientProvider>
  </StrictMode>,
)
