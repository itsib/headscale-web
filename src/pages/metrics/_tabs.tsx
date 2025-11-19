import { Trans } from 'react-i18next';
import { ListLoading } from '@app-components/skeleton/list-loading';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { REFRESH_INTERVAL } from '@app-config';
import { PageCaption } from '@app-components/page-caption/page-caption';
import { createContext } from 'react';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import './_tabs.css';

export const MetricsPageContext = createContext<string>('');

const metricsQueryOptions = queryOptions<string>({
  queryKey: ['/metrics', 'GET'],
  staleTime: REFRESH_INTERVAL,
  refetchInterval: REFRESH_INTERVAL,
});

export const Route = createFileRoute('/metrics/_tabs')({
  loader: ({ context }) => context.client.ensureQueryData(metricsQueryOptions),
  component: RouteComponent,
  pendingComponent: ListLoading,
});

export function RouteComponent() {
  const { data } = useSuspenseQuery(metricsQueryOptions);

  return (
    <MetricsPageContext.Provider value={data}>
      <div className="page metrics-page">
        <PageCaption title="metrics" subtitle="metrics_page_subtitle" />

        <nav className="tabs-links">
          <Link to="/metrics/formatted" className="tab-link">
            <Trans i18nKey="formatted" />
          </Link>

          <Link to="/metrics/raw" className="tab-link">
            <Trans i18nKey="raw_data" />
          </Link>
        </nav>

        <Outlet />
      </div>
    </MetricsPageContext.Provider>
  );
}
