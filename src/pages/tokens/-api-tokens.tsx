import { useState, useMemo } from 'preact/hooks';
import { Trans, useTranslation } from 'react-i18next';
import { ApiTokenItem, ContextAction } from './-api-token-item';
import { ApiToken } from '@app-types';
import { useApiTokens } from '@app-hooks/use-api-tokens';
import { ModalApiTokenCreate } from '@app-components/modals/modal-api-token-create/modal-api-token-create';
import { ModalApiTokenExpire } from '@app-components/modals/modal-api-token-expire/modal-api-token-expire';
import { ModalApiTokenDelete } from '@app-components/modals/modal-api-token-delete/modal-api-token-delete';
import { ButtonConfig, ButtonGroup } from '@app-components/button-group/button-group';
import { EmptyList } from '@app-components/empty-list/empty-list.tsx';
import { KeysLoading } from '@app-components/skeleton/keys-loading.tsx';

export const ApiTokens = () => {
  const { t } = useTranslation();
  const { data: apiTokens, isLoading, refetch } = useApiTokens();

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

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="mb-2">
            <Trans i18nKey="api_access_tokens"/>
          </h2>
          <p className="text-secondary">
            <Trans i18nKey="api_access_tokens_subtitle"/>
          </p>
        </div>

        <ButtonGroup buttons={buttons} onClick={onClick} />
      </div>

      {isLoading ? (
        <KeysLoading />
      ) : apiTokens?.length ? (
        <div className="overflow-x-auto lg:overflow-x-hidden">
          <table className="w-full table-auto border-spacing-px">
            <thead>
            <tr className="border-b border-b-primary h-[30px] text-xs font-medium text-secondary uppercase">
              <th/>
              <th className="text-left ">{t('key_id')}</th>
              <th className="text-left">{t('created')}</th>
              <th className="text-left">{t('expiry')}</th>
              <th className="text-right">{t('last_seen')}</th>
              <th/>
            </tr>
            </thead>
            <tbody>
            {apiTokens?.map(apiToken => (
              <ApiTokenItem
                key={apiToken.id}
                onAction={action => {
                  setSelected(apiToken);
                  setOpened(action);
                }}
                {...apiToken} />
            ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyList message="no_api_tokens" />
      )}

      <ModalApiTokenCreate
        isOpen={opened === 'create'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => refetch()}
      />
      <ModalApiTokenExpire
        isOpen={opened === 'expire'}
        apiToken={selected}
        onDismiss={() => setOpened(null)}
        onSuccess={() => refetch()}
      />
      <ModalApiTokenDelete
        isOpen={opened === 'delete'}
        apiToken={selected}
        onDismiss={() => setOpened(null)}
        onSuccess={() => refetch()}
      />
    </>
  );
}