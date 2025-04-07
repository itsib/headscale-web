import { Trans } from 'react-i18next';
import { ListLoading } from '@app-components/skeleton/list-loading';
import { useLocation } from 'preact-iso/router';
import { cn } from 'react-just-ui/utils/cn';
import { useQuery } from '@tanstack/react-query';
import { REFRESH_INTERVAL } from '@app-config';
import { Redirect } from '@app-components/redirect/redirect';
import { Formatted } from './formatted';
import { Raw } from './raw';
import './index.css';

export default function Metrics() {
  const { path } = useLocation();

  const { data: metrics, isLoading, refetch } = useQuery<string>({
    queryKey: ['/metrics'],
    staleTime: REFRESH_INTERVAL,
    refetchInterval: REFRESH_INTERVAL,
  });

  return (
    <div className="metrics-page pt-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">
            <Trans i18nKey="metrics" />
          </h1>
          <p className="text-secondary">
            <Trans i18nKey="metrics_page_subtitle" />
          </p>
        </div>
      </div>

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
      ) : path === '/metrics/formatted' ? (
        <Formatted metrics={metrics} refetch={refetch} />
      ) : path === '/metrics/raw' ? (
        <Raw metrics={metrics} refetch={refetch} />
      ) : (
        <Redirect to="/metrics/formatted"/>
      )}
    </div>
  );
}
