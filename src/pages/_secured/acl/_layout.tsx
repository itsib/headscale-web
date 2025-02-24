import { createFileRoute, ErrorComponentProps, Link, Outlet, useNavigate } from '@tanstack/react-router';
import { fetchWithContext } from '../../../utils/query-fn.ts';
import { Trans, useTranslation } from 'react-i18next';
import { ListLoading } from '../../../components/skeleton/list-loading.tsx';
import { useLog } from '../../../hooks/use-log.ts';
import { useEffect } from 'react';
import { useUpdateAcl } from '../../../hooks/use-update-acl.ts';
import { DEFAULT_ACL_POLICY } from '../../../config.ts';
import './_layout.css';

export const Route = createFileRoute('/_secured/acl/_layout')({
  component: Component,
  loader: ({ context, abortController }) => {
    return fetchWithContext(
      '/api/v1/policy',
      { signal: abortController.signal },
      context.storage,
    );
  },
  pendingComponent: Pending,
  errorComponent: ErrorComponent,
});

function Component() {
  return (
    <div className="acl-page pt-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">
            <Trans i18nKey="access_controls" />
          </h1>
          <p className="text-secondary">
            <Trans i18nKey="access_controls_subtitle" />
          </p>
        </div>
      </div>

      <div className="tabs-links">
        <Link
          to="/acl/edit-file"
          className="tab-link"
          activeProps={{ className: 'active' }}
        >
          <i className="icon icon-edit-code" />
          <Trans i18nKey="edit_file" />
        </Link>
        <Link
          to="/acl/preview"
          className="tab-link"
          activeProps={{ className: 'active' }}
        >
          <i className="icon icon-eye" />
          <Trans i18nKey="preview" />
        </Link>
      </div>

      <Outlet />
    </div>
  );
}

function Pending() {
  useTranslation();

  return (
    <div className="container pt-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">
            <Trans i18nKey="access_controls" />
          </h1>
          <p className="text-secondary">
            <Trans i18nKey="access_controls_subtitle" />
          </p>
        </div>
      </div>
      <ListLoading />
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const navigate = useNavigate();
  const { mutateAsync } = useUpdateAcl();

  useLog({ error });

  useEffect(() => {
    if (!error.message?.includes('acl policy not found')) {
      navigate({ to: '/error-500' });
    }

    mutateAsync(DEFAULT_ACL_POLICY).then(() => {
      reset();
    })
  }, [error]);

  return (
    <div className="container pt-6">

    </div>
  );
}
