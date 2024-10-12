import { FC, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useAuthKeys } from '../../hooks/use-auth-keys.ts';
import { ContextAction } from './_api-token-item.tsx';
import { AuthKeyWithUser } from '../../types';
import { AuthKeyItem } from './_auth-key-item.tsx';
import { ListLoading } from '../../components/skeleton/list-loading.tsx';
import { ModalAuthKeyCreate } from '../../components/modals/modal-auth-key-create/modal-auth-key-create.tsx';
import { ModalAuthKeyExpire } from '../../components/modals/modal-auth-key-expire/modal-auth-key-expire.tsx';

export const AuthKeys: FC = () => {
  const { t } = useTranslation();
  const { data: authKeys, isLoading, refetch } = useAuthKeys();

  const [opened, setOpened] = useState<ContextAction | null>(null);
  const [selected, setSelected] = useState<AuthKeyWithUser | null>(null);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="mb-2"><Trans i18nKey="auth_keys"/></h2>
          <p className="text-secondary"><Trans i18nKey="auth_keys_subtitle"/></p>
        </div>

        <button type="button" className="btn btn-primary flex items-center gap-2" onClick={() => setOpened('create')}>
          <i className="icon icon-key-plus text-lg"/>
          <span className="font-semibold">
            <Trans i18nKey="generate_auth_key"/>
          </span>
        </button>
      </div>
      {isLoading ? (
        <ListLoading />
      ) : authKeys?.length ? (
        <div className="overflow-x-auto lg:overflow-x-hidden">
          <table className="w-full min-w-[860px] table-auto border-spacing-px" border={1}>
            <thead>
            <tr className="border-b border-b-primary h-[50px] text-sm font-semibold text-secondary uppercase">
              <th/>
              <th className="text-left whitespace-nowrap">{t('auth_key')}</th>
              <th className="text-left whitespace-nowrap">{t('user')}</th>
              <th className="text-center whitespace-nowrap">{t('type')}</th>
              <th className="text-left whitespace-nowrap lg:pl-10">{t('created')}</th>
              <th className="text-left whitespace-nowrap">{t('expiry')}</th>
              <th/>
            </tr>
            </thead>
            <tbody>
            {authKeys?.map(({ key, ...authKey }) => (
              <AuthKeyItem
                key={key}
                authKey={key}
                onAction={action => {
                  setSelected({ ...authKey, key });
                  setOpened(action);
                }}
                {...authKey} />
            ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border-primary border rounded-md p-8 text-center">
          <Trans i18nKey="no_auth_keys"/>
        </div>
      )}

      <ModalAuthKeyCreate
        isOpen={opened === 'create'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => refetch()}
      />
      <ModalAuthKeyExpire
        isOpen={opened === 'expire'}
        authKey={selected}
        onDismiss={() => setOpened(null)}
        onSuccess={() => refetch()}
      />
    </>
  );
}