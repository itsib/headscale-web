import {
  createFileRoute,
  getRouteApi,
  useRouter,
} from '@tanstack/react-router';
import { useContext, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { fetchWithContext } from '../../../../utils/query-fn.ts';
import { AclPolicy } from '../../../../types';
import { formatError } from '../../../../utils/errors.ts';
import { Trans } from 'react-i18next';
import { JsonCodeEditor } from '../../../../components/json-code-editor/json-code-editor.tsx';
import ApplicationContext from '../../../../context/application/application.context.ts';

export const Route = createFileRoute('/_secured/acl/_layout/edit-file')({
  component: Component,
});

function Component() {
  const routeApi = getRouteApi('/_secured/acl/_layout');
  const { invalidate } = useRouter();
  const { storage } = useContext(ApplicationContext);
  const { policy } = routeApi.useLoaderData();
  const [policyTyped, setPolicyTyped] = useState<string>(policy);

  const { mutate, isPending, error, reset } = useMutation({
    mutationKey: ['/api/v1/policy'],
    mutationFn(policy: string) {
      return fetchWithContext<AclPolicy>(
        '/api/v1/policy',
        {
          method: 'PUT',
          body: JSON.stringify({ policy }),
        },
        storage,
      );
    },
    onSuccess() {
      invalidate();
    },
  });

  return (
    <>
      <div className="tabs-content jj-scroll">
        <div className="py-4 max-h-[calc(100vh-360px)] overflow-y-auto">
          <JsonCodeEditor value={policyTyped} onChange={setPolicyTyped} />
        </div>
      </div>

      <div className="min-h-[30px] text-sm pt-2">
        {error ? (
          <span className="text-red-500 px-4">{formatError(error)}</span>
        ) : null}
      </div>
      <div className="mt-4 flex gap-4 justify-end">
        <button
          className="jj-btn btn-outline-secondary min-w-[180px]"
          disabled={(policy === policyTyped || isPending) && !error}
          onClick={() => {
            setPolicyTyped(policy);
            reset();
          }}
        >
          <span>
            <Trans i18nKey="discard_changes" />
          </span>
        </button>

        <button
          className={`jj-btn btn-accent min-w-[120px] ${isPending ? 'loading' : ''}`}
          disabled={policy === policyTyped || isPending}
          onClick={() => mutate(policyTyped || '')}
        >
          <span>
            <Trans i18nKey="save" />
          </span>
        </button>
      </div>
    </>
  );
}
