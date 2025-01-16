import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { fetchWithContext } from '../../../utils/query-fn.ts';
import { Trans } from 'react-i18next';
import { ListLoading } from '../../../components/skeleton/list-loading.tsx';
import './_layout.css';

export const Route = createFileRoute('/_secured/metrics/_layout')({
  loader: async ({ context, abortController }) => {
    return fetchWithContext(
      '/metrics',
      { signal: abortController.signal },
      context.storage,
    );
  },
  component: RouteComponent,
  pendingComponent: Pending,
});

function RouteComponent() {
  return (
    <div className="metrics-page container pt-6">
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
        <Link to="/metrics/formatted" className="tab-link">
          <Trans i18nKey="formatted" />
        </Link>

        <Link to="/metrics/raw" className="tab-link">
          <Trans i18nKey="raw_data" />
        </Link>
      </nav>

      <Outlet />
    </div>
  );
}

function Pending() {
  return (
    <div className="container pt-6">
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

      <ListLoading />
    </div>
  );
}
