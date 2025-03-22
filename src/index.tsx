import './i18n';

import { LocationProvider } from 'preact-iso';
import { render } from 'preact';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ApplicationProvider } from '@app-context/application';
import { AuthProvider } from '@app-context/auth';
import { getDefaultQueryFn } from '@app-utils/query-fn';
import { createPersister, createStorage } from '@app-utils/storage.ts';

import 'react-just-ui/theme/minimal.css';
import './index.css';

const BUILD_ID = import.meta.env.BUILD_ID;
const VERSION = import.meta.env.VERSION;
const NODE_ENV = import.meta.env.NODE_ENV;

const storage = createStorage('app');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry(failureCount: number, error: any) {
        return failureCount <= 4 && error.code !== 401;
      },
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
  const rootElement = document.getElementById('root')!;

  render(
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: createPersister(), buster: BUILD_ID }}>
      <ApplicationProvider storage={storage}>
        <AuthProvider>
          <LocationProvider>
            <Application/>
          </LocationProvider>
        </AuthProvider>
      </ApplicationProvider>
    </PersistQueryClientProvider>,
    rootElement,
  );
}

showAppVersion();

init();