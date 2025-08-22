import { useState, useMemo } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { _apiTokenItem, ContextAction } from './_api-token-item.tsx';
import { ApiToken } from '@app-types';
import { useApiTokens } from '@app-hooks/use-api-tokens';
import { ModalApiTokenCreate } from '@app-components/modals/modal-api-token-create/modal-api-token-create';
import { ModalApiTokenExpire } from '@app-components/modals/modal-api-token-expire/modal-api-token-expire';
import { ModalApiTokenDelete } from '@app-components/modals/modal-api-token-delete/modal-api-token-delete';
import { ButtonConfig, ButtonGroup } from '@app-components/button-group/button-group';
import { EmptyList } from '@app-components/empty-list/empty-list.tsx';
import { KeysLoading } from '@app-components/skeleton';
import { PageCaption } from '@app-components/page-caption/page-caption.tsx';
import './_api-tokens.css';

export const ApiTokens = () => {
  const { t } = useTranslation();
  const { data: apiTokens, isLoading } = useApiTokens();

  const [opened, setOpened] = useState<ContextAction | null>(null);
  const [selected, setSelected] = useState<ApiToken | null>(null);

  const buttons: ButtonConfig[] = useMemo(() => {
    return [
      {
        id: 'add-token',
        icon: 'icon-key-plus',
        tooltip: t('add_api_token'),
        effect: 'icon-shake',
      },
    ];
  }, [t]);

  async function onClick(id: string) {
    switch (id) {
      case 'add-token':
        return setOpened('create');
    }
  }

  function onDismiss() {
    setOpened(null);
  }

  return (
    <>
      <PageCaption
        title="api_access_tokens"
        class="pt-6"
        subtitle="api_access_tokens_subtitle"
        h={3}
        actions={<ButtonGroup buttons={buttons} onClick={onClick} />}
      />

      {isLoading ? (
        <KeysLoading />
      ) : apiTokens?.length ? (
        <div className="api-tokens">
          <table>
            <thead>
              <tr className="header-row text-xs font-medium text-secondary">
                <th />
                <th className="text-left ">{t('key_id')}</th>
                <th className="text-left">{t('created')}</th>
                <th className="text-left">{t('expiry')}</th>
                <th className="text-right">{t('last_seen')}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {apiTokens?.map((apiToken) => (
                <_apiTokenItem
                  key={apiToken.id}
                  onAction={(action) => {
                    setSelected(apiToken);
                    setOpened(action);
                  }}
                  {...apiToken}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyList message="no_api_tokens" />
      )}

      <ModalApiTokenCreate isOpen={opened === 'create'} onDismiss={onDismiss} />
      <ModalApiTokenExpire isOpen={opened === 'expire'} apiToken={selected} onDismiss={onDismiss} />
      <ModalApiTokenDelete isOpen={opened === 'delete'} apiToken={selected} onDismiss={onDismiss} />
    </>
  );
};
