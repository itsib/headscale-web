import { FC, useCallback, useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { NavLink, Outlet } from 'react-router-dom';
import { useAclPolicy } from '../../hooks/use-acl-policy.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signedQueryFn } from '../../utils/query-fn.ts';
import { AclPolicy } from '../../types';
import { formatError } from '../../utils/errors.ts';
import './acl.css';

export const AclContent: FC = () => {
  const { data, isLoading, error } = useAclPolicy();
  const { policy: policyOrigin = '' } = data || {};
  const [policyNew, setPolicyNew] = useState<string>('');

  const onChange = useCallback((policy: string) => setPolicyNew(policy), []);

  // Hold policy state
  useEffect(() => {
    if (isLoading || !policyOrigin) {
      return;
    }
    setPolicyNew(policyOrigin);
  }, [policyOrigin, isLoading]);

  return (
    <div className="acl-page container pt-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2"><Trans i18nKey="access_controls"/></h1>
          <p className="text-secondary"><Trans i18nKey="access_controls_subtitle"/></p>
        </div>
      </div>

      <div className="tabs-links">
        <NavLink to="" end className={({ isActive }) => `tab-link ${isActive ? 'active' : ''}`}>
          <i className="icon icon-edit-code"/>
          <Trans i18nKey="edit_file"/>
        </NavLink>
        <NavLink to="preview" className={({ isActive }) => `tab-link ${isActive ? 'active' : ''}`}>
          <i className="icon icon-eye"/>
          <Trans i18nKey="preview"/>
        </NavLink>
      </div>

      <div className="tabs-content">
        <Outlet context={{ value: policyNew, onChange }}/>
      </div>

      <ButtonBlock
        policyOrigin={policyOrigin || undefined}
        policyNew={policyNew || undefined}
        onReset={() => setPolicyNew(policyOrigin || '')}
        error={error}
      />
    </div>
  );
};

interface ButtonBlock {
  policyOrigin?: string;
  policyNew?: string;
  onReset?: () => void;
  error?: Error | null;
}

const ButtonBlock: FC<ButtonBlock> = ({ policyOrigin, policyNew, onReset, error: error0 }) => {
  const client = useQueryClient();

  const { mutate, isPending, error: error1, reset } = useMutation({
    mutationKey: ['/api/v1/policy'],
    mutationFn(policy: string) {
      return signedQueryFn<AclPolicy>('/api/v1/policy', {
        method: 'PUT',
        body: JSON.stringify({ policy }),
      });
    },
    onSuccess(result: AclPolicy) {
      client.setQueryData(['/api/v1/policy'], result);
    },
  });

  const error = error0 || error1;

  return (
    <>
      <div className="min-h-[30px] text-sm pt-2">
        {error ? (
          <span className="text-red-500 px-4">{formatError(error)}</span>
        ) : null}
      </div>
      <div className="mt-4 flex gap-4 justify-end">
        <button
          className="jj-jj-btn btn-outline-secondary min-w-[180px]"
          disabled={(policyOrigin === policyNew || isPending) && !error1}
          onClick={() => {
            reset();
            onReset?.();
          }}
        >
          <span><Trans i18nKey="discard_changes"/></span>
        </button>

        <button
          className={`jj-btn btn-accent min-w-[120px] ${isPending ? 'loading' : ''}`}
          disabled={policyOrigin === policyNew || isPending}
          onClick={() => mutate(policyNew || '')}
        >
          <span><Trans i18nKey="save"/></span>
        </button>
      </div>
    </>
  );
};