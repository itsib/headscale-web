import './i18n';

import { LocationProvider } from 'preact-iso';
import { render } from 'preact';
import { QueryClient } from '@tanstack/react-query';
import { PersistedClient, Persister, PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ApplicationProvider } from '@app-context/application';
import { AuthProvider } from '@app-context/auth';
import { IDBStorage } from '@app-utils/idb-storage';
import { getDefaultQueryFn } from '@app-utils/query-fn';
import { StorageTables } from '@app-types';
import { IDB_VERSION } from './config.ts';

import 'react-just-ui/theme/minimal.css';
import './index.css';

const BUILD_ID = import.meta.env.BUILD_ID;
const VERSION = import.meta.env.VERSION;
const NODE_ENV = import.meta.env.NODE_ENV;

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
      staleTime: 20_000,
      gcTime: 60_000,
      networkMode: 'offlineFirst',
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      retryDelay: 3_000,
      queryFn: getDefaultQueryFn(storage) as any,
    },
  },
});

function showAppVersion() {
  const formatRegular = 'color: #ffffff; font-size: 11px;';
  const formatAccent = 'color: #dfb519; font-weight: bold; font-size: 11px;';

  console.log(
    `%cApp running in %c${NODE_ENV.toUpperCase()} %cmode. Version %cv${VERSION}`,
    formatRegular,
    formatAccent,
    formatRegular,
    formatAccent,
  );
}

async function init() {
  const { Application } = await import('./pages/application.tsx');
  const rootElement = document.getElementById('root')!

  render(
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister, buster: BUILD_ID }}>
      <ApplicationProvider storage={storage}>
        <AuthProvider>
          <LocationProvider>
            <Application />
          </LocationProvider>
        </AuthProvider>
      </ApplicationProvider>
    </PersistQueryClientProvider>,
    rootElement,
  );
}

showAppVersion();
init();