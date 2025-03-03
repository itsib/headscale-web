import { useState } from 'preact/hooks';
import { Trans } from 'react-i18next';
import { formatError } from '@app-utils/errors';
import { FunctionComponent } from 'preact';
import { useStorage } from '@app-hooks/use-storage.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithContext } from '@app-utils/query-fn.ts';
import { AclPolicy } from '@app-types';
import { JsonEditor } from '@app-components/json-editor/json-editor';
import { DEFAULT_ACL_POLICY } from '@app-config';

export const EditFile: FunctionComponent<{ policy?: string | null }> = ({ policy })=>  {
  const storage = useStorage();
  const client = useQueryClient();
  const [policyTyped, setPolicyTyped] = useState<string>(policy || DEFAULT_ACL_POLICY);
  const isChanged = policy !== policyTyped;

  const { mutate, isPending, error, reset } = useMutation({
    mutationKey: ['/api/v1/policy', 'PUT'],
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
    onSuccess: () => {
      client.setQueryData(['/api/v1/policy', 'GET'], policyTyped);
    }
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

      <div className="min-h-[30px] text-sm pt-2">
        {error ? (
          <span className="text-red-500 px-4">{formatError(error)}</span>
        ) : null}
      </div>
      <div className="mt-4 flex gap-4 justify-end">
        <button
          className="btn btn-outline-secondary min-w-[180px]"
          disabled={(!isChanged || isPending || policy === null) && !error}
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
          className="btn btn-accent min-w-[120px]"
          disabled={!isChanged && policy !== null}
          data-loading={isPending}
          onClick={() => {
            if (isChanged && !isPending) {
              mutate(policyTyped)
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
