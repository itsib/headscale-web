import './i18n';

import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { ApplicationProvider } from '@app-context/application';
import { AuthProvider } from '@app-context/auth';
import { NotifyProvider } from '@app-context/notify';
import { defaultQueryFn } from '@app-utils/query-fn';
import { showAppVersion } from '@app-utils/logging.ts';
import { routeTree } from './route-tree.gen';

import 'react-just-ui/theme/minimal.css';
import './index.css';

const VERSION = import.meta.env.VERSION;
const NODE_ENV = import.meta.env.NODE_ENV;

const client = new QueryClient({
  queryCache: new QueryCache(),
  mutationCache: new MutationCache(),
  defaultOptions: {
    queries: {
      retry(failureCount: number, error: any) {
        if (error.code === -1 || error.code === 401 || error.code === 404) {
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

const router = createRouter({
  routeTree,
  context: {
    client,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement, {
  onUncaughtError(error: any, errorInfo: { componentStack?: string | undefined }) {
    console.error(error, errorInfo);
  },
});

root.render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <NotifyProvider>
        <ApplicationProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </ApplicationProvider>
      </NotifyProvider>
    </QueryClientProvider>
  </StrictMode>
);

showAppVersion(NODE_ENV, VERSION);
