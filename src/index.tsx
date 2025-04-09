import './i18n';

import { LocationProvider } from 'preact-iso';
import { render } from 'preact';
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { ApplicationProvider } from '@app-context/application';
import { AuthProvider } from '@app-context/auth';
import { defaultQueryFn } from '@app-utils/query-fn';

import 'react-just-ui/theme/minimal.css';
import './index.css';

const VERSION = import.meta.env.VERSION;
const NODE_ENV = import.meta.env.NODE_ENV;

const queryClient = new QueryClient({
  queryCache: new QueryCache(),
  mutationCache: new MutationCache(),
  defaultOptions: {
    queries: {
      retry(failureCount: number, error: any) {
        if (error.code === -1 || error.code === 401) {
          return false;
        }
        return failureCount <= 3;
      },
      staleTime: 20_000,
      gcTime: 60_000,
      networkMode: 'offlineFirst',
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      retryDelay: 3_000,
      queryFn: defaultQueryFn as any,
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
    <QueryClientProvider client={queryClient}>
      <ApplicationProvider>
        <AuthProvider>
          <LocationProvider>
            <Application/>
          </LocationProvider>
        </AuthProvider>
      </ApplicationProvider>
    </QueryClientProvider>,
    rootElement,
  );
}

showAppVersion();

init();