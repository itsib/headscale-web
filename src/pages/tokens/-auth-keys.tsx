import { useMemo, useState } from 'preact/hooks';
import { Checkbox } from 'react-just-ui/checkbox';
import { AuthKeyWithUser } from '@app-types';
import { Trans, useTranslation } from 'react-i18next';
import { useAuthKeys } from '@app-hooks/use-auth-keys';
import { ListLoading } from '@app-components/skeleton/list-loading';
import { ModalAuthKeyCreate } from '@app-components/modals/modal-auth-key-create/modal-auth-key-create';
import { ModalAuthKeyExpire } from '@app-components/modals/modal-auth-key-expire/modal-auth-key-expire';
import { ContextAction } from './-api-token-item';
import { AuthKeyItem } from './-auth-key-item';

export const AuthKeys = () => {
  const { t } = useTranslation();
  const { data: authKeys, isLoading, refetch } = useAuthKeys();

  const [opened, setOpened] = useState<ContextAction | null>(null);
  const [selected, setSelected] = useState<AuthKeyWithUser | null>(null);
  const [isShowExpired, setIsShowExpired] = useState(false);

  const activeAuthKeys = useMemo(() => {
    return authKeys?.filter(authKey => !!authKey && (new Date(authKey.expiration).getTime() - Date.now()) > 0);
  }, [authKeys]);

  const list = isShowExpired ? authKeys : activeAuthKeys;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="mb-2"><Trans i18nKey="auth_keys"/></h2>
          <p className="text-secondary"><Trans i18nKey="auth_keys_subtitle"/></p>
        </div>

        <button type="button" className="btn btn-accent flex items-center gap-2" onClick={() => setOpened('create')}>
          <i className="icon icon-key-plus text-lg text-white"/>
          <span className="font-medium text-white">
            <Trans i18nKey="generate_auth_key"/>
          </span>
        </button>
      </div>
      {isLoading ? (
        <ListLoading count={3} />
      ) : list?.length ? (
        <div className="overflow-x-auto lg:overflow-x-hidden">
          <table className="w-full min-w-[860px] table-auto border-spacing-px">
            <thead>
            <tr className="border-b border-b-primary h-[30px] text-xs font-medium text-secondary uppercase">
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
              {list?.map(({ key, ...authKey }) => (
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

      {authKeys && activeAuthKeys && authKeys.length !== activeAuthKeys.length ? (
        <div className="mt-6 -mr-2">
          <Checkbox
            id="show-expired-auth-keys"
            label={t('show_expired_auth_keys')}
            rowReverse
            className="justify-end"
            checked={isShowExpired}
            onChange={() => setIsShowExpired(!isShowExpired)}
          />
        </div>
      ) : null}

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