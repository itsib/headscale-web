import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { PageCaption } from '@app-components/page-caption/page-caption.tsx';
import { EditorLoading } from '@app-components/skeleton';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createContext } from 'react';
import './_tabs.css';

export const PolicyPageContext = createContext<string | null>(null);

const policyQueryOptions = queryOptions<{ policy: string }, Error, string>({
  queryKey: ['/api/v1/policy', 'GET'],
  select: (data) => data.policy,
  staleTime: 0,
  refetchInterval: false,
});

export const Route = createFileRoute('/acl/_tabs')({
  loader: ({ context }) => context.client.ensureQueryData(policyQueryOptions),
  pendingComponent: EditorLoading,
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  const { data } = useSuspenseQuery(policyQueryOptions);

  return (
    <PolicyPageContext.Provider value={data || null}>
      <div className="page acl-page">
        <PageCaption title="access_controls" subtitle="access_controls_subtitle" />

        <div className="tabs-links">
          <Link to="/acl/edit-file" className="tab-link">
            <i className="icon icon-edit-code" />
            {t('edit_file')}
          </Link>
          <Link to="/acl/preview" className="tab-link">
            <i className="icon icon-eye" />
            {t('preview')}
          </Link>
        </div>

        <Outlet />
      </div>
    </PolicyPageContext.Provider>
  );
}
