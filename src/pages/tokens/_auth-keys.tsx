import { useMemo, useState } from 'preact/hooks';
import { AuthKeyWithUser } from '@app-types';
import { useTranslation } from 'react-i18next';
import { useAuthKeys } from '@app-hooks/use-auth-keys';
import { ModalAuthKeyCreate } from '@app-components/modals/modal-auth-key-create/modal-auth-key-create';
import { ModalAuthKeyExpire } from '@app-components/modals/modal-auth-key-expire/modal-auth-key-expire';
import { ContextAction } from './_api-token-item.tsx';
import { AuthKeyItem } from './_auth-key-item.tsx';
import { ButtonConfig, ButtonGroup } from '@app-components/button-group/button-group.tsx';
import { EmptyList } from '@app-components/empty-list/empty-list.tsx';
import { KeysLoading } from '@app-components/skeleton';
import { PageCaption } from '@app-components/page-caption/page-caption.tsx';
import './_auth-keys.css';

export const AuthKeys = () => {
  const { t } = useTranslation();
  const { data: authKeys, isLoading } = useAuthKeys();

  const [opened, setOpened] = useState<ContextAction | null>(null);
  const [selected, setSelected] = useState<AuthKeyWithUser | null>(null);
  const [isShowExpired, setIsShowExpired] = useState(false);

  const activeAuthKeys = useMemo(() => {
    return authKeys?.filter(
      (authKey) => !!authKey && new Date(authKey.expiration).getTime() - Date.now() > 0
    );
  }, [authKeys]);

  const list = isShowExpired ? authKeys : activeAuthKeys;

  const enableIsShowExpired =
    authKeys && activeAuthKeys && authKeys.length !== activeAuthKeys.length;

  const buttons: ButtonConfig[] = useMemo(() => {
    const button = enableIsShowExpired
      ? [
          {
            id: 'toggle-show-expired',
            icon: isShowExpired ? 'icon-timer-off' : 'icon-timer',
            tooltip: t('show_expired_auth_keys'),
            effect: 'icon-shake',
          },
        ]
      : [];

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
        return setIsShowExpired((i) => !i);
    }
  }

  function onDismiss() {
    setOpened(null);
  }

  return (
    <>
      <PageCaption
        title="auth_keys"
        class="pt-6"
        subtitle="auth_keys_subtitle"
        h={3}
        actions={<ButtonGroup buttons={buttons} onClick={onClick} />}
      />
      {isLoading ? (
        <KeysLoading />
      ) : list?.length ? (
        <div class="auth-keys">
          <table>
            <thead>
              <tr class="header-row text-xs font-medium text-secondary">
                <th />
                <th className="text-left">{t('auth_key')}</th>
                <th className="text-left">{t('user')}</th>
                <th className="text-center">{t('type')}</th>
                <th className="text-left lg:pl-10">{t('created')}</th>
                <th className="text-left">{t('expiry')}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {list?.map(({ key, ...authKey }) => (
                <AuthKeyItem
                  key={key}
                  authKey={key}
                  onAction={(action) => {
                    setSelected({ ...authKey, key });
                    setOpened(action);
                  }}
                  {...authKey}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyList message="no_auth_keys" />
      )}

      <ModalAuthKeyCreate isOpen={opened === 'create'} onDismiss={onDismiss} />
      <ModalAuthKeyExpire isOpen={opened === 'expire'} authKey={selected} onDismiss={onDismiss} />
    </>
  );
};
