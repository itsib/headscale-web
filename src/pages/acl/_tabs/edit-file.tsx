import { createFileRoute } from '@tanstack/react-router';
import { useContext, useState } from 'react';
import { Trans } from 'react-i18next';
import { formatError } from '@app-utils/errors';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AclPolicy } from '@app-types';
import { JsonEditor } from '@app-components/json-editor/json-editor';
import { DEFAULT_ACL_POLICY } from '@app-config';
import { fetchFn } from '@app-utils/query-fn.ts';
import { PolicyPageContext } from '../_tabs.tsx';

export const Route = createFileRoute('/acl/_tabs/edit-file')({
  component: RouteComponent,
});

function RouteComponent() {
  const policy = useContext(PolicyPageContext);
  const client = useQueryClient();
  const [policyTyped, setPolicyTyped] = useState<string>(policy || DEFAULT_ACL_POLICY);
  const isChanged = policy !== policyTyped;

  const { mutate, isPending, error, reset } = useMutation({
    mutationKey: ['/api/v1/policy', 'PUT'],
    mutationFn(policy: string) {
      return fetchFn<AclPolicy>('/api/v1/policy', {
        method: 'PUT',
        body: JSON.stringify({ policy }),
      });
    },
    onSuccess: () => {
      client.setQueryData(['/api/v1/policy', 'GET'], policyTyped);
    },
  });

  return (
    <>
      <div className="tabs-content ui-scroll">
        <div className="py-4 max-h-[calc(100vh-380px)] overflow-y-auto">
          <JsonEditor
            value={policyTyped}
            onChange={setPolicyTyped}
            onSave={() => {
              if (isChanged) {
                mutate(policyTyped);
              }
            }}
          />
        </div>
      </div>

      <div style={{ minHeight: '30px' }} className="text-sm pt-2">
        {error ? <span className="text-danger px-4">{formatError(error)}</span> : null}
      </div>
      <div className="mt-4 flex gap-4 justify-end">
        <button
          style={{ minWidth: '180px' }}
          className="btn btn-outline-secondary"
          disabled={(!isChanged || isPending || policy == null) && !error}
          onClick={() => {
            setPolicyTyped(policy || DEFAULT_ACL_POLICY);
            reset();
          }}
        >
          <span>
            <Trans i18nKey="discard_changes" />
          </span>
        </button>

        <button
          style={{ minWidth: '120px' }}
          className="btn btn-accent"
          disabled={!isChanged && policy != null}
          data-loading={isPending}
          onClick={() => {
            if (isChanged && !isPending) {
              mutate(policyTyped);
            }
          }}
        >
          <span>
            <Trans i18nKey="save" />
          </span>
        </button>
      </div>
    </>
  );
}
