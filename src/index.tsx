import './i18n';

import { LocationProvider } from 'preact-iso';
import { render } from 'preact';
import { QueryClient } from '@tanstack/react-query';
import { PersistedClient, Persister, PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ApplicationProvider } from '@app-context/application/application.provider';
import { IDBStorage } from '@app-utils/idb-storage';
import { getDefaultQueryFn } from '@app-utils/query-fn';
import { StorageTables } from '@app-types';
import { IDB_VERSION } from './config.ts';

import 'react-just-ui/theme/minimal.css';
import './index.css';

const BUILD_ID = import.meta.env.VITE_BUILD_ID;

const storage = IDBStorage.get<StorageTables>('HeadscaleUI', IDB_VERSION, { cache: [], appStore: [] });

const persister: Persister = {
  async persistClient(persistClient: PersistedClient): Promise<void> {
    await storage.writeCache('persister', persistClient);
  },
  async restoreClient(): Promise<PersistedClient | undefined> {
    return await storage.readCache('persister');
  },
  async removeClient(): Promise<void> {
    await storage.deleteCache('persister');
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 4,
      retryDelay: 3000,
      queryFn: getDefaultQueryFn(storage) as any,
    },
  },
});

async function init() {
  const { Application } = await import('./pages/application.tsx');
  const rootElement = document.getElementById('root')!

  render(
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister, buster: BUILD_ID }}>
      <ApplicationProvider storage={storage}>
        <LocationProvider>
          <Application />
        </LocationProvider>
      </ApplicationProvider>
    </PersistQueryClientProvider>,
    rootElement,
  );
}

init();