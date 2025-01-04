import { createFileRoute, Link, Outlet, redirect, useRouter } from '@tanstack/react-router';
import { getCredentials, setCredentials } from '../../../utils/credentials.ts';
import { fetchFn } from '../../../utils/query-fn.ts';
import { Trans } from 'react-i18next';
import { ListLoading } from '../../../components/skeleton/list-loading.tsx';
import { useContext, useEffect, useState } from 'react';
import { ModalMetricsUrl } from '../../../components/modals/modal-metrics-url/modal-metrics-url.tsx';
import { Credentials } from '../../../types';
import ApplicationContext from '../../../context/application/application.context.ts';
import './_layout.css';

export const Route = createFileRoute('/_secured/mt/_layout')({
  beforeLoad: async ({ location, context }) => {
    const { base } = await getCredentials(context.storage, 'metric');
    if (location.pathname === '/mt' && base) {
      throw redirect({ to: '/mt/formatted', replace: true });
    } else if (location.pathname !== '/mt/credentials' && !base) {
      throw redirect({ to: '/mt/credentials', replace: true });
    }
  },
  loader: async ({ context, abortController }) => {
    const { base, token, tokenType } = await getCredentials(context.storage, 'metric');
    if (base) {
      return {
        base,
        metrics: await fetchFn(base, { signal: abortController.signal }, token, tokenType),
      };
    } else {
      return {
        base: null,
        metrics: null,
      };
    }
  },
  component: RouteComponent,
  pendingComponent: Pending,
});

function RouteComponent() {
  const { storage } = useContext(ApplicationContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { invalidate } = useRouter();
  const [metricCredentials, setMetricCredentials] = useState<Partial<Credentials> | null>(null);
  const { base } = Route.useLoaderData() as { metrics: string | null, base: string | null };

  async function onSuccess(credentials: Required<Credentials>) {
    await setCredentials(storage, { ...credentials, component: 'metric' });
    setMetricCredentials(credentials);
    invalidate();
  }

  useEffect(() => {
    getCredentials(storage, 'metric')
      .then(setMetricCredentials)
      .catch(() => {});
  }, []);

  return (
    <div className="metrics-page container pt-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">
            <Trans i18nKey="metrics"/>
          </h1>
          <p className="text-secondary">
            <Trans i18nKey="metrics_page_subtitle"/>
          </p>
        </div>

        {base ? (
          <div className="text-secondary text-sm">
            <span>
              <Trans i18nKey="metric_server_url" />
              <>:&nbsp;</>
              <span className="text-primary">{base}</span>
            </span>
            <Link to="/mt/credentials" className="ml-2 size-6 relative top-1.5 transition opacity-70 hover:opacity-100">
              <i className="icon icon-edit-url icon-lg " />
            </Link>
          </div>
        ) : null}
      </div>

      <nav className="tabs-links">
        <Link to="/mt/formatted" className="tab-link">
          <Trans i18nKey="formatted" />
        </Link>

        <Link to="/mt/raw" className="tab-link">
          <Trans i18nKey="raw_data" />
        </Link>
      </nav>

      <Outlet/>

      <ModalMetricsUrl
        isOpen={isModalOpen}
        onDismiss={() => setIsModalOpen(false)}
        credentials={metricCredentials}
        onSuccess={onSuccess}
      />
    </div>
  );
}

function Pending() {
  return (
    <div className="container pt-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">
            <Trans i18nKey="metrics"/>
          </h1>
          <p className="text-secondary">
            <Trans i18nKey="metrics_page_subtitle"/>
          </p>
        </div>
      </div>

      <ListLoading />
    </div>
  );
}