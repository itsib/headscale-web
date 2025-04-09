import { useMemo, useState } from 'preact/hooks';
import { AuthKeyWithUser } from '@app-types';
import { Trans, useTranslation } from 'react-i18next';
import { useAuthKeys } from '@app-hooks/use-auth-keys';
import { ModalAuthKeyCreate } from '@app-components/modals/modal-auth-key-create/modal-auth-key-create';
import { ModalAuthKeyExpire } from '@app-components/modals/modal-auth-key-expire/modal-auth-key-expire';
import { ContextAction } from './-api-token-item';
import { AuthKeyItem } from './-auth-key-item';
import { ButtonConfig, ButtonGroup } from '@app-components/button-group/button-group.tsx';
import { EmptyList } from '@app-components/empty-list/empty-list.tsx';
import { KeysLoading } from '@app-components/skeleton/keys-loading.tsx';

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

  const enableIsShowExpired = authKeys && activeAuthKeys && authKeys.length !== activeAuthKeys.length;

  const buttons: ButtonConfig[] = useMemo(() => {
    const button = enableIsShowExpired ? [{
      id: 'toggle-show-expired',
      icon: isShowExpired ? 'icon-timer-cross' : 'icon-timer',
      tooltip: t('show_expired_auth_keys'),
      effect: 'icon-shake',
    }] : [];

    return [
      ...button,
      {
        id: 'add-auth-key',
        icon: 'icon-key-plus',
        tooltip: t('generate_auth_key'),
        effect: 'icon-shake',
      },
    ];
  }, [t, isShowExpired, enableIsShowExpired]);

  async function onClick(id: string) {
    switch (id) {
      case 'add-auth-key':
        return setOpened('create');
      case 'toggle-show-expired':
        return setIsShowExpired(i => !i);
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="mb-2">
            <Trans i18nKey="auth_keys"/>
          </h2>
          <p className="text-secondary">
            <Trans i18nKey="auth_keys_subtitle"/>
          </p>
        </div>

        <ButtonGroup buttons={buttons} onClick={onClick} />
      </div>
      {isLoading ? (
        <KeysLoading />
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
        <EmptyList message="no_auth_keys" />
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