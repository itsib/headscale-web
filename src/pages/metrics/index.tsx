import { Trans } from 'react-i18next';
import { ListLoading } from '@app-components/skeleton/list-loading';
import { useLocation } from 'preact-iso/router';
import { cn } from 'react-just-ui/utils/cn';
import { useQuery } from '@tanstack/react-query';
import { REFRESH_INTERVAL } from '@app-config';
import { Redirect } from '@app-components/redirect/redirect';
import { FormattedPage } from './formatted';
import { RawPage } from './raw';
import { EmptyList } from '@app-components/empty-list/empty-list';
import './index.css';

export default function Metrics() {
  const { path } = useLocation();

  const { data: metrics, isLoading, refetch } = useQuery<string>({
    queryKey: ['/metrics'],
    staleTime: REFRESH_INTERVAL,
    refetchInterval: REFRESH_INTERVAL,
  });

  return (
    <div className="metrics-page">
      <h1>
        <Trans i18nKey="metrics" />
      </h1>
      <p className="sub-caption">
        <Trans i18nKey="metrics_page_subtitle" />
      </p>

      <nav className="tabs-links">
        <a href="/metrics/formatted" className={cn('tab-link', { active: path.startsWith('/metrics/formatted') })}>
          <Trans i18nKey="formatted" />
        </a>

        <a href="/metrics/raw" className={cn('tab-link', { active: path.startsWith('/metrics/raw') })}>
          <Trans i18nKey="raw_data" />
        </a>
      </nav>

      {isLoading ? (
        <ListLoading />
      ) : !metrics?.length ? (
        <EmptyList />
      ) : path === '/metrics/formatted' ? (
        <FormattedPage metrics={metrics} refetch={refetch} />
      ) : path === '/metrics/raw' ? (
        <RawPage metrics={metrics} refetch={refetch} />
      ) : (
        <Redirect to="/metrics/formatted"/>
      )}
    </div>
  );
}
